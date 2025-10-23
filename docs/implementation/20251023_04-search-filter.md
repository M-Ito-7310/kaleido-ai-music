# Phase 4: 検索・フィルター機能 - 詳細実装ガイド

**Phase**: 4/7
**推定時間**: 1-2日
**前提条件**: Phase 1-3完了
**次のPhase**: Phase 5 - ダウンロード機能

---

## 目次

1. [概要](#概要)
2. [カテゴリフィルター実装](#カテゴリフィルター実装)
3. [タグフィルター実装](#タグフィルター実装)
4. [検索機能実装](#検索機能実装)
5. [ソート機能実装](#ソート機能実装)
6. [URL同期とページネーション](#url同期とページネーション)
7. [フィルター状態管理](#フィルター状態管理)
8. [動作確認](#動作確認)
9. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 4では、音楽ライブラリに検索・フィルター・ソート機能を追加します。ユーザーがカテゴリ、タグ、キーワードで音楽を絞り込み、新着順・人気順・ダウンロード数順で並び替えできるようにします。

### このPhaseで実現すること

- カテゴリフィルターコンポーネント
- タグフィルターコンポーネント
- キーワード検索バー
- ソート機能（新着順、人気順、ダウンロード数順）
- フィルター状態のURL同期
- ページネーション

---

## カテゴリフィルター実装

### ステップ 1: カテゴリフィルターコンポーネント

**ファイル名**: `components/filters/CategoryFilter.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  currentCategory?: string;
}

export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }

    // オフセットをリセット
    params.delete('offset');

    router.push(`/library?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-900">カテゴリ</h3>
      <div className="flex flex-wrap gap-2">
        {/* すべて */}
        <button
          onClick={() => handleCategoryChange(null)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            !currentCategory
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          すべて
        </button>

        {/* 各カテゴリ */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.slug)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              currentCategory === category.slug
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category.icon && <span className="mr-1">{category.icon}</span>}
            {category.name}
            {category.musicCount > 0 && (
              <span className="ml-1.5 text-xs opacity-75">({category.musicCount})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### ステップ 2: カテゴリデータのシード

**ファイル名**: `scripts/seed-categories.ts`

```typescript
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';

const categoryData = [
  {
    name: 'ポップ',
    slug: 'pop',
    description: '明るく親しみやすいポップミュージック',
    icon: '🎵',
    color: 'blue',
  },
  {
    name: 'ロック',
    slug: 'rock',
    description: 'エネルギッシュなロックサウンド',
    icon: '🎸',
    color: 'red',
  },
  {
    name: 'クラシック',
    slug: 'classical',
    description: '優雅なクラシック音楽',
    icon: '🎻',
    color: 'purple',
  },
  {
    name: 'アンビエント',
    slug: 'ambient',
    description: '落ち着いた雰囲気の環境音楽',
    icon: '🌌',
    color: 'indigo',
  },
  {
    name: 'エレクトロニック',
    slug: 'electronic',
    description: 'シンセサイザーを使った電子音楽',
    icon: '🎹',
    color: 'cyan',
  },
  {
    name: 'ジャズ',
    slug: 'jazz',
    description: '即興性豊かなジャズミュージック',
    icon: '🎷',
    color: 'amber',
  },
  {
    name: 'Lo-Fi',
    slug: 'lofi',
    description: 'リラックスできるLo-Fiヒップホップ',
    icon: '☕',
    color: 'orange',
  },
  {
    name: 'シネマティック',
    slug: 'cinematic',
    description: '映画のような壮大なサウンドトラック',
    icon: '🎬',
    color: 'gray',
  },
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  for (const category of categoryData) {
    await db.insert(categories).values(category).onConflictDoNothing();
    console.log(`✅ Created category: ${category.name}`);
  }

  console.log('✅ Categories seeded successfully');
}

seedCategories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  });
```

**実行コマンド:**
```bash
npx tsx scripts/seed-categories.ts
```

---

## タグフィルター実装

### ステップ 3: タグフィルターコンポーネント

**ファイル名**: `components/filters/TagFilter.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import type { Tag } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
}

export function TagFilter({ tags, selectedTags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagToggle = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = params.get('tags')?.split(',').filter(Boolean) || [];

    let newTags: string[];
    if (currentTags.includes(tagSlug)) {
      // タグを削除
      newTags = currentTags.filter((t) => t !== tagSlug);
    } else {
      // タグを追加
      newTags = [...currentTags, tagSlug];
    }

    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }

    // オフセットをリセット
    params.delete('offset');

    router.push(`/library?${params.toString()}`);
  };

  const handleClearTags = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tags');
    params.delete('offset');
    router.push(`/library?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">タグ</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={handleClearTags}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            クリア
          </button>
        )}
      </div>

      {/* 選択中のタグ */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200">
          {selectedTags.map((tagSlug) => {
            const tag = tags.find((t) => t.slug === tagSlug);
            if (!tag) return null;

            return (
              <button
                key={tag.slug}
                onClick={() => handleTagToggle(tag.slug)}
                className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 hover:bg-primary-200 transition-colors"
              >
                #{tag.name}
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>
      )}

      {/* すべてのタグ */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.slug);

          return (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.slug)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              #{tag.name}
              {tag.count > 0 && (
                <span className="ml-1 text-xs opacity-75">({tag.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 検索機能実装

### ステップ 4: 検索バーコンポーネント

**ファイル名**: `components/filters/SearchBar.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // デバウンス付き検索
  const debouncedSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }

    // オフセットをリセット
    params.delete('offset');

    router.push(`/library?${params.toString()}`);
  }, 500);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="タイトル、アーティストで検索..."
        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
```

**依存関係の追加:**
```bash
npm install use-debounce
```

---

## ソート機能実装

### ステップ 5: ソートセレクターコンポーネント

**ファイル名**: `components/filters/SortSelector.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

type SortOption = 'latest' | 'popular' | 'downloads';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '新着順' },
  { value: 'popular', label: '人気順（再生数）' },
  { value: 'downloads', label: 'ダウンロード数順' },
];

export function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get('sortBy') as SortOption) || 'latest';

  const handleSortChange = (sortBy: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.delete('offset');
    router.push(`/library?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## URL同期とページネーション

### ステップ 6: ページネーションコンポーネント

**ファイル名**: `components/filters/Pagination.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  total: number;
  limit: number;
  currentOffset: number;
}

export function Pagination({ total, limit, currentOffset }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(currentOffset / limit) + 1;

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * limit;
    const params = new URLSearchParams(searchParams.toString());
    params.set('offset', newOffset.toString());
    router.push(`/library?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  // ページ番号の配列を生成（最大7ページ分表示）
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // 全ページを表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 省略形で表示
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 前へ */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          currentPage === 1
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        前へ
      </button>

      {/* ページ番号 */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={cn(
                'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 次へ */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        次へ
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
```

---

## フィルター状態管理

### ステップ 7: 音楽ライブラリページの更新

**ファイル名**: `app/library/page.tsx`（更新版）

```typescript
import { Suspense } from 'react';
import { getMusicList, getCategories, getTags } from '@/lib/db/queries';
import { MusicGrid } from '@/components/music/MusicGrid';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { TagFilter } from '@/components/filters/TagFilter';
import { SearchBar } from '@/components/filters/SearchBar';
import { SortSelector } from '@/components/filters/SortSelector';
import { Pagination } from '@/components/filters/Pagination';
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
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
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
  const limit = parseInt(searchParams.limit || '20', 10);
  const offset = parseInt(searchParams.offset || '0', 10);

  // データ取得
  const [musicList, categoriesList, tagsList] = await Promise.all([
    getMusicList({ category, tags, search, sortBy, limit, offset }),
    getCategories(),
    getTags(50),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">音楽ライブラリ</h1>
          <p className="mt-2 text-gray-600">AI生成音楽を視聴・ダウンロードできます</p>
        </div>

        {/* 検索バーとソート */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <SortSelector />
        </div>

        {/* フィルター */}
        <div className="mb-8 space-y-6 rounded-lg bg-white p-6 shadow-sm">
          <CategoryFilter categories={categoriesList} currentCategory={category} />
          <TagFilter tags={tagsList} selectedTags={tags || []} />
        </div>

        {/* 音楽グリッド */}
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          }
        >
          <MusicGrid musicList={musicList} />
        </Suspense>

        {/* ページネーション */}
        {musicList.length > 0 && (
          <div className="mt-12">
            <Pagination total={1000} limit={limit} currentOffset={offset} />
          </div>
        )}

        {/* 結果が0件の場合 */}
        {musicList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {search || category || tags
                ? '検索条件に一致する音楽が見つかりませんでした'
                : '音楽がまだ登録されていません'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### ステップ 8: アクティブフィルター表示

**ファイル名**: `components/filters/ActiveFilters.tsx`

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

export function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category');
  const tagsParam = searchParams.get('tags');
  const tags = tagsParam ? tagsParam.split(',') : [];
  const search = searchParams.get('search');

  const hasFilters = category || tags.length > 0 || search;

  const handleRemoveFilter = (filterType: 'category' | 'tags' | 'search', value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filterType === 'category') {
      params.delete('category');
    } else if (filterType === 'tags' && value) {
      const currentTags = params.get('tags')?.split(',').filter(Boolean) || [];
      const newTags = currentTags.filter((t) => t !== value);
      if (newTags.length > 0) {
        params.set('tags', newTags.join(','));
      } else {
        params.delete('tags');
      }
    } else if (filterType === 'search') {
      params.delete('search');
    }

    params.delete('offset');
    router.push(`/library?${params.toString()}`);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('tags');
    params.delete('search');
    params.delete('offset');
    router.push(`/library?${params.toString()}`);
  };

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700">フィルター:</span>

      {/* カテゴリ */}
      {category && (
        <button
          onClick={() => handleRemoveFilter('category')}
          className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 hover:bg-primary-200"
        >
          カテゴリ: {category}
          <X className="h-3 w-3" />
        </button>
      )}

      {/* タグ */}
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleRemoveFilter('tags', tag)}
          className="inline-flex items-center gap-1 rounded-full bg-accent-light/20 px-3 py-1 text-sm font-medium text-accent-dark hover:bg-accent-light/30"
        >
          #{tag}
          <X className="h-3 w-3" />
        </button>
      ))}

      {/* 検索 */}
      {search && (
        <button
          onClick={() => handleRemoveFilter('search')}
          className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-300"
        >
          検索: &quot;{search}&quot;
          <X className="h-3 w-3" />
        </button>
      )}

      {/* すべてクリア */}
      <button
        onClick={handleClearAll}
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        すべてクリア
      </button>
    </div>
  );
}
```

---

## 動作確認

### ステップ 9: テスト

**テスト項目:**

1. **カテゴリフィルター**
   - カテゴリをクリックして絞り込みが動作する
   - URLに`?category=pop`が反映される
   - 「すべて」をクリックするとフィルターが解除される

2. **タグフィルター**
   - タグをクリックして絞り込みが動作する
   - 複数タグを選択できる
   - URLに`?tags=tag1,tag2`が反映される
   - 「クリア」で全タグが解除される

3. **検索機能**
   - キーワード入力で検索が動作する
   - デバウンスが正しく機能する（500ms後に検索）
   - URLに`?search=keyword`が反映される
   - Xボタンで検索クリアが動作する

4. **ソート機能**
   - 新着順、人気順、ダウンロード数順で並び替えが動作する
   - URLに`?sortBy=popular`が反映される

5. **ページネーション**
   - ページ移動が動作する
   - URLに`?offset=20`が反映される
   - フィルター適用時にページがリセットされる

6. **複合フィルター**
   - カテゴリ + タグ + 検索の組み合わせが動作する
   - URLに全パラメータが反映される
   - ブラウザの戻る/進むボタンで状態が復元される

---

## 成果物チェックリスト

### コンポーネント

- [ ] `components/filters/CategoryFilter.tsx` が作成されている
- [ ] `components/filters/TagFilter.tsx` が作成されている
- [ ] `components/filters/SearchBar.tsx` が作成されている
- [ ] `components/filters/SortSelector.tsx` が作成されている
- [ ] `components/filters/Pagination.tsx` が作成されている
- [ ] `components/filters/ActiveFilters.tsx` が作成されている

### 機能

- [ ] カテゴリフィルターが動作する
- [ ] タグフィルターが動作する
- [ ] 検索機能が動作する
- [ ] ソート機能が動作する
- [ ] ページネーションが動作する
- [ ] URL同期が正しく動作する

### データ

- [ ] カテゴリデータがシードされている
- [ ] タグデータが存在する
- [ ] 音楽データにカテゴリ・タグが関連付けられている

### UI/UX

- [ ] フィルター状態が視覚的に分かる
- [ ] アクティブフィルターが表示される
- [ ] フィルタークリアが簡単にできる
- [ ] レスポンシブデザインが動作する

---

## 次のステップ

Phase 4が完了したら、Phase 5「ダウンロード機能」に進みます。

**次のドキュメント**: `20251023_05-download-feature.md`

Phase 5では以下を実装します:
- ダウンロードボタン
- ダウンロードAPI
- ダウンロード数のトラッキング
- 再生回数のトラッキング
- アップロード機能（管理者向け）

---

## まとめ

Phase 4では、音楽ライブラリに検索・フィルター・ソート機能を実装しました。

**達成したこと:**
- ✅ カテゴリフィルター
- ✅ タグフィルター
- ✅ キーワード検索
- ✅ ソート機能
- ✅ URL同期
- ✅ ページネーション

**所要時間:** 約1-2日（8-16時間）

次のPhaseに進む準備が整いました！

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
