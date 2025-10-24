import { TrendingUp, Download, Music, Clock } from 'lucide-react';
import { getMusicStats } from '@/lib/db/queries';
import { formatDuration } from '@/lib/utils';

export async function MusicStats() {
  const stats = await getMusicStats();

  const statItems = [
    {
      icon: Music,
      label: '総音楽数',
      value: stats.totalMusic.toLocaleString(),
      color: 'text-primary-600',
      bg: 'bg-primary-100',
    },
    {
      icon: TrendingUp,
      label: '総再生回数',
      value: stats.totalPlays.toLocaleString(),
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: Download,
      label: '総ダウンロード数',
      value: stats.totalDownloads.toLocaleString(),
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Clock,
      label: '平均楽曲時間',
      value: formatDuration(stats.averageDuration),
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
