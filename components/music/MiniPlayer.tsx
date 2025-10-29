'use client';

import { motion, useMotionValue, useTransform, PanInfo, useDragControls } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';
import { MusicTitleIcon } from './MusicTitleIcon';
import { formatDuration } from '@/lib/utils';
import { usePlayer } from '@/lib/contexts/PlayerContext';

interface MiniPlayerProps {
  track: {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    audioUrl: string;
  };
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  onExpand?: () => void;
}

export function MiniPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onClose,
  onExpand,
}: MiniPlayerProps) {
  const { seekTo } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [isSeekbarDragging, setIsSeekbarDragging] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const dragControls = useDragControls();

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

  const startDrag = (e: React.PointerEvent) => {
    // Only start drag if not clicking on the seekbar
    const target = e.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.type !== 'range') {
      console.log('[MiniPlayer] Starting player drag');
      dragControls.start(e);
    } else {
      console.log('[MiniPlayer] Blocked drag - clicked on seekbar');
    }
  };

  const handleSeekStart = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    console.log('[MiniPlayer] handleSeekStart');
    e.stopPropagation();
    setIsSeekbarDragging(true);
    setSeekPosition(currentTime); // Initialize with current time
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const time = parseFloat(e.target.value);
    console.log('[MiniPlayer] handleSeekChange:', { time, isSeekbarDragging });

    if (isSeekbarDragging) {
      // ドラッグ中は視覚的な位置だけ更新
      setSeekPosition(time);
    } else {
      // クリックの場合は即座にシーク
      console.log('[MiniPlayer] Click detected - immediate seek');
      seekTo(time);
    }
  };

  const handleSeekInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const time = parseFloat((e.target as HTMLInputElement).value);
    console.log('[MiniPlayer] handleSeekInput:', { time, isSeekbarDragging });

    // ドラッグ中は視覚的な位置だけ更新
    if (isSeekbarDragging) {
      setSeekPosition(time);
    }
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    console.log('[MiniPlayer] handleSeekEnd:', { seekPosition, isSeekbarDragging });
    e.stopPropagation();

    if (isSeekbarDragging) {
      // ドラッグ終了時に実際にシーク
      console.log('[MiniPlayer] Drag ended - seeking to:', seekPosition);
      seekTo(seekPosition);
    }

    // 必ずリセット
    setIsSeekbarDragging(false);
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
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onPointerDown={startDrag}
        style={{ x, opacity }}
        onClick={handleClick}
        className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl rounded-2xl overflow-hidden cursor-pointer pointer-events-auto border border-white/20 dark:border-gray-700/50"
      >
        {/* グローエフェクト */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-accent-DEFAULT/10 pointer-events-none" />

        {/* シークバー */}
        <div className="absolute top-0 left-0 right-0 px-3 pt-1 pointer-events-auto">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={isSeekbarDragging ? seekPosition : currentTime}
            onChange={handleSeekChange}
            onInput={handleSeekInput}
            onPointerDownCapture={(e) => {
              console.log('[MiniPlayer] onPointerDownCapture - stopping propagation');
              e.stopPropagation();
            }}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchStart={handleSeekStart}
            onTouchEnd={handleSeekEnd}
            onClick={(e) => {
              console.log('[MiniPlayer] onClick');
              e.stopPropagation();
            }}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{
              accentColor: '#0284c7',
            }}
            aria-label="再生位置"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={isSeekbarDragging ? seekPosition : currentTime}
          />
        </div>

        <div className="relative flex items-center gap-3 p-3 pt-4">
          {/* アルバムアート */}
          <motion.div
            className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/10"
            whileHover={{ scale: 1.05 }}
          >
            {track.imageUrl ? (
              <Image
                src={track.imageUrl}
                alt={track.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <MusicTitleIcon title={track.title} size="sm" />
              </div>
            )}
          </motion.div>

          {/* トラック情報 */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate drop-shadow-sm">
              {track.title}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {track.artist}
            </p>
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
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 text-white shadow-lg shadow-primary-500/50"
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
            <p className="text-xs text-gray-500 dark:text-gray-400 drop-shadow">
              ← スワイプで曲を切り替え →
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
