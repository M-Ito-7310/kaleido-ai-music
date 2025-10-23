# Phase 3: UI実装 - 詳細実装ガイド

**Phase**: 3/7
**推定時間**: 2-3日
**前提条件**: Phase 1-2完了
**次のPhase**: Phase 4 - 検索・フィルター機能

---

## 目次

1. [概要](#概要)
2. [レイアウトコンポーネント](#レイアウトコンポーネント)
3. [ランディングページ](#ランディングページ)
4. [音楽ライブラリページ](#音楽ライブラリページ)
5. [音楽詳細ページ](#音楽詳細ページ)
6. [音楽プレイヤーコンポーネント](#音楽プレイヤーコンポーネント)
7. [共通UIコンポーネント](#共通uiコンポーネント)
8. [スタイリング](#スタイリング)
9. [動作確認](#動作確認)
10. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 3では、Kaleido AI Musicのフロントエンド画面を実装します。ランディングページ、音楽ライブラリ、音楽詳細ページ、そして音楽プレイヤーコンポーネントを構築し、ユーザーがAI音楽を視聴・ダウンロードできる環境を整えます。

### このPhaseで実現すること

- レイアウトコンポーネント（Header、Footer）
- ランディングページ（ヒーロー、機能紹介）
- 音楽ライブラリページ（グリッド表示、カード）
- 音楽詳細ページ（詳細情報、プレイヤー統合）
- 音楽プレイヤーコンポーネント（Web Audio API）
- 共通UIコンポーネント（Button、Modal、Toast等）

---

## レイアウトコンポーネント

### ステップ 1: ルートレイアウト

**ファイル名**: `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kaleido AI Music - AI生成音楽ライブラリ',
  description:
    'AI生成音楽を展示・共有できるプラットフォーム。Suno AI、Udio等で生成した音楽を視聴・ダウンロードできます。',
  keywords: ['AI音楽', 'AI Music', 'Suno AI', 'Udio', '音楽ライブラリ', '無料音楽'],
  authors: [{ name: 'Kaleido Future' }],
  openGraph: {
    title: 'Kaleido AI Music',
    description: 'AI生成音楽ライブラリプラットフォーム',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### ステップ 2: ヘッダーコンポーネント

**ファイル名**: `components/layout/Header.tsx`

```typescript
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
          </div>
        </div>
      )}
    </header>
  );
}
```

### ステップ 3: フッターコンポーネント

**ファイル名**: `components/layout/Footer.tsx`

```typescript
import Link from 'next/link';
import { Music, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
                href="https://github.com"
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
    </footer>
  );
}
```

---

## ランディングページ

### ステップ 4: ランディングページ実装

**ファイル名**: `app/page.tsx`

```typescript
import Link from 'next/link';
import { ArrowRight, Music, Headphones, Download, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-light/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-display">
              AI音楽を、
              <span className="text-primary-600">もっと身近に</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Kaleido AI Musicは、AI生成音楽を展示・共有できるプラットフォームです。
              Suno AI、Udio等で生成した音楽を視聴・ダウンロードできます。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/library"
                className="rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors flex items-center gap-2"
              >
                ライブラリを見る
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/upload"
                className="text-base font-semibold leading-7 text-gray-900 hover:text-primary-600 transition-colors"
              >
                音楽をアップロード <span aria-hidden="true">→</span>
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
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
              手軽にAI音楽を楽しむ
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              スマートフォンでも快適に視聴・ダウンロードできます
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* 機能1 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 p-8 hover:border-primary-300 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Music className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">豊富な音楽ライブラリ</h3>
                <p className="text-gray-600">
                  様々なジャンル、ムードのAI生成音楽を視聴できます。カテゴリ・タグで簡単に検索。
                </p>
              </div>

              {/* 機能2 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 p-8 hover:border-primary-300 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-light/20">
                  <Headphones className="h-6 w-6 text-accent-dark" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">高品質プレイヤー</h3>
                <p className="text-gray-600">
                  Web Audio APIを使用した高音質再生。シークバー、ボリューム調整など充実した機能。
                </p>
              </div>

              {/* 機能3 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 p-8 hover:border-primary-300 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">無料ダウンロード</h3>
                <p className="text-gray-600">
                  すべての音楽を無料でダウンロード可能。動画制作のBGM、個人利用に最適。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 人気音楽セクション（サーバーコンポーネント版は後で実装） */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
              人気の音楽
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              再生回数の多い人気のAI音楽をチェック
            </p>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
            >
              すべての音楽を見る
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="bg-primary-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-display">
              あなたのAI音楽を共有しませんか？
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-100">
              Suno AI、Udio等で生成した音楽をアップロードして、多くの人に聴いてもらいましょう。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/upload"
                className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-600 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                今すぐアップロード
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 音楽ライブラリページ

### ステップ 5: 音楽カードコンポーネント

**ファイル名**: `components/music/MusicCard.tsx`

```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play, Clock, TrendingUp } from 'lucide-react';
import type { Music } from '@/lib/db/schema';
import { formatDuration } from '@/lib/utils';

interface MusicCardProps {
  music: Music;
}

export function MusicCard({ music }: MusicCardProps) {
  return (
    <Link
      href={`/music/${music.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-primary-300"
    >
      {/* サムネイル */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={music.imageUrl}
          alt={music.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {/* 再生オーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
          <div className="scale-0 transition-transform group-hover:scale-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
              <Play className="h-6 w-6 text-primary-600 ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
        {/* カテゴリバッジ */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm">
            {music.category}
          </span>
        </div>
      </div>

      {/* 情報 */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {music.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-1">{music.artist}</p>

        {/* メタデータ */}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDuration(music.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{music.playCount.toLocaleString()} 再生</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### ステップ 6: 音楽グリッドコンポーネント

**ファイル名**: `components/music/MusicGrid.tsx`

```typescript
'use client';

import { MusicCard } from './MusicCard';
import type { Music } from '@/lib/db/schema';

interface MusicGridProps {
  musicList: Music[];
}

export function MusicGrid({ musicList }: MusicGridProps) {
  if (musicList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">音楽が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {musicList.map((music) => (
        <MusicCard key={music.id} music={music} />
      ))}
    </div>
  );
}
```

### ステップ 7: 音楽ライブラリページ

**ファイル名**: `app/library/page.tsx`

```typescript
import { getMusicList } from '@/lib/db/queries';
import { MusicGrid } from '@/components/music/MusicGrid';

export const metadata = {
  title: '音楽ライブラリ - Kaleido AI Music',
  description: 'AI生成音楽のライブラリ。様々なジャンル、ムードの音楽を視聴・ダウンロードできます。',
};

export default async function LibraryPage() {
  const musicList = await getMusicList({ limit: 20 });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">音楽ライブラリ</h1>
          <p className="mt-2 text-gray-600">
            AI生成音楽を視聴・ダウンロードできます
          </p>
        </div>

        <MusicGrid musicList={musicList} />
      </div>
    </div>
  );
}
```

---

## 音楽詳細ページ

### ステップ 8: 音楽詳細ページ

**ファイル名**: `app/music/[id]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Calendar, Download, TrendingUp, Sparkles } from 'lucide-react';
import { getMusicById } from '@/lib/db/queries';
import { formatDuration } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const music = await getMusicById(parseInt(params.id, 10));

  if (!music) {
    return {
      title: '音楽が見つかりません',
    };
  }

  return {
    title: `${music.title} - ${music.artist} | Kaleido AI Music`,
    description: music.description || `${music.artist}によるAI生成音楽「${music.title}」`,
  };
}

export default async function MusicDetailPage({ params }: { params: { id: string } }) {
  const music = await getMusicById(parseInt(params.id, 10));

  if (!music) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* 左側: 画像 */}
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={music.imageUrl}
                alt={music.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 右側: 情報 */}
            <div className="flex flex-col">
              {/* タイトル・アーティスト */}
              <div>
                <div className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                  {music.category}
                </div>
                <h1 className="mt-4 text-3xl font-bold text-gray-900 font-display">
                  {music.title}
                </h1>
                <p className="mt-2 text-xl text-gray-600">{music.artist}</p>
              </div>

              {/* メタデータ */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(music.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(music.createdAt), 'yyyy年M月d日', { locale: ja })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{music.playCount.toLocaleString()} 再生</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Download className="h-4 w-4" />
                  <span>{music.downloadCount.toLocaleString()} DL</span>
                </div>
              </div>

              {/* AI Platform */}
              {music.aiPlatform && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 text-accent-DEFAULT" />
                  <span>生成AI: {music.aiPlatform}</span>
                </div>
              )}

              {/* 説明 */}
              {music.description && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-gray-900">説明</h2>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                    {music.description}
                  </p>
                </div>
              )}

              {/* タグ */}
              {music.tags && music.tags.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-gray-900">タグ</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {music.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* アクションボタン（クライアントコンポーネントとして後で実装） */}
              <div className="mt-auto pt-8">
                <div className="flex gap-4">
                  <button className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors">
                    再生
                  </button>
                  <button className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                    ダウンロード
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 音楽プレイヤーコンポーネント

### ステップ 9: Web Audio API プレイヤークラス

**ファイル名**: `lib/audio/player.ts`

```typescript
export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startTime: number = 0;
  private pauseTime: number = 0;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    }
  }

  async loadTrack(url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load audio:', error);
      throw error;
    }
  }

  play(): void {
    if (!this.audioContext || !this.audioBuffer || !this.gainNode) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.gainNode);

    this.startTime = this.audioContext.currentTime - this.pauseTime;
    this.source.start(0, this.pauseTime);
    this.isPlaying = true;
  }

  pause(): void {
    if (!this.source || !this.audioContext) return;

    this.pauseTime = this.audioContext.currentTime - this.startTime;
    this.source.stop();
    this.isPlaying = false;
  }

  stop(): void {
    if (this.source) {
      this.source.stop();
      this.source = null;
    }
    this.pauseTime = 0;
    this.startTime = 0;
    this.isPlaying = false;
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  getCurrentTime(): number {
    if (!this.audioContext) return 0;
    return this.isPlaying ? this.audioContext.currentTime - this.startTime : this.pauseTime;
  }

  getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  seek(time: number): void {
    const wasPlaying = this.isPlaying;
    this.stop();
    this.pauseTime = Math.max(0, Math.min(time, this.getDuration()));
    if (wasPlaying) {
      this.play();
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
```

### ステップ 10: 音楽プレイヤーUIコンポーネント

**ファイル名**: `components/music/MusicPlayer.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { AudioPlayer } from '@/lib/audio/player';
import { formatDuration } from '@/lib/utils';

interface MusicPlayerProps {
  audioUrl: string;
  title: string;
  artist: string;
}

export function MusicPlayer({ audioUrl, title, artist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const playerRef = useRef<AudioPlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // プレイヤー初期化
  useEffect(() => {
    playerRef.current = new AudioPlayer();

    playerRef.current.loadTrack(audioUrl).then(() => {
      setDuration(playerRef.current!.getDuration());
      setIsLoading(false);
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      playerRef.current?.destroy();
    };
  }, [audioUrl]);

  // 再生時間の更新
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const time = playerRef.current?.getCurrentTime() || 0;
        setCurrentTime(time);

        if (time >= duration) {
          setIsPlaying(false);
          setCurrentTime(0);
          playerRef.current?.stop();
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current?.seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    playerRef.current?.setVolume(vol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.8);
      playerRef.current?.setVolume(0.8);
    } else {
      setVolume(0);
      playerRef.current?.setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-gray-100 p-6">
        <p className="text-center text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gradient-to-br from-primary-50 to-accent-light/20 p-6">
      {/* 曲情報 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{artist}</p>
      </div>

      {/* シークバー */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex items-center justify-between">
        {/* 再生ボタン */}
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-500 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* ボリュームコントロール */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-gray-600 hover:text-gray-900">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 共通UIコンポーネント

### ステップ 11: Buttonコンポーネント

**ファイル名**: `components/ui/Button.tsx`

```typescript
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600',
      secondary:
        'bg-accent-DEFAULT text-white hover:bg-accent-dark focus-visible:outline-accent-DEFAULT',
      outline:
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            読み込み中...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### ステップ 12: Modalコンポーネント

**ファイル名**: `components/ui/Modal.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* モーダル */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={cn(
            'relative w-full rounded-lg bg-white shadow-xl',
            sizes[size]
          )}
        >
          {/* ヘッダー */}
          {title && (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* コンテンツ */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

---

## スタイリング

### ステップ 13: グローバルスタイル

**ファイル名**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-gray-200;
  }

  body {
    @apply bg-white text-gray-900;
  }

  /* カスタムスクロールバー */
  ::-webkit-scrollbar {
    @apply w-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
  }
}

@layer utilities {
  /* アニメーション */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* テキスト省略 */
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

---

## 動作確認

### ステップ 14: 開発サーバーで確認

**コマンド:**
```bash
npm run dev
```

**確認項目:**

1. **ランディングページ** (`http://localhost:3000`)
   - ヒーローセクションが表示される
   - 機能セクションが正しく配置されている
   - CTAボタンが動作する

2. **音楽ライブラリページ** (`http://localhost:3000/library`)
   - 音楽カードがグリッド表示される
   - カードホバー時のアニメーションが動作する
   - 音楽がない場合のメッセージが表示される

3. **音楽詳細ページ** (`http://localhost:3000/music/1`)
   - 音楽情報が正しく表示される
   - 画像が正しく読み込まれる
   - メタデータが表示される

4. **レスポンシブ対応**
   - モバイル（375px）で確認
   - タブレット（768px）で確認
   - デスクトップ（1280px）で確認

---

## 成果物チェックリスト

### レイアウト

- [ ] `app/layout.tsx` が作成されている
- [ ] `components/layout/Header.tsx` が作成されている
- [ ] `components/layout/Footer.tsx` が作成されている
- [ ] ヘッダーがすべてのページで表示される
- [ ] フッターがすべてのページで表示される

### ページ

- [ ] `app/page.tsx` が作成されている
- [ ] `app/library/page.tsx` が作成されている
- [ ] `app/music/[id]/page.tsx` が作成されている
- [ ] すべてのページが正しく表示される

### コンポーネント

- [ ] `components/music/MusicCard.tsx` が作成されている
- [ ] `components/music/MusicGrid.tsx` が作成されている
- [ ] `components/music/MusicPlayer.tsx` が作成されている
- [ ] `components/ui/Button.tsx` が作成されている
- [ ] `components/ui/Modal.tsx` が作成されている

### オーディオ

- [ ] `lib/audio/player.ts` が作成されている
- [ ] 音楽プレイヤーが動作する
- [ ] 再生/一時停止が動作する
- [ ] シークバーが動作する
- [ ] ボリュームコントロールが動作する

### スタイル

- [ ] `app/globals.css` が更新されている
- [ ] Tailwind CSSが正しく適用されている
- [ ] レスポンシブデザインが動作する

---

## 次のステップ

Phase 3が完了したら、Phase 4「検索・フィルター機能」に進みます。

**次のドキュメント**: `20251023_04-search-filter.md`

Phase 4では以下を実装します:
- カテゴリフィルター
- タグフィルター
- キーワード検索
- ソート機能

---

## まとめ

Phase 3では、Kaleido AI MusicのUI実装を完了しました。

**達成したこと:**
- ✅ レイアウトコンポーネント
- ✅ ランディングページ
- ✅ 音楽ライブラリページ
- ✅ 音楽詳細ページ
- ✅ 音楽プレイヤーコンポーネント
- ✅ 共通UIコンポーネント

**所要時間:** 約2-3日（16-24時間）

次のPhaseに進む準備が整いました！

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
