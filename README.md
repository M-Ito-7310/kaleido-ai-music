# Kaleido AI Music

AI生成音楽を展示・ダウンロードできる音楽ライブラリプラットフォーム

## 概要

Kaleido AI Musicは、外部AIプラットフォーム(Suno AI、Udio等)で生成したAI音楽を展示・共有できるWebアプリケーションです。主にスマートフォンユーザー向けに最適化されており、多くの人に手軽にAI音楽を視聴・ダウンロードしてもらうことを目的としています。

## 主な機能

- 音楽ライブラリ・ギャラリー表示
- インライン音楽プレイヤー
- 音楽詳細ページ
- ダウンロード機能
- カテゴリ・タグによるフィルタリング
- 検索・ソート機能
- 音楽アップロード機能(管理者向け)

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router) - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Web Audio API** - 音楽再生

### バックエンド・データベース
- **Next.js API Routes** - サーバーレス API
- **Neon PostgreSQL** - データベース
- **Drizzle ORM** - 型安全なORM

### ファイルストレージ
- **Vercel Blob Storage** - 音楽ファイル・画像保存

### デプロイ
- **Vercel** - ホスティング

## セットアップ

### 前提条件

- Node.js 18.x以上
- npm 9.x以上

### インストール手順

#### 1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/kaleido-ai-music.git
cd kaleido-ai-music
```

#### 2. 依存関係をインストール

```bash
npm install
```

#### 3. 環境変数を設定

`.env.local.example` を `.env.local` にコピーして、必要な値を設定します。

```bash
cp .env.local.example .env.local
```

**必須環境変数:**

```bash
# Neon PostgreSQL接続文字列
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"

# Vercel Blob Storage トークン
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# アプリケーションURL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 4. データベースをセットアップ

```bash
# マイグレーション生成
npm run db:generate

# データベースにスキーマを適用
npm run db:push
```

#### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - ESLintチェック
- `npm run type-check` - TypeScript型チェック
- `npm run format` - Prettierでフォーマット
- `npm run db:generate` - Drizzleマイグレーション生成
- `npm run db:push` - データベースにスキーマ反映
- `npm run db:studio` - Drizzle Studio起動

## プロジェクト構造

```
kaleido-ai-music/
├── docs/                 # ドキュメント
│   ├── idea/             # 初期設計・アイデア
│   └── implementation/   # 実装記録
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── library/      # 音楽ライブラリページ
│   │   ├── music/        # 音楽詳細ページ
│   │   └── upload/       # アップロードページ
│   ├── components/       # Reactコンポーネント
│   │   ├── music/        # 音楽関連コンポーネント
│   │   ├── layout/       # レイアウトコンポーネント
│   │   ├── filters/      # フィルター関連
│   │   └── ui/           # 共通UIコンポーネント
│   ├── lib/              # ユーティリティ・DB
│   │   ├── db/           # データベース設定・スキーマ
│   │   ├── storage/      # ファイルストレージ
│   │   └── utils.ts      # ユーティリティ関数
│   └── types/            # TypeScript型定義
├── public/               # 静的ファイル
├── .env.local.example    # 環境変数テンプレート
├── next.config.js        # Next.js設定
├── tailwind.config.ts    # Tailwind CSS設定
├── tsconfig.json         # TypeScript設定
└── package.json          # 依存関係
```

## ドキュメント

### 設計ドキュメント(docs/idea/)
- [01-project-overview.md](docs/idea/01-project-overview.md) - プロジェクト概要
- [02-architecture.md](docs/idea/02-architecture.md) - アーキテクチャ設計
- [03-feature-specifications.md](docs/idea/03-feature-specifications.md) - 機能仕様
- [04-database-schema.md](docs/idea/04-database-schema.md) - データベーススキーマ
- [05-ui-design.md](docs/idea/05-ui-design.md) - UIデザイン方針

## デプロイ

### Vercel(推奨)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kaleido-ai-music)

1. Vercelアカウントを作成
2. リポジトリをインポート
3. 環境変数を設定(`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`)
4. デプロイ

## 開発状況

**現在のフェーズ**: プロトタイプ設計完了、実装開始前

| 項目 | 進捗 |
|------|------|
| 設計ドキュメント | 100% ✅ |
| データベーススキーマ | 100% ✅ |
| UIデザイン方針 | 100% ✅ |
| 機能実装 | 0% 🚧 |

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下でライセンスされています。

## 参考プロジェクト

- [BlueprintHub](https://github.com/M-Ito-7310/BlueprintHub) - AIプログラマーと共同開発したマーケットプレイス
- [CodeNest](https://github.com/yourusername/codenest) - 紹介コード共有プラットフォーム
- [nocode-ui-builder](https://github.com/yourusername/nocode-ui-builder) - ノーコードUIビルダー

## お問い合わせ

- **バグ報告**: [GitHub Issues](https://github.com/yourusername/kaleido-ai-music/issues)
- **機能リクエスト**: [GitHub Discussions](https://github.com/yourusername/kaleido-ai-music/discussions)

---

**Kaleido AI Music** - AI生成音楽を、もっと身近に。
