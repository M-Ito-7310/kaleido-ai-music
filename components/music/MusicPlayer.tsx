'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { AudioPlayer } from '@/lib/audio/player';
import { formatDuration } from '@/lib/utils';
import { useDynamicColors } from '@/lib/hooks/useDynamicColors';
import { createGradientFromPalette, getContrastColor } from '@/lib/colors/extractColors';

interface MusicPlayerProps {
  audioUrl: string;
  title: string;
  artist: string;
  imageUrl?: string;
}

export function MusicPlayer({ audioUrl, title, artist, imageUrl }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const playerRef = useRef<AudioPlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ダイナミックカラー抽出
  const { colors } = useDynamicColors(imageUrl);

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

  // カラーパレットから背景スタイルとテキストカラーを生成
  const backgroundStyle = colors
    ? { background: createGradientFromPalette(colors), transition: 'background 0.5s ease' }
    : {};
  const textColor = colors ? getContrastColor(colors.dominant) : 'black';
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = textColor === 'white' ? 'text-white/80' : 'text-gray-600';

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg bg-gray-100 dark:bg-gray-800 p-6"
      >
        <p className="text-center text-gray-600 dark:text-gray-400">読み込み中...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg p-6 shadow-lg"
      style={backgroundStyle}
    >
      {/* 曲情報 */}
      <div className="mb-4">
        <h3 className={`text-lg font-semibold ${textColorClass}`}>{title}</h3>
        <p className={`text-sm ${secondaryTextClass}`}>{artist}</p>
      </div>

      {/* シークバー */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: colors?.vibrant || '#0284c7' }}
          aria-label="再生位置"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
        />
        <div className={`flex justify-between text-xs ${secondaryTextClass} mt-1`}>
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex items-center justify-between">
        {/* 再生ボタン */}
        <motion.button
          onClick={togglePlay}
          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all ${textColorClass}`}
          style={{ backgroundColor: colors?.vibrant || '#0284c7' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? '一時停止' : '再生'}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
          )}
        </motion.button>

        {/* ボリュームコントロール */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleMute}
            className={secondaryTextClass}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMuted ? 'ミュート解除' : 'ミュート'}
            aria-pressed={isMuted}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </motion.button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: colors?.vibrant || '#0284c7' }}
            aria-label="ボリューム"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={volume}
          />
        </div>
      </div>
    </motion.div>
  );
}
