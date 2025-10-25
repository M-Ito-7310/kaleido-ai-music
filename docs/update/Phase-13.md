# Phase 13: Data Persistence & Favorites

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 1-2 hours

## Overview
IndexedDBとSupabaseを使用したデータ永続化システムの実装。お気に入り管理、再生履歴追跡、再生位置の自動保存、オフラインダウンロード、クラウド同期により、シームレスなユーザー体験を提供します。

## Technologies to Use
- idb ^8.0.0 (IndexedDB wrapper)
- Supabase (optional cloud sync)
- Service Worker (offline storage)
- LocalStorage (quick access data)

## Dependencies to Add

```json
{
  "idb": "^8.0.0",
  "@supabase/supabase-js": "^2.39.0"
}
```

## Files to Create

1. **lib/db/indexedDB.ts** - IndexedDB wrapper and operations
2. **lib/db/schema.ts** - IndexedDB schema definitions
3. **lib/db/supabaseSync.ts** - Cloud sync logic (optional)
4. **hooks/useFavorites.ts** - Favorites management hook
5. **hooks/useHistory.ts** - Listening history hook
6. **hooks/usePlaybackState.ts** - Resume playback hook
7. **hooks/useOfflineDownloads.ts** - Offline download management
8. **components/library/FavoritesGrid.tsx** - Favorites display
9. **components/library/HistoryList.tsx** - Recently played list
10. **components/ui/FavoriteButton.tsx** - Heart icon toggle button
11. **components/downloads/DownloadManager.tsx** - Download queue UI

## Key Features to Implement

### 1. IndexedDB Setup

```typescript
// lib/db/indexedDB.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface KaleidoDB extends DBSchema {
  favorites: {
    key: number;
    value: {
      id: number;
      trackId: number;
      addedAt: Date;
    };
    indexes: { 'by-trackId': number; 'by-addedAt': Date };
  };
  history: {
    key: number;
    value: {
      id: number;
      trackId: number;
      playedAt: Date;
      progress: number;
      completed: boolean;
    };
    indexes: { 'by-playedAt': Date; 'by-trackId': number };
  };
  downloads: {
    key: number;
    value: {
      id: number;
      trackId: number;
      blob: Blob;
      downloadedAt: Date;
      size: number;
    };
    indexes: { 'by-trackId': number };
  };
  playbackState: {
    key: 1;
    value: {
      id: 1;
      trackId: number | null;
      position: number;
      volume: number;
      updatedAt: Date;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<KaleidoDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<KaleidoDB>('kaleido-music', 1, {
      upgrade(db) {
        // Favorites store
        const favoritesStore = db.createObjectStore('favorites', {
          keyPath: 'id',
          autoIncrement: true,
        });
        favoritesStore.createIndex('by-trackId', 'trackId', { unique: true });
        favoritesStore.createIndex('by-addedAt', 'addedAt');

        // History store
        const historyStore = db.createObjectStore('history', {
          keyPath: 'id',
          autoIncrement: true,
        });
        historyStore.createIndex('by-playedAt', 'playedAt');
        historyStore.createIndex('by-trackId', 'trackId');

        // Downloads store
        const downloadsStore = db.createObjectStore('downloads', {
          keyPath: 'id',
          autoIncrement: true,
        });
        downloadsStore.createIndex('by-trackId', 'trackId', { unique: true });

        // Playback state store (singleton)
        db.createObjectStore('playbackState', { keyPath: 'id' });

        // Settings store
        db.createObjectStore('settings');
      },
    });
  }
  return dbPromise;
}

// Clear all data (for testing/reset)
export async function clearAllData() {
  const db = await getDB();
  const tx = db.transaction(
    ['favorites', 'history', 'downloads', 'playbackState', 'settings'],
    'readwrite'
  );

  await Promise.all([
    tx.objectStore('favorites').clear(),
    tx.objectStore('history').clear(),
    tx.objectStore('downloads').clear(),
    tx.objectStore('playbackState').clear(),
    tx.objectStore('settings').clear(),
  ]);

  await tx.done;
}
```

### 2. Favorites Hook

