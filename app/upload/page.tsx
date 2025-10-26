import { Lock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: '音楽をアップロード - Kaleido AI Music',
  description: 'AI生成音楽をアップロードして、多くの人に聴いてもらいましょう。',
};

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <Lock className="h-8 w-8 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">音楽アップロード機能</h1>
          <p className="mt-2 text-gray-600">
            現在、この機能は一般公開されていません
          </p>
        </div>

        {/* メッセージ */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              デモアプリのため非公開中
            </h2>
            <p className="text-gray-600">
              Kaleido AI Musicは現在デモアプリとして公開されています。<br />
              セキュリティとコンテンツ品質管理のため、音楽のアップロード機能は管理者のみに制限されています。
            </p>
            <div className="pt-4">
              <Link
                href="/library"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                ライブラリに戻る
              </Link>
            </div>
          </div>
        </div>

        {/* 今後の予定 */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">今後の予定</h3>
          <p className="text-sm text-blue-800">
            将来的に管理者向けの音楽アップロード機能を実装予定です。<br />
            現在は厳選されたAI生成音楽をお楽しみください。
          </p>
        </div>
      </div>
    </div>
  );
}
