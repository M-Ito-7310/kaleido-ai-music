# Phase 2: データベース・API構築

**ステータス**: 🔴 未着手
**担当**: AIエージェント
**見積もり時間**: 2日
**実績時間**: -
**依存**: Phase 1
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

Neon PostgreSQLデータベースのスキーマ設計と実装、APIルートの構築を行います。音楽ライブラリの基盤となるデータベーステーブル(musics、categories、tags)を作成し、CRUD操作のためのAPI Routes を実装します。

## ✅ タスクチェックリスト

### データベーススキーマ実装
- [ ] src/lib/db/schema.tsを作成
  - [ ] musicsテーブル定義(id、title、artist、description、audioUrl、imageUrl、duration、genre、tags、createdAt、updatedAt、playCount、downloadCount)
  - [ ] categoriesテーブル定義(id、name、slug、description)
  - [ ] tagsテーブル定義(id、name、slug)
  - [ ] music_tagsテーブル定義(多対多リレーション)
  - [ ] インデックス設定(genre、createdAt、playCount、downloadCount)
- [ ] src/lib/db/index.tsを作成
  - [ ] Neon接続設定
  - [ ] 環境変数検証
  - [ ] Drizzle ORMインスタンス作成
- [ ] src/lib/db/queries.tsを作成
  - [ ] getMusics() - 音楽一覧取得(ページネーション、フィルター、ソート対応)
  - [ ] getMusicById() - 音楽詳細取得
  - [ ] getMusicsByCategory() - カテゴリ別音楽取得
  - [ ] getMusicsByTag() - タグ別音楽取得
  - [ ] searchMusics() - キーワード検索
  - [ ] incrementPlayCount() - 再生回数+1
  - [ ] incrementDownloadCount() - ダウンロード回数+1
  - [ ] getCategories() - カテゴリ一覧取得
  - [ ] getTags() - タグ一覧取得

### 型定義作成
- [ ] src/types/music.tsを作成
  - [ ] Music型定義
  - [ ] MusicWithTags型定義
  - [ ] Category型定義
  - [ ] Tag型定義
  - [ ] MusicFilter型定義
  - [ ] SortOption型定義
- [ ] src/types/api.tsを作成
  - [ ] APIレスポンス型定義
  - [ ] PaginatedResponse型定義
  - [ ] ErrorResponse型定義

### API Routes実装
- [ ] src/app/api/musics/route.tsを作成
  - [ ] GET /api/musics - 音楽一覧取得(クエリパラメータ: page、limit、genre、tag、sort)
  - [ ] POST /api/musics - 音楽アップロード(管理者向け、Phase後半で実装)
- [ ] src/app/api/musics/[id]/route.tsを作成
  - [ ] GET /api/musics/[id] - 音楽詳細取得
  - [ ] PUT /api/musics/[id] - 音楽更新(管理者向け)
  - [ ] DELETE /api/musics/[id] - 音楽削除(管理者向け)
- [ ] src/app/api/musics/[id]/play/route.tsを作成
  - [ ] POST /api/musics/[id]/play - 再生回数インクリメント
- [ ] src/app/api/musics/[id]/download/route.tsを作成
  - [ ] GET /api/musics/[id]/download - ダウンロード(カウント+リダイレクト)
- [ ] src/app/api/categories/route.tsを作成
  - [ ] GET /api/categories - カテゴリ一覧取得
- [ ] src/app/api/tags/route.tsを作成
  - [ ] GET /api/tags - タグ一覧取得
- [ ] エラーハンドリング実装(400、404、500)
- [ ] リクエストバリデーション実装

### Vercel Blob Storage設定
- [ ] src/lib/storage/index.tsを作成
  - [ ] uploadAudioFile() - 音楽ファイルアップロード
  - [ ] uploadImageFile() - 画像ファイルアップロード
  - [ ] deleteFile() - ファイル削除
  - [ ] getFileUrl() - ファイルURL取得

### Neonデータベース接続
- [ ] Neonダッシュボードで新しいデータベースを作成
- [ ] DATABASE_URLを.env.localに設定
- [ ] npm run db:generateでマイグレーション生成
- [ ] npm run db:pushでスキーマをデータベースに反映
- [ ] 接続テストスクリプトの実行

## 📦 成果物

- [ ] src/lib/db/schema.ts (4テーブル定義)
- [ ] src/lib/db/index.ts (DB接続設定)
- [ ] src/lib/db/queries.ts (9つのクエリ関数)
- [ ] src/types/music.ts (6つの型定義)
- [ ] src/types/api.ts (3つの型定義)
- [ ] src/app/api/musics/route.ts (GET/POST)
- [ ] src/app/api/musics/[id]/route.ts (GET/PUT/DELETE)
- [ ] src/app/api/musics/[id]/play/route.ts (POST)
- [ ] src/app/api/musics/[id]/download/route.ts (GET)
- [ ] src/app/api/categories/route.ts (GET)
- [ ] src/app/api/tags/route.ts (GET)
- [ ] src/lib/storage/index.ts (ストレージ関数)
- [ ] Neonデータベース(本番環境)

## 🔗 関連ドキュメント

- [データベーススキーマ設計](../../idea/04-database-schema.md)
- [アーキテクチャ設計](../../idea/02-architecture.md)

## 🎯 完了条件

- [ ] npm run buildでTypeScriptエラーが0件
- [ ] Drizzleマイグレーションが正常に実行される
- [ ] Neonデータベースにテーブルが作成されている
- [ ] すべてのAPI Routesが正常にレスポンスを返す
- [ ] Postmanなどで各APIエンドポイントの動作確認完了
- [ ] エラーハンドリングが適切に動作する
- [ ] TypeScript型定義が完全に機能している

## 🧪 テスト項目

- [ ] GET /api/musics - 音楽一覧取得が正常に動作
- [ ] GET /api/musics/[id] - 音楽詳細取得が正常に動作
- [ ] POST /api/musics/[id]/play - 再生回数が正常にインクリメント
- [ ] GET /api/categories - カテゴリ一覧取得が正常に動作
- [ ] GET /api/tags - タグ一覧取得が正常に動作
- [ ] クエリパラメータ(フィルター、ソート、ページネーション)が正常に動作
- [ ] エラー時に適切なステータスコードとメッセージが返る
- [ ] DATABASE_URL未設定時にエラーメッセージが表示される

## 📝 メモ・進捗コメント

### 注意事項
- Neon無料枠の制限に注意(データベースサイズ、接続数)
- Vercel Blob Storageの無料枠も確認
- APIルートは後のPhaseで拡張可能な設計にする
- 管理者向けアップロード機能は基本実装のみ(認証なし)

### 技術的な決定事項
- Drizzle ORMのリレーショナルクエリを活用
- ページネーションはoffset方式(シンプルさ優先)
- 音楽ファイル形式はMP3とWAV対応
- 画像形式はJPG、PNG、WebP対応

### 次のPhaseへの引き継ぎ
- Phase 3でUIコンポーネントを作成し、これらのAPIを呼び出す
- サンプルデータを数件投入しておくと開発しやすい

---

**Phase 2完了後の状態**: データベースとAPIが整い、フロントエンドから音楽データを取得・操作できる
