'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Music } from '@/lib/db/schema';

interface PlayerContextType {
  currentTrack: Music | null;
  isPlaying: boolean;
  playlist: Music[];
  currentIndex: number;
  playTrack: (track: Music, playlist?: Music[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayer: () => void;
  setPlaylist: (tracks: Music[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylistState] = useState<Music[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playTrack = useCallback((track: Music, newPlaylist?: Music[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);

    if (newPlaylist) {
      setPlaylistState(newPlaylist);
      const index = newPlaylist.findIndex((t) => t.id === track.id);
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  }, [playlist, currentIndex]);

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
    setCurrentIndex(0);
  }, []);

  const setPlaylist = useCallback((tracks: Music[]) => {
    setPlaylistState(tracks);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playlist,
        currentIndex,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        clearPlayer,
        setPlaylist,
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
