import { redirect } from 'next/navigation';
import { Music, Edit, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getMusicList } from '@/lib/db/queries';

export const metadata = {
  title: '音楽管理 - 管理者ダッシュボード',
  description: '管理者専用：アップロード済み音楽を管理する',
};

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

interface MusicManagementPageProps {
  searchParams: {
    search?: string;
    offset?: string;
  };
}

export default async function MusicManagementPage({ searchParams }: MusicManagementPageProps) {
  // 認証チェック
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const search = searchParams.search || '';
  const offset = parseInt(searchParams.offset || '0', 10);
  const limit = 20;

  // 音楽一覧を取得
  const musicList = await getMusicList({ search, limit, offset });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                音楽管理
              </h1>
              <p className="mt-2 text-gray-600">
                アップロード済みの音楽を管理します
              </p>
            </div>
            <Link
              href="/admin/music/upload"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              新規アップロード
            </Link>
          </div>
        </div>

        {/* 検索バー */}
        <div className="mb-6">
          <form method="GET" className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="タイトルまたはアーティスト名で検索..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </form>
        </div>

        {/* 統計情報 */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">総音楽数</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{musicList.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">総再生数</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {musicList.reduce((sum, m) => sum + (m.playCount || 0), 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">総ダウンロード数</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {musicList.reduce((sum, m) => sum + (m.downloadCount || 0), 0)}
            </p>
          </div>
        </div>

        {/* 音楽一覧 */}
        <div className="rounded-xl bg-white shadow-sm">
          {musicList.length === 0 ? (
            <div className="p-12 text-center">
              <Music className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">
                {search ? '検索条件に一致する音楽が見つかりませんでした' : 'まだ音楽が登録されていません'}
              </p>
              {!search && (
                <Link
                  href="/admin/music/upload"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4" />
                  最初の音楽をアップロード
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* テーブルヘッダー */}
              <div className="grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-medium text-gray-700">
                <div className="col-span-1">画像</div>
                <div className="col-span-3">タイトル</div>
                <div className="col-span-2">アーティスト</div>
                <div className="col-span-2">カテゴリ</div>
                <div className="col-span-1 text-center">再生数</div>
                <div className="col-span-1 text-center">DL数</div>
                <div className="col-span-2 text-right">操作</div>
              </div>

              {/* テーブルボディ */}
              <div className="divide-y divide-gray-200">
                {musicList.map((music) => (
                  <div
                    key={music.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                  >
                    {/* サムネイル */}
                    <div className="col-span-1">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
                        {music.imageUrl ? (
                          <img
                            src={music.imageUrl}
                            alt={music.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Music className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* タイトル */}
                    <div className="col-span-3 flex items-center">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {music.title}
                        </p>
                        {music.tags && Array.isArray(music.tags) && music.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {music.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* アーティスト */}
                    <div className="col-span-2 flex items-center">
                      <p className="truncate text-sm text-gray-600">{music.artist}</p>
                    </div>

                    {/* カテゴリ */}
                    <div className="col-span-2 flex items-center">
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                        {music.category}
                      </span>
                    </div>

                    {/* 再生数 */}
                    <div className="col-span-1 flex items-center justify-center">
                      <p className="text-sm text-gray-900">{music.playCount || 0}</p>
                    </div>

                    {/* ダウンロード数 */}
                    <div className="col-span-1 flex items-center justify-center">
                      <p className="text-sm text-gray-900">{music.downloadCount || 0}</p>
                    </div>

                    {/* 操作 */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Link
                        href={`/music/${music.id}`}
                        target="_blank"
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        プレビュー
                      </Link>
                      <Link
                        href={`/admin/music/${music.id}/edit`}
                        className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-200"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        編集
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ページネーション */}
        {musicList.length >= limit && (
          <div className="mt-6 flex justify-center gap-2">
            {offset > 0 && (
              <Link
                href={`/admin/music?search=${search}&offset=${Math.max(0, offset - limit)}`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                前へ
              </Link>
            )}
            {musicList.length === limit && (
              <Link
                href={`/admin/music?search=${search}&offset=${offset + limit}`}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                次へ
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
