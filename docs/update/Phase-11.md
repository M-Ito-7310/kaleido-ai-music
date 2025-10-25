# Phase 11: Gamification

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 2-3 hours

## Overview
ゲーミフィケーション要素の実装。アチーブメントバッジ、リーダーボード、リスニングチャレンジ、XPシステム、報酬アンロックにより、ユーザーのエンゲージメントと継続利用を促進します。

## Technologies to Use
- IndexedDB (progress tracking)
- Canvas API (badge rendering)
- LocalStorage (achievements)
- Framer Motion (animations)
- React Context (gamification state)

## Dependencies to Add

No new dependencies required (uses existing tools)

## Files to Create/Modify

### Create
1. **components/gamification/BadgeDisplay.tsx** - Achievement badge showcase
2. **components/gamification/Leaderboard.tsx** - Top users leaderboard
3. **components/gamification/ChallengeCard.tsx** - Daily/weekly challenges
4. **components/gamification/ProgressBar.tsx** - XP progress visualization
5. **components/gamification/RewardNotification.tsx** - Toast for unlocks
6. **lib/gamification/achievements.ts** - Achievement definitions and logic
7. **lib/gamification/xpSystem.ts** - XP calculation and leveling
8. **lib/gamification/challenges.ts** - Challenge generation
9. **hooks/useAchievements.ts** - Achievement tracking hook
10. **hooks/useXP.ts** - XP management hook
11. **hooks/useChallenges.ts** - Challenge progress hook

### Modify
- lib/contexts/PlayerContext.tsx - Track listening events for XP
- components/music/GlobalPlayer.tsx - Award XP on track completion
- app/(pages)/profile/page.tsx - Display badges and stats

## Key Features to Implement

### 1. Achievement System

```typescript
// lib/gamification/achievements.ts

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  category: 'listening' | 'exploration' | 'social' | 'creation' | 'milestone';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: {
    type: 'count' | 'streak' | 'collection' | 'time' | 'special';
    target: number;
    metric: string;
  };
  reward: {
    xp: number;
    unlock?: string; // Theme, visualizer, etc.
  };
  unlocked: boolean;
  progress: number;
  unlockedAt?: Date;
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
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
    unlocked: false,
    progress: 0,
  },

  // Creation achievements
  {
    id: 'playlist-creator',
    name: 'Playlist Creator',
    description: 'Create your first playlist',
    icon: '📝',
    category: 'creation',
    tier: 'bronze',
    requirement: { type: 'count', target: 1, metric: 'playlists_created' },
    reward: { xp: 30 },
    unlocked: false,
    progress: 0,
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'Create 10 playlists',
    icon: '🎨',
    category: 'creation',
    tier: 'gold',
    requirement: { type: 'count', target: 10, metric: 'playlists_created' },
    reward: { xp: 300, unlock: 'advanced-playlist-tools' },
    unlocked: false,
    progress: 0,
  },
];

// Check and unlock achievements
export async function checkAchievements(
  metric: string,
  value: number,
  achievements: Achievement[]
): Promise<Achievement[]> {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of achievements) {
    if (achievement.unlocked) continue;
    if (achievement.requirement.metric !== metric) continue;

    const progress = (value / achievement.requirement.target) * 100;

    if (progress >= 100) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      achievement.progress = 100;
      newlyUnlocked.push(achievement);
    } else {
      achievement.progress = progress;
    }
  }

  return newlyUnlocked;
}
```

### 2. XP System

