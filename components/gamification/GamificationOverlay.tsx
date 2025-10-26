'use client';

import { useGamification } from '@/lib/contexts/GamificationContext';
import { AchievementStack } from './AchievementNotification';

/**
 * GamificationOverlay Component
 *
 * Displays achievement notifications when they are unlocked
 */

export function GamificationOverlay() {
  const { newlyUnlocked, clearNewlyUnlocked } = useGamification();

  const handleDismiss = (achievementId: string) => {
    // Remove the specific achievement from the newlyUnlocked array
    // For now, we just clear all since we don't have granular control
    clearNewlyUnlocked();
  };

  return (
    <AchievementStack
      achievements={newlyUnlocked}
      onDismiss={handleDismiss}
      position="top-right"
    />
  );
}
