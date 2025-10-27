import { Upload } from 'lucide-react';
import { getCategories } from '@/lib/db/queries';
import { AdminMusicUploadForm } from '@/components/admin/AdminMusicUploadForm';

export const metadata = {
  title: '音楽をアップロード - 管理者ダッシュボード',
  description: '管理者専用：AI生成音楽をアップロードして公開する',
};

// 動的レンダリングを強制（ビルド時にデータベース接続しない）
export const dynamic = 'force-dynamic';

export default async function AdminMusicUploadPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                音楽をアップロード
              </h1>
              <p className="mt-1 text-gray-600">
                AI生成音楽をアップロードして、多くの人に聴いてもらいましょう
              </p>
            </div>
          </div>
        </div>

        {/* アップロードフォーム */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <AdminMusicUploadForm categories={categories} />
        </div>

        {/* ヒント */}
        <div className="mt-6 rounded-lg bg-blue-50 p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">アップロードのヒント</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 音楽ファイルは MP3 形式、最大 50MB まで対応しています</li>
            <li>• カバー画像は JPEG/PNG 形式、最大 10MB まで対応しています</li>
            <li>• タイトルとカテゴリは必須項目です</li>
            <li>• タグはカンマ区切りで複数指定できます（例: チルアウト, 作業用, リラックス）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
