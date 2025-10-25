# Phase 7: Full-Screen Player & Advanced Controls

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 2-3 hours

## Overview
フルスクリーンプレーヤーの実装。大画面での没入体験、キュー管理、リピート・シャッフル機能、歌詞表示を実現します。

## Technologies to Use
- Framer Motion (full-screen transitions)
- React Context (player state expansion)
- Canvas API (enhanced visualizer)
- Web Lyrics API (歌詞取得)

## Files to Create/Modify

### Create
1. **components/music/FullScreenPlayer.tsx** - Full-screen player component
2. **components/music/QueuePanel.tsx** - Playlist queue management
3. **components/music/LyricsDisplay.tsx** - Synchronized lyrics display
4. **lib/contexts/PlayerContext.tsx** - Add full-screen state
5. **hooks/useFullScreen.ts** - Full-screen API hook
6. **lib/utils/shuffleAlgorithm.ts** - Fisher-Yates shuffle implementation

### Modify
- components/music/GlobalPlayer.tsx - Add expand button
- components/music/MiniPlayer.tsx - Tap to expand functionality
- lib/contexts/PlayerContext.tsx - Add repeat/shuffle state

## Key Features to Implement

### 1. Full-Screen Player UI

#### Component Structure
```typescript
interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullScreenPlayer({ isOpen, onClose }: FullScreenPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    playlist,
    currentIndex,
    repeatMode,
    shuffleEnabled,
    togglePlayPause,
    playNext,
    playPrevious,
    setRepeatMode,
    toggleShuffle,
  } = usePlayer();

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
          {/* Large album art */}
          <div className="relative w-full aspect-square max-w-md mx-auto mt-16">
            <Image
              src={currentTrack.imageUrl}
              alt={currentTrack.title}
              fill
              className="rounded-2xl shadow-2xl"
            />
          </div>

          {/* Enhanced visualizer */}
          <AudioVisualizer mode="circular" size="large" />

          {/* Track info */}
          <div className="text-center px-8 mt-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentTrack.title}
            </h1>
            <p className="text-xl text-gray-300">
              {currentTrack.artist}
            </p>
          </div>

          {/* Progress bar */}
          <SeekBar />

          {/* Control buttons */}
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onNext={playNext}
            onPrevious={playPrevious}
            repeatMode={repeatMode}
            onRepeatChange={setRepeatMode}
            shuffleEnabled={shuffleEnabled}
            onShuffleToggle={toggleShuffle}
          />

          {/* Queue button */}
          <button onClick={() => setShowQueue(true)}>
            Queue ({playlist.length})
          </button>

          {/* Close button */}
          <button onClick={onClose}>
            <ChevronDown />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 2. Repeat Modes

```typescript
type RepeatMode = 'off' | 'all' | 'one';

