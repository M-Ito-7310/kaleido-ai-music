# Database Schema

## データベース設計

Kaleido AI Musicのデータベーススキーマ設計です。Neon PostgreSQL + Drizzle ORMを使用します。

---

## ER図

```
┌─────────────────┐
│   categories    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ slug            │
│ description     │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────────────────┐
│      music_tracks           │
├─────────────────────────────┤
│ id (PK)                     │
│ title                       │
│ description                 │
│ category_id (FK)            │
│ file_url                    │
│ thumbnail_url               │
│ duration                    │
│ file_size                   │
│ generated_by                │
│ play_count                  │
│ download_count              │
│ created_at                  │
│ updated_at                  │
└────────┬────────────────────┘
         │
         │ N:M
         │
┌────────▼────────┐      ┌─────────────┐
│   music_tags    │──────│    tags     │
├─────────────────┤ N:1  ├─────────────┤
│ music_id (FK)   │      │ id (PK)     │
│ tag_id (FK)     │      │ name        │
│ created_at      │      │ slug        │
└─────────────────┘      │ created_at  │
                         └─────────────┘
```

---

## テーブル定義

### 1. categories (カテゴリマスター)

音楽のカテゴリ(ジャンル)を管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | SERIAL | PRIMARY KEY | カテゴリID |
| name | VARCHAR(50) | NOT NULL, UNIQUE | カテゴリ名(例: "ポップ") |
| slug | VARCHAR(50) | NOT NULL, UNIQUE | URLスラグ(例: "pop") |
| description | TEXT | NULL | カテゴリの説明 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 作成日時 |

**初期データ例:**
```sql
INSERT INTO categories (name, slug, description) VALUES
  ('ポップ', 'pop', 'ポップミュージック'),
  ('ロック', 'rock', 'ロックミュージック'),
  ('エレクトロニック', 'electronic', 'エレクトロニックミュージック'),
  ('クラシック', 'classical', 'クラシック音楽'),
  ('アンビエント', 'ambient', 'アンビエント音楽'),
  ('ジャズ', 'jazz', 'ジャズ音楽'),
  ('ヒップホップ', 'hip-hop', 'ヒップホップ音楽'),
  ('その他', 'other', 'その他のジャンル');
```

---

### 2. music_tracks (音楽トラック)

AI生成音楽のメタデータを管理するメインテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 音楽ID |
| title | VARCHAR(200) | NOT NULL | タイトル |
| description | TEXT | NULL | 説明文 |
| category_id | INTEGER | NOT NULL, FOREIGN KEY → categories(id) | カテゴリID |
| file_url | TEXT | NOT NULL | 音楽ファイルURL(Vercel Blob) |
| thumbnail_url | TEXT | NULL | サムネイル画像URL |
| duration | INTEGER | NULL | 曲の長さ(秒) |
| file_size | BIGINT | NULL | ファイルサイズ(バイト) |
| generated_by | VARCHAR(100) | NULL | 生成AI名(例: "Suno AI") |
| play_count | INTEGER | NOT NULL, DEFAULT 0 | 再生回数 |
| download_count | INTEGER | NOT NULL, DEFAULT 0 | ダウンロード回数 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新日時 |

**インデックス:**
```sql
CREATE INDEX idx_music_tracks_category_id ON music_tracks(category_id);
CREATE INDEX idx_music_tracks_created_at ON music_tracks(created_at DESC);
CREATE INDEX idx_music_tracks_play_count ON music_tracks(play_count DESC);
CREATE INDEX idx_music_tracks_download_count ON music_tracks(download_count DESC);
```

---

### 3. tags (タグマスター)

音楽に付与されるフリータグを管理するテーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | SERIAL | PRIMARY KEY | タグID |
| name | VARCHAR(50) | NOT NULL, UNIQUE | タグ名(例: "relaxing") |
| slug | VARCHAR(50) | NOT NULL, UNIQUE | URLスラグ(例: "relaxing") |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 作成日時 |

**インデックス:**
```sql
CREATE INDEX idx_tags_name ON tags(name);
```

---

### 4. music_tags (音楽とタグの中間テーブル)

音楽とタグの多対多リレーションを管理する中間テーブル。

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| music_id | UUID | NOT NULL, FOREIGN KEY → music_tracks(id) ON DELETE CASCADE | 音楽ID |
| tag_id | INTEGER | NOT NULL, FOREIGN KEY → tags(id) ON DELETE CASCADE | タグID |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 作成日時 |

**複合主キー:**
```sql
PRIMARY KEY (music_id, tag_id)
```

**インデックス:**
```sql
CREATE INDEX idx_music_tags_music_id ON music_tags(music_id);
CREATE INDEX idx_music_tags_tag_id ON music_tags(tag_id);
```

---

## Drizzle ORMスキーマ定義

**src/lib/db/schema.ts**

