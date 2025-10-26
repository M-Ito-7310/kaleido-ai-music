'use client';

import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle } from 'lucide-react';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import type { RepeatMode } from '@/lib/contexts/PlayerContext';

interface PlayerControlsProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Player Controls Component
 *
 * Features:
 * - Play/Pause
 * - Previous/Next track
 * - Repeat modes (off, all, one)
 * - Shuffle toggle
 */
export function PlayerControls({ size = 'md' }: PlayerControlsProps) {
  const {
    isPlaying,
    repeatMode,
    shuffleEnabled,
    togglePlayPause,
    playPrevious,
    playNext,
    setRepeatMode,
    toggleShuffle,
  } = usePlayer();

  const sizeClasses = {
    sm: {
      main: 'h-10 w-10',
      secondary: 'h-8 w-8',
      icon: 'h-5 w-5',
      iconSecondary: 'h-4 w-4',
    },
    md: {
      main: 'h-14 w-14',
      secondary: 'h-10 w-10',
      icon: 'h-6 w-6',
      iconSecondary: 'h-5 w-5',
    },
    lg: {
      main: 'h-16 w-16',
      secondary: 'h-12 w-12',
      icon: 'h-7 w-7',
      iconSecondary: 'h-6 w-6',
    },
  };

  const sizes = sizeClasses[size];

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return <Repeat1 className={sizes.iconSecondary} />;
    }
    return <Repeat className={sizes.iconSecondary} />;
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Shuffle Button */}
      <motion.button
        onClick={toggleShuffle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-full p-2 transition-colors ${
          shuffleEnabled
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label={shuffleEnabled ? 'Disable shuffle' : 'Enable shuffle'}
      >
        <Shuffle className={sizes.iconSecondary} />
      </motion.button>

      {/* Previous Button */}
      <motion.button
        onClick={playPrevious}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${sizes.secondary} rounded-full p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        aria-label="Previous track"
      >
        <SkipBack className={sizes.iconSecondary} />
      </motion.button>

      {/* Play/Pause Button */}
      <motion.button
        onClick={togglePlayPause}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizes.main} rounded-full bg-primary-600 dark:bg-primary-500 p-3 text-white shadow-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center justify-center`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className={sizes.icon} fill="currentColor" />
        ) : (
          <Play className={sizes.icon} fill="currentColor" />
        )}
      </motion.button>

      {/* Next Button */}
      <motion.button
        onClick={playNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${sizes.secondary} rounded-full p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        aria-label="Next track"
      >
        <SkipForward className={sizes.iconSecondary} />
      </motion.button>

      {/* Repeat Button */}
      <motion.button
        onClick={cycleRepeatMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-full p-2 transition-colors ${
          repeatMode !== 'off'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label={`Repeat: ${repeatMode}`}
      >
        {getRepeatIcon()}
      </motion.button>
    </div>
  );
}
