# Kaleido AI Music

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI生成音楽を展示・ダウンロードできる音楽ライブラリプラットフォーム

**[ライブデモを見る](https://kaleidoaimusic.kaleidofuture.com/)** | [ドキュメント](#ドキュメント) | [コントリビューション](#コントリビューション)

## 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [スクリプト](#スクリプト)
- [プロジェクト構造](#プロジェクト構造)
- [ドキュメント](#ドキュメント)
- [デプロイ](#デプロイ)
- [開発状況](#開発状況)
- [トラブルシューティング](#トラブルシューティング)
- [FAQ](#faq)
- [ロードマップ](#ロードマップ)
- [コントリビューション](#コントリビューション)
- [ライセンス](#ライセンス)
- [参考プロジェクト](#参考プロジェクト)
- [お問い合わせ](#お問い合わせ)

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
git clone https://github.com/M-Ito-7310/kaleido-ai-music.git
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

# アプリケーションURL（オプション）
# 注: 現在未使用。将来的にOGPメタタグ生成や絶対URL生成時に使用予定
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
│   ├── implementation/   # 実装記録
│   └── ticket/           # チケット管理
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   │   ├── music/        # 音楽API
│   │   ├── categories/   # カテゴリAPI
│   │   ├── tags/         # タグAPI
│   │   └── upload/       # アップロードAPI
│   ├── library/          # 音楽ライブラリページ
│   ├── music/[id]/       # 音楽詳細ページ
│   ├── upload/           # アップロードページ
│   ├── about/            # Aboutページ
│   ├── privacy/          # プライバシーポリシー
│   ├── terms/            # 利用規約
│   └── (ルートページ他)
├── components/           # Reactコンポーネント
│   ├── music/            # 音楽関連コンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   ├── filters/          # フィルター関連
│   ├── upload/           # アップロード関連
│   └── ui/               # 共通UIコンポーネント
├── lib/                  # ユーティリティ・DB
│   ├── db/               # データベース設定・スキーマ
│   ├── storage/          # ファイルストレージ
│   ├── hooks/            # カスタムフック
│   ├── audio/            # 音楽再生ユーティリティ
│   ├── env.ts            # 環境変数検証
│   └── utils.ts          # ユーティリティ関数
├── types/                # TypeScript型定義
│   ├── api.ts            # API関連の型
│   └── music.ts          # 音楽関連の型
├── public/               # 静的ファイル
│   ├── audio/            # 音楽ファイル（サンプル）
│   ├── images/           # 画像ファイル
│   ├── manifest.json     # PWAマニフェスト
│   └── robots.txt        # SEO設定
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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/M-Ito-7310/kaleido-ai-music)

1. Vercelアカウントを作成
2. リポジトリをインポート
3. 環境変数を設定(`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`)
4. デプロイ

## 開発状況

**現在のフェーズ**: 基本機能実装完了

| 項目 | 進捗 |
|------|------|
| 設計ドキュメント | 100% ✅ |
| データベーススキーマ | 100% ✅ |
| UIデザイン方針 | 100% ✅ |
| 基本UI実装 | 100% ✅ |
| 音楽再生機能 | 100% ✅ |
| 検索・フィルター | 100% ✅ |
| ダウンロード機能 | 100% ✅ |
| モバイル最適化 | 100% ✅ |
| アップロード機能 | 🚧 作業中 |

**デプロイ済み**: [https://kaleidoaimusic.kaleidofuture.com/](https://kaleidoaimusic.kaleidofuture.com/)

## トラブルシューティング

### よくある問題と解決方法

#### データベース接続エラー

**問題**: `Error: connection to database failed`

**解決方法**:

1. `.env.local` ファイルに `DATABASE_URL` が正しく設定されているか確認
2. Neon PostgreSQLダッシュボードでデータベースが起動しているか確認
3. 接続文字列に `?sslmode=require` が含まれているか確認

```bash
# 正しい形式の例
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

#### Vercel Blob Storageエラー

**問題**: `Error: BLOB_READ_WRITE_TOKEN is not defined`

**解決方法**:

1. Vercelダッシュボードで Blob Storage を有効化
2. `.env.local` に正しいトークンを設定
3. ローカル開発の場合、Vercel CLIで `vercel env pull .env.local` を実行

#### ビルドエラー (Type errors)

**問題**: `Type error: Cannot find module ...`

**解決方法**:

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 型チェック実行
npm run type-check
```

#### 音楽ファイルが再生されない

**問題**: プレイヤーが動作しない、または音が出ない

**解決方法**:

1. ブラウザのコンソールでエラーを確認
2. 音楽ファイルのURLが正しくアクセスできるか確認
3. ブラウザが対応している音声フォーマット(MP3, WAV)か確認
4. CORS設定を確認 (Vercel Blob Storageは自動的に設定されます)

#### 開発サーバーが起動しない

**問題**: `Port 3000 is already in use`

**解決方法**:

```bash
# 別のポートで起動
PORT=3001 npm run dev

# または既存のプロセスを終了
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## FAQ

### Q: このプラットフォームで音楽を生成できますか?

A: いいえ、Kaleido AI Musicは音楽生成機能を持っていません。Suno AI、Udioなどの外部AIプラットフォームで生成した音楽を展示・共有するためのプラットフォームです。

### Q: 商用利用は可能ですか?

A: プロジェクト自体はMITライセンスで提供されていますが、展示する音楽の著作権は各生成AIプラットフォームの利用規約に従います。商用利用する場合は、使用するAIプラットフォームのライセンスを確認してください。

### Q: スマートフォンでの動作はどうですか?

A: Kaleido AI Musicはモバイルファースト設計で、スマートフォンでの快適な閲覧・視聴を最優先に開発されています。iOS Safari、Android Chrome で動作確認済みです。

### Q: どのような音声フォーマットに対応していますか?

A: 主にMP3とWAVフォーマットに対応しています。ブラウザの Web Audio API でサポートされているフォーマットであれば再生可能です。

### Q: 自分の音楽をアップロードするにはどうすればいいですか?

A: 現在、アップロード機能は管理者向けに開発中です。一般ユーザー向けのアップロード機能は今後のロードマップに含まれています。

### Q: オフラインで音楽を聴けますか?

A: ダウンロード機能を使用すれば、音楽ファイルをローカルに保存してオフラインで聴くことができます。

### Q: データベースは何を使っていますか?

A: Neon PostgreSQLを使用しています。Neonはサーバーレス PostgreSQL で、無料プランから始められます。

### Q: 本番環境へのデプロイは簡単ですか?

A: はい、Vercelへのデプロイは非常に簡単です。GitHubリポジトリを接続して環境変数を設定するだけで、数分でデプロイできます。

## ロードマップ

### 🎯 短期目標 (1-2ヶ月)

- [ ] 一般ユーザー向けアップロード機能
- [ ] ユーザー認証・ログイン機能
- [ ] プレイリスト作成機能
- [ ] いいね・お気に入り機能
- [ ] コメント機能

### 🚀 中期目標 (3-6ヶ月)

- [ ] ユーザープロフィールページ
- [ ] ソーシャルシェア機能
- [ ] 音楽の波形ビジュアライザー
- [ ] 高度な検索フィルター (BPM, キー, ムードなど)
- [ ] レコメンデーション機能
- [ ] API公開

### 💡 長期目標 (6ヶ月以上)

- [ ] モバイルアプリ (React Native)
- [ ] AI音楽生成プラットフォームとの直接連携
- [ ] コミュニティ機能 (フォロー、フィード)
- [ ] 音楽コンテスト・イベント機能
- [ ] 多言語対応 (英語、中国語など)
- [ ] サブスクリプション/収益化機能

### 📝 継続的な改善

- パフォーマンス最適化
- アクセシビリティ向上
- SEO対策
- セキュリティ強化
- テストカバレッジ向上

## コントリビューション

Kaleido AI Musicへのコントリビューションを歓迎します!

### コントリビューション方法

1. **バグ報告**: [GitHub Issues](https://github.com/M-Ito-7310/kaleido-ai-music/issues) でバグを報告してください
2. **機能リクエスト**: [GitHub Discussions](https://github.com/M-Ito-7310/kaleido-ai-music/discussions) で新機能を提案してください
3. **プルリクエスト**: 以下の手順でコードをコントリビュートしてください

### プルリクエストの手順

1. リポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コーディング規約

- **コードスタイル**: Prettierでフォーマット (`npm run format`)
- **Lint**: ESLintチェックを通過すること (`npm run lint`)
- **型チェック**: TypeScript型エラーがないこと (`npm run type-check`)
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) に従う

### 開発の流れ

```bash
# リポジトリをフォーク後、クローン
git clone https://github.com/your-username/kaleido-ai-music.git
cd kaleido-ai-music

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
# .env.local を編集

# 開発サーバーを起動
npm run dev

# コードをフォーマット
npm run format

# Lintチェック
npm run lint

# 型チェック
npm run type-check
```

### コントリビューター

このプロジェクトに貢献してくださった皆様に感謝します!

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- コントリビューターリストは自動生成されます -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下でライセンスされています。

## 参考プロジェクト

- [BlueprintHub](https://github.com/M-Ito-7310/BlueprintHub) - AIプログラマーと共同開発したマーケットプレイス
- [CodeNest](https://github.com/M-Ito-7310/codenest) - 紹介コード共有プラットフォーム
- [nocode-ui-builder](https://github.com/M-Ito-7310/nocode-ui-builder) - ノーコードUIビルダー

## お問い合わせ

- **バグ報告**: [GitHub Issues](https://github.com/M-Ito-7310/kaleido-ai-music/issues)
- **機能リクエスト**: [GitHub Discussions](https://github.com/M-Ito-7310/kaleido-ai-music/discussions)

---

**Kaleido AI Music** - AI生成音楽を、もっと身近に。
