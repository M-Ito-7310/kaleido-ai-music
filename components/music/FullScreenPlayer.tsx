'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { SeekBar } from './SeekBar';
import { PlayerControls } from './PlayerControls';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { useDynamicColors } from '@/lib/hooks/useDynamicColors';

/**
 * Full-Screen Player Component
 *
 * Features:
 * - Large album art with dynamic background
 * - Seek bar with dragging
 * - Player controls (play/pause, next/prev, repeat, shuffle)
 * - Swipe down to close
 * - Glassmorphism effects
 */
export function FullScreenPlayer() {
  const { currentTrack, isFullScreen, setIsFullScreen } = usePlayer();
  const { colors } = useDynamicColors(currentTrack?.imageUrl);

  const handleClose = () => {
    setIsFullScreen(false);
  };

  if (!currentTrack) return null;

  const primaryColor = colors?.vibrant || '#1e293b';
  const secondaryColor = colors?.darkVibrant || primaryColor;

  return (
    <AnimatePresence>
      {isFullScreen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, ${primaryColor}20, ${secondaryColor}40, #0f172a)`,
          }}
        >
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/30 transition-colors"
              aria-label="Close full-screen player"
            >
              <ChevronDown className="h-6 w-6" />
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-white/80">Now Playing</p>
            </div>

            <div className="w-10" /> {/* Spacer for center alignment */}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16">
            {/* Album Art */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative mb-8 aspect-square w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src={currentTrack.imageUrl}
                alt={currentTrack.title}
                fill
                className="object-cover"
                priority
              />

              {/* Favorite Button Overlay */}
              <div className="absolute top-4 right-4">
                <div className="rounded-full bg-black/40 backdrop-blur-md p-1">
                  <FavoriteButton trackId={currentTrack.id} size="md" />
                </div>
              </div>
            </motion.div>

            {/* Track Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-8 w-full max-w-md text-center"
            >
              <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl line-clamp-1">
                {currentTrack.title}
              </h1>
              <p className="text-lg text-white/80 sm:text-xl line-clamp-1">
                {currentTrack.artist}
              </p>
              <p className="mt-1 text-sm text-white/60">{currentTrack.category}</p>
            </motion.div>

            {/* Seek Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-8 w-full max-w-md"
            >
              <SeekBar />
            </motion.div>

            {/* Player Controls */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="w-full max-w-md"
            >
              <PlayerControls size="lg" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
