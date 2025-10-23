# Architecture

## システムアーキテクチャ概要

Kaleido AI Musicは、Next.js 14のApp Routerをベースにしたフルスタックアプリケーションです。フロントエンドとバックエンドAPI、データベース、ファイルストレージを統合したモノリシックな構成を採用します。モバイルファーストの設計により、スマートフォンでの快適な音楽視聴体験を実現します。

## 技術スタック詳細

### フロントエンド
- **Next.js 14** (App Router)
  - React Server Components (RSC)
  - Client Components(音楽プレイヤー等のインタラクティブUI用)
- **TypeScript 5+**
  - 型安全性の確保
  - 開発者体験の向上
- **Tailwind CSS 3+**
  - ユーティリティファーストのスタイリング
  - モバイルファーストのレスポンシブデザイン
- **Web Audio API**
  - ブラウザネイティブな音楽再生
  - クロスプラットフォーム対応

### バックエンド
- **Next.js API Routes** (App Router)
  - RESTful API
  - サーバーサイドロジック
  - ファイルアップロード処理
- **Drizzle ORM**
  - 型安全なORMクエリ
  - PostgreSQL対応
- **Neon PostgreSQL**
  - サーバーレスPostgreSQL
  - 無料枠: 0.5GB ストレージ

### ファイルストレージ
- **Vercel Blob Storage** (推奨)
  - 音楽ファイル(MP3/WAV)保存
  - サムネイル画像保存
  - 無料枠: 500MB

### デプロイ・インフラ
- **Vercel**
  - Next.jsに最適化されたホスティング
  - 自動CI/CD
  - エッジネットワーク
  - モバイル最適化

## アプリケーション構造

### ディレクトリ構成

```
kaleido-ai-music/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # ルートレイアウト
│   │   ├── page.tsx                  # ランディングページ
│   │   ├── library/                  # 音楽ライブラリ
│   │   │   └── page.tsx
│   │   ├── music/                    # 音楽詳細
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── category/                 # カテゴリ別表示
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── upload/                   # アップロード(管理者向け)
│   │   │   └── page.tsx
│   │   └── api/                      # API Routes
│   │       ├── music/
│   │       │   ├── route.ts          # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET, PUT, DELETE
│   │       ├── download/
│   │       │   └── [id]/
│   │       │       └── route.ts      # ダウンロード処理
│   │       ├── categories/
│   │       │   └── route.ts
│   │       └── upload/
│   │           └── route.ts          # ファイルアップロード
│   ├── components/
│   │   ├── music/                    # 音楽関連コンポーネント
│   │   │   ├── MusicCard.tsx         # 音楽カード
│   │   │   ├── MusicPlayer.tsx       # インライン音楽プレイヤー
│   │   │   ├── MusicGrid.tsx         # グリッドレイアウト
│   │   │   ├── MusicDetail.tsx       # 詳細表示
│   │   │   └── DownloadButton.tsx    # ダウンロードボタン
│   │   ├── layout/                   # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── filters/                  # フィルター関連
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── TagFilter.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── SortDropdown.tsx
│   │   └── ui/                       # 共通UIコンポーネント
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Spinner.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Neon接続設定
│   │   │   ├── schema.ts             # Drizzleスキーマ定義
│   │   │   └── queries.ts            # データベースクエリ
│   │   ├── storage/
│   │   │   └── blob.ts               # Vercel Blob操作
│   │   └── utils.ts                  # ユーティリティ関数
│   └── types/
│       ├── music.ts                  # Music型定義
│       ├── category.ts               # Category型定義
│       └── api.ts                    # APIレスポンス型定義
├── public/
│   ├── icons/                        # アイコン画像
│   └── placeholder.png               # デフォルトサムネイル
├── docs/
│   └── idea/                         # 設計ドキュメント
├── .env.local                        # 環境変数(Neon接続情報)
├── drizzle.config.ts                 # Drizzle設定
├── next.config.js                    # Next.js設定
├── tailwind.config.ts                # Tailwind設定
├── tsconfig.json                     # TypeScript設定
└── package.json                      # 依存関係
```

## コンポーネントアーキテクチャ

### 画面構成

