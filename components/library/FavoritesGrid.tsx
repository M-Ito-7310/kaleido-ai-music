'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { MusicCard } from '@/components/music/MusicCard';
import type { Music } from '@/lib/db/schema';

interface FavoritesGridProps {
  allTracks: Music[];
}

/**
 * Grid display of favorited tracks
 *
 * Features:
 * - Filters tracks to show only favorites
 * - Responsive grid layout
 * - Empty state when no favorites
 */
export function FavoritesGrid({ allTracks }: FavoritesGridProps) {
  const { favorites, isLoading } = useFavorites();
  const [favoritedTracks, setFavoritedTracks] = useState<Music[]>([]);

  useEffect(() => {
    // Filter tracks to only favorites
    const filtered = allTracks.filter((track) => favorites.includes(track.id));
    setFavoritedTracks(filtered);
  }, [favorites, allTracks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (favoritedTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="h-24 w-24 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No favorites yet
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Start adding tracks to your favorites by clicking the heart icon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {favoritedTracks.map((track, index) => (
        <MusicCard key={track.id} music={track} index={index} playlist={favoritedTracks} />
      ))}
    </div>
  );
}
