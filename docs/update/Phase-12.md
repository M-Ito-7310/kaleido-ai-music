# Phase 12: Accessibility & Voice Control

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 2-3 hours

## Overview
完全なアクセシビリティ対応と音声制御の実装。スクリーンリーダー完全対応、キーボードナビゲーション、Web Speech APIによるハンズフリー操作、高コントラストモード、フォントサイズ調整により、すべてのユーザーが快適に利用できるプラットフォームを実現します。

## Technologies to Use
- Web Speech API (Speech Recognition, Speech Synthesis)
- ARIA attributes (Accessibility)
- CSS custom properties (User preferences)
- Focus management (React refs)
- Keyboard event handling

## Dependencies to Add

No new dependencies required (uses Web APIs)

## Files to Create

1. **components/accessibility/VoiceControl.tsx** - Voice command interface
2. **components/accessibility/AccessibilityPanel.tsx** - Accessibility settings
3. **components/accessibility/ScreenReaderAnnouncer.tsx** - Live region announcements
4. **components/accessibility/SkipToContent.tsx** - Skip navigation link
5. **components/accessibility/FocusIndicator.tsx** - Enhanced focus styles
6. **hooks/useVoiceCommands.ts** - Voice recognition hook
7. **hooks/useKeyboardShortcuts.ts** - Keyboard shortcuts hook
8. **lib/accessibility/screenReaderAnnouncer.ts** - Announcement utilities
9. **lib/accessibility/focusManagement.ts** - Focus trap and restoration
10. **styles/accessibility.css** - High contrast, font scaling, reduced motion

## Key Features to Implement

### 1. Voice Control with Web Speech API

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { usePlayer } from '@/lib/contexts/PlayerContext';

