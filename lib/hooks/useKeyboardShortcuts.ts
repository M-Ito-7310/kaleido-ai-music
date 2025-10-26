'use client';

import { useEffect } from 'react';
import { usePlayer } from '@/lib/contexts/PlayerContext';

/**
 * Keyboard shortcuts for music player
 *
 * Shortcuts:
 * - Space: Play/Pause
 * - ArrowRight: Next track
 * - ArrowLeft: Previous track
 * - ArrowUp: Volume up
 * - ArrowDown: Volume down
 * - M: Mute/Unmute
 * - R: Cycle repeat mode
 * - S: Toggle shuffle
 * - F: Toggle full-screen
 */
export function useKeyboardShortcuts() {
  const {
    togglePlayPause,
    playNext,
    playPrevious,
    setRepeatMode,
    toggleShuffle,
    repeatMode,
    setIsFullScreen,
    isFullScreen,
  } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;

        case 'arrowright':
          event.preventDefault();
          playNext();
          break;

        case 'arrowleft':
          event.preventDefault();
          playPrevious();
          break;

        case 'r':
          event.preventDefault();
          // Cycle through repeat modes
          const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
          const currentIndex = modes.indexOf(repeatMode);
          const nextMode = modes[(currentIndex + 1) % modes.length];
          setRepeatMode(nextMode);
          break;

        case 's':
          event.preventDefault();
          toggleShuffle();
          break;

        case 'f':
          event.preventDefault();
          setIsFullScreen(!isFullScreen);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlayPause,
    playNext,
    playPrevious,
    setRepeatMode,
    toggleShuffle,
    repeatMode,
    setIsFullScreen,
    isFullScreen,
  ]);
}
