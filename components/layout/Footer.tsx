import Link from 'next/link';
import { Music, Github, Music2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        {/* モバイル版: 簡易フッター */}
        <div className="md:hidden">
          <div className="flex flex-col items-center text-center gap-4">
            {/* ブランド */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-DEFAULT">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold font-display text-gray-900 dark:text-white">
                Kaleido AI Music
              </span>
            </div>

            {/* 法的情報リンク */}
            <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
              <Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-200">
                お問い合わせ
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-200">
                利用規約
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200">
                プライバシーポリシー
              </Link>
            </div>

            {/* SNSアイコン */}
            <div className="flex gap-4">
              <a
                href="https://github.com/M-Ito-7310/kaleido-ai-music"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://suno.com/@masato_kaleidofuture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Suno AI Profile"
              >
                <Music2 className="h-5 w-5" />
              </a>
            </div>

            {/* 著作権表示 */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Kaleido Future
              </p>
              <Link
                href="/admin/login"
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* デスクトップ版: 詳細フッター */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* ブランド */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-DEFAULT">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold font-display text-gray-900 dark:text-white">
                  Kaleido AI Music
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                AI生成音楽を展示・共有できるプラットフォーム。
                <br />
                Suno AI、Udio等で生成した音楽を視聴・ダウンロードできます。
              </p>
              <div className="mt-6 flex gap-4">
                <a
                  href="https://github.com/M-Ito-7310/kaleido-ai-music"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://suno.com/@masato_kaleidofuture"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Suno AI Profile"
                >
                  <Music2 className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* リンク */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">サイト</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/library" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    ライブラリ
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    このサイトについて
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>

            {/* 法的情報 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">法的情報</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex justify-center items-baseline gap-4">
              <span className="text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Kaleido Future. All rights reserved.
              </span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                href="/admin/login"
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