#### 1. ランディングページ (`/`)
- ヒーローセクション
- 注目の音楽
- カテゴリ一覧
- 「ライブラリへ」ボタン

#### 2. 音楽ライブラリ画面 (`/library`)

```
┌─────────────────────────────────────────┐
│  Header                                  │
│  [Logo] [Search] [Categories]           │
├─────────────────────────────────────────┤
│  Filters & Sort                          │
│  [カテゴリ] [タグ] [並び替え]           │
├─────────────────────────────────────────┤
│  ┌───────┐  ┌───────┐  ┌───────┐       │
│  │Music 1│  │Music 2│  │Music 3│       │
│  │[再生] │  │[再生] │  │[再生] │       │
│  └───────┘  └───────┘  └───────┘       │
│  ┌───────┐  ┌───────┐  ┌───────┐       │
│  │Music 4│  │Music 5│  │Music 6│       │
│  │[再生] │  │[再生] │  │[再生] │       │
│  └───────┘  └───────┘  └───────┘       │
├─────────────────────────────────────────┤
│  Player (固定フッター)                   │
│  ▶ [Title] ━━━━━━━━ 🔊               │
└─────────────────────────────────────────┘
```

**主要機能:**
- **Header**: ロゴ、検索バー、カテゴリメニュー
- **Filters**: カテゴリ・タグフィルター、ソート
- **Music Grid**: レスポンシブグリッド(スマホ1列、タブレット2列、PC3-4列)
- **Player**: 固定フッター音楽プレイヤー

#### 3. 音楽詳細ページ (`/music/[id]`)

```
┌─────────────────────────────────────────┐
│  Header                                  │
├─────────────────────────────────────────┤
│  ┌─────────────┐                        │
│  │             │  Title                 │
│  │  Thumbnail  │  Category / Tags       │
│  │             │  Generated by: AI Name │
│  └─────────────┘                        │
│  ▶ ━━━━━━━━━━━━━ 🔊 [Download]        │
│                                          │
│  Description:                            │
│  Lorem ipsum dolor sit amet...          │
│                                          │
│  Stats: 👁 123 views | ⬇ 45 downloads  │
└─────────────────────────────────────────┘
```

**主要機能:**
- サムネイル画像
- タイトル・メタデータ
- インライン音楽プレイヤー
- ダウンロードボタン
- 説明文
- 統計情報(視聴回数・ダウンロード数)

#### 4. アップロード画面 (`/upload` - 管理者向け)
- ファイル選択(ドラッグ&ドロップ対応)
- メタデータ入力フォーム
- サムネイルアップロード
- プレビュー機能

### データフロー

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ ブラウズ・検索
       ▼
┌─────────────────────┐
│  Library Page (RSC) │
│  - SSR データ取得   │
└──────┬──────────────┘
       │ APIリクエスト
       ▼
┌─────────────────────┐
│  API Route          │
│  GET /api/music     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Drizzle ORM        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Neon PostgreSQL    │
│  music_tracks table │
└─────────────────────┘

┌─────────────┐
│   Admin     │
└──────┬──────┘
       │ アップロード
       ▼
┌─────────────────────┐
│  Upload Page        │
└──────┬──────────────┘
       │ ファイル送信
       ▼
┌─────────────────────┐
│  POST /api/upload   │
└──────┬──────────────┘
       │
       ├──────────────┐
       ▼              ▼
