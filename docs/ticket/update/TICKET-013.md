# TICKET-013: Data Persistence & Favorites

> IndexedDBとSupabaseを使用したデータ永続化とお気に入りシステムの実装。ローカルストレージとクラウド同期による、シームレスなデータ管理を実現します。

---

## 📋 Ticket Information

| Field | Value |
|-------|-------|
| **Ticket ID** | TICKET-013 |
| **Phase** | Phase 13 |
| **Status** | ⚪ Planned |
| **Priority** | 🔴 High |
| **Assignee** | Development Team |
| **Created Date** | 2025-10-25 |
| **Start Date** | TBD |
| **Completion Date** | TBD |
| **Time Estimate** | 1-2 hours |
| **Actual Time** | TBD |

---

## 🎯 Objectives

- [ ] Implement IndexedDB wrapper for local data storage
- [ ] Create favorites system (like/unlike tracks and playlists)
- [ ] Track recently played history with playback progress
- [ ] Implement playback resume functionality
- [ ] Add offline download capability with Service Worker
- [ ] Optional: Cloud sync with Supabase for cross-device access

---

## 📦 Deliverables

### Files to Create
- `lib/db/indexedDB.ts` - IndexedDB wrapper and database operations
- `lib/db/schema.ts` - IndexedDB schema definitions
- `lib/db/supabaseSync.ts` - Optional cloud sync logic
- `hooks/useFavorites.ts` - Favorites management hook
- `hooks/useHistory.ts` - Listening history hook
- `hooks/usePlaybackState.ts` - Resume playback hook
- `hooks/useOfflineDownloads.ts` - Offline download management
- `components/library/FavoritesGrid.tsx` - Favorites display component
- `components/library/HistoryList.tsx` - Recently played list
- `components/ui/FavoriteButton.tsx` - Heart icon toggle button

### Files to Modify
- `components/music/MusicCard.tsx` - Add favorite button
- `components/music/GlobalPlayer.tsx` - Track playback progress
- `lib/contexts/PlayerContext.tsx` - Add playback state management

### Dependencies to Add
```json
{
  "idb": "^8.0.0"
}
```

Optional for cloud sync:
```json
{
  "@supabase/supabase-js": "^2.39.0"
}
```

---

## 🔗 Dependencies

### Blocked By
None - This is a foundational feature

### Blocks
- TICKET-009: AI Features (needs history data for recommendations)
- TICKET-011: Gamification (needs listening data for achievements)

### Related
- TICKET-006-A: PWA (works with Service Worker for offline)
- TICKET-010: Social Features (favorites can be shared)

---

## ✅ Acceptance Criteria

**Must Have**:
- [ ] Users can add/remove tracks from favorites
- [ ] Favorites persist across sessions (stored in IndexedDB)
- [ ] Recently played history automatically tracked (max 100 entries)
- [ ] Playback position saved every 5 seconds
- [ ] Resume playback: when reopening app, offers to resume last track
- [ ] Favorites page displays all favorited tracks
- [ ] History page shows chronological listening history

**Should Have**:
- [ ] Offline downloads: Download tracks for offline playback
- [ ] Sync status indicator (syncing/synced/error)
- [ ] Clear history option
- [ ] Export favorites as playlist
- [ ] Search within favorites

**Nice to Have**:
- [ ] Cloud sync with Supabase (cross-device favorites)
- [ ] Import/export favorites as JSON
- [ ] Favorite playlists (not just tracks)
- [ ] Statistics: most played tracks, listening time

---

## 🛠️ Implementation Notes

### Technical Approach

#### 1. IndexedDB Schema
```typescript
interface LocalDatabase {
  favorites: {
    id: number; // auto-increment
    trackId: number;
    addedAt: Date;
  };
  history: {
    id: number;
    trackId: number;
    playedAt: Date;
    progress: number; // seconds
    completed: boolean;
  };
  downloads: {
    id: number;
    trackId: number;
    blob: Blob;
    downloadedAt: Date;
    size: number; // bytes
  };
  playbackState: {
    id: 1; // singleton
    trackId: number | null;
    position: number; // seconds
    updatedAt: Date;
  };
}
```

#### 2. IndexedDB Wrapper
```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface KaleidoDB extends DBSchema {
  favorites: {
    key: number;
    value: { trackId: number; addedAt: Date };
    indexes: { 'by-trackId': number };
  };
  history: {
    key: number;
    value: { trackId: number; playedAt: Date; progress: number; completed: boolean };
    indexes: { 'by-playedAt': Date; 'by-trackId': number };
  };
  // ... other stores
}

let dbPromise: Promise<IDBPDatabase<KaleidoDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<KaleidoDB>('kaleido-music', 1, {
      upgrade(db) {
        // Create favorites store
        const favoritesStore = db.createObjectStore('favorites', {
          keyPath: 'id',
          autoIncrement: true,
        });
        favoritesStore.createIndex('by-trackId', 'trackId', { unique: true });

        // Create history store
        const historyStore = db.createObjectStore('history', {
          keyPath: 'id',
          autoIncrement: true,
        });
        historyStore.createIndex('by-playedAt', 'playedAt');
        historyStore.createIndex('by-trackId', 'trackId');

        // ... other stores
      },
    });
  }
  return dbPromise;
}
```

#### 3. Favorites Hook
```typescript
export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const db = await getDB();
    const allFavorites = await db.getAll('favorites');
    setFavorites(allFavorites.map((f) => f.trackId));
  };

  const toggleFavorite = async (trackId: number) => {
    const db = await getDB();
    const isFavorited = favorites.includes(trackId);

    if (isFavorited) {
      // Remove from favorites
      const key = await db.getKeyFromIndex('favorites', 'by-trackId', trackId);
      if (key) await db.delete('favorites', key);
      setFavorites(favorites.filter((id) => id !== trackId));
    } else {
      // Add to favorites
      await db.add('favorites', { trackId, addedAt: new Date() });
      setFavorites([...favorites, trackId]);
    }

    // Optional: Sync to cloud
    await syncToCloud('favorites');
  };

  const isFavorite = (trackId: number) => favorites.includes(trackId);

  return { favorites, toggleFavorite, isFavorite };
}
```

