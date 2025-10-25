'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import type { Music } from '@/lib/db/schema';

interface PlayButtonProps {
  music: Music;
  playlist?: Music[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PlayButton({ music, playlist, className = '', size = 'md' }: PlayButtonProps) {
  const { playTrack } = usePlayer();

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // プレイリストが指定されていればそれを使い、なければ単曲のみ
    playTrack(music, playlist || [music]);

    // ハプティックフィードバック
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <motion.button
      onClick={handlePlay}
      className={`flex items-center justify-center rounded-full bg-white shadow-lg ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`${music.title}を再生`}
    >
      <Play className={`text-primary-600 ml-0.5 ${iconSizes[size]}`} fill="currentColor" />
    </motion.button>
  );
}