```typescript
import { pgTable, serial, text, varchar, timestamp, integer, bigint, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// categories テーブル
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// music_tracks テーブル
export const musicTracks = pgTable('music_tracks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  fileUrl: text('file_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'), // 秒単位
  fileSize: bigint('file_size', { mode: 'number' }), // バイト単位
  generatedBy: varchar('generated_by', { length: 100 }),
  playCount: integer('play_count').notNull().default(0),
  downloadCount: integer('download_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// tags テーブル
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// music_tags 中間テーブル
export const musicTags = pgTable('music_tags', {
  musicId: uuid('music_id').notNull().references(() => musicTracks.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.musicId, table.tagId] }),
}));

// リレーション定義
export const categoriesRelations = relations(categories, ({ many }) => ({
  musicTracks: many(musicTracks),
}));

export const musicTracksRelations = relations(musicTracks, ({ one, many }) => ({
  category: one(categories, {
    fields: [musicTracks.categoryId],
    references: [categories.id],
  }),
  musicTags: many(musicTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  musicTags: many(musicTags),
}));

export const musicTagsRelations = relations(musicTags, ({ one }) => ({
  music: one(musicTracks, {
    fields: [musicTags.musicId],
    references: [musicTracks.id],
  }),
  tag: one(tags, {
    fields: [musicTags.tagId],
    references: [tags.id],
  }),
}));
```

---

## マイグレーション

### 初期マイグレーション生成

```bash
npm run db:generate
```

これにより `drizzle/` フォルダにマイグレーションファイルが生成されます。

### データベースへの適用

```bash
npm run db:push
```

---

## クエリ例

### 1. 音楽一覧取得(カテゴリ・タグ・ソート対応)

```typescript
import { db } from '@/lib/db';
import { musicTracks, categories, musicTags, tags } from '@/lib/db/schema';
import { eq, desc, like, and } from 'drizzle-orm';

// カテゴリ "ambient" の音楽を新着順で取得
const results = await db.query.musicTracks.findMany({
  where: eq(musicTracks.categoryId, 5), // ambient のID
  orderBy: [desc(musicTracks.createdAt)],
  limit: 20,
  with: {
    category: true,
    musicTags: {
      with: {
        tag: true,
      },
    },
  },
});
```

### 2. 音楽詳細取得

```typescript
const music = await db.query.musicTracks.findFirst({
  where: eq(musicTracks.id, musicId),
  with: {
    category: true,
    musicTags: {
      with: {
        tag: true,
      },
    },
  },
});
```

### 3. 音楽作成(タグ付き)

```typescript
// トランザクション使用
await db.transaction(async (tx) => {
  // 音楽を作成
  const [newMusic] = await tx.insert(musicTracks).values({
    title: 'Sunset Dreams',
    description: 'A relaxing ambient track',
    categoryId: 5,
    fileUrl: 'https://blob.vercel-storage.com/...',
    thumbnailUrl: 'https://blob.vercel-storage.com/...',
    generatedBy: 'Suno AI',
  }).returning();

  // タグを作成または取得
  const tagNames = ['relaxing', 'chill', 'ambient'];
  for (const tagName of tagNames) {
    let tag = await tx.query.tags.findFirst({
      where: eq(tags.name, tagName),
    });

    if (!tag) {
      [tag] = await tx.insert(tags).values({
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-'),
      }).returning();
    }

    // 音楽とタグを関連付け
    await tx.insert(musicTags).values({
      musicId: newMusic.id,
      tagId: tag.id,
    });
  }
});
```

### 4. 再生回数インクリメント

```typescript
await db.update(musicTracks)
  .set({ playCount: sql`${musicTracks.playCount} + 1` })
  .where(eq(musicTracks.id, musicId));
```

### 5. タグでフィルタリング

```typescript
// "relaxing" タグを持つ音楽を取得
const results = await db
  .select()
  .from(musicTracks)
  .innerJoin(musicTags, eq(musicTracks.id, musicTags.musicId))
  .innerJoin(tags, eq(musicTags.tagId, tags.id))
  .where(eq(tags.slug, 'relaxing'));
```

---

## データベース容量見積もり

### Neon PostgreSQL 無料枠
- **ストレージ**: 0.5GB
- **データ転送**: 制限なし
- **コネクション**: 制限なし

### 容量計算
- **音楽レコード**: 約1KB/レコード
- **カテゴリ**: 8レコード(固定)
- **タグ**: 約100レコード想定
- **音楽タグ関連**: 約5タグ/音楽 × 音楽数

**1000曲の場合:**
- 音楽: 1KB × 1000 = 1MB
- タグ: 0.5KB × 100 = 50KB
- 音楽タグ: 0.2KB × 5000 = 1MB
- **合計**: 約2MB

→ 無料枠で十分に対応可能

---

## バックアップ戦略

### 開発環境
- Neon PostgreSQL のスナップショット機能を利用
- 定期的にエクスポート(`pg_dump`)

### 本番環境(将来的)
- Neon の有料プランでポイントインタイムリカバリ
- 日次バックアップ

---

## パフォーマンスチューニング

### インデックス最適化
- よく検索されるカラムにインデックスを作成
- 複合インデックスの検討(例: `category_id + created_at`)

### クエリ最適化
- N+1問題の回避(Drizzleの `with` を活用)
- 必要なカラムのみ取得(`select()` 使用)
- ページネーションの実装

### 接続プーリング
- Neon のサーバーレスドライバー使用(自動接続プーリング)
- エッジ環境での効率的な接続管理

---

## 将来的な拡張(スコープ外)

### ユーザー管理
- `users` テーブル追加
- `music_tracks.user_id` 外部キー追加

### お気に入り機能
- `favorites` テーブル追加(`user_id`, `music_id`)

### コメント機能
- `comments` テーブル追加

### プレイリスト機能
- `playlists` テーブル
- `playlist_tracks` 中間テーブル
