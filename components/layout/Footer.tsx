import Link from 'next/link';
import { Music, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        {/* モバイル版: 簡易フッター */}
        <div className="md:hidden">
          <div className="flex flex-col items-center text-center gap-4">
            {/* ブランド */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-DEFAULT">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold font-display text-gray-900">
                Kaleido AI Music
              </span>
            </div>

            {/* 法的情報リンク */}
            <div className="flex gap-4 text-xs text-gray-600">
              <Link href="/terms" className="hover:text-gray-900">
                利用規約
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacy" className="hover:text-gray-900">
                プライバシーポリシー
              </Link>
            </div>

            {/* SNSアイコン */}
            <div className="flex gap-4">
              <a
                href="https://github.com/M-Ito-7310/kaleido-ai-music"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            {/* 著作権表示 */}
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Kaleido Future
            </p>
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
                <span className="text-xl font-bold font-display text-gray-900">
                  Kaleido AI Music
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                AI生成音楽を展示・共有できるプラットフォーム。
                <br />
                Suno AI、Udio等で生成した音楽を視聴・ダウンロードできます。
              </p>
              <div className="mt-6 flex gap-4">
                <a
                  href="https://github.com/M-Ito-7310/kaleido-ai-music"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* リンク */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">サイト</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/library" className="text-sm text-gray-600 hover:text-gray-900">
                    ライブラリ
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="text-sm text-gray-600 hover:text-gray-900">
                    アップロード
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                    このサイトについて
                  </Link>
                </li>
              </ul>
            </div>

            {/* 法的情報 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">法的情報</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Kaleido Future. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