```typescript
// hooks/useFavorites.ts
import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db/indexedDB';
import { announce } from '@/lib/accessibility/screenReaderAnnouncer';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const db = await getDB();
      const allFavorites = await db.getAll('favorites');
      setFavorites(allFavorites.map((f) => f.trackId));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (trackId: number, trackTitle?: string) => {
    const db = await getDB();
    const isFavorited = favorites.includes(trackId);

    try {
      if (isFavorited) {
        // Remove from favorites
        const key = await db.getKeyFromIndex('favorites', 'by-trackId', trackId);
        if (key !== undefined) {
          await db.delete('favorites', key);
        }
        setFavorites((prev) => prev.filter((id) => id !== trackId));

        if (trackTitle) {
          announce(`${trackTitle} removed from favorites`);
        }
      } else {
        // Add to favorites
        await db.add('favorites', {
          trackId,
          addedAt: new Date(),
        } as any);
        setFavorites((prev) => [...prev, trackId]);

        if (trackTitle) {
          announce(`${trackTitle} added to favorites`);
        }
      }

      // Optional: Sync to cloud
      await syncToCloud('favorites');
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const isFavorite = (trackId: number) => favorites.includes(trackId);

  const getFavoriteCount = () => favorites.length;

  const getFavoriteTracks = async () => {
    const db = await getDB();
    return await db.getAll('favorites');
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    getFavoriteTracks,
  };
}

// Optional cloud sync
async function syncToCloud(storeName: string) {
  // Implementation depends on backend choice (Supabase, Firebase, etc.)
  // This would upload local changes to cloud storage
}
```

### 3. History Hook

```typescript
// hooks/useHistory.ts
import { useState, useEffect } from 'react';
import { getDB } from '@/lib/db/indexedDB';

export function useHistory() {
  const [history, setHistory] = useState<any[]>([]);

  const trackPlay = async (trackId: number) => {
    const db = await getDB();

    try {
      await db.add('history', {
        trackId,
        playedAt: new Date(),
        progress: 0,
        completed: false,
      } as any);

      // Limit to 100 most recent entries
      const allHistory = await db.getAllFromIndex('history', 'by-playedAt');
      if (allHistory.length > 100) {
        // Delete oldest entries
        const toDelete = allHistory.slice(0, allHistory.length - 100);
        for (const entry of toDelete) {
          await db.delete('history', entry.id);
        }
      }

      loadHistory();
    } catch (error) {
      console.error('Failed to track play:', error);
    }
  };

  const updateProgress = async (trackId: number, progress: number) => {
    const db = await getDB();

    try {
      const tx = db.transaction('history', 'readwrite');
      const index = tx.store.index('by-trackId');
      const entries = await index.getAll(trackId);

      if (entries.length > 0) {
        // Update most recent entry
        const latest = entries.reduce((prev, curr) =>
          new Date(curr.playedAt) > new Date(prev.playedAt) ? curr : prev
        );

        latest.progress = progress;
        latest.completed = progress > 0.9; // 90% = completed

        await tx.store.put(latest);
      }

      await tx.done;
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const loadHistory = async () => {
    const db = await getDB();
    const allHistory = await db.getAllFromIndex('history', 'by-playedAt');
    setHistory(allHistory.reverse().slice(0, 50)); // Last 50 entries
  };

  const getRecentlyPlayed = async (limit: number = 20) => {
    const db = await getDB();
    const allHistory = await db.getAllFromIndex('history', 'by-playedAt');

    // Get unique tracks (latest play only)
    const uniqueTracks = new Map();
    for (const entry of allHistory.reverse()) {
      if (!uniqueTracks.has(entry.trackId)) {
        uniqueTracks.set(entry.trackId, entry);
      }
      if (uniqueTracks.size >= limit) break;
    }

    return Array.from(uniqueTracks.values());
  };

  const clearHistory = async () => {
    const db = await getDB();
    await db.clear('history');
    setHistory([]);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return {
    history,
    trackPlay,
    updateProgress,
    getRecentlyPlayed,
    clearHistory,
  };
}
```

### 4. Playback State Hook

