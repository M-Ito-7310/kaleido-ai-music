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
              {tag.count != null && tag.count > 0 && (
                <span className="ml-1 text-xs opacity-75">({tag.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
