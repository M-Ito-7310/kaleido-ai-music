# Bug #005: 本番環境で音楽アップロード時にBLOB_READ_WRITE_TOKENエラー

**ステータス**: 🟢 完了
**優先度**: Critical
**担当**: AIエージェント
**作成日**: 2025-10-27
**開始日時**: 2025-10-27 23:55
**完了日時**: 2025-10-27 24:10
**実績時間**: 15分

## 🐛 バグ概要

Vercel本番環境で音楽ファイルをアップロードしようとすると、`BLOB_READ_WRITE_TOKEN` 環境変数が設定されていないため、エラーが発生してアップロードが失敗する。

## 📍 発生環境

- 環境: 本番環境（Vercel）
- URL: https://kaleidoaimusic.kaleidofuture.com/admin
- アップロード機能: 音楽ファイル・画像ファイルのアップロード
- エラー発生箇所: `/api/admin/upload`

## 🔄 再現手順

1. 本番環境の管理者ページにアクセス（https://kaleidoaimusic.kaleidofuture.com/admin）
2. 管理者パスワードでログイン
3. 音楽ファイル（MP3またはWAV）を選択
4. 「アップロード」ボタンをクリック
5. エラーが発生してアップロード失敗

## ❌ 期待される動作

- 音楽ファイルが正常にVercel Blob Storageにアップロードされる
- アップロード完了後、ファイルのURLが返される
- データベースに音楽情報が保存される

## 🚨 実際の動作

エラーメッセージ:
```
Upload error: l [Error]: Vercel Blob: No token found. Either configure the `BLOB_READ_WRITE_TOKEN` environment variable, or pass a `token` option to your calls.
    at /var/task/.next/server/chunks/757.js:34:68658
    at K (/var/task/.next/server/chunks/757.js:34:68790)
    at Ai.allowedOptions (/var/task/.next/server/chunks/757.js:34:76534)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async o (/var/task/.next/server/app/api/admin/upload/route.js:1:3240)
    at async c (/var/task/.next/server/app/api/admin/upload/route.js:1:2169)
```

## 📸 スクリーンショット/ログ

エラーログ全文（上記参照）

## 🔍 原因分析

### 問題箇所
- ファイル: `lib/storage/upload.ts:20`
- 関数: `uploadMusic()`, `uploadImage()`
- 問題: `@vercel/blob` の `put()` 関数が環境変数 `BLOB_READ_WRITE_TOKEN` を参照するが、本番環境で設定されていない

### 原因
1. **環境変数未設定**: Vercel本番環境で `BLOB_READ_WRITE_TOKEN` が設定されていなかった
2. **Blob Storage未有効化**: Vercelプロジェクトで Blob Storage が有効化されていない可能性
3. **ドキュメント不足**: 本番環境デプロイ時の環境変数設定手順がREADMEに不十分だった

### 影響範囲
- 音楽ファイルのアップロード機能（全面的に使用不可）
- 画像ファイルのアップロード機能（全面的に使用不可）
- ローカル環境は影響なし（`.env.local`で設定済み）

### 修正方法
1. **ドキュメント強化**:
   - README.mdのデプロイセクションに詳細な環境変数設定手順を追加
   - トラブルシューティングセクションに本エラーの対処法を追加
   - Blob Storageの有効化手順を明記

2. **手順案内**:
   - ユーザーにVercelダッシュボードでの設定手順を案内
   - 環境変数設定後の再デプロイの必要性を明記

## ✅ 修正内容

- [x] README.mdのデプロイセクションを更新
- [x] 環境変数設定手順の詳細化
- [x] Blob Storage有効化手順の追加
- [x] トラブルシューティングセクションの更新
- [x] バグチケット作成・記録

### 修正詳細

#### 1. README.md - デプロイセクション更新
- **変更内容**: Vercelデプロイ手順を5ステップに分割して詳細化
- **追加項目**:
  - 環境変数の取得方法を表形式で説明
  - Blob Storage有効化手順を独立セクションとして追加
  - 再デプロイの必要性を強調

#### 2. README.md - トラブルシューティング更新
- **変更内容**: Vercel Blob Storageエラーのセクションを大幅に拡充
- **追加項目**:
  - 本番環境とローカル環境の解決方法を分離
  - 3ステップの解決フロー（有効化 → 設定 → 再デプロイ）
  - Vercel CLI を使った環境変数取得方法
  - 確認コマンドの例

### 技術的な対応
- コード変更なし（ドキュメント更新のみ）
- ユーザー側で環境変数を設定する必要がある

## 🧪 テスト確認項目

### ドキュメント確認
- [x] README.mdのデプロイセクションが明確でわかりやすい
- [x] トラブルシューティングセクションに解決手順が詳細に記載されている
- [x] 環境変数の取得方法が明確に説明されている
- [x] Blob Storage有効化手順が含まれている

### 本番環境での確認（ユーザー側で実施必要）
- [ ] Vercelダッシュボードで Blob Storage を有効化
- [ ] `BLOB_READ_WRITE_TOKEN` 環境変数を設定
- [ ] プロジェクトを再デプロイ
- [ ] 音楽ファイルのアップロードが正常に動作することを確認
- [ ] 画像ファイルのアップロードが正常に動作することを確認

## 📝 メモ

チケット作成日: 2025-10-27
修正実施日: 2025-10-27 23:55-24:10
修正者: AIエージェント

### 修正時の気付き
- 本番環境のエラーはコード自体の問題ではなく、環境設定の問題
- ドキュメントの充実によって今後同様の問題を防ぐことができる
- Vercel Blob Storageは無料プランでも使用可能（容量制限あり）
- 環境変数の設定は再デプロイしないと反映されないことに注意

### ユーザーへの案内事項
1. Vercelダッシュボードにアクセス
2. プロジェクト → Storage → Blob → Create Blob Store
3. 生成されたトークンをコピー
4. Settings → Environment Variables → `BLOB_READ_WRITE_TOKEN` を追加
5. Deployments → 最新デプロイ → Redeploy

### 完了記録
完了日時: 2025-10-27 24:10
実績時間: 15分
Git commit: （次回コミット時に記録）

#### 最終確認
- [x] ドキュメントが完全に更新されている
- [x] 解決手順が明確に記載されている
- [x] トラブルシューティングが充実している
- [x] バグチケットが適切に記録されている

## 🔗 関連

- 関連Issue: -
- 関連PR: -
- 参考資料:
  - [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
  - [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
