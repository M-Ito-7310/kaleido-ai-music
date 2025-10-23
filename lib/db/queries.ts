import { db } from './index';
import { music, categories, tags } from './schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { MusicFilter, MusicStats } from '@/types/music';
import type { NewMusic } from './schema';

/**
 * 音楽一覧を取得（フィルター・ソート・ページネーション対応）
 */
export async function getMusicList(filter: MusicFilter = {}) {
  const {
    sortBy = 'latest',
    limit = 20,
    offset = 0,
  } = filter;

  let orderBy;
  switch (sortBy) {
    case 'popular':
      orderBy = [desc(music.playCount), desc(music.createdAt)];
      break;
    case 'downloads':
      orderBy = [desc(music.downloadCount), desc(music.createdAt)];
      break;
    case 'latest':
    default:
      orderBy = [desc(music.createdAt)];
      break;
  }

  const result = await db
    .select()
    .from(music)
    .where(eq(music.isPublished, 1))
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset);

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
 * カテゴリ一覧を取得
 */
export async function getCategories() {
  return await db.select().from(categories);
}

/**
 * タグ一覧を取得
 */
export async function getTags() {
  return await db.select().from(tags);
}

/**
 * 音楽統計情報を取得
 */
export async function getMusicStats(): Promise<MusicStats> {
  const result = await db
    .select({
      totalMusic: sql<number>`count(*)`,
      totalPlays: sql<number>`coalesce(sum(${music.playCount}), 0)`,
      totalDownloads: sql<number>`coalesce(sum(${music.downloadCount}), 0)`,
      averageDuration: sql<number>`coalesce(avg(${music.duration}), 0)`,
    })
    .from(music)
    .where(eq(music.isPublished, 1));

  return result[0] as MusicStats;
}
