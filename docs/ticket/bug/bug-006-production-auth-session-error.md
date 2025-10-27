# Bug #006: 本番環境で音楽アップロード時に認証エラー（401）が発生

**ステータス**: 🟢 完了
**優先度**: Critical
**担当**: AIエージェント
**作成日**: 2025-10-27
**開始日時**: 2025-10-27 11:20
**完了日時**: 2025-10-27 12:30
**実績時間**: 70分

## 🐛 バグ概要

Vercel本番環境で音楽ファイルをアップロードしようとすると、HTTPステータス401（Unauthorized）エラーが発生し、認証に失敗する。

## 📍 発生環境

- 環境: 本番環境（Vercel）
- URL: https://kaleidoaimusic.kaleidofuture.com/admin
- アップロード機能: 音楽ファイル・画像ファイルのアップロード
- エラー発生箇所: `/api/admin/upload`
- HTTPステータス: 401 Unauthorized

## 🔄 再現手順

1. 本番環境の管理者ページにアクセス（https://kaleidoaimusic.kaleidofuture.com/admin）
2. 管理者パスワードでログイン成功
3. 音楽ファイル（MP3またはWAV）を選択
4. 「アップロード」ボタンをクリック
5. 401エラーが発生してアップロード失敗

## ❌ 期待される動作

- ログイン後、セッションが維持される
- アップロードAPIで認証が成功する
- 音楽ファイルが正常にアップロードされる

## 🚨 実際の動作

HTTPステータス401（Unauthorized）が返され、アップロードが失敗する。

## 📸 スクリーンショット/ログ

Vercel関数ログ（logs/20251027/logs_result.json）:
```json
{
  "responseStatusCode": 401,
  "level": "warning",
  "function": "/api/admin/upload",
  "durationMs": 124
}
```

## 🔍 原因分析

### 問題箇所
- ファイル: `lib/auth/session.ts:9`
- コード: `const sessions = new Map<string, { userId: string; expiresAt: number }>();`

### 根本原因

**セッションがメモリ内の `Map` オブジェクトで管理されていた**ため、Vercelのサーバーレス環境で以下の問題が発生：

1. **Lambda関数の分離**: Vercelは各リクエストを異なるLambdaインスタンスで処理する可能性がある
2. **メモリの非共有**: 各Lambdaインスタンスは独立したメモリ空間を持つ
3. **セッション喪失**:
   - ログインリクエスト → Lambda A で処理 → Map A にセッション保存
   - アップロードリクエスト → Lambda B で処理 → Map B は空 → セッション見つからず → 401エラー

### 影響範囲
- 音楽ファイルのアップロード機能（全面的に使用不可）
- 画像ファイルのアップロード機能（全面的に使用不可）
- 管理者向けAPI全般（認証が必要な機能すべて）
- ローカル環境は影響なし（単一プロセスで動作）

### 技術的な詳細

#### サーバーレス環境の特性
- **ステートレス**: 各リクエストは独立して処理される
- **スケーラビリティ**: 複数のインスタンスが並行して起動する
- **揮発性**: インスタンスのメモリは永続化されない

#### なぜローカルでは動作していたか
- 開発環境は単一のNode.jsプロセスで動作
- すべてのリクエストが同じメモリ空間を共有
- Map オブジェクトが全リクエストで参照可能

## ✅ 修正内容

### 解決方針
セッション管理をデータベース（Neon PostgreSQL）に永続化し、すべてのLambdaインスタンスから共有可能にする。

### 修正詳細

#### 1. データベーススキーマ更新（lib/db/schema.ts）
- **変更内容**: `sessions`テーブルを追加
- **フィールド**:
  - `id` (varchar): セッションID（プライマリキー）
  - `userId` (varchar): ユーザーID
  - `expiresAt` (timestamp): 有効期限
  - `createdAt` (timestamp): 作成日時
- **インデックス**: `expires_at`にインデックスを追加（期限切れセッションの効率的な検索）

#### 2. セッション管理ロジック書き換え（lib/auth/session.ts）
- **変更内容**: メモリ内Map → データベース永続化
- **主な変更**:
  - `createSession()`: セッションをDBに保存
  - `validateSession()`: セッションをDBから取得・検証
  - `getSession()`: セッション情報をDBから取得
  - `deleteSession()`: セッションをDBから削除
  - `cleanupExpiredSessions()`: 新規追加（期限切れセッションのクリーンアップ）

#### 3. 詳細ログ追加
- **app/api/admin/upload/route.ts**: 認証チェックのログ出力
- **lib/auth/session.ts**: セッション検証の詳細ログ

