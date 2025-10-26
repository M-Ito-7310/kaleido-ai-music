'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useGamification } from '@/lib/contexts/GamificationContext';

interface FavoriteButtonProps {
  trackId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Favorite toggle button component
 *
 * Features:
 * - Heart icon that fills when favorited
 * - Smooth scale animation on toggle
 * - Accessible with keyboard support
 * - Haptic feedback on mobile (vibration)
 * - Tracks gamification actions
 */
export function FavoriteButton({ trackId, size = 'md', className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { trackAction } = useGamification();
  const favorited = isFavorite(trackId);

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Haptic feedback on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    const wasFavorited = favorited;
    await toggleFavorite(trackId);

    // Track gamification action
    if (!wasFavorited) {
      trackAction('favorite_added');
    } else {
      trackAction('favorite_removed');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`inline-flex items-center justify-center rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={favorited}
      role="button"
      tabIndex={0}
    >
      <motion.div
        initial={false}
        animate={{
          scale: favorited ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`${sizeClasses[size]} transition-colors ${
            favorited
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400 hover:text-red-400 dark:text-gray-500 dark:hover:text-red-400'
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
