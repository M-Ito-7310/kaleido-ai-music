'use client';

import { motion } from 'framer-motion';
import { Achievement, TIER_COLORS, CATEGORY_COLORS } from '@/lib/gamification/achievements';

/**
 * BadgeDisplay Component
 *
 * Displays a single achievement badge with unlock status and progress
 */

interface UserAchievement extends Achievement {
  unlocked: boolean;
  progress: number;
  unlockedAt?: Date;
}

interface BadgeDisplayProps {
  achievement: UserAchievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const iconSizes = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
};

export function BadgeDisplay({
  achievement,
  size = 'md',
  showProgress = true,
}: BadgeDisplayProps) {
  const tierColor = TIER_COLORS[achievement.tier];
  const categoryColor = CATEGORY_COLORS[achievement.category];
  const progress = Math.min(100, (achievement.progress / achievement.requirement.target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="group relative"
    >
      {/* Badge */}
      <div
        className={`${sizeClasses[size]} relative flex items-center justify-center rounded-full border-4 transition-all ${
          achievement.unlocked
            ? 'bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md shadow-lg'
            : 'bg-neutral-800/50 backdrop-blur-sm grayscale opacity-50'
        }`}
        style={{
          borderColor: achievement.unlocked ? tierColor : '#404040',
        }}
      >
        {/* Icon */}
        <span className={iconSizes[size]}>{achievement.icon}</span>

        {/* Locked overlay */}
        {!achievement.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
            <span className="text-2xl">🔒</span>
          </div>
        )}

        {/* Tier indicator */}
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
          style={{ backgroundColor: tierColor }}
        >
          {achievement.tier[0].toUpperCase()}
        </div>
      </div>

      {/* Progress bar (if not unlocked and showProgress) */}
      {!achievement.unlocked && showProgress && (
        <div className="mt-2 w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: categoryColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Tooltip on hover */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-10">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-2xl">{achievement.icon}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-white">{achievement.name}</h4>
            <p className="text-xs text-neutral-400 capitalize">{achievement.tier} • {achievement.category}</p>
          </div>
        </div>
        <p className="text-sm text-neutral-300 mb-2">{achievement.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            Progress: {achievement.progress}/{achievement.requirement.target}
          </span>
          <span className="text-primary-400 font-semibold">+{achievement.reward.xp} XP</span>
        </div>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-xs text-green-400 mt-2">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * BadgeGrid Component
 *
 * Displays a grid of achievement badges
 */

interface BadgeGridProps {
  achievements: UserAchievement[];
  columns?: 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  filter?: 'all' | 'unlocked' | 'locked';
  category?: 'all' | 'listening' | 'exploration' | 'social' | 'milestone';
}

export function BadgeGrid({
  achievements,
  columns = 4,
  size = 'md',
  showProgress = true,
  filter = 'all',
  category = 'all',
}: BadgeGridProps) {
  const filtered = achievements.filter((achievement) => {
    if (filter === 'unlocked' && !achievement.unlocked) return false;
    if (filter === 'locked' && achievement.unlocked) return false;
    if (category !== 'all' && achievement.category !== category) return false;
    return true;
  });

  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {filtered.map((achievement) => (
        <BadgeDisplay
          key={achievement.id}
          achievement={achievement}
          size={size}
          showProgress={showProgress}
        />
      ))}
    </div>
  );
}
