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
