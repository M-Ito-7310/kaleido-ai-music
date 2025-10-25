'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { MiniPlayer } from './MiniPlayer';
import { AudioPlayer } from '@/lib/audio/player';

/**
 * グローバルプレイヤー: アプリ全体で音楽を再生するコンポーネント
 * ミニプレイヤーUIと実際のオーディオ再生を管理
 */
export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    clearPlayer,
    playlist,
  } = usePlayer();

  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  // AudioPlayerの初期化とクリーンアップ
  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer();

    return () => {
      audioPlayerRef.current?.destroy();
    };
  }, []);

  // トラック変更時の処理
  useEffect(() => {
    if (!currentTrack || !audioPlayerRef.current) return;

    audioPlayerRef.current.loadTrack(currentTrack.audioUrl).then(() => {
      if (isPlaying) {
        audioPlayerRef.current?.play();
      }
    });
  }, [currentTrack]);

  // 再生状態の変更
  useEffect(() => {
    if (!audioPlayerRef.current) return;

    if (isPlaying) {
      audioPlayerRef.current.play();
    } else {
      audioPlayerRef.current.pause();
    }
  }, [isPlaying]);

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <MiniPlayer
        track={{
          id: currentTrack.id,
          title: currentTrack.title,
          artist: currentTrack.artist,
          imageUrl: currentTrack.imageUrl,
          audioUrl: currentTrack.audioUrl,
        }}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={playlist.length > 1 ? playNext : undefined}
        onPrevious={playlist.length > 1 ? playPrevious : undefined}
        onClose={clearPlayer}
      />
    </AnimatePresence>
  );
}
