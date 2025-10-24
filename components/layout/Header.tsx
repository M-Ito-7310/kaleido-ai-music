'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Music } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-DEFAULT">
            <Music className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold font-display text-gray-900">
            Kaleido AI Music
          </span>
        </Link>

        {/* デスクトップナビゲーション */}
        <div className="hidden md:flex md:gap-x-8">
          <Link
            href="/library"
            className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
          >
            ライブラリ
          </Link>
          <Link
            href="/upload"
            className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
          >
            アップロード
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
          >
            このサイトについて
          </Link>
        </div>

        {/* モバイルメニューボタン */}
        <button
          type="button"
          className="md:hidden rounded-md p-2 text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/library"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              ライブラリ
            </Link>
            <Link
              href="/upload"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              アップロード
            </Link>
            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              このサイトについて
            </Link>

            {/* 法的情報セクション */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <Link
                href="/terms"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                利用規約
              </Link>
              <Link
                href="/privacy"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
