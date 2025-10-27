'use client';

import { useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlayer } from '@/lib/contexts/PlayerContext';
import { formatDuration } from '@/lib/utils';
import { useDynamicColors } from '@/lib/hooks/useDynamicColors';
import { createGradientFromPalette, getContrastColor } from '@/lib/colors/extractColors';
import type { Music } from '@/lib/db/schema';

interface MusicPlayerProps {
  audioUrl: string;
  title: string;
  artist: string;
  imageUrl?: string;
  musicData?: Music;
}

export function MusicPlayer({ audioUrl, title, artist, imageUrl, musicData }: MusicPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    togglePlayPause,
    seekTo,
  } = usePlayer();

  // ダイナミックカラー抽出
  const { colors } = useDynamicColors(imageUrl);

  // このプレイヤーの楽曲が現在再生中かどうか
  const isCurrentTrack = currentTrack?.audioUrl === audioUrl;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handleTogglePlay = () => {
    if (isCurrentTrack) {
      // 既にこの曲が再生中なら、再生/一時停止をトグル
      togglePlayPause();
    } else {
      // 別の曲が再生中、またはプレイヤーが停止中なら、この曲を再生
      if (musicData) {
        playTrack(musicData);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seekTo(time);
  };

  // カラーパレットから背景スタイルとテキストカラーを生成
  const backgroundStyle = colors
    ? { background: createGradientFromPalette(colors), transition: 'background 0.5s ease' }
    : {};
  const textColor = colors ? getContrastColor(colors.dominant) : 'black';
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = textColor === 'white' ? 'text-white/80' : 'text-gray-600';

  // 表示する時間とdurationを決定
  const displayTime = isCurrentTrack ? currentTime : 0;
  const displayDuration = isCurrentTrack ? duration : 0;

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
          max={displayDuration || 100}
          step="0.1"
          value={displayTime}
          onChange={handleSeek}
          disabled={!isCurrentTrack}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          style={{ accentColor: colors?.vibrant || '#0284c7' }}
          aria-label="再生位置"
          aria-valuemin={0}
          aria-valuemax={displayDuration}
          aria-valuenow={displayTime}
        />
        <div className={`flex justify-between text-xs ${secondaryTextClass} mt-1`}>
          <span>{formatDuration(displayTime)}</span>
          <span>{formatDuration(displayDuration)}</span>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex items-center justify-center">
        {/* 再生ボタン */}
        <motion.button
          onClick={handleTogglePlay}
          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all ${textColorClass}`}
          style={{ backgroundColor: colors?.vibrant || '#0284c7' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isThisPlaying ? '一時停止' : '再生'}
          aria-pressed={isThisPlaying}
        >
          {isThisPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