export function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { playTrack, togglePlayPause, playNext, playPrevious, setVolume } = usePlayer();

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    setSupported(true);

    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP'; // or 'en-US'

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.toLowerCase();

      setTranscript(transcript);

      if (result.isFinal) {
        handleCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const handleCommand = (command: string) => {
    // Play commands
    if (command.includes('play') || command.includes('再生')) {
      togglePlayPause();
      speak('Playing');
    }

    // Pause commands
    else if (command.includes('pause') || command.includes('一時停止')) {
      togglePlayPause();
      speak('Paused');
    }

    // Next track
    else if (command.includes('next') || command.includes('次')) {
      playNext();
      speak('Next track');
    }

    // Previous track
    else if (command.includes('previous') || command.includes('前')) {
      playPrevious();
      speak('Previous track');
    }

    // Volume up
    else if (command.includes('volume up') || command.includes('音量上げて')) {
      setVolume((prev) => Math.min(1, prev + 0.1));
      speak('Volume up');
    }

    // Volume down
    else if (command.includes('volume down') || command.includes('音量下げて')) {
      setVolume((prev) => Math.max(0, prev - 0.1));
      speak('Volume down');
    }

    // Play specific track (requires search)
    else if (command.includes('play') || command.includes('再生して')) {
      const trackName = command.replace(/play|再生して/g, '').trim();
      if (trackName) {
        searchAndPlay(trackName);
      }
    }

    // Help
    else if (command.includes('help') || command.includes('ヘルプ')) {
      speak(
        'You can say: play, pause, next, previous, volume up, volume down, or play followed by a track name'
      );
    }

    // Unknown command
    else {
      speak('Command not recognized. Say "help" for available commands.');
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const searchAndPlay = async (query: string) => {
    // Search tracks and play first result
    // Implementation depends on your search system
    speak(`Searching for ${query}`);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!supported) {
    return (
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Voice control is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={toggleListening}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <>
            <MicOff className="w-6 h-6" />
            Listening...
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            Start Voice Control
          </>
        )}
      </button>

      {/* Transcript */}
      {transcript && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            You said:
          </p>
          <p className="text-lg">{transcript}</p>
        </div>
      )}

      {/* Available commands */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Available Commands:</h3>
        <ul className="text-sm space-y-1">
          <li>• "Play" or "Pause"</li>
          <li>• "Next track" or "Previous track"</li>
          <li>• "Volume up" or "Volume down"</li>
          <li>• "Play [track name]"</li>
          <li>• "Show queue" or "Hide queue"</li>
          <li>• "Help" for more commands</li>
        </ul>
      </div>
    </div>
  );
}
```

### 2. Accessibility Panel

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

export function AccessibilityPanel() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    applySettings();
  }, [settings]);

  const loadSettings = () => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const applySettings = () => {
    const root = document.documentElement;

    // Font size
    const fontSizes = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
      xlarge: '1.25rem',
    };
    root.style.fontSize = fontSizes[settings.fontSize];

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Screen reader mode
    if (settings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Accessibility Settings
      </h2>

      {/* Font Size */}
      <div>
        <label className="block font-semibold mb-2">Text Size</label>
        <div className="flex gap-2">
          {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
            <button
              key={size}
              onClick={() => saveSettings({ ...settings, fontSize: size })}
              className={`px-4 py-2 rounded-lg capitalize ${
                settings.fontSize === size
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* High Contrast */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">High Contrast Mode</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Increase contrast for better visibility
          </p>
        </div>
        <button
          onClick={() => saveSettings({ ...settings, highContrast: !settings.highContrast })}
          className={`w-14 h-8 rounded-full transition-colors ${
            settings.highContrast ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label="Toggle high contrast mode"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-transform ${
              settings.highContrast ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Reduced Motion */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Reduce Motion</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Minimize animations and transitions
          </p>
        </div>
        <button
          onClick={() => saveSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
          className={`w-14 h-8 rounded-full transition-colors ${
            settings.reducedMotion ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label="Toggle reduced motion"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-transform ${
              settings.reducedMotion ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Screen Reader Mode */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Screen Reader Optimizations</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enhanced experience for screen readers
          </p>
        </div>
        <button
          onClick={() =>
            saveSettings({ ...settings, screenReaderMode: !settings.screenReaderMode })
          }
          className={`w-14 h-8 rounded-full transition-colors ${
            settings.screenReaderMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label="Toggle screen reader mode"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-transform ${
              settings.screenReaderMode ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Keyboard Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Enhanced Keyboard Navigation</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visible focus indicators and shortcuts
          </p>
        </div>
        <button
          onClick={() =>
            saveSettings({ ...settings, keyboardNavigation: !settings.keyboardNavigation })
          }
          className={`w-14 h-8 rounded-full transition-colors ${
            settings.keyboardNavigation ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label="Toggle keyboard navigation"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-transform ${
              settings.keyboardNavigation ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
```

### 3. Screen Reader Announcer

```typescript
// lib/accessibility/screenReaderAnnouncer.ts

let announcerElement: HTMLDivElement | null = null;

export function initAnnouncer() {
  if (announcerElement) return;

  announcerElement = document.createElement('div');
  announcerElement.setAttribute('role', 'status');
  announcerElement.setAttribute('aria-live', 'polite');
  announcerElement.setAttribute('aria-atomic', 'true');
  announcerElement.className = 'sr-only';
  document.body.appendChild(announcerElement);
}

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (!announcerElement) {
    initAnnouncer();
  }

  if (announcerElement) {
    announcerElement.setAttribute('aria-live', priority);
    announcerElement.textContent = '';

    // Force re-announcement
    setTimeout(() => {
      if (announcerElement) {
        announcerElement.textContent = message;
      }
    }, 100);
  }
}

// Usage examples
export const announcements = {
  trackChanged: (title: string, artist: string) =>
    announce(`Now playing: ${title} by ${artist}`),

  playbackStateChanged: (isPlaying: boolean) =>
    announce(isPlaying ? 'Playing' : 'Paused'),

  volumeChanged: (volume: number) =>
    announce(`Volume ${Math.round(volume * 100)} percent`),

  trackAdded: (title: string) =>
    announce(`${title} added to queue`),

  favoriteToggled: (title: string, isFavorite: boolean) =>
    announce(`${title} ${isFavorite ? 'added to' : 'removed from'} favorites`),
};
```

### 4. Keyboard Shortcuts Hook

```typescript
// hooks/useKeyboardShortcuts.ts

import { useEffect } from 'react';
import { usePlayer } from '@/lib/contexts/PlayerContext';

export function useKeyboardShortcuts() {
  const { togglePlayPause, playNext, playPrevious, setVolume } = usePlayer();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Space: Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }

      // Arrow Right: Next track
      else if (e.code === 'ArrowRight' && e.shiftKey) {
        e.preventDefault();
        playNext();
      }

      // Arrow Left: Previous track
      else if (e.code === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        playPrevious();
      }

      // Arrow Up: Volume up
      else if (e.code === 'ArrowUp' && e.shiftKey) {
        e.preventDefault();
        setVolume((prev) => Math.min(1, prev + 0.1));
      }

      // Arrow Down: Volume down
      else if (e.code === 'ArrowDown' && e.shiftKey) {
        e.preventDefault();
        setVolume((prev) => Math.max(0, prev - 0.1));
      }

      // M: Mute/Unmute
      else if (e.code === 'KeyM') {
        e.preventDefault();
        setVolume((prev) => (prev > 0 ? 0 : 0.5));
      }

      // F: Toggle full-screen
      else if (e.code === 'KeyF') {
        e.preventDefault();
        // Toggle full-screen player
      }

      // Q: Toggle queue
      else if (e.code === 'KeyQ') {
        e.preventDefault();
        // Toggle queue panel
      }

      // L: Toggle favorites
      else if (e.code === 'KeyL') {
        e.preventDefault();
        // Toggle favorite for current track
      }

      // ?: Show keyboard shortcuts help
      else if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        // Show shortcuts modal
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [togglePlayPause, playNext, playPrevious, setVolume]);
}

// Keyboard shortcuts reference
export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
  { key: 'Shift + →', action: 'Next track' },
  { key: 'Shift + ←', action: 'Previous track' },
  { key: 'Shift + ↑', action: 'Volume up' },
  { key: 'Shift + ↓', action: 'Volume down' },
  { key: 'M', action: 'Mute / Unmute' },
  { key: 'F', action: 'Full-screen player' },
  { key: 'Q', action: 'Toggle queue' },
  { key: 'L', action: 'Like current track' },
  { key: 'Shift + ?', action: 'Show shortcuts' },
];
```

### 5. Accessibility CSS

```css
/* styles/accessibility.css */

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* High contrast mode */
.high-contrast {
  --contrast-multiplier: 1.5;
}

.high-contrast * {
  filter: contrast(var(--contrast-multiplier));
}

.high-contrast a {
  text-decoration: underline;
}

.high-contrast button {
  border: 2px solid currentColor;
}

/* Reduced motion */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus visible (keyboard navigation) */
:focus-visible {
  outline: 3px solid var(--color-primary-600);
  outline-offset: 2px;
}

/* Enhanced focus for keyboard navigation mode */
.keyboard-navigation-enabled *:focus {
  outline: 3px solid var(--color-primary-600);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.2);
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 9999;
  padding: 1rem 2rem;
  background: var(--color-primary-600);
  color: white;
  font-weight: 600;
  transition: top 0.2s;
}

.skip-to-content:focus {
  top: 0;
}

/* Large text mode */
html[style*="font-size: 1.125rem"] {
  /* Adjust layouts for larger text */
}

html[style*="font-size: 1.25rem"] {
  /* Further layout adjustments */
}
```

## ARIA Best Practices

```typescript
// Example: Accessible Music Card
export function AccessibleMusicCard({ track }: { track: Music }) {
  return (
    <article
      className="music-card"
      aria-labelledby={`track-${track.id}-title`}
      aria-describedby={`track-${track.id}-artist`}
    >
      <img
        src={track.imageUrl}
        alt={`Album art for ${track.title}`}
        role="img"
      />

      <h3 id={`track-${track.id}-title`}>{track.title}</h3>
      <p id={`track-${track.id}-artist`}>{track.artist}</p>

      <button
        onClick={() => playTrack(track)}
        aria-label={`Play ${track.title} by ${track.artist}`}
      >
        <Play aria-hidden="true" />
        <span className="sr-only">Play</span>
      </button>

      <button
        onClick={() => toggleFavorite(track.id)}
        aria-label={`Add ${track.title} to favorites`}
        aria-pressed={isFavorite}
      >
        <Heart aria-hidden="true" />
      </button>
    </article>
  );
}
```

## Testing

### Manual Testing
- [ ] VoiceOver (macOS/iOS)
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] TalkBack (Android)
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] 200% zoom level

### Automated Testing
```bash
npm install --save-dev @axe-core/react
npm install --save-dev jest-axe
```

## Accessibility Checklist
- [ ] All images have alt text
- [ ] All interactive elements are keyboard accessible
- [ ] All form inputs have labels
- [ ] Color contrast meets WCAG AAA (7:1)
- [ ] Focus indicators are visible
- [ ] ARIA landmarks used correctly
- [ ] Live regions for dynamic content
- [ ] Skip to content link
- [ ] Keyboard shortcuts documented
- [ ] Voice control available

## Next Steps
➡️ Phase 13: Data Persistence & Favorites

## Notes
- Web Speech APIで音声制御を実現
- WCAG AAA準拠を目指す（コントラスト比7:1以上）
- スクリーンリーダー完全対応
- キーボードショートカット充実
- 高コントラストモード対応
- モーション削減対応
- フォントサイズ調整機能
