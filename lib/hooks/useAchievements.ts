/**
 * useAchievements Hook
 *
 * Manages achievement tracking and progress
 */

import { useState, useEffect, useCallback } from 'react';
import { ACHIEVEMENTS, Achievement } from '@/lib/gamification/achievements';
import { awardXP, UserStats, getLevelFromXP } from '@/lib/gamification/xpSystem';

interface UserAchievement extends Achievement {
  unlocked: boolean;
  progress: number;
  unlockedAt?: Date;
}

interface AchievementState {
  achievements: UserAchievement[];
  userStats: UserStats;
  stats: {
    tracks_played: number;
    total_listen_time: number;
    unique_genres: Set<string>;
    unique_artists: Set<string>;
    favorites_count: number;
    tracks_shared: number;
    daily_streak: number;
    last_listen_date: string | null;
    visualizer_uses: number;
    early_morning_listen: boolean;
    late_night_listen: boolean;
  };
}

const STORAGE_KEY = 'gamification_data';

// Load from localStorage
function loadState(): AchievementState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Convert Set back from array
      data.stats.unique_genres = new Set(data.stats.unique_genres);
      data.stats.unique_artists = new Set(data.stats.unique_artists);
      return data;
    }
  } catch (error) {
    console.error('Failed to load gamification data:', error);
  }

  return getDefaultState();
}

// Save to localStorage
function saveState(state: AchievementState): void {
  if (typeof window === 'undefined') return;

  try {
    // Convert Set to array for storage
    const toStore = {
      ...state,
      stats: {
        ...state.stats,
        unique_genres: Array.from(state.stats.unique_genres),
        unique_artists: Array.from(state.stats.unique_artists),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Failed to save gamification data:', error);
  }
}

function getDefaultState(): AchievementState {
  return {
    achievements: ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: false,
      progress: 0,
    })),
    userStats: { level: 1, xp: 0, xpToNextLevel: 100, totalXP: 0 },
    stats: {
      tracks_played: 0,
      total_listen_time: 0,
      unique_genres: new Set(),
      unique_artists: new Set(),
      favorites_count: 0,
      tracks_shared: 0,
      daily_streak: 0,
      last_listen_date: null,
      visualizer_uses: 0,
      early_morning_listen: false,
      late_night_listen: false,
    },
  };
}

export function useAchievements() {
  const [state, setState] = useState<AchievementState>(getDefaultState);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UserAchievement[]>([]);

  // Load state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Save state when it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Check and unlock achievements
  const checkAchievements = useCallback((updatedStats: typeof state.stats) => {
    const unlocked: UserAchievement[] = [];

    setState((prev) => {
      const newAchievements = prev.achievements.map((achievement) => {
        if (achievement.unlocked) return achievement;

        let progress = 0;
        let shouldUnlock = false;

        switch (achievement.requirement.metric) {
          case 'tracks_played':
            progress = updatedStats.tracks_played;
            break;
          case 'total_listen_time':
            progress = updatedStats.total_listen_time;
            break;
          case 'unique_genres':
            progress = updatedStats.unique_genres.size;
            break;
          case 'unique_artists':
            progress = updatedStats.unique_artists.size;
            break;
          case 'favorites_count':
            progress = updatedStats.favorites_count;
            break;
          case 'tracks_shared':
            progress = updatedStats.tracks_shared;
            break;
          case 'daily_streak':
            progress = updatedStats.daily_streak;
            break;
          case 'visualizer_uses':
            progress = updatedStats.visualizer_uses;
            break;
          case 'early_morning_listen':
            progress = updatedStats.early_morning_listen ? 1 : 0;
            break;
          case 'late_night_listen':
            progress = updatedStats.late_night_listen ? 1 : 0;
            break;
        }

        shouldUnlock = progress >= achievement.requirement.target;

        if (shouldUnlock && !achievement.unlocked) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            progress: achievement.requirement.target,
            unlockedAt: new Date(),
          };
          unlocked.push(unlockedAchievement);
          return unlockedAchievement;
        }

        return { ...achievement, progress };
      });

      // Award XP for unlocked achievements
      let newUserStats = prev.userStats;
      unlocked.forEach((achievement) => {
        newUserStats = awardXP(newUserStats.totalXP, achievement.reward.xp);
      });

      return {
        ...prev,
        achievements: newAchievements,
        userStats: newUserStats,
      };
    });

    if (unlocked.length > 0) {
      setNewlyUnlocked(unlocked);
    }
  }, []);

  // Track actions
  const trackAction = useCallback(
    (action: string, metadata?: any) => {
      setState((prev) => {
        const newStats = { ...prev.stats };
        const now = new Date();
        const hour = now.getHours();

        switch (action) {
          case 'track_played':
            newStats.tracks_played++;
            if (metadata?.genre) newStats.unique_genres.add(metadata.genre);
            if (metadata?.artist) newStats.unique_artists.add(metadata.artist);

            // Check time-based achievements
            if (hour < 6) newStats.early_morning_listen = true;
            if (hour >= 0 && hour < 3) newStats.late_night_listen = true;

            // Update streak
            const today = now.toISOString().split('T')[0];
            if (newStats.last_listen_date !== today) {
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];

              if (newStats.last_listen_date === yesterdayStr) {
                newStats.daily_streak++;
              } else if (newStats.last_listen_date !== today) {
                newStats.daily_streak = 1;
              }
              newStats.last_listen_date = today;
            }
            break;

          case 'track_completed':
            if (metadata?.duration) {
              newStats.total_listen_time += metadata.duration;
            }
            break;

          case 'favorite_added':
            newStats.favorites_count++;
            break;

          case 'favorite_removed':
            newStats.favorites_count = Math.max(0, newStats.favorites_count - 1);
            break;

          case 'track_shared':
            newStats.tracks_shared++;
            break;

          case 'visualizer_used':
            newStats.visualizer_uses++;
            break;
        }

        checkAchievements(newStats);

        return {
          ...prev,
          stats: newStats,
        };
      });
    },
    [checkAchievements]
  );

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  return {
    achievements: state.achievements,
    userStats: state.userStats,
    stats: state.stats,
    trackAction,
    newlyUnlocked,
    clearNewlyUnlocked,
  };
}
