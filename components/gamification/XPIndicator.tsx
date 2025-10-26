'use client';

import { motion } from 'framer-motion';
import { UserStats, getLevelTitle } from '@/lib/gamification/xpSystem';
import { Sparkles, TrendingUp } from 'lucide-react';

/**
 * XPIndicator Component
 *
 * Displays user's current level, XP, and progress to next level
 */

interface XPIndicatorProps {
  userStats: UserStats;
  variant?: 'compact' | 'full';
  showTitle?: boolean;
  animated?: boolean;
}

export function XPIndicator({
  userStats,
  variant = 'full',
  showTitle = true,
  animated = true,
}: XPIndicatorProps) {
  const progress = (userStats.xp / userStats.xpToNextLevel) * 100;
  const levelTitle = getLevelTitle(userStats.level);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary-600/20 to-accent-600/20 backdrop-blur-md border border-white/10 rounded-full">
        {/* Level badge */}
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full font-bold text-white shadow-lg">
          {userStats.level}
        </div>

        {/* XP bar */}
        <div className="flex-1 min-w-[120px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-white">Level {userStats.level}</span>
            <span className="text-xs text-neutral-300">{userStats.xp}/{userStats.xpToNextLevel} XP</span>
          </div>
          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              initial={animated ? { width: 0 } : { width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {/* Level badge */}
        <motion.div
          className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl font-bold text-3xl text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {userStats.level}
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400" />
        </motion.div>

        {/* Level info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">Level {userStats.level}</h3>
          {showTitle && (
            <p className="text-sm text-neutral-300 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {levelTitle}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-300">Progress to Level {userStats.level + 1}</span>
          <span className="font-semibold text-white">
            {userStats.xp}/{userStats.xpToNextLevel} XP
          </span>
        </div>
        <div className="relative h-4 bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-full"
            initial={animated ? { width: 0 } : { width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>{Math.round(progress)}% complete</span>
          <span>{userStats.xpToNextLevel - userStats.xp} XP remaining</span>
        </div>
      </div>

      {/* Total XP */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
        <span className="text-neutral-300">Total XP Earned</span>
        <span className="font-bold text-primary-400">{userStats.totalXP.toLocaleString()} XP</span>
      </div>
    </div>
  );
}

/**
 * XPGainNotification Component
 *
 * Shows a floating notification when XP is gained
 */

interface XPGainNotificationProps {
  amount: number;
  onComplete?: () => void;
}

export function XPGainNotification({ amount, onComplete }: XPGainNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.8 }}
      animate={{ opacity: [0, 1, 1, 0], y: -50, scale: 1 }}
      transition={{ duration: 2, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 backdrop-blur-md border border-white/20 rounded-full shadow-2xl">
        <div className="flex items-center gap-2 text-white font-bold">
          <Sparkles className="w-5 h-5" />
          <span>+{amount} XP</span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * LevelUpNotification Component
 *
 * Shows a celebration when user levels up
 */

interface LevelUpNotificationProps {
  newLevel: number;
  onComplete?: () => void;
}

export function LevelUpNotification({ newLevel, onComplete }: LevelUpNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        className="relative p-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl shadow-2xl max-w-md mx-4"
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ x: '50%', y: '50%', opacity: 0 }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-2">Level Up!</h2>
          <p className="text-xl mb-4">You reached Level {newLevel}</p>
          <p className="text-sm opacity-90">{getLevelTitle(newLevel)}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="mt-6 px-6 py-2 bg-white text-primary-600 font-semibold rounded-full"
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
