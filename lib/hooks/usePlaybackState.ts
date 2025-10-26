import { useCallback } from 'react';
import {
  savePlaybackState,
  loadPlaybackState,
  clearPlaybackState,
} from '@/lib/db/indexedDB';

/**
 * Hook for managing playback state persistence
 *
 * Features:
 * - Save current playback position
 * - Load saved position for resume
 * - Clear saved state
 */
export function usePlaybackState() {
  /**
   * Save current playback state
   */
  const saveState = useCallback(async (trackId: number, position: number) => {
    try {
      await savePlaybackState(trackId, position);
    } catch (error) {
      console.error('Failed to save playback state:', error);
    }
  }, []);

  /**
   * Load saved playback state
   */
  const loadState = useCallback(async () => {
    try {
      return await loadPlaybackState();
    } catch (error) {
      console.error('Failed to load playback state:', error);
      return null;
    }
  }, []);

  /**
   * Clear saved playback state
   */
  const clearState = useCallback(async () => {
    try {
      await clearPlaybackState();
    } catch (error) {
      console.error('Failed to clear playback state:', error);
    }
  }, []);

  return {
    saveState,
    loadState,
    clearState,
  };
}
