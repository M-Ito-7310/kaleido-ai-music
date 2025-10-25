'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { MiniPlayer } from './MiniPlayer';
import { AudioPlayer } from '@/lib/audio/player';
import {
  setupMediaSession,
  updatePlaybackState,
  updatePositionState,
  clearMediaSession,
  createArtworkFromUrl,
} from '@/lib/audio/mediaSession';

/**
 * グローバルプレイヤー: アプリ全体で音楽を再生するコンポーネント
 * ミニプレイヤーUIと実際のオーディオ再生を管理
 * MediaSession APIでロックスクリーンコントロールをサポート
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
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // AudioPlayerの初期化とクリーンアップ
  useEffect(() => {
    audioPlayerRef.current = new AudioPlayer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      audioPlayerRef.current?.destroy();
      clearMediaSession();
    };
  }, []);

  // トラック変更時の処理
  useEffect(() => {
    if (!currentTrack || !audioPlayerRef.current) return;

    audioPlayerRef.current.loadTrack(currentTrack.audioUrl).then(() => {
      const trackDuration = audioPlayerRef.current?.getDuration() || 0;
      setDuration(trackDuration);
      setCurrentTime(0);

      if (isPlaying) {
        audioPlayerRef.current?.play();
      }

      // MediaSession APIのセットアップ
      setupMediaSession(
        {
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.category || '',
          artwork: createArtworkFromUrl(currentTrack.imageUrl),
        },
        {
          onPlay: () => {
            if (!isPlaying) {
              togglePlayPause();
            }
          },
          onPause: () => {
            if (isPlaying) {
              togglePlayPause();
            }
          },
          onPreviousTrack: playlist.length > 1 ? playPrevious : undefined,
          onNextTrack: playlist.length > 1 ? playNext : undefined,
          onSeekBackward: () => {
            const newTime = Math.max(0, (audioPlayerRef.current?.getCurrentTime() || 0) - 10);
            audioPlayerRef.current?.seek(newTime);
            setCurrentTime(newTime);
          },
          onSeekForward: () => {
            const newTime = Math.min(duration, (audioPlayerRef.current?.getCurrentTime() || 0) + 10);
            audioPlayerRef.current?.seek(newTime);
            setCurrentTime(newTime);
          },
          onSeekTo: (time: number) => {
            audioPlayerRef.current?.seek(time);
            setCurrentTime(time);
          },
        }
      );
    });
  }, [currentTrack, isPlaying, togglePlayPause, playNext, playPrevious, playlist.length, duration]);

  // 再生状態の変更
  useEffect(() => {
    if (!audioPlayerRef.current) return;

    if (isPlaying) {
      audioPlayerRef.current.play();
      updatePlaybackState('playing');
    } else {
      audioPlayerRef.current.pause();
      updatePlaybackState('paused');
    }
  }, [isPlaying]);

  // 再生位置の更新
  useEffect(() => {
    if (isPlaying && duration > 0) {
      intervalRef.current = setInterval(() => {
        const time = audioPlayerRef.current?.getCurrentTime() || 0;
        setCurrentTime(time);
        updatePositionState(duration, time);

        // トラック終了時の処理
        if (time >= duration) {
          if (playlist.length > 1) {
            playNext();
          } else {
            togglePlayPause();
            setCurrentTime(0);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration, playlist.length, playNext, togglePlayPause]);

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
