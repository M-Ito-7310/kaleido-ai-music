# Phase 15: Mobile Optimizations

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 1-2 hours

## Overview
モバイル最適化の実装。高度なタッチジェスチャー、ハプティックフィードバック、ネイティブライクなボトムシート、プルトゥリフレッシュ、バッテリーセーバーモード、最適化されたアニメーションにより、モバイルデバイスで最高のユーザー体験を提供します。

## Technologies to Use
- react-use-gesture ^9.1.3 (gesture handling)
- Vibration API (haptic feedback)
- Intersection Observer (performance)
- Battery Status API (power management)
- @dnd-kit/core ^6.1.0 (drag and drop)

## Dependencies to Add

```json
{
  "react-use-gesture": "^9.1.3",
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0"
}
```

## Files to Create

1. **components/mobile/BottomSheet.tsx** - Native-like bottom drawer
2. **components/mobile/GestureHandler.tsx** - Advanced gesture recognition
3. **components/mobile/PullToRefresh.tsx** - Pull to refresh component
4. **components/mobile/SwipeableCard.tsx** - Swipeable track cards
5. **hooks/useHapticFeedback.ts** - Vibration API wrapper
6. **hooks/useBatterySaver.ts** - Battery-conscious features
7. **hooks/useGesture.ts** - Gesture detection hook
8. **lib/mobile/gestureRecognizer.ts** - Gesture pattern recognition

## Key Features

### 1. Advanced Touch Gestures

```typescript
// hooks/useGesture.ts
import { useGesture as useGestureLib } from '@use-gesture/react';
import { useSpring } from '@react-spring/web';

export function useGesture() {
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
  }));

  const bind = useGestureLib({
    // Swipe gestures
    onDrag: ({ offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy], cancel }) => {
      // Horizontal swipe for next/previous track
      if (Math.abs(vx) > 0.5 && Math.abs(dx) > 0.8) {
        if (dx > 0) {
          handlePreviousTrack();
        } else {
          handleNextTrack();
        }
        cancel();
      }

      // Vertical swipe for volume
      if (Math.abs(vy) > 0.3 && Math.abs(dy) > 0.8) {
        adjustVolume(dy > 0 ? -0.1 : 0.1);
      }

      api.start({ x: ox, y: oy });
    },

    // Pinch zoom
    onPinch: ({ offset: [scale] }) => {
      api.start({ scale });
    },

    // Long press
    onLongPress: () => {
      showTrackMenu();
      hapticFeedback('medium');
    },

    // Double tap
    onDoubleTap: () => {
      togglePlayPause();
      hapticFeedback('light');
    },

    // Swipe up for full-screen
    onSwipeUp: () => {
      openFullScreenPlayer();
    },

    // Swipe down to close
    onSwipeDown: () => {
      closeFullScreenPlayer();
    },
  });

  return { bind, x, y, scale };
}
```

### 2. Haptic Feedback

```typescript
// hooks/useHapticFeedback.ts

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHapticFeedback() {
  const vibrate = (pattern: HapticPattern) => {
    if (!('vibrate' in navigator)) return;

    const patterns: Record<HapticPattern, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 40,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [50, 100, 50, 100, 50],
    };

    navigator.vibrate(patterns[pattern]);
  };

  const vibrateOnInteraction = () => {
    vibrate('light');
  };

  const vibrateOnSuccess = () => {
    vibrate('success');
  };

  const vibrateOnError = () => {
    vibrate('error');
  };

  return {
    vibrate,
    vibrateOnInteraction,
    vibrateOnSuccess,
    vibrateOnError,
  };
}
```

### 3. Bottom Sheet Component

```typescript
'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // [0.3, 0.6, 0.9] = 30%, 60%, 90% of screen height
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.9],
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [0.5, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.y;

    // Close if dragged down significantly
    if (info.offset.y > threshold || velocity > 500) {
      onClose();
    } else {
      // Snap to nearest point
      const screenHeight = window.innerHeight;
      const currentPosition = info.point.y / screenHeight;

      const closest = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev
      );

      setCurrentSnap(snapPoints.indexOf(closest));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black z-40"
        style={{ opacity }}
      />

      {/* Sheet */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={{ y: '100%' }}
        animate={{ y: `${(1 - snapPoints[currentSnap]) * 100}%` }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
        style={{ y }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[85vh] px-6 pb-6">
          {children}
        </div>
      </motion.div>
    </>
  );
}
```

