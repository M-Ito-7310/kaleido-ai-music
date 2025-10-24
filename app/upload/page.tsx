import { getCategories } from '@/lib/db/queries';
import { MusicUploadForm } from '@/components/upload/MusicUploadForm';
import { Upload } from 'lucide-react';

export const metadata = {
  title: '音楽をアップロード - Kaleido AI Music',
  description: 'AI生成音楽をアップロードして、多くの人に聴いてもらいましょう。',
};

export default async function UploadPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Upload className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">音楽をアップロード</h1>
          <p className="mt-2 text-gray-600">
            AI生成音楽をアップロードして、多くの人に聴いてもらいましょう
          </p>
        </div>

        {/* フォーム */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <MusicUploadForm categories={categories} />
        </div>

        {/* 注意事項 */}
        <div className="mt-8 rounded-lg bg-yellow-50 p-6">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">注意事項</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
            <li>アップロードできるのはAI生成音楽のみです</li>
            <li>著作権を侵害する音楽はアップロードしないでください</li>
            <li>音楽ファイルは最大50MBまでです</li>
            <li>画像ファイルは最大10MBまでです</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
