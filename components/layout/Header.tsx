'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Music, Heart, Clock, Sparkles, Library, Upload, Info } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { VoiceControl } from '@/components/accessibility/VoiceControl';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-DEFAULT">
            <Music className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold font-display text-gray-900 dark:text-white">
            Kaleido AI Music
          </span>
        </Link>

        {/* デスクトップナビゲーション */}
        <div className="hidden md:flex md:gap-x-8 md:items-center">
          <Link
            href="/library"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Library className="h-4 w-4" />
            ライブラリ
          </Link>
          <Link
            href="/recommendations"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            AI おすすめ
          </Link>
          <Link
            href="/favorites"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Heart className="h-4 w-4" />
            お気に入り
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Clock className="h-4 w-4" />
            履歴
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Upload className="h-4 w-4" />
            アップロード
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Info className="h-4 w-4" />
            このサイトについて
          </Link>
          <VoiceControl />
          <ThemeToggle />
        </div>

        {/* モバイル: テーマトグル + メニューボタン */}
        <div className="flex items-center gap-2 md:hidden">
          <VoiceControl />
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/library"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Library className="h-5 w-5" />
              ライブラリ
            </Link>
            <Link
              href="/recommendations"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="h-5 w-5" />
              AI おすすめ
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="h-5 w-5" />
              お気に入り
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Clock className="h-5 w-5" />
              履歴
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Upload className="h-5 w-5" />
              アップロード
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-5 w-5" />
              このサイトについて
            </Link>

            {/* 法的情報セクション */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
              <Link
                href="/terms"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                利用規約
              </Link>
              <Link
                href="/privacy"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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
