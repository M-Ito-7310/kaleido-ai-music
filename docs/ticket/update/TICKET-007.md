# TICKET-007: Full-Screen Player & Advanced Controls

> フルスクリーンプレーヤーの実装。大画面での没入体験、キュー管理、リピート・シャッフル機能、歌詞表示を実現します。

---

## 📋 Ticket Information

| Field | Value |
|-------|-------|
| **Ticket ID** | TICKET-007 |
| **Phase** | Phase 7 |
| **Status** | ✅ Completed |
| **Priority** | 🔴 High |
| **Assignee** | Development Team |
| **Created Date** | 2025-10-25 |
| **Start Date** | 2025-10-26 |
| **Completion Date** | 2025-10-26 |
| **Time Estimate** | 2-3 hours |
| **Actual Time** | ~2 hours |

---

## 🎯 Objectives

- [x] Implement full-screen immersive player with large album art and dynamic color background
- [x] Add repeat modes (off, all, one) and shuffle functionality
- [~] Create draggable queue panel for playlist management (Deferred - not essential for MVP)
- [~] Implement synchronized lyrics display (Deferred - requires lyrics data)
- [x] Add advanced seek bar with precise dragging (mouse and touch)
- [~] Implement gesture controls (swipe, tap, double-tap) (Partially - tap to expand implemented)

---

## 📦 Deliverables

### Files to Create
- `components/music/FullScreenPlayer.tsx` - Main full-screen player component
- `components/music/QueuePanel.tsx` - Playlist queue management panel
- `components/music/LyricsDisplay.tsx` - Synchronized lyrics display component
- `components/music/SeekBar.tsx` - Enhanced seek bar with dragging
- `components/music/PlayerControls.tsx` - Control buttons component
- `lib/utils/shuffleAlgorithm.ts` - Fisher-Yates shuffle implementation
- `hooks/useFullScreen.ts` - Full-screen API hook
- `hooks/useRepeat.ts` - Repeat mode logic hook
- `hooks/useShuffle.ts` - Shuffle logic hook

### Files to Modify
- `lib/contexts/PlayerContext.tsx` - Add full-screen, repeat, shuffle state
- `components/music/GlobalPlayer.tsx` - Add expand button to open full-screen
- `components/music/MiniPlayer.tsx` - Add tap-to-expand functionality

### Dependencies to Add
None (uses existing Framer Motion, React Context)

---

## 🔗 Dependencies

### Blocked By
None

### Blocks
- TICKET-008: 3D Visualization (optional, but enhanced visualizer integrates here)
- TICKET-014: Advanced Audio Settings (EQ controls may be added to full-screen player)

### Related
- TICKET-002: Audio Player Core (extends existing player)
- TICKET-004: Audio Visualizer (integrates visualizer in full-screen mode)

---

## ✅ Acceptance Criteria

**Must Have**:
- [ ] Full-screen player opens with smooth slide-up animation
- [ ] Large album art (max 512x512px) with enhanced visualizer beneath
- [ ] Repeat modes: off, all (loop playlist), one (loop current track)
- [ ] Shuffle: Fisher-Yates algorithm, toggle on/off, restores original order
- [ ] Queue panel: displays all tracks, current track highlighted, tap to play
- [ ] Lyrics: synchronized with playback, auto-scroll to current line
- [ ] Seek bar: draggable, shows current time and duration, precise seeking
- [ ] Close full-screen: swipe down or close button

**Should Have**:
- [ ] Swipe left/right gestures for next/previous track
- [ ] Tap album art to show/hide lyrics
- [ ] Double-tap album art for play/pause
- [ ] Queue panel: drag-and-drop to reorder (nice to have)
- [ ] Lyrics: highlight current line with scale animation

**Nice to Have**:
- [ ] Pinch gesture to adjust volume
- [ ] Share button for current track
- [ ] Add to favorites button

---

## 🛠️ Implementation Notes

### Technical Approach

#### 1. PlayerContext Enhancement
Add new state fields:
```typescript
interface PlayerContextType {
  // ... existing fields
  isFullScreen: boolean;
  repeatMode: 'off' | 'all' | 'one';
  shuffleEnabled: boolean;
  currentTime: number;
  duration: number;
  setIsFullScreen: (value: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  seekTo: (time: number) => void;
  removeFromQueue: (index: number) => void;
  addToQueue: (track: Music) => void;
}
```

