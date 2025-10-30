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
    shareLink: text('share_link'), // AI音楽サービスの共有リンク（任意）
    youtubeUrl: text('youtube_url'), // YouTube動画のURL（任意）
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

// Sessionsテーブル（管理者セッション管理）
export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    expiresAtIdx: index('expires_at_idx').on(table.expiresAt),
  })
);

// 型推論のためのエクスポート
export type Music = typeof music.$inferSelect;
export type NewMusic = typeof music.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