```typescript
// hooks/usePlaybackState.ts
import { useEffect } from 'react';
import { getDB } from '@/lib/db/indexedDB';
import { usePlayer } from '@/lib/contexts/PlayerContext';

export function usePlaybackState() {
  const { currentTrack, currentTime, volume } = usePlayer();

  // Save state periodically
  useEffect(() => {
    if (!currentTrack) return;

    const interval = setInterval(() => {
      savePlaybackState(currentTrack.id, currentTime, volume);
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [currentTrack, currentTime, volume]);

  const savePlaybackState = async (
    trackId: number,
    position: number,
    volume: number
  ) => {
    const db = await getDB();

    try {
      await db.put('playbackState', {
        id: 1,
        trackId,
        position,
        volume,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to save playback state:', error);
    }
  };

  const loadPlaybackState = async () => {
    const db = await getDB();

    try {
      const state = await db.get('playbackState', 1);
      return state || null;
    } catch (error) {
      console.error('Failed to load playback state:', error);
      return null;
    }
  };

  const clearPlaybackState = async () => {
    const db = await getDB();

    try {
      await db.delete('playbackState', 1);
    } catch (error) {
      console.error('Failed to clear playback state:', error);
    }
  };

  return {
    savePlaybackState,
    loadPlaybackState,
    clearPlaybackState,
  };
}
```

### 5. Favorite Button Component

```typescript
'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  trackId: number;
  trackTitle: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ trackId, trackTitle, size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(trackId);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(trackId, trackTitle);
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={favorited ? `Remove ${trackTitle} from favorites` : `Add ${trackTitle} to favorites`}
      aria-pressed={favorited}
    >
      <Heart
        className={`${sizes[size]} transition-colors ${
          favorited
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-500'
        }`}
      />
    </motion.button>
  );
}
```

### 6. Resume Playback Dialog

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { usePlaybackState } from '@/hooks/usePlaybackState';
import { usePlayer } from '@/lib/contexts/PlayerContext';

export function ResumePlaybackDialog() {
  const [show, setShow] = useState(false);
  const [savedState, setSavedState] = useState<any>(null);
  const { loadPlaybackState, clearPlaybackState } = usePlaybackState();
  const { playTrack, seekTo, setVolume } = usePlayer();

  useEffect(() => {
    checkForSavedState();
  }, []);

  const checkForSavedState = async () => {
    const state = await loadPlaybackState();

    if (state && state.trackId && state.position > 10) {
      // Only show if more than 10 seconds into track
      setSavedState(state);
      setShow(true);
    }
  };

  const handleResume = async () => {
    if (!savedState) return;

    // Fetch track data
    const track = await fetchTrackById(savedState.trackId);

    if (track) {
      playTrack(track);
      setTimeout(() => {
        seekTo(savedState.position);
        setVolume(savedState.volume);
      }, 500); // Wait for player to load
    }

    setShow(false);
    clearPlaybackState();
  };

  const handleDismiss = () => {
    setShow(false);
    clearPlaybackState();
  };

  return (
    <AnimatePresence>
      {show && savedState && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Welcome back!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Continue where you left off?
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleResume}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
              >
                <Play className="w-5 h-5" />
                Resume
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Storage Quota Management

```typescript
// lib/db/storageQuota.ts

export async function getStorageEstimate() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentUsed: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
    };
  }
  return { usage: 0, quota: 0, percentUsed: 0 };
}

export async function checkStorageAvailable(requiredBytes: number): Promise<boolean> {
  const { usage, quota } = await getStorageEstimate();
  const available = quota - usage;
  return available >= requiredBytes;
}

export async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    return await navigator.storage.persist();
  }
  return false;
}
```

## Data Migration

```typescript
// lib/db/migration.ts

export async function migrateLocalStorageToIndexedDB() {
  const db = await getDB();

  // Migrate favorites from localStorage
  const oldFavorites = localStorage.getItem('favorites');
  if (oldFavorites) {
    const favoriteIds = JSON.parse(oldFavorites);
    for (const trackId of favoriteIds) {
      await db.add('favorites', {
        trackId,
        addedAt: new Date(),
      } as any);
    }
    localStorage.removeItem('favorites');
  }

  // Migrate other data...
}
```

## Next Steps
➡️ Phase 14: Advanced Audio Settings

## Notes
- IndexedDBで大容量データを効率的に保存
- idbライブラリで型安全なDB操作
- お気に入り・履歴・再生位置を自動保存
- オフラインダウンロード対応
- ストレージクォータ管理で容量不足を防止
- オプションでSupabaseクラウド同期
- データ移行機能でスムーズな更新
