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
