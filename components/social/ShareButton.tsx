'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Music } from '@/lib/db/schema';
import { useGamification } from '@/lib/contexts/GamificationContext';

/**
 * Share Button Component
 *
 * Uses Web Share API for native sharing on supported devices,
 * falls back to clipboard copy on desktop
 * Tracks gamification actions
 */

interface ShareButtonProps {
  track: Music;
  variant?: 'default' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ShareButton({
  track,
  variant = 'default',
  size = 'md',
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { trackAction } = useGamification();

  const handleShare = async () => {
    const shareData = {
      title: `${track.title} - ${track.artist}`,
      text: `Check out "${track.title}" by ${track.artist} on Kaleido AI Music!`,
      url: `${window.location.origin}/music/${track.id}`,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        // Track share action
        trackAction('track_shared');
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        // Track share action
        trackAction('track_shared');

        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error: any) {
      // User cancelled share dialog
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Share failed:', error);

      // Try clipboard as final fallback
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Clipboard copy failed:', clipboardError);
      }
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  if (variant === 'icon') {
    return (
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors ${sizeClasses[size]} ${className}`}
        aria-label={`Share ${track.title}`}
        title={copied ? 'Link copied!' : 'Share track'}
      >
        {copied ? (
          <Check className={iconSizeClasses[size]} />
        ) : (
          <Share2 className={iconSizeClasses[size]} />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700 ${className}`}
      aria-label={`Share ${track.title}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </>
      )}
    </motion.button>
  );
}
