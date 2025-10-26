import { openDB, DBSchema, IDBPDatabase } from 'idb';

/**
 * IndexedDB Schema for Kaleido AI Music
 *
 * Stores:
 * - favorites: User's favorite tracks
 * - history: Recently played tracks with progress
 * - playbackState: Current playback state for resume
 */
interface KaleidoDB extends DBSchema {
  favorites: {
    key: number;
    value: {
      id?: number;
      trackId: number;
      addedAt: Date;
    };
    indexes: { 'by-trackId': number; 'by-addedAt': Date };
  };
  history: {
    key: number;
    value: {
      id?: number;
      trackId: number;
      playedAt: Date;
      progress: number; // seconds
      completed: boolean;
    };
    indexes: { 'by-playedAt': Date; 'by-trackId': number };
  };
  playbackState: {
    key: number;
    value: {
      id: number;
      trackId: number | null;
      position: number; // seconds
      updatedAt: Date;
    };
  };
}

const DB_NAME = 'kaleido-music';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<KaleidoDB>> | null = null;

/**
 * Get or create the IndexedDB database instance
 */
export function getDB(): Promise<IDBPDatabase<KaleidoDB>> {
  if (!dbPromise) {
    dbPromise = openDB<KaleidoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create favorites store
        if (!db.objectStoreNames.contains('favorites')) {
          const favoritesStore = db.createObjectStore('favorites', {
            keyPath: 'id',
            autoIncrement: true,
          });
          favoritesStore.createIndex('by-trackId', 'trackId', { unique: true });
          favoritesStore.createIndex('by-addedAt', 'addedAt');
        }

        // Create history store
        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', {
            keyPath: 'id',
            autoIncrement: true,
          });
          historyStore.createIndex('by-playedAt', 'playedAt');
          historyStore.createIndex('by-trackId', 'trackId');
        }

        // Create playbackState store
        if (!db.objectStoreNames.contains('playbackState')) {
          db.createObjectStore('playbackState', {
            keyPath: 'id',
          });
        }
      },
    });
  }
  return dbPromise;
}

// =====================
// Favorites Operations
// =====================

/**
 * Get all favorite track IDs
 */
export async function getAllFavorites(): Promise<number[]> {
  const db = await getDB();
  const allFavorites = await db.getAll('favorites');
  return allFavorites.map((f) => f.trackId);
}

/**
 * Add a track to favorites
 */
export async function addFavorite(trackId: number): Promise<void> {
  const db = await getDB();
  await db.add('favorites', { trackId, addedAt: new Date() });
}

/**
 * Remove a track from favorites
 */
export async function removeFavorite(trackId: number): Promise<void> {
  const db = await getDB();
  const key = await db.getKeyFromIndex('favorites', 'by-trackId', trackId);
  if (key !== undefined) {
    await db.delete('favorites', key);
  }
}

/**
 * Check if a track is favorited
 */
export async function isFavorite(trackId: number): Promise<boolean> {
  const db = await getDB();
  const favorite = await db.getFromIndex('favorites', 'by-trackId', trackId);
  return !!favorite;
}

// =====================
// History Operations
// =====================

/**
 * Add a track to play history
 */
export async function addToHistory(trackId: number): Promise<void> {
  const db = await getDB();
  await db.add('history', {
    trackId,
    playedAt: new Date(),
    progress: 0,
    completed: false,
  });

  // Limit to 100 entries
  const allHistory = await db.getAllFromIndex('history', 'by-playedAt');
  if (allHistory.length > 100) {
    // Delete oldest entries
    const toDelete = allHistory.slice(0, allHistory.length - 100);
    const tx = db.transaction('history', 'readwrite');
    for (const entry of toDelete) {
      if (entry.id) {
        await tx.store.delete(entry.id);
      }
    }
    await tx.done;
  }
}

/**
 * Update progress for the latest history entry of a track
 */
export async function updateHistoryProgress(
  trackId: number,
  progress: number,
  duration: number
): Promise<void> {
  const db = await getDB();
  const entries = await db.getAllFromIndex('history', 'by-trackId', trackId);

  if (entries.length > 0) {
    // Update the most recent entry
    const latest = entries[entries.length - 1];
    if (latest.id) {
      const completed = duration > 0 && progress / duration > 0.9; // 90% = completed
      await db.put('history', {
        ...latest,
        progress,
        completed,
      });
    }
  }
}

/**
 * Get recent history (latest 50 entries)
 */
export async function getRecentHistory(): Promise<
  Array<{
    id?: number;
    trackId: number;
    playedAt: Date;
    progress: number;
    completed: boolean;
  }>
> {
  const db = await getDB();
  const allHistory = await db.getAllFromIndex('history', 'by-playedAt');
  return allHistory.reverse().slice(0, 50); // Most recent first
}

/**
 * Clear all history
 */
export async function clearHistory(): Promise<void> {
  const db = await getDB();
  await db.clear('history');
}

// =====================
// Playback State Operations
// =====================

const PLAYBACK_STATE_KEY = 1;

/**
 * Save playback state for resume
 */
export async function savePlaybackState(
  trackId: number,
  position: number
): Promise<void> {
  const db = await getDB();
  await db.put('playbackState', {
    id: PLAYBACK_STATE_KEY,
    trackId,
    position,
    updatedAt: new Date(),
  });
}

/**
 * Load saved playback state
 */
export async function loadPlaybackState(): Promise<{
  trackId: number;
  position: number;
  updatedAt: Date;
} | null> {
  const db = await getDB();
  const state = await db.get('playbackState', PLAYBACK_STATE_KEY);
  return state
    ? { trackId: state.trackId!, position: state.position, updatedAt: state.updatedAt }
    : null;
}

/**
 * Clear playback state
 */
export async function clearPlaybackState(): Promise<void> {
  const db = await getDB();
  await db.delete('playbackState', PLAYBACK_STATE_KEY);
}
