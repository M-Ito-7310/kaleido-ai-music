'use client';

import { useCallback } from 'react';

/**
 * Haptic Feedback Hook
 *
 * Uses Vibration API for haptic feedback on mobile devices
 * https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [50, 100, 50, 100, 50],
};

export function useHapticFeedback() {
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const triggerHaptic = useCallback(
    (type: HapticType = 'light') => {
      if (!isSupported) return;

      const pattern = HAPTIC_PATTERNS[type];
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    },
    [isSupported]
  );

  const cancelHaptic = useCallback(() => {
    if (!isSupported) return;
    navigator.vibrate(0);
  }, [isSupported]);

  return {
    triggerHaptic,
    cancelHaptic,
    isSupported,
  };
}
