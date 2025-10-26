'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { announce } from '@/lib/accessibility/screenReaderAnnouncer';

/**
 * Voice Commands Hook
 *
 * Uses Web Speech API for voice control
 *
 * Supported commands:
 * - "play" / "pause" / "stop"
 * - "next" / "next song" / "next track"
 * - "previous" / "previous song" / "previous track"
 * - "shuffle on" / "shuffle off"
 * - "repeat off" / "repeat all" / "repeat one"
 * - "full screen" / "exit full screen"
 */

interface VoiceCommandsOptions {
  enabled?: boolean;
  language?: string;
}

export function useVoiceCommands({ enabled = false, language = 'en-US' }: VoiceCommandsOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');

  const {
    togglePlayPause,
    playNext,
    playPrevious,
    setRepeatMode,
    toggleShuffle,
    setIsFullScreen,
    isPlaying,
  } = usePlayer();

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const processCommand = useCallback(
    (command: string) => {
      const lowerCommand = command.toLowerCase().trim();
      setLastCommand(lowerCommand);

      // Play/Pause/Stop commands
      if (lowerCommand.includes('play') && !isPlaying) {
        togglePlayPause();
        announce('Playing', 'polite');
        return;
      }

      if (lowerCommand.includes('pause') || lowerCommand.includes('stop')) {
        if (isPlaying) {
          togglePlayPause();
          announce('Paused', 'polite');
        }
        return;
      }

      // Next track
      if (lowerCommand.includes('next')) {
        playNext();
        announce('Next track', 'polite');
        return;
      }

      // Previous track
      if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
        playPrevious();
        announce('Previous track', 'polite');
        return;
      }

      // Shuffle
      if (lowerCommand.includes('shuffle on')) {
        toggleShuffle();
        announce('Shuffle enabled', 'polite');
        return;
      }

      if (lowerCommand.includes('shuffle off')) {
        toggleShuffle();
        announce('Shuffle disabled', 'polite');
        return;
      }

      // Repeat modes
      if (lowerCommand.includes('repeat off')) {
        setRepeatMode('off');
        announce('Repeat off', 'polite');
        return;
      }

      if (lowerCommand.includes('repeat all')) {
        setRepeatMode('all');
        announce('Repeat all', 'polite');
        return;
      }

      if (lowerCommand.includes('repeat one') || lowerCommand.includes('repeat current')) {
        setRepeatMode('one');
        announce('Repeat one', 'polite');
        return;
      }

      // Full screen
      if (lowerCommand.includes('full screen') || lowerCommand.includes('fullscreen')) {
        setIsFullScreen(true);
        announce('Entering full screen', 'polite');
        return;
      }

      if (lowerCommand.includes('exit full screen')) {
        setIsFullScreen(false);
        announce('Exiting full screen', 'polite');
        return;
      }

      // Command not recognized
      announce('Command not recognized', 'polite');
    },
    [
      togglePlayPause,
      playNext,
      playPrevious,
      setRepeatMode,
      toggleShuffle,
      setIsFullScreen,
      isPlaying,
    ]
  );

  useEffect(() => {
    if (!isSupported || !enabled) return;

    // @ts-expect-error - webkit prefix not in standard types
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      announce('Voice control activated', 'polite');
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if still enabled
      if (enabled) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to restart speech recognition:', error);
        }
      }
    };

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript;
      processCommand(command);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        announce('Microphone access denied', 'assertive');
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }

    return () => {
      recognition.stop();
    };
  }, [isSupported, enabled, language, processCommand]);

  return {
    isSupported,
    isListening,
    lastCommand,
  };
}
