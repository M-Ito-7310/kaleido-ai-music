'use client';

import { useEffect, useState } from 'react';
import type { Music } from '@/lib/db/schema';
import { HistoryList } from '@/components/library/HistoryList';
import { Clock } from 'lucide-react';

export default function HistoryPage() {
  const [allTracks, setAllTracks] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/music')
      .then((res) => res.json())
      .then((data) => {
        setAllTracks(data.data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load music:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
          <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">再生履歴</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            最近再生した曲（最大100件）
          </p>
        </div>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">読み込み中...</p>
          </div>
        </div>
      ) : (
        <HistoryList allTracks={allTracks} />
      )}
    </main>
  );
}
