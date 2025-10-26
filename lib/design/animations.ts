/**
 * Animation Presets Library
 *
 * Reusable animation variants for Framer Motion
 */

import { Variants, Transition } from 'framer-motion';

// Fade animations
export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide animations
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Scale animations
export const scale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const scaleSpring: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.8 },
};

// Rotate animations
export const rotate: Variants = {
  initial: { opacity: 0, rotate: -180 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 180 },
};

// Blur animations
export const blur: Variants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(10px)' },
};

// Stagger animations
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Continuous animations
export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

// Preset transition configurations
export const transitions = {
  fast: { duration: 0.15 } as Transition,
  normal: { duration: 0.3 } as Transition,
  slow: { duration: 0.5 } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 20 } as Transition,
  springBouncy: { type: 'spring', stiffness: 200, damping: 10 } as Transition,
};

// Combined animation presets
export const animations = {
  fade,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scale,
  scaleSpring,
  rotate,
  blur,
  staggerContainer,
  staggerItem,
  bounce,
  pulse,
  shake,
};
