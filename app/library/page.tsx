export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { getMusicList, getMusicCount, getCategories, getTags } from '@/lib/db/queries';
import { MusicGrid } from '@/components/music/MusicGrid';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { TagFilter } from '@/components/filters/TagFilter';
import { SearchBar } from '@/components/filters/SearchBar';
import { SortSelector } from '@/components/filters/SortSelector';
import { Pagination } from '@/components/filters/Pagination';
import { ActiveFilters } from '@/components/filters/ActiveFilters';
import { FadeTransition } from '@/components/ui/PageTransition';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: '音楽ライブラリ - Kaleido AI Music',
  description: 'AI生成音楽のライブラリ。様々なジャンル、ムードの音楽を視聴・ダウンロードできます。',
};

interface LibraryPageProps {
  searchParams: {
    category?: string;
    tags?: string;
    search?: string;
    sortBy?: 'latest' | 'popular' | 'downloads';
    offset?: string;
    limit?: string;
  };
}

// ローディング用のスケルトン
function MusicGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const category = searchParams.category;
  const tagsParam = searchParams.tags;
  const tags = tagsParam ? tagsParam.split(',') : undefined;
  const search = searchParams.search;
  const sortBy = searchParams.sortBy || 'latest';
  const limit = parseInt(searchParams.limit || '10', 10);
  const offset = parseInt(searchParams.offset || '0', 10);

  // データ取得
  const [musicList, totalCount, categoriesList, tagsList] = await Promise.all([
    getMusicList({ category, tags, search, sortBy, limit, offset }),
    getMusicCount({ category, tags, search }),
    getCategories(),
    getTags(10),
  ]);

  return (
    <FadeTransition className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">音楽ライブラリ</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">AI生成音楽を視聴・ダウンロードできます</p>
        </div>

        {/* 検索バーとソート */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <SortSelector />
        </div>

        {/* アクティブフィルター */}
        <div className="mb-6">
          <ActiveFilters />
        </div>

        {/* フィルター */}
        <div className="mb-8 space-y-6 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <CategoryFilter categories={categoriesList} currentCategory={category} />
          <TagFilter tags={tagsList} selectedTags={tags || []} />
        </div>

        {/* 件数表示 */}
        {totalCount > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category || tags || search ? (
                <>
                  <span className="font-medium text-gray-900 dark:text-white">{totalCount}件</span>
                  の音楽が見つかりました
                </>
              ) : (
                <>
                  全<span className="font-medium text-gray-900 dark:text-white">{totalCount}件</span>
                  の音楽
                </>
              )}
            </p>
          </div>
        )}

        {/* 音楽グリッド */}
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
            </div>
          }
        >
          <MusicGrid musicList={musicList} />
        </Suspense>

        {/* ページネーション */}
        {musicList.length > 0 && (
          <div className="mt-12">
            <Pagination total={totalCount} limit={limit} currentOffset={offset} />
          </div>
        )}

        {/* 結果が0件の場合 */}
        {musicList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {search || category || tags
                ? '検索条件に一致する音楽が見つかりませんでした'
                : '音楽がまだ登録されていません'}
            </p>
          </div>
        )}
      </div>
    </FadeTransition>
  );
}
