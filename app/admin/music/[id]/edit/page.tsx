import { notFound, redirect } from 'next/navigation';
import { Edit } from 'lucide-react';
import { validateSession } from '@/lib/auth/session';
import { getMusicById, getCategories } from '@/lib/db/queries';
import { MusicEditForm } from '@/components/admin/MusicEditForm';

export const metadata = {
  title: '音楽を編集 - 管理者ダッシュボード',
  description: '管理者専用：音楽情報を編集する',
};

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

interface EditMusicPageProps {
  params: {
    id: string;
  };
}

export default async function EditMusicPage({ params }: EditMusicPageProps) {
  // 認証チェック
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  // 音楽IDをパース
  const musicId = parseInt(params.id, 10);
  if (isNaN(musicId)) {
    notFound();
  }

  // 音楽データとカテゴリを取得
  const [music, categories] = await Promise.all([
    getMusicById(musicId),
    getCategories(),
  ]);

  // 音楽が存在しない場合
  if (!music) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <Edit className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                音楽を編集
              </h1>
              <p className="mt-1 text-gray-600">
                音楽情報を編集できます
              </p>
            </div>
          </div>
        </div>

        {/* 編集フォーム */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <MusicEditForm music={music} categories={categories} />
        </div>
      </div>
    </div>
  );
}
