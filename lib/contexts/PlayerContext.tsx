'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Music } from '@/lib/db/schema';
import { addToHistory } from '@/lib/db/indexedDB';
import { shuffleArray } from '@/lib/utils/shuffleAlgorithm';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerContextType {
  currentTrack: Music | null;
  isPlaying: boolean;
  playlist: Music[];
  originalPlaylist: Music[];
  currentIndex: number;
  currentTime: number;
  duration: number;
  isFullScreen: boolean;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  playTrack: (track: Music, playlist?: Music[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayer: () => void;
  setPlaylist: (tracks: Music[]) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsFullScreen: (value: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  seekTo: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylistState] = useState<Music[]>([]);
  const [originalPlaylist, setOriginalPlaylist] = useState<Music[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);

  // Track play in history when a new track starts
  useEffect(() => {
    if (currentTrack) {
      addToHistory(currentTrack.id).catch((error) => {
        console.error('Failed to add to history:', error);
      });
    }
  }, [currentTrack?.id]);

  const playTrack = useCallback((track: Music, newPlaylist?: Music[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);

    if (newPlaylist) {
      setPlaylistState(newPlaylist);
      setOriginalPlaylist(newPlaylist);
      const index = newPlaylist.findIndex((t) => t.id === track.id);
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex: number;

    if (repeatMode === 'one') {
      // Repeat current track
      nextIndex = currentIndex;
    } else if (currentIndex === playlist.length - 1) {
      // At end of playlist
      if (repeatMode === 'all') {
        nextIndex = 0; // Loop to start
      } else {
        return; // Stop at end
      }
    } else {
      nextIndex = currentIndex + 1;
    }

    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  }, [playlist, currentIndex, repeatMode]);

  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;

    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  }, [playlist, currentIndex]);

  const clearPlayer = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setPlaylistState([]);
    setOriginalPlaylist([]);
    setCurrentIndex(0);
  }, []);

  const setPlaylist = useCallback((tracks: Music[]) => {
    setPlaylistState(tracks);
    if (!shuffleEnabled) {
      setOriginalPlaylist(tracks);
    }
  }, [shuffleEnabled]);

  const toggleShuffle = useCallback(() => {
    setShuffleEnabled((prev) => {
      const newShuffleState = !prev;

      if (newShuffleState) {
        // Enable shuffle: save original, shuffle playlist
        setOriginalPlaylist(playlist);
        const shuffled = shuffleArray(playlist);
        setPlaylistState(shuffled);

        // Find current track in shuffled playlist and update index
        // Note: Don't update currentTrack to avoid triggering track reload
        if (currentTrack) {
          const newIndex = shuffled.findIndex((t) => t.id === currentTrack.id);
          if (newIndex !== -1) {
            setCurrentIndex(newIndex);
          }
        }
      } else {
        // Disable shuffle: restore original order
        setPlaylistState(originalPlaylist);

        // Find current track in original playlist and update index
        // Note: Don't update currentTrack to avoid triggering track reload
        if (currentTrack) {
          const newIndex = originalPlaylist.findIndex((t) => t.id === currentTrack.id);
          if (newIndex !== -1) {
            setCurrentIndex(newIndex);
          }
        }
      }

      return newShuffleState;
    });
  }, [playlist, originalPlaylist, currentTrack]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playlist,
        originalPlaylist,
        currentIndex,
        currentTime,
        duration,
        isFullScreen,
        repeatMode,
        shuffleEnabled,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        clearPlayer,
        setPlaylist,
        setCurrentTime,
        setDuration,
        setIsFullScreen,
        setRepeatMode,
        toggleShuffle,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