```typescript
// lib/gamification/xpSystem.ts

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
  perks: string[];
}

export const LEVELS: Level[] = [
  { level: 1, xpRequired: 0, title: 'Novice Listener', perks: [] },
  { level: 2, xpRequired: 100, title: 'Music Fan', perks: ['Basic visualizer'] },
  { level: 3, xpRequired: 250, title: 'Enthusiast', perks: ['Advanced filters'] },
  { level: 5, xpRequired: 500, title: 'Connoisseur', perks: ['Custom playlists'] },
  { level: 10, xpRequired: 1500, title: 'Audiophile', perks: ['Premium themes'] },
  { level: 15, xpRequired: 3000, title: 'Music Master', perks: ['3D visualizer'] },
  { level: 20, xpRequired: 5000, title: 'Legend', perks: ['All features unlocked'] },
];

export function calculateLevel(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  title: string;
} {
  let currentLevel = 1;

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i].level;
      break;
    }
  }

  const currentLevelData = LEVELS.find((l) => l.level === currentLevel)!;
  const nextLevelData = LEVELS.find((l) => l.level === currentLevel + 1);

  const currentLevelXP = currentLevelData.xpRequired;
  const nextLevelXP = nextLevelData?.xpRequired || currentLevelXP;
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  return {
    level: currentLevel,
    currentLevelXP: xpInCurrentLevel,
    nextLevelXP: xpNeededForNextLevel,
    progress: Math.min(100, progress),
    title: currentLevelData.title,
  };
}

// XP rewards for actions
export const XP_REWARDS = {
  LISTEN_TRACK: 5,
  COMPLETE_TRACK: 10,
  CREATE_PLAYLIST: 30,
  SHARE_TRACK: 15,
  ADD_FAVORITE: 5,
  COMMENT: 10,
  DAILY_LOGIN: 25,
  COMPLETE_CHALLENGE: 50,
};

export async function awardXP(
  action: keyof typeof XP_REWARDS,
  multiplier: number = 1
): Promise<{ xp: number; levelUp: boolean; newLevel?: number }> {
  const xpGained = XP_REWARDS[action] * multiplier;

  // Get current XP from storage
  const currentXP = parseInt(localStorage.getItem('totalXP') || '0');
  const oldLevel = calculateLevel(currentXP).level;

  // Add new XP
  const newXP = currentXP + xpGained;
  localStorage.setItem('totalXP', newXP.toString());

  // Check for level up
  const newLevel = calculateLevel(newXP).level;
  const levelUp = newLevel > oldLevel;

  return { xp: xpGained, levelUp, newLevel: levelUp ? newLevel : undefined };
}
```

### 3. Challenge System

```typescript
// lib/gamification/challenges.ts

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'special';
  duration: number; // hours
  expiresAt: Date;
  goal: {
    type: 'listen' | 'discover' | 'social' | 'create';
    target: number;
    current: number;
  };
  reward: {
    xp: number;
    badge?: string;
  };
  completed: boolean;
}

export function generateDailyChallenges(): Challenge[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const challenges: Challenge[] = [
    {
      id: `daily-listen-${now.toDateString()}`,
      title: 'Daily Listener',
      description: 'Listen to 10 tracks today',
      icon: '🎵',
      type: 'daily',
      duration: 24,
      expiresAt: tomorrow,
      goal: { type: 'listen', target: 10, current: 0 },
      reward: { xp: 50 },
      completed: false,
    },
    {
      id: `daily-discover-${now.toDateString()}`,
      title: 'Explorer',
      description: 'Listen to 3 new artists',
      icon: '🔍',
      type: 'daily',
      duration: 24,
      expiresAt: tomorrow,
      goal: { type: 'discover', target: 3, current: 0 },
      reward: { xp: 75 },
      completed: false,
    },
    {
      id: `daily-social-${now.toDateString()}`,
      title: 'Social Sharer',
      description: 'Share 2 tracks with friends',
      icon: '🔗',
      type: 'daily',
      duration: 24,
      expiresAt: tomorrow,
      goal: { type: 'social', target: 2, current: 0 },
      reward: { xp: 40 },
      completed: false,
    },
  ];

  return challenges;
}

export function generateWeeklyChallenges(): Challenge[] {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(nextMonday.getDate() + ((7 - nextMonday.getDay() + 1) % 7 || 7));
  nextMonday.setHours(0, 0, 0, 0);

  const challenges: Challenge[] = [
    {
      id: `weekly-listen-${now.toDateString()}`,
      title: 'Weekly Marathon',
      description: 'Listen to 100 tracks this week',
      icon: '🏃',
      type: 'weekly',
      duration: 168,
      expiresAt: nextMonday,
      goal: { type: 'listen', target: 100, current: 0 },
      reward: { xp: 500, badge: 'weekly-champion' },
      completed: false,
    },
    {
      id: `weekly-create-${now.toDateString()}`,
      title: 'Playlist Master',
      description: 'Create 5 playlists this week',
      icon: '📝',
      type: 'weekly',
      duration: 168,
      expiresAt: nextMonday,
      goal: { type: 'create', target: 5, current: 0 },
      reward: { xp: 400 },
      completed: false,
    },
  ];

  return challenges;
}
```

### 4. Badge Display Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Achievement, ACHIEVEMENTS } from '@/lib/gamification/achievements';
import { Trophy, Lock } from 'lucide-react';

