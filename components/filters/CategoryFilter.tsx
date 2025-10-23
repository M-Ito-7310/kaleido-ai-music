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
            {category.musicCount != null && category.musicCount > 0 && (
              <span className="ml-1.5 text-xs opacity-75">({category.musicCount})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
