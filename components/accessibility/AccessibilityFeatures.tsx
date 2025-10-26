'use client';

import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

/**
 * AccessibilityFeatures Component
 *
 * Initializes keyboard shortcuts and other accessibility features
 * Should be included once in the app layout
 */
export function AccessibilityFeatures() {
  useKeyboardShortcuts();

  // This component renders nothing visually
  // It only initializes accessibility features
  return null;
}
