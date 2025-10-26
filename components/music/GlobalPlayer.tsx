'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { MiniPlayer } from './MiniPlayer';
import { FullScreenPlayer } from './FullScreenPlayer';
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
    setCurrentTime,
    setDuration,
    setIsFullScreen,
    repeatMode,
  } = usePlayer();

  const audioPlayerRef = useRef<AudioPlayer | null>(null);
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
            const currentDuration = audioPlayerRef.current?.getDuration() || 0;
            const newTime = Math.min(currentDuration, (audioPlayerRef.current?.getCurrentTime() || 0) + 10);
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
  }, [currentTrack, isPlaying, togglePlayPause, playNext, playPrevious, playlist.length, setCurrentTime, setDuration]);

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
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const time = audioPlayerRef.current?.getCurrentTime() || 0;
        const currentDuration = audioPlayerRef.current?.getDuration() || 0;
        setCurrentTime(time);
        updatePositionState(currentDuration, time);

        // トラック終了時の処理
        if (time >= currentDuration && currentDuration > 0) {
          if (repeatMode === 'one') {
            // リピート1: 現在のトラックを再生
            audioPlayerRef.current?.seek(0);
            setCurrentTime(0);
          } else if (playlist.length > 1) {
            playNext();
          } else if (repeatMode === 'all') {
            // リピートオールだがプレイリストが1曲の場合、最初に戻る
            audioPlayerRef.current?.seek(0);
            setCurrentTime(0);
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
  }, [isPlaying, playlist.length, playNext, togglePlayPause, setCurrentTime, repeatMode]);

  const handleExpand = () => {
    setIsFullScreen(true);
  };

  if (!currentTrack) return null;

  return (
    <>
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
          onExpand={handleExpand}
        />
      </AnimatePresence>

      <FullScreenPlayer />
    </>
  );
}