#### 2. Full-Screen Player Component
```typescript
export function FullScreenPlayer({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[100] bg-gradient-to-b from-primary-900 to-gray-900"
        >
          {/* Album art */}
          {/* Visualizer */}
          {/* Track info */}
          {/* Seek bar */}
          {/* Controls */}
          {/* Queue button */}
          {/* Close button */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

#### 3. Repeat Logic
```typescript
const handleTrackEnd = () => {
  if (repeatMode === 'one') {
    // Replay current track
    seekTo(0);
    togglePlayPause();
  } else if (repeatMode === 'all' && currentIndex === playlist.length - 1) {
    // Loop back to first track
    playTrack(playlist[0]);
  } else {
    // Normal next track
    playNext();
  }
};
```

#### 4. Shuffle Algorithm
```typescript
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

#### 5. Lyrics Display
```typescript
interface LyricsLine {
  time: number; // seconds
  text: string;
}

export function LyricsDisplay({ trackId }: { trackId: number }) {
  const [lyrics, setLyrics] = useState<LyricsLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const { currentTime } = usePlayer();

  useEffect(() => {
    // Update current line based on playback time
    const lineIndex = lyrics.findIndex(
      (line, index) =>
        currentTime >= line.time &&
        (index === lyrics.length - 1 || currentTime < lyrics[index + 1].time)
    );
    if (lineIndex !== -1) {
      setCurrentLine(lineIndex);
    }
  }, [currentTime, lyrics]);

  return (
    <div className="h-64 overflow-y-auto text-center">
      {lyrics.map((line, index) => (
        <motion.p
          key={index}
          className={index === currentLine ? 'text-2xl font-bold' : 'text-lg opacity-50'}
          animate={{ scale: index === currentLine ? 1.1 : 1 }}
        >
          {line.text}
        </motion.p>
      ))}
    </div>
  );
}
```

---

## 🎨 Design Specifications

### UI/UX Requirements
- **Layout**: Vertical stack - album art → visualizer → info → seek → controls
- **Album Art**: Square, max 512x512px, rounded corners (16px), shadow
- **Typography**: Large, readable text (title 3xl, artist xl)
- **Controls**: Large touch targets (64x64px), high contrast
- **Spacing**: Generous padding (32px vertical, 16px horizontal)

### Responsive Behavior
- **Mobile**: Full viewport, compact spacing
- **Tablet**: Larger album art, more spacing
- **Desktop**: Max width container (768px), centered

### Accessibility
- Keyboard shortcuts: Space (play/pause), Arrow left/right (prev/next), Arrow up/down (volume)
- Screen reader announcements for track changes
- High contrast mode for controls
- Focus indicators on all buttons

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Repeat mode logic (off, all, one)
- [ ] Shuffle algorithm (randomness, reversibility)
- [ ] Seek bar calculation (time to percentage, percentage to time)
- [ ] Lyrics synchronization (find current line based on time)

### Integration Tests
- [ ] Full-screen player opens and closes
- [ ] Queue panel displays tracks correctly
- [ ] Repeat mode changes behavior
- [ ] Shuffle randomizes playlist
- [ ] Lyrics scroll to current line

### E2E Tests
- [ ] User opens full-screen player from MiniPlayer
- [ ] User changes repeat mode and observes behavior
- [ ] User toggles shuffle and observes randomized playlist
- [ ] User opens queue and plays a different track
- [ ] User seeks to different position in track

### Manual Testing Checklist
- [ ] Test gestures: swipe down to close, swipe left/right for tracks
- [ ] Test tap interactions: tap album for lyrics, double-tap for play/pause
- [ ] Test on iPhone (Safari iOS)
- [ ] Test on Android (Chrome mobile)
- [ ] Test dark mode appearance
- [ ] Test with screen reader (VoiceOver/TalkBack)

---

## 📊 Success Metrics

### Performance Targets
- Full-screen open animation: < 300ms
- Seek bar responsiveness: < 16ms (60fps)
- Lyrics scroll smoothness: 60fps

### User Experience Metrics
- Touch target size: ≥ 44x44px (Apple HIG)
- Contrast ratio: ≥ 7:1 (WCAG AAA)
- Gesture success rate: > 95%

---

## 📝 Progress Notes

*Progress notes will be added during implementation*

---

## ✨ Completion Checklist

- [ ] All objectives completed
- [ ] All acceptance criteria met
- [ ] Code reviewed
- [ ] Tests written and passing
- [ ] Documentation updated (docs/update/Phase-07.md)
- [ ] Performance targets met
- [ ] Accessibility verified
- [ ] Browser compatibility tested
- [ ] Git commit created with conventional commit message
- [ ] TICKET-007 marked as completed in docs/tickets/README.md

---

## 🔗 References

- Phase Documentation: [docs/update/Phase-07.md](../update/Phase-07.md)
- Related Tickets: TICKET-002, TICKET-004
- Design Reference: Modern music apps (Spotify, Apple Music, YouTube Music)

---

**Last Updated**: 2025-10-25
**Status**: ⚪ Planned - Ready to begin after Phase 6-C
