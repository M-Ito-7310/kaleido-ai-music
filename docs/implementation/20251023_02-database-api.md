# Phase 2: データベース・API構築 - 詳細実装ガイド

**Phase**: 2/7
**推定時間**: 2日
**前提条件**: Phase 1完了、Neonアカウント、Vercelアカウント
**次のPhase**: Phase 3 - UI実装

---

## 目次

1. [概要](#概要)
2. [Neon PostgreSQL設定](#neon-postgresql設定)
3. [Drizzle ORMスキーマ定義](#drizzle-ormスキーマ定義)
4. [型定義の作成](#型定義の作成)
5. [データベースクエリ関数](#データベースクエリ関数)
6. [API Routes実装](#api-routes実装)
7. [Vercel Blob Storage統合](#vercel-blob-storage統合)
8. [テストとデバッグ](#テストとデバッグ)
9. [トラブルシューティング](#トラブルシューティング)
10. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 2では、Kaleido AI Musicのデータベース基盤とAPI Routesを構築します。Neon PostgreSQLをデータベースとして使用し、Drizzle ORMで型安全なデータアクセスを実現します。また、Vercel Blob Storageを統合して音楽ファイルと画像の保存を可能にします。

### このPhaseで実現すること

- Neon PostgreSQLデータベースの作成と接続設定
- Drizzle ORMスキーマ定義（music、categories、tags）
- TypeScript型定義の作成
- データベースクエリ関数の実装
- API Routes実装（CRUD操作）
- Vercel Blob Storageの統合
- ファイルアップロード機能

---

## Neon PostgreSQL設定

### ステップ 1: Neonアカウントの作成

1. https://neon.tech にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントで認証（推奨）
4. 無料プラン（Free Tier）を選択

### ステップ 2: 新しいプロジェクトの作成

1. ダッシュボードで「Create Project」をクリック
2. プロジェクト設定:
   - **Project Name**: `kaleido-ai-music`
   - **Database Name**: `kaleido_db`
   - **Region**: 最寄りのリージョン（例: US East 1）
   - **PostgreSQL Version**: 最新版（16.x推奨）

3. 「Create Project」をクリック

### ステップ 3: 接続文字列の取得

プロジェクト作成後、接続文字列が表示されます:

```
postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/kaleido_db?sslmode=require
```

**この接続文字列をコピーして保管してください。**

### ステップ 4: 環境変数の設定

**ファイル名**: `.env.local`

```bash
# Neon PostgreSQL接続文字列
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/kaleido_db?sslmode=require"

# Vercel Blob Storage トークン（後で設定）
BLOB_READ_WRITE_TOKEN=""

# アプリケーションURL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**注意**: `.env.local` はGitに含めないでください（`.gitignore`で除外されています）

---

## Drizzle ORMスキーマ定義

### ステップ 5: データベーススキーマの作成

**ファイル名**: `lib/db/schema.ts`

```typescript
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
  json,
  index,
} from 'drizzle-orm/pg-core';

// Musicテーブル
export const music = pgTable(
  'music',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    artist: varchar('artist', { length: 255 }).notNull(),
    description: text('description'),
    audioUrl: text('audio_url').notNull(),
    imageUrl: text('image_url').notNull(),
    duration: integer('duration').notNull(), // 秒数
    fileSize: integer('file_size'), // バイト
    category: varchar('category', { length: 100 }).notNull(),
    tags: json('tags').$type<string[]>().default([]),
    aiPlatform: varchar('ai_platform', { length: 100 }), // "Suno AI", "Udio" など
    genre: varchar('genre', { length: 100 }),
    mood: varchar('mood', { length: 100 }),
    tempo: integer('tempo'), // BPM
    playCount: integer('play_count').default(0),
    downloadCount: integer('download_count').default(0),
    isPublished: integer('is_published').default(1), // 1: 公開, 0: 非公開
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('category_idx').on(table.category),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    playCountIdx: index('play_count_idx').on(table.playCount),
    downloadCountIdx: index('download_count_idx').on(table.downloadCount),
  })
);

// Categoriesテーブル
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }), // アイコン名またはemoji
  color: varchar('color', { length: 20 }), // Tailwindカラー名
  musicCount: integer('music_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tagsテーブル
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  count: integer('count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 型推論のためのエクスポート
export type Music = typeof music.$inferSelect;
export type NewMusic = typeof music.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
```

### ステップ 6: データベース接続設定

**ファイル名**: `lib/db/index.ts`

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// 環境変数の検証
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Neon接続
const sql = neon(process.env.DATABASE_URL);

// Drizzle ORMインスタンス
export const db = drizzle(sql, { schema });

// 接続テスト関数
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected:', result);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
```

### ステップ 7: マイグレーションの生成と実行

**コマンド:**
```bash
# マイグレーションファイルの生成
npm run db:generate

# データベースにスキーマを反映
npm run db:push
```

**成功時の出力:**
```
✅ Applying: CREATE TABLE "music" ...
✅ Applying: CREATE TABLE "categories" ...
✅ Applying: CREATE TABLE "tags" ...
✅ Applying: CREATE INDEX "category_idx" ...
✅ Applying: CREATE INDEX "created_at_idx" ...
✅ Migrations complete!
```

---

## 型定義の作成

### ステップ 8: 音楽関連の型定義

**ファイル名**: `types/music.ts`

```typescript
import { Music, Category, Tag } from '@/lib/db/schema';

// 音楽詳細型（関連データを含む）
export interface MusicWithDetails extends Music {
  categoryInfo?: Category;
  tagsList?: Tag[];
}

// 音楽フィルター型
export interface MusicFilter {
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'latest' | 'popular' | 'downloads';
  limit?: number;
  offset?: number;
}

// 音楽統計型
export interface MusicStats {
  totalPlays: number;
  totalDownloads: number;
  totalMusic: number;
  averageDuration: number;
}

// ファイルアップロード型
export interface MusicUploadData {
  title: string;
  artist: string;
  description?: string;
  category: string;
  tags: string[];
  aiPlatform?: string;
  genre?: string;
  mood?: string;
  tempo?: number;
}

// 音楽カード表示用型
export interface MusicCardData {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  duration: number;
  category: string;
  playCount: number;
  createdAt: Date;
}
```

### ステップ 9: API レスポンス型定義

**ファイル名**: `types/api.ts`

```typescript
// 成功レスポンス
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// エラーレスポンス
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// API レスポンス型（成功 or エラー）
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
```

---

## データベースクエリ関数

### ステップ 10: 音楽クエリ関数の実装

**ファイル名**: `lib/db/queries.ts`

```typescript
import { db } from './index';
import { music, categories, tags } from './schema';
import { eq, desc, asc, like, inArray, sql } from 'drizzle-orm';
import type { MusicFilter, MusicStats } from '@/types/music';
import type { NewMusic } from './schema';

/**
 * 音楽一覧を取得（フィルター・ソート・ページネーション対応）
 */
export async function getMusicList(filter: MusicFilter = {}) {
  const {
    category,
    tags: filterTags,
    search,
    sortBy = 'latest',
    limit = 20,
    offset = 0,
  } = filter;

  let query = db.select().from(music).where(eq(music.isPublished, 1));

  // カテゴリフィルター
  if (category) {
    query = query.where(eq(music.category, category));
  }

  // 検索フィルター
  if (search) {
    query = query.where(
      sql`${music.title} ILIKE ${`%${search}%`} OR ${music.artist} ILIKE ${`%${search}%`}`
    );
  }

  // タグフィルター（配列の重なりチェック）
  if (filterTags && filterTags.length > 0) {
    query = query.where(
      sql`${music.tags} && ${JSON.stringify(filterTags)}::jsonb`
    );
  }

  // ソート
  switch (sortBy) {
    case 'popular':
      query = query.orderBy(desc(music.playCount), desc(music.createdAt));
      break;
    case 'downloads':
      query = query.orderBy(desc(music.downloadCount), desc(music.createdAt));
      break;
    case 'latest':
    default:
      query = query.orderBy(desc(music.createdAt));
      break;
  }

  // ページネーション
  query = query.limit(limit).offset(offset);

  const result = await query;
  return result;
}

/**
 * 音楽詳細を取得
 */
export async function getMusicById(id: number) {
  const result = await db.select().from(music).where(eq(music.id, id)).limit(1);
  return result[0] || null;
}

/**
 * 音楽を作成
 */
export async function createMusic(data: NewMusic) {
  const result = await db.insert(music).values(data).returning();
  return result[0];
}

/**
 * 音楽を更新
 */
export async function updateMusic(id: number, data: Partial<NewMusic>) {
  const result = await db
    .update(music)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(music.id, id))
    .returning();
  return result[0];
}

/**
 * 音楽を削除
 */
export async function deleteMusic(id: number) {
  await db.delete(music).where(eq(music.id, id));
  return true;
}

/**
 * 再生回数をインクリメント
 */
export async function incrementPlayCount(id: number) {
  await db
    .update(music)
    .set({ playCount: sql`${music.playCount} + 1` })
    .where(eq(music.id, id));
}

/**
 * ダウンロード回数をインクリメント
 */
export async function incrementDownloadCount(id: number) {
  await db
    .update(music)
    .set({ downloadCount: sql`${music.downloadCount} + 1` })
    .where(eq(music.id, id));
}

/**
 * 音楽統計を取得
 */
export async function getMusicStats(): Promise<MusicStats> {
  const result = await db
    .select({
      totalPlays: sql<number>`SUM(${music.playCount})`,
      totalDownloads: sql<number>`SUM(${music.downloadCount})`,
      totalMusic: sql<number>`COUNT(*)`,
      averageDuration: sql<number>`AVG(${music.duration})`,
    })
    .from(music)
    .where(eq(music.isPublished, 1));

  return {
    totalPlays: Number(result[0]?.totalPlays || 0),
    totalDownloads: Number(result[0]?.totalDownloads || 0),
    totalMusic: Number(result[0]?.totalMusic || 0),
    averageDuration: Math.round(Number(result[0]?.averageDuration || 0)),
  };
}

/**
 * カテゴリ一覧を取得
 */
export async function getCategories() {
  return await db.select().from(categories).orderBy(asc(categories.name));
}

/**
 * カテゴリを作成
 */
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}) {
  const result = await db.insert(categories).values(data).returning();
  return result[0];
}

/**
 * タグ一覧を取得（使用頻度順）
 */
export async function getTags(limit = 50) {
  return await db.select().from(tags).orderBy(desc(tags.count)).limit(limit);
}

/**
 * タグを作成または更新
 */
export async function upsertTag(name: string, slug: string) {
  // 既存タグを検索
  const existingTag = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);

  if (existingTag.length > 0) {
    // 既存タグのカウントをインクリメント
    const result = await db
      .update(tags)
      .set({ count: sql`${tags.count} + 1` })
      .where(eq(tags.slug, slug))
      .returning();
    return result[0];
  } else {
    // 新規タグを作成
    const result = await db.insert(tags).values({ name, slug, count: 1 }).returning();
    return result[0];
  }
}
```

---

## API Routes実装

### ステップ 11: 音楽一覧API

**ファイル名**: `app/api/music/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getMusicList, createMusic } from '@/lib/db/queries';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Music } from '@/lib/db/schema';
import { z } from 'zod';

// GET /api/music - 音楽一覧を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // クエリパラメータを取得
    const category = searchParams.get('category') || undefined;
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',') : undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('sortBy') as 'latest' | 'popular' | 'downloads') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 音楽リストを取得
    const musicList = await getMusicList({
      category,
      tags,
      search,
      sortBy,
      limit,
      offset,
    });

    // レスポンス
    const response: PaginatedResponse<Music> = {
      success: true,
      data: musicList,
      pagination: {
        total: musicList.length, // TODO: 総数を取得する別クエリを実装
        limit,
        offset,
        hasMore: musicList.length === limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching music list:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch music list',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST /api/music - 新しい音楽を作成
const createMusicSchema = z.object({
  title: z.string().min(1).max(255),
  artist: z.string().min(1).max(255),
  description: z.string().optional(),
  audioUrl: z.string().url(),
  imageUrl: z.string().url(),
  duration: z.number().positive(),
  fileSize: z.number().positive().optional(),
  category: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  aiPlatform: z.string().max(100).optional(),
  genre: z.string().max(100).optional(),
  mood: z.string().max(100).optional(),
  tempo: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = createMusicSchema.parse(body);

    // 音楽を作成
    const newMusic = await createMusic(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: newMusic,
        message: 'Music created successfully',
      } as ApiResponse<Music>,
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.errors.map((e) => e.message).join(', '),
        } as ApiResponse,
        { status: 400 }
      );
    }

    console.error('Error creating music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
```

### ステップ 12: 音楽詳細API

**ファイル名**: `app/api/music/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getMusicById, updateMusic, deleteMusic } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
import type { Music } from '@/lib/db/schema';
import { z } from 'zod';

// GET /api/music/[id] - 音楽詳細を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid music ID',
        } as ApiResponse,
        { status: 400 }
      );
    }

    const music = await getMusicById(id);

    if (!music) {
      return NextResponse.json(
        {
          success: false,
          error: 'Music not found',
        } as ApiResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: music,
    } as ApiResponse<Music>);
  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// PUT /api/music/[id] - 音楽を更新
const updateMusicSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  artist: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
  aiPlatform: z.string().max(100).optional(),
  genre: z.string().max(100).optional(),
  mood: z.string().max(100).optional(),
  tempo: z.number().optional(),
  isPublished: z.number().min(0).max(1).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid music ID',
        } as ApiResponse,
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateMusicSchema.parse(body);

    const updatedMusic = await updateMusic(id, validatedData);

    if (!updatedMusic) {
      return NextResponse.json(
        {
          success: false,
          error: 'Music not found',
        } as ApiResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMusic,
      message: 'Music updated successfully',
    } as ApiResponse<Music>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.errors.map((e) => e.message).join(', '),
        } as ApiResponse,
        { status: 400 }
      );
    }

    console.error('Error updating music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE /api/music/[id] - 音楽を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid music ID',
        } as ApiResponse,
        { status: 400 }
      );
    }

    await deleteMusic(id);

    return NextResponse.json({
      success: true,
      message: 'Music deleted successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
```

### ステップ 13: 再生回数API

**ファイル名**: `app/api/music/[id]/play/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { incrementPlayCount } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';

// POST /api/music/[id]/play - 再生回数をインクリメント
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid music ID',
        } as ApiResponse,
        { status: 400 }
      );
    }

    await incrementPlayCount(id);

    return NextResponse.json({
      success: true,
      message: 'Play count incremented',
    } as ApiResponse);
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to increment play count',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
```

### ステップ 14: ダウンロード回数API

**ファイル名**: `app/api/music/[id]/download/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { incrementDownloadCount } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';

// POST /api/music/[id]/download - ダウンロード回数をインクリメント
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid music ID',
        } as ApiResponse,
        { status: 400 }
      );
    }

    await incrementDownloadCount(id);

    return NextResponse.json({
      success: true,
      message: 'Download count incremented',
    } as ApiResponse);
  } catch (error) {
    console.error('Error incrementing download count:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to increment download count',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
```

### ステップ 15: カテゴリAPI

**ファイル名**: `app/api/categories/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
import type { Category } from '@/lib/db/schema';

// GET /api/categories - カテゴリ一覧を取得
export async function GET() {
  try {
    const categoriesList = await getCategories();

    return NextResponse.json({
      success: true,
      data: categoriesList,
    } as ApiResponse<Category[]>);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
```

### ステップ 16: タグAPI

**ファイル名**: `app/api/tags/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getTags } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
import type { Tag } from '@/lib/db/schema';

// GET /api/tags - タグ一覧を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const tagsList = await getTags(limit);

    return NextResponse.json({
      success: true,
      data: tagsList,
    } as ApiResponse<Tag[]>);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tags',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
```

---

## Vercel Blob Storage統合

### ステップ 17: Vercel Blobトークンの取得

1. https://vercel.com にログイン
2. プロジェクトを作成（または既存プロジェクトを選択）
3. Settings → Environment Variables
4. 新しい環境変数を追加:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: トークンを生成（Vercel Blobセクション）

5. トークンを`.env.local`に追加:
```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"
```

### ステップ 18: ファイルアップロード関数

**ファイル名**: `lib/storage/upload.ts`

```typescript
import { put, del } from '@vercel/blob';

/**
 * 音楽ファイルをアップロード
 */
export async function uploadMusic(file: File): Promise<string> {
  if (!file.type.startsWith('audio/')) {
    throw new Error('File must be an audio file');
  }

  const timestamp = Date.now();
  const filename = `music/${timestamp}-${file.name}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return blob.url;
}

/**
 * 画像ファイルをアップロード
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image file');
  }

  const timestamp = Date.now();
  const filename = `images/${timestamp}-${file.name}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return blob.url;
}

/**
 * ファイルを削除
 */
export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

/**
 * ファイルサイズをバリデーション
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * ファイルタイプをバリデーション
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => file.type.startsWith(type));
}
```

---

## テストとデバッグ

### ステップ 19: データベース接続テスト

**ファイル名**: `scripts/test-db.ts`

```typescript
import { testConnection } from '@/lib/db';

async function main() {
  console.log('Testing database connection...');
  const isConnected = await testConnection();

  if (isConnected) {
    console.log('✅ Database connection successful');
    process.exit(0);
  } else {
    console.error('❌ Database connection failed');
    process.exit(1);
  }
}

main();
```

**実行コマンド:**
```bash
npx tsx scripts/test-db.ts
```

### ステップ 20: APIテスト

**テストツール**: Thunder Client（VSCode拡張機能）または Postman

**テストケース:**

1. **GET /api/music**
   - URL: `http://localhost:3000/api/music`
   - 期待結果: `{ success: true, data: [], pagination: {...} }`

2. **POST /api/music**
   - URL: `http://localhost:3000/api/music`
   - Body:
   ```json
   {
     "title": "Test Music",
     "artist": "Test Artist",
     "audioUrl": "https://example.com/music.mp3",
     "imageUrl": "https://example.com/image.jpg",
     "duration": 180,
     "category": "pop",
     "tags": ["test", "demo"]
   }
   ```
   - 期待結果: `{ success: true, data: {...}, message: "Music created successfully" }`

3. **GET /api/categories**
   - URL: `http://localhost:3000/api/music/categories`
   - 期待結果: `{ success: true, data: [] }`

---

## トラブルシューティング

### 問題1: データベース接続エラー

**エラーメッセージ:**
```
Error: getaddrinfo ENOTFOUND ep-xxx-xxx.us-east-1.aws.neon.tech
```

**解決策:**
1. `.env.local` の `DATABASE_URL` を確認
2. 接続文字列が正しいか確認
3. Neonダッシュボードでデータベースが起動しているか確認

### 問題2: マイグレーションエラー

**エラーメッセージ:**
```
Error: relation "music" does not exist
```

**解決策:**
```bash
# マイグレーションを再実行
npm run db:push
```

### 問題3: Blob Storageエラー

**エラーメッセージ:**
```
Error: BLOB_READ_WRITE_TOKEN is not set
```

**解決策:**
1. `.env.local` に `BLOB_READ_WRITE_TOKEN` を追加
2. Vercelダッシュボードでトークンを確認
3. 開発サーバーを再起動

---

## 成果物チェックリスト

### データベース

- [ ] Neon PostgreSQLプロジェクトが作成されている
- [ ] `.env.local` に `DATABASE_URL` が設定されている
- [ ] `npm run db:push` が成功している
- [ ] `scripts/test-db.ts` が成功する

### スキーマ・型定義

- [ ] `lib/db/schema.ts` が作成されている
- [ ] `lib/db/index.ts` が作成されている
- [ ] `lib/db/queries.ts` が作成されている
- [ ] `types/music.ts` が作成されている
- [ ] `types/api.ts` が作成されている

### API Routes

- [ ] `app/api/music/route.ts` が作成されている
- [ ] `app/api/music/[id]/route.ts` が作成されている
- [ ] `app/api/music/[id]/play/route.ts` が作成されている
- [ ] `app/api/music/[id]/download/route.ts` が作成されている
- [ ] `app/api/categories/route.ts` が作成されている
- [ ] `app/api/tags/route.ts` が作成されている

### Blob Storage

- [ ] `.env.local` に `BLOB_READ_WRITE_TOKEN` が設定されている
- [ ] `lib/storage/upload.ts` が作成されている

### テスト

- [ ] `GET /api/music` が200を返す
- [ ] `POST /api/music` が201を返す（有効なデータで）
- [ ] `GET /api/categories` が200を返す
- [ ] データベース接続テストが成功する

---

## 次のステップ

Phase 2が完了したら、Phase 3「UI実装」に進みます。

**次のドキュメント**: `20251023_03-ui-implementation.md`

Phase 3では以下を実装します:
- ランディングページ
- 音楽ライブラリ画面
- 音楽詳細ページ
- 音楽プレイヤーコンポーネント
- 共通UIコンポーネント

---

## まとめ

Phase 2では、Kaleido AI Musicのバックエンド基盤を構築しました。

**達成したこと:**
- ✅ Neon PostgreSQL設定
- ✅ Drizzle ORMスキーマ定義
- ✅ TypeScript型定義
- ✅ データベースクエリ関数
- ✅ API Routes実装
- ✅ Vercel Blob Storage統合

**所要時間:** 約2日（12-16時間）

次のPhaseに進む準備が整いました！

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
