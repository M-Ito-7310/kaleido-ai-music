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