#### 4. History Tracking
```typescript
export function useHistory() {
  const trackPlay = async (trackId: number) => {
    const db = await getDB();
    await db.add('history', {
      trackId,
      playedAt: new Date(),
      progress: 0,
      completed: false,
    });

    // Limit to 100 entries
    const allHistory = await db.getAll('history');
    if (allHistory.length > 100) {
      const oldest = allHistory.sort((a, b) =>
        a.playedAt.getTime() - b.playedAt.getTime()
      )[0];
      await db.delete('history', oldest.id!);
    }
  };

  const updateProgress = async (trackId: number, progress: number) => {
    const db = await getDB();
    const tx = db.transaction('history', 'readwrite');
    const index = tx.store.index('by-trackId');
    const entries = await index.getAll(trackId);

    if (entries.length > 0) {
      const latest = entries[entries.length - 1];
      latest.progress = progress;
      latest.completed = progress > 0.9; // 90% = completed
      await tx.store.put(latest);
    }
    await tx.done;
  };

  return { trackPlay, updateProgress };
}
```

#### 5. Playback Resume
```typescript
export function usePlaybackState() {
  const savePlaybackState = async (trackId: number, position: number) => {
    const db = await getDB();
    await db.put('playbackState', {
      id: 1,
      trackId,
      position,
      updatedAt: new Date(),
    });
  };

  const loadPlaybackState = async () => {
    const db = await getDB();
    const state = await db.get('playbackState', 1);
    return state || null;
  };

  const clearPlaybackState = async () => {
    const db = await getDB();
    await db.delete('playbackState', 1);
  };

  return { savePlaybackState, loadPlaybackState, clearPlaybackState };
}
```

#### 6. Offline Downloads (with Service Worker)
```typescript
export function useOfflineDownloads() {
  const downloadTrack = async (track: Music) => {
    try {
      const response = await fetch(track.audioUrl);
      const blob = await response.blob();

      const db = await getDB();
      await db.add('downloads', {
        trackId: track.id,
        blob,
        downloadedAt: new Date(),
        size: blob.size,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const deleteDownload = async (trackId: number) => {
    const db = await getDB();
    const key = await db.getKeyFromIndex('downloads', 'by-trackId', trackId);
    if (key) await db.delete('downloads', key);
  };

  const isDownloaded = async (trackId: number) => {
    const db = await getDB();
    const download = await db.getFromIndex('downloads', 'by-trackId', trackId);
    return !!download;
  };

  return { downloadTrack, deleteDownload, isDownloaded };
}
```

---

## 🎨 Design Specifications

### UI/UX Requirements
- **Favorite Button**: Heart icon (outline when not favorited, filled when favorited)
- **Animation**: Heart scales and pulses when toggled
- **Feedback**: Haptic feedback on mobile when toggling
- **Color**: Red/pink for favorite state

### Responsive Behavior
- Mobile: Touch-optimized favorite buttons (min 44x44px)
- Desktop: Hover states on favorite buttons

### Accessibility
- ARIA label: "Add to favorites" / "Remove from favorites"
- Keyboard: Enter/Space to toggle
- Screen reader: Announces favorite state changes

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] IndexedDB operations (add, get, delete)
- [ ] Favorites logic (toggle, check if favorited)
- [ ] History tracking (add, limit to 100)
- [ ] Playback state save/load

### Integration Tests
- [ ] Favorite persists across page reloads
- [ ] History automatically tracked during playback
- [ ] Resume playback offers to continue last track
- [ ] Offline download successfully stores blob

### E2E Tests
- [ ] User adds track to favorites, refreshes page, sees it still favorited
- [ ] User plays 5 tracks, navigates to history, sees all 5 tracks
- [ ] User closes app mid-track, reopens, offered to resume

### Manual Testing Checklist
- [ ] Test favorites on Chrome desktop
- [ ] Test favorites on Safari iOS
- [ ] Test offline download on mobile
- [ ] Test resume playback after closing tab
- [ ] Test with IndexedDB quota exceeded (error handling)

---

## 📊 Success Metrics

### Performance Targets
- IndexedDB operation latency: < 50ms
- Favorites toggle response: < 100ms
- History save frequency: Every 5 seconds

### Storage Limits
- Max favorites: Unlimited (practical limit ~10,000)
- Max history entries: 100
- Max downloads: Based on available storage (warn at 80%)

---

## 📝 Progress Notes

*Progress notes will be added during implementation*

---

## ✨ Completion Checklist

- [ ] All objectives completed
- [ ] All acceptance criteria met
- [ ] Code reviewed
- [ ] Tests written and passing
- [ ] Documentation updated (docs/update/Phase-13.md)
- [ ] Performance targets met
- [ ] Storage quota handling implemented
- [ ] Error handling for IndexedDB failures
- [ ] Git commit created
- [ ] TICKET-013 marked as completed in docs/tickets/README.md

---

## 🔗 References

- Phase Documentation: [docs/update/Phase-10-16-Summary.md](../update/Phase-10-16-Summary.md#phase-13-data-persistence--favorites-1-2-hours)
- idb library: https://github.com/jakearchibald/idb
- IndexedDB API: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- Supabase (optional): https://supabase.com/docs

---

**Last Updated**: 2025-10-25
**Status**: ⚪ Planned - High priority, no blockers, ready to begin
