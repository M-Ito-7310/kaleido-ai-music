'use client';

import { useEffect } from 'react';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import {
  announceTrackChange,
  announcePlayPause,
  announceRepeatMode,
  announceShuffle,
} from '@/lib/accessibility/screenReaderAnnouncer';

/**
 * ScreenReaderAnnouncer Component
 *
 * Announces player state changes to screen readers
 * Should be included once in the app layout
 */
export function ScreenReaderAnnouncer() {
  const { currentTrack, isPlaying, repeatMode, shuffleEnabled } = usePlayer();

  // Announce track changes
  useEffect(() => {
    if (currentTrack) {
      announceTrackChange(currentTrack.title, currentTrack.artist || 'Unknown Artist');
    }
  }, [currentTrack?.id]);

  // Announce play/pause changes
  useEffect(() => {
    if (currentTrack) {
      announcePlayPause(isPlaying);
    }
  }, [isPlaying]);

  // Announce repeat mode changes
  useEffect(() => {
    announceRepeatMode(repeatMode);
  }, [repeatMode]);

  // Announce shuffle changes
  useEffect(() => {
    announceShuffle(shuffleEnabled);
  }, [shuffleEnabled]);

  // This component renders nothing visually
  // It only manages screen reader announcements
  return null;
}
