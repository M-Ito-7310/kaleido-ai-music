import Link from 'next/link';
import { ArrowRight, Music, Headphones, Download } from 'lucide-react';
import { ScaleTransition } from '@/components/ui/PageTransition';

export default function HomePage() {
  return (
    <ScaleTransition className="bg-white dark:bg-gray-900">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 dark:from-primary-950 to-accent-light/20 dark:to-accent-dark/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl font-display">
              AI音楽を、
              <span className="text-primary-600 dark:text-primary-400">もっと身近に</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kaleido AI Musicは、AI生成音楽を展示・共有できるプラットフォームです。
              Suno AI、Udio等で生成した音楽を視聴・ダウンロードできます。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/library"
                className="rounded-lg bg-primary-600 dark:bg-primary-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors flex items-center gap-2"
              >
                ライブラリを見る
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 装飾 */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-300 to-accent-light opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* 機能セクション */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-display">
              手軽にAI音楽を楽しむ
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              スマートフォンでも快適に視聴・ダウンロードできます
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* 機能1 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
                  <Music className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">豊富な音楽ライブラリ</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  様々なジャンル、ムードのAI生成音楽を視聴できます。カテゴリ・タグで簡単に検索。
                </p>
              </div>

              {/* 機能2 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-light/20 dark:bg-accent-dark/20">
                  <Headphones className="h-6 w-6 text-accent-dark dark:text-accent-light" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">高品質プレイヤー</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Web Audio APIを使用した高音質再生。シークバー、ボリューム調整など充実した機能。
                </p>
              </div>

              {/* 機能3 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">無料ダウンロード</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  すべての音楽を無料でダウンロード可能。動画制作のBGM、個人利用に最適。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 人気音楽セクション（サーバーコンポーネント版は後で実装） */}
      <section className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-display">
              人気の音楽
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              再生回数の多い人気のAI音楽をチェック
            </p>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 dark:bg-primary-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-400 transition-colors"
            >
              すべての音楽を見る
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </ScaleTransition>
  );
}
