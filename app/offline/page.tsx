'use client';

import { WifiOff, RefreshCw, Music } from 'lucide-react';
import Link from 'next/link';

/**
 * オフライン時のフォールバックページ
 * ネットワーク接続がない場合に表示される
 */
export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* アイコン */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-amber-600 dark:text-amber-500" />
            </div>
            {/* パルスエフェクト */}
            <div className="absolute inset-0 rounded-full bg-amber-400/20 dark:bg-amber-500/20 animate-ping" />
          </div>
        </div>

        {/* メインメッセージ */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-display">
          オフラインです
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          インターネット接続が利用できません。
          <br />
          接続を確認して、もう一度お試しください。
        </p>

        {/* アクション */}
        <div className="space-y-4">
          {/* リトライボタン */}
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400 text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            再読み込み
          </button>

          {/* キャッシュされた音楽へのリンク */}
          <Link
            href="/library"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
          >
            <Music className="w-5 h-5" />
            キャッシュされた音楽を見る
          </Link>
        </div>

        {/* ヒント */}
        <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>ヒント:</strong> 一度再生した音楽はオフラインでも楽しめます！
          </p>
        </div>
      </div>
    </div>
  );
}
