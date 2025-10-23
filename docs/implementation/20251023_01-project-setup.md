# Phase 1: プロジェクトセットアップ - 詳細実装ガイド

**Phase**: 1/7
**推定時間**: 1日
**前提条件**: Node.js 18.x以上、Git、テキストエディタ
**次のPhase**: Phase 2 - データベース・API構築

---

## 目次

1. [概要](#概要)
2. [前提条件の確認](#前提条件の確認)
3. [プロジェクト初期化](#プロジェクト初期化)
4. [依存パッケージのインストール](#依存パッケージのインストール)
5. [設定ファイルの作成](#設定ファイルの作成)
6. [ディレクトリ構造の作成](#ディレクトリ構造の作成)
7. [Git初期化](#git初期化)
8. [動作確認](#動作確認)
9. [トラブルシューティング](#トラブルシューティング)
10. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 1では、Kaleido AI Musicプロジェクトの開発環境を構築します。Next.js 14をベースに、TypeScript、Tailwind CSS、Drizzle ORM、Vercel Blob等の必要な依存関係をインストールし、プロジェクトの基盤を整えます。

### このPhaseで実現すること

- Next.js 14プロジェクトの初期化
- すべての依存パッケージのインストール
- TypeScript、Tailwind CSS、ESLintの設定
- ディレクトリ構造の構築
- Gitバージョン管理の初期化
- 開発サーバーの起動確認

---

## 前提条件の確認

### 必要なソフトウェア

#### 1. Node.js（バージョン 18.x 以上）

**確認コマンド:**
```bash
node --version
# 出力例: v18.17.0 または v20.x.x
```

**インストールが必要な場合:**
- 公式サイト: https://nodejs.org/
- 推奨: LTS版（Long Term Support）

#### 2. npm または yarn

**確認コマンド:**
```bash
npm --version
# 出力例: 9.6.7
```

本ドキュメントでは`npm`を使用しますが、`yarn`でも代替可能です。

#### 3. Git

**確認コマンド:**
```bash
git --version
# 出力例: git version 2.40.1
```

**インストールが必要な場合:**
- 公式サイト: https://git-scm.com/

#### 4. テキストエディタ

推奨: **Visual Studio Code**
- 公式サイト: https://code.visualstudio.com/
- 推奨拡張機能:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

---

## プロジェクト初期化

### ステップ 1: 作業ディレクトリへ移動

```bash
# 既存のプロジェクトディレクトリの場合
cd c:/Users/mitoi/Desktop/Projects/kaleido-ai-music

# または新規作成の場合
mkdir -p c:/Users/mitoi/Desktop/Projects/kaleido-ai-music
cd c:/Users/mitoi/Desktop/Projects/kaleido-ai-music
```

### ステップ 2: Next.js 14プロジェクトの初期化

**コマンド:**
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src
```

**インタラクティブな質問への回答:**

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

**実行結果:**
```
Creating a new Next.js app in c:/Users/mitoi/Desktop/Projects/kaleido-ai-music.

Using npm.

Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/react
- @types/node
- @types/react-dom
- autoprefixer
- postcss
- tailwindcss
- eslint
- eslint-config-next

Success! Created kaleido-ai-music
```

---

## 依存パッケージのインストール

### ステップ 3: プロダクション依存関係のインストール

```bash
npm install \
  @neondatabase/serverless \
  drizzle-orm \
  @vercel/blob \
  zod \
  clsx \
  tailwind-merge \
  date-fns
```

**各パッケージの説明:**

| パッケージ名 | 用途 | バージョン |
|-------------|------|-----------|
| `@neondatabase/serverless` | Neon PostgreSQL接続 | ^0.9.0 |
| `drizzle-orm` | TypeScript ORM | ^0.29.0 |
| `@vercel/blob` | ファイルストレージ | ^0.19.0 |
| `zod` | スキーマバリデーション | ^3.22.0 |
| `clsx` | 条件付きクラス名 | ^2.1.0 |
| `tailwind-merge` | Tailwindクラスのマージ | ^2.2.0 |
| `date-fns` | 日付フォーマット | ^3.0.0 |

### ステップ 4: 開発依存関係のインストール

```bash
npm install -D \
  drizzle-kit \
  @types/node \
  prettier \
  prettier-plugin-tailwindcss
```

**各パッケージの説明:**

| パッケージ名 | 用途 | バージョン |
|-------------|------|-----------|
| `drizzle-kit` | Drizzle CLIツール | ^0.20.0 |
| `@types/node` | Node.js型定義 | ^20.0.0 |
| `prettier` | コードフォーマッター | ^3.2.0 |
| `prettier-plugin-tailwindcss` | Tailwindクラスソート | ^0.5.0 |

---

## 設定ファイルの作成

### ステップ 5: TypeScript設定

**ファイル名**: `tsconfig.json`

既存の`tsconfig.json`を以下の内容に更新:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ステップ 6: Tailwind CSS設定

**ファイル名**: `tailwind.config.ts`

既存のファイルを以下の内容に更新:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### ステップ 7: Drizzle設定

**ファイル名**: `drizzle.config.ts`

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### ステップ 8: Prettier設定

**ファイル名**: `.prettierrc.json`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### ステップ 9: 環境変数テンプレート

**ファイル名**: `.env.local.example`

```bash
# Neon PostgreSQL接続文字列
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"

# Vercel Blob Storage トークン
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# アプリケーションURL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### ステップ 10: .gitignore更新

**ファイル名**: `.gitignore`

既存のファイルに以下を追加:

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# drizzle
/drizzle

# ide
.vscode
.idea
```

---

## ディレクトリ構造の作成

### ステップ 11: ディレクトリ構造の構築

**コマンド:**
```bash
# Windowsの場合
mkdir -p app\api\music
mkdir -p app\api\categories
mkdir -p app\api\tags
mkdir -p app\library
mkdir -p app\music\[id]
mkdir -p app\upload
mkdir -p components\music
mkdir -p components\filters
mkdir -p components\layout
mkdir -p components\ui
mkdir -p lib\db
mkdir -p lib\storage
mkdir -p lib\audio
mkdir -p types
mkdir -p public\images
mkdir -p public\audio
```

**Linux/Macの場合:**
```bash
mkdir -p app/api/{music,categories,tags}
mkdir -p app/{library,music/\[id\],upload}
mkdir -p components/{music,filters,layout,ui}
mkdir -p lib/{db,storage,audio}
mkdir -p types
mkdir -p public/{images,audio}
```

### 完成後のディレクトリ構造

```
kaleido-ai-music/
├── app/
│   ├── api/
│   │   ├── music/
│   │   ├── categories/
│   │   └── tags/
│   ├── library/
│   ├── music/
│   │   └── [id]/
│   ├── upload/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── music/
│   ├── filters/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── db/
│   ├── storage/
│   ├── audio/
│   └── utils.ts
├── types/
├── public/
│   ├── images/
│   └── audio/
├── drizzle/
├── docs/
│   ├── idea/
│   ├── implementation/
│   └── ticket/
├── .env.local.example
├── .gitignore
├── .prettierrc.json
├── drizzle.config.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## ステップ 12: ユーティリティ関数の作成

**ファイル名**: `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSクラスをマージするユーティリティ関数
 * clsx と tailwind-merge を組み合わせて使用
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 秒数を "MM:SS" 形式にフォーマット
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * ファイルサイズを人間が読みやすい形式にフォーマット
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * URLからファイル名を抽出
 */
export function extractFilename(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1] || 'unknown';
}

/**
 * スラッグを生成
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
```

---

## Git初期化

### ステップ 13: Gitリポジトリの初期化

**コマンド:**
```bash
# Gitリポジトリ初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: Next.js 14 + TypeScript + Tailwind CSS setup"
```

### ステップ 14: GitHubリポジトリとの連携（オプション）

```bash
# GitHubリポジトリを作成後、以下を実行
git remote add origin https://github.com/yourusername/kaleido-ai-music.git
git branch -M main
git push -u origin main
```

---

## 動作確認

### ステップ 15: 開発サーバーの起動

**コマンド:**
```bash
npm run dev
```

**成功時の出力:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in 2.3s
```

### ステップ 16: ブラウザで確認

ブラウザで `http://localhost:3000` を開く

**確認項目:**
- Next.jsのデフォルトページが表示される
- Tailwind CSSのスタイルが適用されている
- コンソールにエラーがない

### ステップ 17: TypeScript型チェック

**コマンド:**
```bash
npm run type-check
```

**package.jsonにスクリプト追加:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

### ステップ 18: ESLintチェック

**コマンド:**
```bash
npm run lint
```

**成功時の出力:**
```
✔ No ESLint warnings or errors
```

### ステップ 19: ビルドテスト

**コマンド:**
```bash
npm run build
```

**成功時の出力:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.02 kB        87.1 kB
└ ○ /_not-found                          871 B          83.9 kB
+ First Load JS shared by all            83 kB
  ├ chunks/framework-*.js                45.2 kB
  ├ chunks/main-app-*.js                 231 B
  └ chunks/webpack-*.js                  1.72 kB

○  (Static)  automatically rendered as static HTML (uses no initial props)
```

---

## トラブルシューティング

### 問題1: `npm run dev` でエラー

**エラーメッセージ:**
```
Error: Cannot find module 'next'
```

**解決策:**
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 問題2: TypeScriptエラー

**エラーメッセージ:**
```
Cannot find name 'React'
```

**解決策:**
```bash
# @types/react を再インストール
npm install -D @types/react @types/react-dom
```

### 問題3: Tailwind CSSが適用されない

**確認項目:**
1. `globals.css` に以下が含まれているか確認
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. `app/layout.tsx` で `globals.css` がインポートされているか確認
```typescript
import './globals.css'
```

### 問題4: Prettier/ESLintの競合

**解決策:**

`.eslintrc.json` を更新:
```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off"
  }
}
```

---

## 成果物チェックリスト

### 必須項目

- [ ] `npm run dev` で開発サーバーが起動する
- [ ] `http://localhost:3000` でページが表示される
- [ ] `npm run lint` でエラーがない（警告は5件以下）
- [ ] `npm run type-check` でTypeScriptエラーがない
- [ ] `npm run build` でビルドが成功する
- [ ] `git log` で初回コミットが確認できる

### ファイル・ディレクトリ

- [ ] `package.json` に全依存パッケージがある
- [ ] `tsconfig.json` が正しく設定されている
- [ ] `tailwind.config.ts` が正しく設定されている
- [ ] `drizzle.config.ts` が作成されている
- [ ] `.prettierrc.json` が作成されている
- [ ] `.env.local.example` が作成されている
- [ ] `lib/utils.ts` が作成されている
- [ ] すべてのディレクトリが作成されている

### 追加確認

- [ ] VSCodeでTypeScript IntelliSenseが動作する
- [ ] VSCodeでTailwind CSSのオートコンプリートが動作する
- [ ] ESLintの警告がVSCodeで表示される
- [ ] Prettierでコードフォーマットができる

---

## 次のステップ

Phase 1が完了したら、Phase 2「データベース・API構築」に進みます。

**次のドキュメント**: `20251023_02-database-api.md`

Phase 2では以下を実装します:
- Neon PostgreSQL接続設定
- Drizzle ORMスキーマ定義
- API Routes実装
- Vercel Blob Storage統合

---

## まとめ

Phase 1では、Kaleido AI Musicプロジェクトの開発環境を構築しました。

**達成したこと:**
- ✅ Next.js 14プロジェクト初期化
- ✅ TypeScript、Tailwind CSS設定
- ✅ すべての依存パッケージインストール
- ✅ ディレクトリ構造構築
- ✅ Git初期化
- ✅ 開発サーバー起動確認

**所要時間:** 約1日（6-8時間）

次のPhaseに進む準備が整いました！

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
