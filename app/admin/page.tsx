import { Upload, Music, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: '管理者ダッシュボード - Kaleido AI Music',
  description: '管理者専用ダッシュボード',
};

export default function AdminDashboardPage() {
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
      href: '/library',
      color: 'bg-purple-100 text-purple-600',
      comingSoon: true,
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
              <p className="mt-1 text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">総再生数</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">総ダウンロード数</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            ※ 統計情報機能は今後実装予定です
          </p>
        </div>
      </div>
    </div>
  );
}
