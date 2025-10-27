'use client';

import { MusicCard } from './MusicCard';
import type { Music } from '@/lib/db/schema';

interface MusicGridProps {
  musicList: Music[];
}

export function MusicGrid({ musicList }: MusicGridProps) {
  if (musicList.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {musicList.map((music, index) => (
        <MusicCard key={music.id} music={music} index={index} playlist={musicList} />
      ))}
    </div>
  );
}