┌──────────────┐ ┌──────────────┐
│ Vercel Blob  │ │ PostgreSQL   │
│ (音楽保存)   │ │ (メタデータ) │
└──────────────┘ └──────────────┘
```

### 状態管理

**React State(useState)を使用**
- `currentTrack`: 現在再生中の楽曲
- `isPlaying`: 再生状態
- `filters`: カテゴリ・タグフィルター
- `searchQuery`: 検索クエリ

**将来的な拡張(スコープ外):**
- Zustand / Jotai等のグローバル状態管理
- プレイリスト機能のための状態管理

## API設計

### エンドポイント一覧

#### 1. 音楽一覧・作成
**GET /api/music**
- クエリパラメータ: `?category=pop&tag=upbeat&sort=latest&limit=20`
- レスポンス: 音楽一覧(ページネーション対応)

**POST /api/music**
- リクエスト: `{ title, description, category_id, tags, file_url, thumbnail_url }`
- レスポンス: 作成された音楽ID

#### 2. 音楽詳細・更新・削除
**GET /api/music/[id]**
- レスポンス: 音楽データ(メタデータ・ファイルURL含む)

**PUT /api/music/[id]**
- リクエスト: `{ title, description, category_id, tags }`
- レスポンス: 更新結果

**DELETE /api/music/[id]**
- レスポンス: 削除結果

#### 3. ダウンロード
**GET /api/download/[id]**
- レスポンス: 音楽ファイル(ストリーム)
- ダウンロード数をインクリメント

#### 4. カテゴリ一覧
**GET /api/categories**
- レスポンス: カテゴリ一覧

#### 5. ファイルアップロード
**POST /api/upload**
- リクエスト: FormData(音楽ファイル・サムネイル)
- レスポンス: `{ file_url, thumbnail_url }`

### データ構造

#### Music Track (JSON)
```typescript
{
  "id": "uuid",
  "title": "Sunset Dreams",
  "description": "A relaxing ambient track...",
  "category": {
    "id": 1,
    "name": "Ambient",
    "slug": "ambient"
  },
  "tags": ["relaxing", "chill", "sunset"],
  "generated_by": "Suno AI",
  "file_url": "https://blob.vercel-storage.com/...",
  "thumbnail_url": "https://blob.vercel-storage.com/...",
  "duration": 180, // seconds
  "file_size": 5242880, // bytes
  "play_count": 1234,
  "download_count": 567,
  "created_at": "2025-10-23T00:00:00Z",
  "updated_at": "2025-10-23T00:00:00Z"
}
```

## 音楽再生アーキテクチャ

### Web Audio API使用パターン

```typescript
// MusicPlayer.tsx (Client Component)
'use client';

import { useRef, useState, useEffect } from 'react';

export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <button onClick={togglePlay}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <progress value={currentTime} max={duration} />
    </div>
  );
}
```

## データベース接続

### Neon PostgreSQL設定

**.env.local**
```
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

**lib/db/index.ts**
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

## ファイルストレージ

### Vercel Blob設定

**lib/storage/blob.ts**
```typescript
import { put, del } from '@vercel/blob';

export async function uploadMusic(file: File) {
  const blob = await put(`music/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}

export async function deleteMusic(url: string) {
  await del(url);
}
```

## セキュリティ考慮事項

### 初期プロトタイプ
- **基本的な認証**: 管理者のみがアップロード可能(環境変数でパスワード管理)
- **公開音楽**: すべての音楽は公開状態
- **ファイルバリデーション**: アップロードファイルの形式・サイズチェック

### 将来的な対策(スコープ外)
- Next-Auth / Clerkによる本格的な認証
- ユーザー権限管理
- CSRF対策
- Rate Limiting
- コンテンツモデレーション

## パフォーマンス最適化

### 初期段階
- React Server Componentsの活用(データフェッチングの最適化)
- 画像最適化(next/image)
- 音楽ファイルのストリーミング
- Tailwind CSSのPurge設定
- モバイル向け軽量化

### 将来的な最適化(スコープ外)
- CDNキャッシング
- 音楽ファイルの圧縮
- プログレッシブロード
- 仮想化(react-window)

## モバイルファースト戦略

### レスポンシブデザイン
- スマホ: 1カラムグリッド
- タブレット: 2カラムグリッド
- PC: 3-4カラムグリッド

### タッチ最適化
- タップ領域の拡大(44x44px以上)
- スワイプジェスチャー対応(将来的)
- タッチフィードバック

### パフォーマンス
- モバイル通信を考慮した最適化
- 画像の遅延読み込み
- 音楽ファイルのストリーミング

## デプロイ戦略

### Vercel設定
1. GitHubリポジトリ連携
2. 環境変数設定(`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`)
3. 自動デプロイ(mainブランチへのpush時)

### ビルド設定
- **Node.js**: 18.x以上
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `.next/`

## 拡張性の考慮

### 将来的な機能拡張
- プレイリスト機能
- ユーザー認証・マイページ
- コメント・レビュー機能
- いいね・お気に入り機能
- ソーシャルシェア
- AI音楽生成機能の統合
- リアルタイム通知(WebSocket)
