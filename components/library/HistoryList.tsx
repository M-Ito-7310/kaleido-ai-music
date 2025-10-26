'use client';

import { useEffect, useState } from 'react';
import { useHistory } from '@/lib/hooks/useHistory';
import { Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { MusicCard } from '@/components/music/MusicCard';
import type { Music } from '@/lib/db/schema';
import { Button } from '@/components/ui/Button';

interface HistoryListProps {
  allTracks: Music[];
}

/**
 * Recently played tracks list
 *
 * Features:
 * - Shows tracks in reverse chronological order
 * - Displays when each track was played
 * - Clear history button
 * - Empty state
 */
export function HistoryList({ allTracks }: HistoryListProps) {
  const { history, isLoading, clearHistory } = useHistory();
  const [historyTracks, setHistoryTracks] = useState<
    Array<{ track: Music; playedAt: Date; progress: number; completed: boolean }>
  >([]);

  useEffect(() => {
    // Map history to actual track data
    const tracksWithHistory = history
      .map((entry) => {
        const track = allTracks.find((t) => t.id === entry.trackId);
        return track
          ? {
              track,
              playedAt: entry.playedAt,
              progress: entry.progress,
              completed: entry.completed,
            }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    setHistoryTracks(tracksWithHistory);
  }, [history, allTracks]);

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear your listening history?')) {
      await clearHistory();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  if (historyTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock className="h-24 w-24 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No listening history
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your recently played tracks will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Clear button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recently Played ({historyTracks.length})
        </h2>
        <Button
          onClick={handleClearHistory}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </div>

      {/* Grid of history tracks */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {historyTracks.map((item, index) => (
          <div key={`${item.track.id}-${item.playedAt.getTime()}`} className="relative">
            <MusicCard music={item.track} index={index} playlist={historyTracks.map((i) => i.track)} />

            {/* Played timestamp overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center">
              <span className="rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                {formatDistanceToNow(new Date(item.playedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
