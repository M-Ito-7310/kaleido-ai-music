'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-900">タグ</h3>

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
