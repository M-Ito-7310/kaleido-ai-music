import { Upload, Music, BarChart3, Settings, Edit } from 'lucide-react';
import Link from 'next/link';
import { getMusicList } from '@/lib/db/queries';

export const metadata = {
  title: '管理者ダッシュボード - Kaleido AI Music',
  description: '管理者専用ダッシュボード',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 音楽一覧を取得（最新10件）
  const musicList = await getMusicList({ limit: 10, offset: 0 });
  const menuItems = [
    {
      title: '音楽アップロード',
      description: '新しい音楽をアップロードして公開する',
      icon: Upload,
      href: '/admin/music/upload',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      title: '音楽管理',
      description: 'アップロード済みの音楽を管理する',
      icon: Music,
      href: '/admin/music',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: '統計情報',
      description: '再生数やダウンロード数を確認する',
      icon: BarChart3,
      href: '#',
      color: 'bg-blue-100 text-blue-600',
      comingSoon: true,
    },
    {
      title: '設定',
      description: 'システム設定を管理する',
      icon: Settings,
      href: '#',
      color: 'bg-gray-100 text-gray-600',
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            管理者ダッシュボード
          </h1>
          <p className="mt-2 text-gray-600">
            Kaleido AI Music の管理画面へようこそ
          </p>
        </div>

        {/* メニューカード */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const cardClassName = `relative rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md ${
              item.comingSoon
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:scale-[1.02]'
            }`;

            const cardContent = (
              <>
                {item.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="flex items-start">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </>
            );

            if (item.comingSoon) {
              return (
                <div key={item.title} className={cardClassName}>
                  {cardContent}
                </div>
              );
            }

            return (
              <Link key={item.title} href={item.href} className={cardClassName}>
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* クイック統計 */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            クイック統計
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">総音楽数</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{musicList.length}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">総再生数</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {musicList.reduce((sum, m) => sum + (m.playCount || 0), 0)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">総ダウンロード数</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {musicList.reduce((sum, m) => sum + (m.downloadCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* 音楽一覧 */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              最近の音楽
            </h2>
            <Link
              href="/library"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              すべて表示 →
            </Link>
          </div>

          {musicList.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              まだ音楽が登録されていません
            </p>
          ) : (
            <div className="space-y-3">
              {musicList.map((music) => (
                <div
                  key={music.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                >
                  {/* サムネイル */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    {music.imageUrl ? (
                      <img
                        src={music.imageUrl}
                        alt={music.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Music className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {music.title}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {music.artist} • {music.category}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        再生: {music.playCount || 0}
                      </span>
                      <span className="text-xs text-gray-500">
                        DL: {music.downloadCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* 編集ボタン */}
                  <Link
                    href={`/admin/music/${music.id}/edit`}
                    className="flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200"
                  >
                    <Edit className="h-4 w-4" />
                    編集
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