### 4. Pull to Refresh

```typescript
'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const rotate = useTransform(y, [0, 100], [0, 360]);
  const opacity = useTransform(y, [0, 100], [0, 1]);

  const handleDragEnd = async () => {
    if (y.get() > 100 && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    y.set(0);
  };

  return (
    <div className="relative">
      {/* Refresh indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
        style={{ y, opacity }}
      >
        <motion.div style={{ rotate }}>
          <RefreshCw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        style={{ y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

### 5. Battery Saver Mode

```typescript
// hooks/useBatterySaver.ts

export function useBatterySaver() {
  const [batterySaverMode, setBatterySaverMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level);
        setIsCharging(battery.charging);

        // Enable battery saver if battery is low and not charging
        if (battery.level < 0.2 && !battery.charging) {
          setBatterySaverMode(true);
        }

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level);
          if (battery.level < 0.2 && !battery.charging) {
            setBatterySaverMode(true);
          }
        });

        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
          if (battery.charging) {
            setBatterySaverMode(false);
          }
        });
      });
    }
  }, []);

  const optimizations = {
    reduceAnimations: batterySaverMode,
    disableVisualizer: batterySaverMode,
    lowerImageQuality: batterySaverMode,
    reducePollInterval: batterySaverMode,
  };

  return {
    batterySaverMode,
    setBatterySaverMode,
    batteryLevel,
    isCharging,
    optimizations,
  };
}
```

### 6. Swipeable Track Card

```typescript
'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, Trash2, Plus } from 'lucide-react';

export function SwipeableCard({ track, onDelete, onFavorite, onAddToQueue }) {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-200, 0, 200],
    ['rgb(239, 68, 68)', 'transparent', 'rgb(34, 197, 94)']
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x < -threshold) {
      // Swipe left: Delete
      onDelete(track.id);
    } else if (info.offset.x > threshold) {
      // Swipe right: Add to favorites
      onFavorite(track.id);
    }

    x.set(0); // Reset position
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-red-500">
          <Trash2 className="w-5 h-5" />
          <span className="font-semibold">Delete</span>
        </div>
        <div className="flex items-center gap-2 text-green-500">
          <Heart className="w-5 h-5" />
          <span className="font-semibold">Favorite</span>
        </div>
      </div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, background }}
        className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
      >
        {/* Track content */}
        <div className="flex items-center gap-4">
          <img src={track.imageUrl} alt={track.title} className="w-12 h-12 rounded" />
          <div className="flex-1">
            <p className="font-semibold">{track.title}</p>
            <p className="text-sm text-gray-500">{track.artist}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

### 7. Gesture Map

```typescript
// Gesture patterns for mobile
export const GESTURE_MAP = {
  // Player gestures
  swipeLeft: 'Next track',
  swipeRight: 'Previous track',
  swipeUp: 'Open full-screen player',
  swipeDown: 'Close full-screen player',
  doubleTap: 'Play/Pause',
  longPress: 'Show track menu',
  pinchOut: 'Zoom in album art',
  pinchIn: 'Zoom out album art',

  // Volume gestures
  twoFingerSwipeUp: 'Volume up',
  twoFingerSwipeDown: 'Volume down',

  // Playlist gestures
  swipeLeftOnTrack: 'Remove from queue',
  swipeRightOnTrack: 'Add to favorites',
  dragAndDrop: 'Reorder playlist',
};
```

## Performance Optimizations

### 1. Virtualized Lists
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualizedTrackList({ tracks }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Row height
    overscan: 5, // Render 5 extra items
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <TrackCard track={tracks[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. Image Lazy Loading
```typescript
<img
  src={track.imageUrl}
  alt={track.title}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover"
/>
```

### 3. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing on Mobile Devices

### iOS Testing
- Safari iOS 15+
- Chrome iOS
- Test on iPhone SE, iPhone 14, iPad

### Android Testing
- Chrome Android
- Samsung Internet
- Test on various screen sizes

## Next Steps
➡️ Phase 16: Design System Completion

## Notes
- react-use-gestureで高度なジェスチャー認識
- Vibration APIでハプティックフィードバック
- ボトムシートでネイティブアプリライクなUI
- プルトゥリフレッシュで直感的な更新
- バッテリーセーバーモードで電力消費を抑制
- 仮想化リストで大量データも高速表示
- すべてのジェスチャーがアクセシブル
