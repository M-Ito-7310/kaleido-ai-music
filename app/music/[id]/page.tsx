export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { getMusicById, incrementPlayCount } from '@/lib/db/queries';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { DownloadButton } from '@/components/music/DownloadButton';
import { Clock, TrendingUp, Calendar, ExternalLink, QrCode } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { PageTransition } from '@/components/ui/PageTransition';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';
import Image from 'next/image';

interface MusicDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MusicDetailPage({ params }: MusicDetailPageProps) {
  const musicId = parseInt(params.id, 10);

  if (isNaN(musicId)) {
    notFound();
  }

  const music = await getMusicById(musicId);

  if (!music) {
    notFound();
  }

  // 再生回数をインクリメント
  await incrementPlayCount(musicId);

  return (
    <PageTransition className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* 左側: アートワーク */}
            <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700 lg:aspect-auto">
              <Image
                src={music.imageUrl}
                alt={music.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 右側: 詳細情報 */}
            <div className="p-8 flex flex-col">
              {/* タイトル & アーティスト */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display mb-2">
                  {music.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">{music.artist}</p>
              </div>

              {/* メタデータ */}
              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(music.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>{(music.playCount || 0).toLocaleString()} 再生</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(music.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>

              {/* カテゴリ & タグ */}
              <div className="mb-6">
                <div className="mb-3">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">カテゴリ: </span>
                  <span className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-sm font-medium text-primary-800 dark:text-primary-200">
                    {music.category}
                  </span>
                </div>
                {music.tags && music.tags.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                      タグ:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {music.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 説明文 */}
              {music.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">説明</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {music.description}
                  </p>
                </div>
              )}

              {/* 共有リンク */}
              {music.shareLink && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    オリジナル
                  </h3>
                  <a
                    href={music.shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>生成元のサービスで表示</span>
                  </a>
                </div>
              )}

              {/* プレイヤー */}
              <div className="mb-6 flex-1 flex items-end">
                <MusicPlayer
                  audioUrl={music.audioUrl}
                  title={music.title}
                  artist={music.artist}
                  imageUrl={music.imageUrl}
                />
              </div>

              {/* ダウンロードボタン */}
              <DownloadButton
                musicId={music.id}
                audioUrl={music.audioUrl}
                title={music.title}
                artist={music.artist}
              />
            </div>
          </div>

          {/* QRコードセクション */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5" />
              QRコードでシェア
            </h3>
            <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
              {/* 楽曲ページQRコード */}
              <div className="flex justify-center">
                <QRCodeDisplay
                  value={`https://kaleidoaimusic.kaleidofuture.com/music/${music.id}`}
                  size={180}
                  label="この楽曲ページ"
                />
              </div>

              {/* 共有リンクQRコード */}
              {music.shareLink && (
                <div className="flex justify-center">
                  <QRCodeDisplay
                    value={music.shareLink}
                    size={180}
                    label="生成元のサービス"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