const useRepeat = () => {
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const shouldRepeat = (isLastTrack: boolean) => {
    if (repeatMode === 'one') return true;
    if (repeatMode === 'all' && isLastTrack) return true;
    return false;
  };

  return { repeatMode, cycleRepeatMode, shouldRepeat };
};
```

### 3. Shuffle Implementation

```typescript
// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const useShuffle = (playlist: Music[]) => {
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [originalPlaylist, setOriginalPlaylist] = useState<Music[]>([]);
  const [shuffledPlaylist, setShuffledPlaylist] = useState<Music[]>([]);

  const toggleShuffle = () => {
    if (!shuffleEnabled) {
      // Enable shuffle
      setOriginalPlaylist(playlist);
      setShuffledPlaylist(shuffleArray(playlist));
    } else {
      // Disable shuffle - restore original order
      setShuffledPlaylist([]);
    }
    setShuffleEnabled(!shuffleEnabled);
  };

  const activePlaylist = shuffleEnabled ? shuffledPlaylist : playlist;

  return { shuffleEnabled, toggleShuffle, activePlaylist };
};
```

### 4. Queue Panel

```typescript
export function QueuePanel({ isOpen, onClose }: QueuePanelProps) {
  const { playlist, currentIndex, playTrack, removeFromQueue } = usePlayer();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[110]"
        >
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold">Queue</h2>
            <p className="text-sm text-gray-500">
              {playlist.length} tracks
            </p>
          </div>

          <div className="overflow-y-auto h-full pb-32">
            {playlist.map((track, index) => (
              <QueueItem
                key={track.id}
                track={track}
                index={index}
                isPlaying={index === currentIndex}
                onPlay={() => playTrack(track)}
                onRemove={() => removeFromQueue(index)}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 5. Synchronized Lyrics Display

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
    // Fetch lyrics
    fetchLyrics(trackId).then(setLyrics);
  }, [trackId]);

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
          className={`py-2 transition-all ${
            index === currentLine
              ? 'text-2xl font-bold text-white'
              : 'text-lg text-gray-400'
          }`}
          animate={{
            scale: index === currentLine ? 1.1 : 1,
            opacity: index === currentLine ? 1 : 0.5,
          }}
        >
          {line.text}
        </motion.p>
      ))}
    </div>
  );
}
```

### 6. Enhanced Seek Bar

```typescript
export function SeekBar() {
  const { currentTime, duration, seekTo } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [tempTime, setTempTime] = useState(0);

  const displayTime = isDragging ? tempTime : currentTime;
  const progress = (displayTime / duration) * 100;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    seekTo(time);
  };

  return (
    <div className="px-8">
      <div
        className="relative h-2 bg-gray-700 rounded-full cursor-pointer"
        onClick={handleSeek}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <motion.div
          className="absolute h-full bg-gradient-to-r from-primary-500 to-accent-DEFAULT rounded-full"
          style={{ width: `${progress}%` }}
        />
        <motion.div
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
          style={{ left: `${progress}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-400 mt-2">
        <span>{formatTime(displayTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
```

## Technical Implementation

### Player Context Enhancement
```typescript
interface PlayerContextType {
  // ... existing fields
  isFullScreen: boolean;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  setIsFullScreen: (value: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  removeFromQueue: (index: number) => void;
  addToQueue: (track: Music) => void;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
}
```

### Full-Screen API Hook
```typescript
export function useFullScreen() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullScreen = async () => {
    try {
      await document.exitFullscreen();
      setIsFullScreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return { isFullScreen, enterFullScreen, exitFullScreen };
}
```

## Design Specifications

### Full-Screen Layout
- **Album Art**: Square, max 512x512px, centered
- **Visualizer**: Circular mode, beneath album art
- **Controls**: Large touch targets (64x64px minimum)
- **Typography**: Large, readable from distance
- **Spacing**: Generous padding for comfortable viewing

### Gestures
- **Swipe down**: Close full-screen player
- **Swipe left/right**: Next/previous track
- **Tap album art**: Show/hide lyrics
- **Double-tap**: Play/pause
- **Pinch**: Adjust volume (future)

### Animations
- **Open**: Slide up with spring animation
- **Close**: Slide down with ease-out
- **Track change**: Crossfade album art
- **Lyrics**: Auto-scroll with smooth animation

## Accessibility

- Full keyboard navigation
- Screen reader announcements for track changes
- High contrast mode for lyrics
- Focus indicators on all controls
- ARIA labels for all buttons

## Performance

- Lazy load lyrics data
- Optimize album art for large display
- Throttle seek bar updates
- GPU-accelerated animations

## Browser Compatibility

- Full-screen API: Chrome 71+, Safari 16+, Firefox 64+
- Fallback: Modal-style overlay for unsupported browsers

## Dependencies (No new dependencies required)

## Next Steps
➡️ Phase 8: 3D Audio Visualization

## Notes
- フルスクリーンで没入体験を提供
- リピート・シャッフルで柔軟な再生制御
- キュー管理で次に聴く曲を簡単に調整
- 歌詞表示で歌詞を楽しめる
- ジェスチャー操作でモバイル最適化
