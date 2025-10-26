'use client';

import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { useAchievements } from '@/lib/hooks/useAchievements';
import { UserStats } from '@/lib/gamification/xpSystem';
import { Achievement } from '@/lib/gamification/achievements';
import { usePlayer } from './PlayerContext';

/**
 * Gamification Context
 *
 * Provides gamification features (achievements, XP) throughout the app
 */

interface UserAchievement extends Achievement {
  unlocked: boolean;
  progress: number;
  unlockedAt?: Date;
}

interface GamificationContextType {
  achievements: UserAchievement[];
  userStats: UserStats;
  trackAction: (action: string, metadata?: any) => void;
  newlyUnlocked: UserAchievement[];
  clearNewlyUnlocked: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const {
    achievements,
    userStats,
    trackAction,
    newlyUnlocked,
    clearNewlyUnlocked,
  } = useAchievements();

  const { currentTrack, currentTime, duration } = usePlayer();
  const trackCompletionRef = useRef<Set<number>>(new Set());

  // Track when a new track starts playing
  useEffect(() => {
    if (currentTrack) {
      trackAction('track_played', {
        genre: currentTrack.genre,
        artist: currentTrack.artist,
      });
      // Reset completion tracking for this track
      trackCompletionRef.current.delete(currentTrack.id);
    }
  }, [currentTrack?.id, trackAction]);

  // Track when a track is completed (95% listened)
  useEffect(() => {
    if (currentTrack && duration > 0 && currentTime > 0) {
      const completion = currentTime / duration;
      if (completion >= 0.95 && !trackCompletionRef.current.has(currentTrack.id)) {
        trackAction('track_completed', {
          duration: duration,
        });
        trackCompletionRef.current.add(currentTrack.id);
      }
    }
  }, [currentTime, duration, currentTrack, trackAction]);

  return (
    <GamificationContext.Provider
      value={{
        achievements,
        userStats,
        trackAction,
        newlyUnlocked,
        clearNewlyUnlocked,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
