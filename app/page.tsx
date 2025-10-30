import Link from 'next/link';
import { ArrowRight, Music, Headphones, Download, Sparkles, ExternalLink, QrCode } from 'lucide-react';
import { ScaleTransition } from '@/components/ui/PageTransition';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';
import { MusicCard } from '@/components/music/MusicCard';
import { getMusicList } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 新着3曲を取得
  const latestMusic = await getMusicList({
    sortBy: 'latest',
    limit: 3,
    offset: 0,
  });

  // 再生数上位3曲を取得
  const popularMusic = await getMusicList({
    sortBy: 'popular',
    limit: 3,
    offset: 0,
  });
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

      {/* 新着音楽セクション */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-display">
              新着の音楽
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              最近追加された最新のAI音楽をチェック
            </p>
          </div>

          {/* 新着3曲のカード表示 */}
          {latestMusic.length > 0 ? (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {latestMusic.map((music, index) => (
                <MusicCard key={music.id} music={music} index={index} playlist={latestMusic} />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-gray-500 dark:text-gray-400">まだ音楽がありません</p>
            </div>
          )}
        </div>
      </section>

      {/* 人気音楽セクション */}
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

          {/* 上位3曲のカード表示 */}
          {popularMusic.length > 0 ? (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {popularMusic.map((music, index) => (
                <MusicCard key={music.id} music={music} index={index} playlist={popularMusic} />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-gray-500 dark:text-gray-400">まだ音楽がありません</p>
            </div>
          )}

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

      {/* Suno AI招待セクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 dark:from-purple-950 to-pink-50 dark:to-pink-950">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-display">
              Suno AIで音楽を生成しよう
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Suno AIは、テキストから高品質な音楽を生成できるAIツールです。
              あなたもAI音楽クリエイターになりませんか？
            </p>
            <div className="mt-10 flex flex-col items-center gap-8">
              <a
                href="https://suno.com/invite/@masato_kaleidofuture"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-purple-500 hover:to-pink-500 dark:hover:from-purple-400 dark:hover:to-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all"
              >
                Suno AIを試す
                <ExternalLink className="h-5 w-5" />
              </a>

              {/* QRコード */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <QrCode className="h-5 w-5" />
                  <span className="text-sm font-semibold">スマートフォンでアクセス</span>
                </div>
                <QRCodeDisplay
                  value="https://suno.com/invite/@masato_kaleidofuture"
                  size={180}
                  label="Suno AI 招待URL"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 装飾 */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-300 to-pink-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* YouTubeチャンネルセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 dark:from-red-950 to-orange-50 dark:to-orange-950">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600">
                <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-display">
              YouTubeチャンネルをチェック
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kaleido FutureのYouTubeチャンネルで、AI音楽の最新動画をご覧いただけます。
              チャンネル登録して、最新情報をチェックしましょう！
            </p>
            <div className="mt-10 flex flex-col items-center gap-8">
              <a
                href="https://www.youtube.com/@KaleidoFuture"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-400 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-red-500 hover:to-red-400 dark:hover:from-red-400 dark:hover:to-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all"
              >
                YouTubeチャンネルを見る
                <ExternalLink className="h-5 w-5" />
              </a>

              {/* QRコード */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <QrCode className="h-5 w-5" />
                  <span className="text-sm font-semibold">スマートフォンでアクセス</span>
                </div>
                <QRCodeDisplay
                  value="https://www.youtube.com/@KaleidoFuture"
                  size={180}
                  label="Kaleido Future YouTube"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 装飾 */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-red-300 to-orange-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </section>

      {/* ホームページQRコードセクション */}
      <section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-display">
              このサイトをスマートフォンで開く
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              QRコードをスキャンして、スマートフォンでKaleido AI Musicにアクセスできます
            </p>
            <div className="mt-12 flex justify-center">
              <QRCodeDisplay
                value="https://kaleidoaimusic.kaleidofuture.com/"
                size={200}
                label="Kaleido AI Music トップページ"
              />
            </div>
          </div>
        </div>
      </section>
    </ScaleTransition>
  );
}
