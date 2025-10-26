/**
 * Achievement System
 *
 * Defines all achievements, their requirements, and rewards
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  category: 'listening' | 'exploration' | 'social' | 'milestone';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: {
    type: 'count' | 'streak' | 'collection' | 'special';
    target: number;
    metric: string;
  };
  reward: {
    xp: number;
    unlock?: string;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  // Listening achievements
  {
    id: 'first-listen',
    name: 'First Steps',
    description: 'Listen to your first track',
    icon: '🎵',
    category: 'listening',
    tier: 'bronze',
    requirement: { type: 'count', target: 1, metric: 'tracks_played' },
    reward: { xp: 10 },
  },
  {
    id: 'music-lover',
    name: 'Music Lover',
    description: 'Listen to 100 tracks',
    icon: '🎧',
    category: 'listening',
    tier: 'silver',
    requirement: { type: 'count', target: 100, metric: 'tracks_played' },
    reward: { xp: 100 },
  },
  {
    id: 'audiophile',
    name: 'Audiophile',
    description: 'Listen to 1,000 tracks',
    icon: '🎼',
    category: 'listening',
    tier: 'gold',
    requirement: { type: 'count', target: 1000, metric: 'tracks_played' },
    reward: { xp: 1000, unlock: 'premium-visualizer' },
  },
  {
    id: 'marathon-listener',
    name: 'Marathon Listener',
    description: 'Listen for 10 hours total',
    icon: '⏱️',
    category: 'listening',
    tier: 'silver',
    requirement: { type: 'count', target: 36000, metric: 'total_listen_time' }, // 10 hours in seconds
    reward: { xp: 250 },
  },

  // Exploration achievements
  {
    id: 'genre-explorer',
    name: 'Genre Explorer',
    description: 'Listen to 5 different genres',
    icon: '🗺️',
    category: 'exploration',
    tier: 'bronze',
    requirement: { type: 'collection', target: 5, metric: 'unique_genres' },
    reward: { xp: 50 },
  },
  {
    id: 'music-archaeologist',
    name: 'Music Archaeologist',
    description: 'Listen to 20 different artists',
    icon: '🔍',
    category: 'exploration',
    tier: 'silver',
    requirement: { type: 'collection', target: 20, metric: 'unique_artists' },
    reward: { xp: 150 },
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Add 50 tracks to favorites',
    icon: '⭐',
    category: 'exploration',
    tier: 'gold',
    requirement: { type: 'count', target: 50, metric: 'favorites_count' },
    reward: { xp: 300 },
  },

  // Time-based achievements
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Listen to music before 6 AM',
    icon: '🌅',
    category: 'milestone',
    tier: 'bronze',
    requirement: { type: 'special', target: 1, metric: 'early_morning_listen' },
    reward: { xp: 25 },
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Listen to music after midnight',
    icon: '🦉',
    category: 'milestone',
    tier: 'bronze',
    requirement: { type: 'special', target: 1, metric: 'late_night_listen' },
    reward: { xp: 25 },
  },

  // Streak achievements
  {
    id: 'daily-listener',
    name: 'Daily Listener',
    description: 'Listen for 7 days in a row',
    icon: '📅',
    category: 'listening',
    tier: 'silver',
    requirement: { type: 'streak', target: 7, metric: 'daily_streak' },
    reward: { xp: 200 },
  },
  {
    id: 'dedicated-fan',
    name: 'Dedicated Fan',
    description: 'Listen for 30 days in a row',
    icon: '🔥',
    category: 'listening',
    tier: 'gold',
    requirement: { type: 'streak', target: 30, metric: 'daily_streak' },
    reward: { xp: 1000, unlock: 'custom-theme' },
  },

  // Social achievements
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Share 10 tracks with friends',
    icon: '🦋',
    category: 'social',
    tier: 'bronze',
    requirement: { type: 'count', target: 10, metric: 'tracks_shared' },
    reward: { xp: 75 },
  },

  // Special milestones
  {
    id: 'first-favorite',
    name: 'Treasure Found',
    description: 'Add your first favorite track',
    icon: '💎',
    category: 'milestone',
    tier: 'bronze',
    requirement: { type: 'count', target: 1, metric: 'favorites_count' },
    reward: { xp: 15 },
  },
  {
    id: 'visualizer-fan',
    name: 'Visualizer Fan',
    description: 'Use the 3D visualizer 10 times',
    icon: '✨',
    category: 'exploration',
    tier: 'bronze',
    requirement: { type: 'count', target: 10, metric: 'visualizer_uses' },
    reward: { xp: 50 },
  },
];

export const TIER_COLORS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
};

export const CATEGORY_COLORS = {
  listening: '#9333ea',
  exploration: '#06b6d4',
  social: '#10b981',
  milestone: '#f59e0b',
};
