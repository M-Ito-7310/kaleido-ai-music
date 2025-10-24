export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import dynamicImport from 'next/dynamic';
import { Clock, Calendar, Download, TrendingUp, Sparkles } from 'lucide-react';
import { getMusicById } from '@/lib/db/queries';
import { formatDuration } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// MusicPlayerを動的にインポート（クライアントサイドのみ）
const MusicPlayer = dynamicImport(
  () => import('@/components/music/MusicPlayer').then((mod) => mod.MusicPlayer),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg bg-gray-100 p-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    ),
  }
);

export async function generateMetadata({ params }: { params: { id: string } }) {
  const music = await getMusicById(parseInt(params.id, 10));

  if (!music) {
    return {
      title: '音楽が見つかりません',
    };
  }

  return {
    title: `${music.title} - ${music.artist} | Kaleido AI Music`,
    description: music.description || `${music.artist}によるAI生成音楽「${music.title}」`,
  };
}

export default async function MusicDetailPage({ params }: { params: { id: string } }) {
  const music = await getMusicById(parseInt(params.id, 10));

  if (!music) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* 左側: 画像 */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={music.imageUrl}
                alt={music.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                quality={90}
              />
            </div>

            {/* 右側: 情報 */}
            <div className="flex flex-col">
              {/* タイトル・アーティスト */}
              <div>
                <div className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                  {music.category}
                </div>
                <h1 className="mt-4 text-3xl font-bold text-gray-900 font-display">
                  {music.title}
                </h1>
                <p className="mt-2 text-xl text-gray-600">{music.artist}</p>
              </div>

              {/* メタデータ */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(music.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(music.createdAt), 'yyyy年M月d日', { locale: ja })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{(music.playCount || 0).toLocaleString()} 再生</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Download className="h-4 w-4" />
                  <span>{(music.downloadCount || 0).toLocaleString()} DL</span>
                </div>
              </div>

              {/* AI Platform */}
              {music.aiPlatform && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 text-accent-DEFAULT" />
                  <span>生成AI: {music.aiPlatform}</span>
                </div>
              )}

              {/* 説明 */}
              {music.description && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-gray-900">説明</h2>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                    {music.description}
                  </p>
                </div>
              )}

              {/* タグ */}
              {music.tags && music.tags.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-gray-900">タグ</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {music.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 音楽プレイヤー */}
          <div className="border-t border-gray-200 p-8">
            <MusicPlayer
              audioUrl={music.audioUrl}
              title={music.title}
              artist={music.artist}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
