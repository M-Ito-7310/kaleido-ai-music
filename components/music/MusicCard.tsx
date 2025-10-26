'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import type { Music } from '@/lib/db/schema';
import { formatDuration } from '@/lib/utils';
import { PlayButton } from './PlayButton';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

interface MusicCardProps {
  music: Music;
  index?: number;
  playlist?: Music[];
}

export function MusicCard({ music, index = 0, playlist }: MusicCardProps) {
  return (
    <Link href={`/music/${music.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600"
      >
        {/* サムネイル */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={music.imageUrl}
            alt={music.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {/* 再生オーバーレイ */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
            <div className="scale-0 transition-transform group-hover:scale-100">
              <PlayButton music={music} playlist={playlist} />
            </div>
          </div>
          {/* カテゴリバッジ */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-gray-800/90 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 backdrop-blur-sm">
              {music.category}
            </span>
          </div>
          {/* お気に入りボタン */}
          <div className="absolute top-2 right-2">
            <FavoriteButton trackId={music.id} size="sm" />
          </div>
        </div>

        {/* 情報 */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {music.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{music.artist}</p>

          {/* メタデータ */}
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDuration(music.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{(music.playCount || 0).toLocaleString()} 再生</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
