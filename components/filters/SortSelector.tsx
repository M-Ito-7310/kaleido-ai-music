'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

type SortOption = 'latest' | 'popular';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '新着順' },
  { value: 'popular', label: '人気順（再生数）' },
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