#### 4. データベースマイグレーション
- `drizzle/0000_perfect_thunderbird.sql`: sessionsテーブル作成SQLを生成
- 本番環境で `npm run db:push` を実行

### 技術的な実装

#### Before（メモリ内Map）
```typescript
const sessions = new Map<string, { userId: string; expiresAt: number }>();
sessions.set(sessionId, { userId, expiresAt });
const session = sessions.get(sessionId);
```

#### After（データベース永続化）
```typescript
await db.insert(sessionsTable).values({ id: sessionId, userId, expiresAt });
const sessions = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));
```

## 🧪 テスト確認項目

### 修正前の動作確認
- [x] 本番環境でログインが成功することを確認
- [x] ログイン後のアップロード時に401エラーが発生することを確認
- [x] Vercel関数ログで401エラーを確認

### 修正後の動作確認
- [x] データベースにsessionsテーブルが作成されたことを確認
- [x] 型チェックが成功することを確認（`npm run type-check`）
- [x] 本番環境にデプロイ成功
- [x] マイグレーション実行成功（`npm run db:push`）
- [x] ログインが成功することを確認
- [x] ログイン後のセッションがデータベースに保存されることを確認
- [x] 音楽ファイルのアップロードが成功することを確認
- [x] 画像ファイルのアップロードが成功することを確認
- [x] 複数回のアップロードが連続して成功することを確認

### パフォーマンス確認
- [x] アップロードAPIのレスポンス時間が許容範囲内（<3秒）
- [x] データベースクエリが効率的に実行される
- [x] セッション検証のオーバーヘッドが最小限

## 📝 メモ

チケット作成日: 2025-10-27
修正実施日: 2025-10-27 11:20-12:30
修正者: AIエージェント

### 修正時の気付き

#### サーバーレス環境の特性理解
- Vercelのようなサーバーレス環境では、メモリ内状態管理は使用できない
- セッション、キャッシュなど、共有が必要なデータは外部ストレージ（DB、Redis等）に保存すべき
- ローカル開発と本番環境の動作差異に注意が必要

#### セッション永続化の選択肢
1. **データベース**（今回採用）: シンプル、既存インフラ活用、コスト効率的
2. **Redis/Vercel KV**: 高速、セッション特化、追加コスト
3. **JWT**: ステートレス、DBアクセス不要、セキュリティ考慮が必要

データベースを選択した理由:
- 既にNeon PostgreSQLを使用している
- セッション数が少ない（管理者のみ）
- 追加コストなし
- シンプルな実装

#### ログの重要性
- 詳細なログ出力により、問題の特定が迅速にできた
- 本番環境のデバッグには適切なログが不可欠
- セキュリティ情報（セッションIDの完全な値等）はログに出力しないよう配慮

### デプロイ手順

1. コードをプッシュ
   ```bash
   git push origin main
   ```

2. Vercelが自動デプロイ

3. 本番環境でマイグレーション実行
   ```bash
   vercel link
   vercel env pull .env.local
   npm run db:push
   ```

4. 管理者ページで再ログイン

5. アップロード機能をテスト

### 完了記録
完了日時: 2025-10-27 12:30
実績時間: 70分
Git commit: e91b5e5

#### 最終確認
- [x] バグが完全に修正されている
- [x] 本番環境で正常動作確認
- [x] 関連機能に影響がない
- [x] パフォーマンスが許容範囲
- [x] TypeScriptエラーなし
- [x] ドキュメント更新

## 🎯 今後の改善提案

### 短期（1-2週間）
- [ ] セッションクリーンアップのスケジュール実行（Vercel Cron Jobsを使用）
- [ ] セッション有効期限の延長機能（アクティブユーザーの自動更新）

### 中期（1-2ヶ月）
- [ ] Redis/Vercel KVへの移行検討（パフォーマンス向上）
- [ ] セッション管理のテスト追加（ユニットテスト、統合テスト）
- [ ] 管理者ログイン履歴の記録

### 長期（3ヶ月以上）
- [ ] 複数管理者アカウント対応
- [ ] ロールベースアクセス制御（RBAC）
- [ ] 2要素認証（2FA）の導入

## 🔗 関連

- 関連Issue: -
- 関連PR: -
- 参考資料:
  - [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
  - [Drizzle ORM Documentation](https://orm.drizzle.team/)
  - [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- 関連バグ:
  - Bug #005: 本番環境BLOB_READ_WRITE_TOKENエラー（ドキュメント更新で対応）
