import { useState, useEffect, useCallback } from 'react';
import {
  addToHistory,
  updateHistoryProgress,
  getRecentHistory,
  clearHistory as clearHistoryDB,
} from '@/lib/db/indexedDB';

export interface HistoryEntry {
  id?: number;
  trackId: number;
  playedAt: Date;
  progress: number;
  completed: boolean;
}

/**
 * Hook for managing listening history
 *
 * Features:
 * - Track when tracks are played
 * - Update playback progress
 * - Get recent history
 * - Clear history
 */
export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const recentHistory = await getRecentHistory();
      setHistory(recentHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Track that a track was played
   */
  const trackPlay = useCallback(async (trackId: number) => {
    try {
      await addToHistory(trackId);
      await loadHistory(); // Reload to show new entry
    } catch (error) {
      console.error('Failed to track play:', error);
    }
  }, []);

  /**
   * Update playback progress for a track
   */
  const updateProgress = useCallback(
    async (trackId: number, progress: number, duration: number) => {
      try {
        await updateHistoryProgress(trackId, progress, duration);
        // Optionally reload history to reflect changes
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    },
    []
  );

  /**
   * Clear all history
   */
  const clearHistory = useCallback(async () => {
    try {
      await clearHistoryDB();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, []);

  return {
    history,
    isLoading,
    trackPlay,
    updateProgress,
    clearHistory,
    refresh: loadHistory,
  };
}
