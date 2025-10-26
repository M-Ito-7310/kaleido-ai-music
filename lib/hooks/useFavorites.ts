import { useState, useEffect, useCallback } from 'react';
import {
  getAllFavorites,
  addFavorite,
  removeFavorite,
  isFavorite as checkIsFavorite,
} from '@/lib/db/indexedDB';

/**
 * Hook for managing user's favorite tracks
 *
 * Features:
 * - Load favorites from IndexedDB
 * - Toggle favorite status (add/remove)
 * - Check if a track is favorited
 * - Auto-sync with IndexedDB
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoriteIds = await getAllFavorites();
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle favorite status for a track
   */
  const toggleFavorite = useCallback(
    async (trackId: number) => {
      const isFavorited = favorites.includes(trackId);

      try {
        if (isFavorited) {
          // Remove from favorites
          await removeFavorite(trackId);
          setFavorites((prev) => prev.filter((id) => id !== trackId));
        } else {
          // Add to favorites
          await addFavorite(trackId);
          setFavorites((prev) => [...prev, trackId]);
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        // Revert state on error
        await loadFavorites();
      }
    },
    [favorites]
  );

  /**
   * Check if a track is favorited (synchronous)
   */
  const isFavorite = useCallback(
    (trackId: number): boolean => {
      return favorites.includes(trackId);
    },
    [favorites]
  );

  /**
   * Check if a track is favorited (async, from DB)
   */
  const checkFavorite = useCallback(async (trackId: number): Promise<boolean> => {
    try {
      return await checkIsFavorite(trackId);
    } catch (error) {
      console.error('Failed to check favorite:', error);
      return false;
    }
  }, []);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    checkFavorite,
    refresh: loadFavorites,
  };
}
