'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, TIER_COLORS } from '@/lib/gamification/achievements';
import { X, Award } from 'lucide-react';

/**
 * AchievementNotification Component
 *
 * Displays a notification when an achievement is unlocked
 */

interface UserAchievement extends Achievement {
  unlocked: boolean;
  progress: number;
  unlockedAt?: Date;
}

interface AchievementNotificationProps {
  achievement: UserAchievement;
  onClose: () => void;
}

export function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  const tierColor = TIER_COLORS[achievement.tier];

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="relative p-4 pr-12 bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 backdrop-blur-md border-2 rounded-xl shadow-2xl min-w-[320px] max-w-[400px]"
      style={{ borderColor: tierColor }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-5 h-5 text-yellow-400" />
        <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">
          Achievement Unlocked!
        </h3>
      </div>

      {/* Achievement content */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full border-4 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md shadow-lg flex-shrink-0"
          style={{ borderColor: tierColor }}
        >
          <span className="text-3xl">{achievement.icon}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-lg mb-1">{achievement.name}</h4>
          <p className="text-sm text-neutral-300 mb-2">{achievement.description}</p>
          <div className="flex items-center gap-3 text-xs">
            <span
              className="px-2 py-1 rounded-full font-semibold text-white"
              style={{ backgroundColor: tierColor }}
            >
              {achievement.tier.toUpperCase()}
            </span>
            <span className="text-primary-400 font-semibold">+{achievement.reward.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: tierColor }}
            initial={{ x: '50%', y: '50%', opacity: 1 }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * AchievementStack Component
 *
 * Manages multiple achievement notifications
 */

interface AchievementStackProps {
  achievements: UserAchievement[];
  onDismiss: (achievementId: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

export function AchievementStack({
  achievements,
  onDismiss,
  position = 'top-right',
}: AchievementStackProps) {
  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-3`}>
      <AnimatePresence mode="popLayout">
        {achievements.map((achievement) => (
          <AchievementNotification
            key={achievement.id}
            achievement={achievement}
            onClose={() => onDismiss(achievement.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
