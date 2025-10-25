'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';

interface MiniPlayerProps {
  track: {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    audioUrl: string;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  onExpand?: () => void;
}

export function MiniPlayer({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onClose,
  onExpand,
}: MiniPlayerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  // ハプティックフィードバック
  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    // 左スワイプで次の曲
    if (info.offset.x < -100 && onNext) {
      onNext();
      triggerHaptic(10);
    }
    // 右スワイプで前の曲
    else if (info.offset.x > 100 && onPrevious) {
      onPrevious();
      triggerHaptic(10);
    }
  };

  const handleClick = () => {
    if (!isDragging && onExpand) {
      onExpand();
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        onClick={handleClick}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden cursor-pointer pointer-events-auto"
      >
        <div className="flex items-center gap-3 p-3">
          {/* アルバムアート */}
          <motion.div
            className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={track.imageUrl}
              alt={track.title}
              fill
              sizes="56px"
              className="object-cover"
            />
          </motion.div>

          {/* トラック情報 */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{track.title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{track.artist}</p>
          </div>

          {/* コントロールボタン */}
          <div className="flex items-center gap-2">
            {/* 前の曲ボタン */}
            {onPrevious && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious();
                  triggerHaptic(10);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="前の曲"
              >
                <SkipBack className="w-5 h-5" />
              </motion.button>
            )}

            {/* 再生/一時停止ボタン */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onPlayPause();
                triggerHaptic(10);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 text-white shadow-lg"
              aria-label={isPlaying ? '一時停止' : '再生'}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </motion.button>

            {/* 次の曲ボタン */}
            {onNext && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                  triggerHaptic(10);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="次の曲"
              >
                <SkipForward className="w-5 h-5" />
              </motion.button>
            )}

            {/* 閉じるボタン */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ml-2"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* スワイプインジケーター */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">← スワイプで曲を切り替え →</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