export function BadgeDisplay() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    // Load from IndexedDB/localStorage
    const saved = localStorage.getItem('achievements');
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      setAchievements(ACHIEVEMENTS);
    }
  };

  const filteredAchievements = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Achievements
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unlockedCount} / {achievements.length} unlocked
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'unlocked', 'locked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-xl border-2 transition-all ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400 dark:border-yellow-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
            }`}
          >
            {/* Icon */}
            <div className="text-6xl mb-4 filter drop-shadow-lg">
              {achievement.unlocked ? achievement.icon : '🔒'}
            </div>

            {/* Info */}
            <div className="mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {achievement.name}
                {achievement.unlocked && (
                  <span className="text-xs px-2 py-1 bg-yellow-500 text-white rounded-full">
                    {achievement.tier}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {achievement.description}
              </p>
            </div>

            {/* Progress */}
            {!achievement.unlocked && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{Math.round(achievement.progress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Reward */}
            <div className="text-sm">
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                +{achievement.reward.xp} XP
              </span>
              {achievement.reward.unlock && (
                <span className="ml-2 text-accent-DEFAULT">
                  Unlocks: {achievement.reward.unlock}
                </span>
              )}
            </div>

            {/* Unlocked date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Leaderboard Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  badges: number;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    // Fetch from API
    const mockData: LeaderboardEntry[] = [
      { rank: 1, username: 'MusicLover99', avatar: '🎵', level: 20, xp: 5420, badges: 45 },
      { rank: 2, username: 'AudiophileKing', avatar: '👑', level: 18, xp: 4200, badges: 38 },
      { rank: 3, username: 'BeatMaster', avatar: '🎧', level: 17, xp: 3850, badges: 35 },
      // ... more entries
    ];

    setEntries(mockData);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Leaderboard</h2>

        {/* Timeframe selector */}
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg capitalize ${
                timeframe === t
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {t === 'all' ? 'All Time' : `This ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={entry.username}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {/* Rank */}
            <div className="w-12 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-DEFAULT flex items-center justify-center text-2xl">
              {entry.avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="font-bold text-lg">{entry.username}</p>
              <p className="text-sm text-gray-500">
                Level {entry.level} • {entry.badges} badges
              </p>
            </div>

            {/* XP */}
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">
                {entry.xp.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 6. Challenge Card Component

```typescript
'use client';

import { motion } from 'framer-motion';
import { Challenge } from '@/lib/gamification/challenges';
import { Clock, Target } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const progress = (challenge.goal.current / challenge.goal.target) * 100;
  const timeRemaining = challenge.expiresAt.getTime() - Date.now();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border-2 ${
        challenge.completed
          ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{challenge.icon}</div>
          <div>
            <h3 className="text-xl font-bold">{challenge.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {challenge.description}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          challenge.type === 'daily'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : challenge.type === 'weekly'
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {challenge.type}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {challenge.goal.current} / {challenge.goal.target}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-DEFAULT"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {hoursRemaining > 0 ? `${hoursRemaining}h remaining` : 'Expired'}
        </div>

        <div className="text-sm font-semibold text-primary-600">
          +{challenge.reward.xp} XP
        </div>
      </div>

      {/* Completed badge */}
      {challenge.completed && (
        <div className="mt-4 p-3 bg-green-500 text-white rounded-lg text-center font-semibold">
          ✓ Challenge Completed!
        </div>
      )}
    </motion.div>
  );
}
```

## Hooks Implementation

```typescript
// hooks/useAchievements.ts
import { useState, useEffect } from 'react';
import { Achievement, ACHIEVEMENTS, checkAchievements } from '@/lib/gamification/achievements';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      setAchievements(ACHIEVEMENTS);
      localStorage.setItem('achievements', JSON.stringify(ACHIEVEMENTS));
    }
  };

  const updateProgress = async (metric: string, value: number) => {
    const updated = await checkAchievements(metric, value, achievements);

    if (updated.length > 0) {
      setAchievements([...achievements]);
      localStorage.setItem('achievements', JSON.stringify(achievements));

      // Show notifications for newly unlocked
      updated.forEach((achievement) => {
        showAchievementNotification(achievement);
      });
    }
  };

  return { achievements, updateProgress };
}
```

## Next Steps
➡️ Phase 12: Accessibility & Voice Control

## Notes
- ゲーミフィケーションでユーザーエンゲージメント向上
- アチーブメント・バッジで達成感を提供
- リーダーボードで競争意識を刺激
- デイリー・ウィークリーチャレンジで継続利用促進
- XPシステムでレベルアップの喜びを演出
- 報酬アンロックでプレミアム機能へのアクセス提供
