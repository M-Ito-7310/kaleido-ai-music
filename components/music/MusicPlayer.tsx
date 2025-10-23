'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { AudioPlayer } from '@/lib/audio/player';
import { formatDuration } from '@/lib/utils';

interface MusicPlayerProps {
  audioUrl: string;
  title: string;
  artist: string;
}

export function MusicPlayer({ audioUrl, title, artist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const playerRef = useRef<AudioPlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // プレイヤー初期化
  useEffect(() => {
    playerRef.current = new AudioPlayer();

    playerRef.current.loadTrack(audioUrl).then(() => {
      setDuration(playerRef.current!.getDuration());
      setIsLoading(false);
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      playerRef.current?.destroy();
    };
  }, [audioUrl]);

  // 再生時間の更新
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const time = playerRef.current?.getCurrentTime() || 0;
        setCurrentTime(time);

        if (time >= duration) {
          setIsPlaying(false);
          setCurrentTime(0);
          playerRef.current?.stop();
        }
      }, 100);
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
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current?.seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    playerRef.current?.setVolume(vol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.8);
      playerRef.current?.setVolume(0.8);
    } else {
      setVolume(0);
      playerRef.current?.setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-gray-100 p-6">
        <p className="text-center text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gradient-to-br from-primary-50 to-accent-light/20 p-6">
      {/* 曲情報 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{artist}</p>
      </div>

      {/* シークバー */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex items-center justify-between">
        {/* 再生ボタン */}
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-500 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* ボリュームコントロール */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-gray-600 hover:text-gray-900">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
      </div>
    </div>
  );
}
