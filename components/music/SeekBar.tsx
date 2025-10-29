'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { formatDuration } from '@/lib/utils';

/**
 * SeekBar component with dragging support
 *
 * Features:
 * - Click to seek
 * - Drag to seek
 * - Visual feedback
 * - Time display
 */
export function SeekBar() {
  const { currentTime, duration, seekTo } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const getProgressFromPosition = useCallback((clientX: number) => {
    if (!progressBarRef.current) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return progress;
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      const progress = getProgressFromPosition(e.clientX);
      setDragProgress(progress);
      seekTo(progress * duration);
    },
    [getProgressFromPosition, duration, seekTo]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const progress = getProgressFromPosition(e.clientX);
      setDragProgress(progress);
      seekTo(progress * duration);
    },
    [isDragging, getProgressFromPosition, duration, seekTo]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const touch = e.touches[0];
      const progress = getProgressFromPosition(touch.clientX);
      setDragProgress(progress);
      seekTo(progress * duration);
    },
    [getProgressFromPosition, duration, seekTo]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const progress = getProgressFromPosition(touch.clientX);
      setDragProgress(progress);
      seekTo(progress * duration);
    },
    [isDragging, getProgressFromPosition, duration, seekTo]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const progress = duration > 0 ? (isDragging ? dragProgress : currentTime / duration) : 0;

  return (
    <div className="w-full space-y-2">
      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="group relative h-2 cursor-pointer rounded-full bg-gray-300 dark:bg-gray-700"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Filled Progress */}
        <motion.div
          className="absolute h-full rounded-full bg-primary-600 dark:bg-primary-500"
          style={{ width: `${progress * 100}%` }}
        />

        {/* Draggable Thumb */}
        <motion.div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg ring-2 ring-primary-600 dark:ring-primary-500"
          style={{ left: `${progress * 100}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{formatDuration(currentTime)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </div>
  );
}
