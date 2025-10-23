# Phase 5: ダウンロード機能 - 詳細実装ガイド

**Phase**: 5/7
**推定時間**: 1日
**前提条件**: Phase 1-4完了
**次のPhase**: Phase 6 - モバイル最適化

---

## 目次

1. [概要](#概要)
2. [ダウンロード機能実装](#ダウンロード機能実装)
3. [再生回数トラッキング](#再生回数トラッキング)
4. [統計情報の表示](#統計情報の表示)
5. [アップロード機能実装](#アップロード機能実装)
6. [ファイルバリデーション](#ファイルバリデーション)
7. [動作確認](#動作確認)
8. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 5では、音楽のダウンロード機能と再生回数のトラッキングを実装します。また、管理者向けの音楽アップロード機能も構築します。

### このPhaseで実現すること

- ダウンロードボタンとロジック
- ダウンロード数のカウントアップ
- 再生回数のカウントアップ
- 統計情報の表示
- 管理者向けアップロード機能
- ファイルバリデーション

---

## ダウンロード機能実装

### ステップ 1: ダウンロードボタンコンポーネント

**ファイル名**: `components/music/DownloadButton.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DownloadButtonProps {
  musicId: number;
  audioUrl: string;
  title: string;
  artist: string;
}

export function DownloadButton({ musicId, audioUrl, title, artist }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // ダウンロード数をインクリメント
      await fetch(`/api/music/${musicId}/download`, {
        method: 'POST',
      });

      // ファイルをダウンロード
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      // ファイル名を生成
      const filename = `${artist} - ${title}.mp3`.replace(/[^a-zA-Z0-9\s\-_.]/g, '_');

      // ダウンロードリンクを作成
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('ダウンロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      size="md"
      className="w-full sm:w-auto"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ダウンロード中...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          ダウンロード
        </>
      )}
    </Button>
  );
}
```

### ステップ 2: 音楽詳細ページへの統合

**ファイル名**: `app/music/[id]/page.tsx`（一部更新）

```typescript
// ... 既存のインポート
import { DownloadButton } from '@/components/music/DownloadButton';

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
            {/* ... 既存のコンテンツ */}

            {/* アクションボタン */}
            <div className="mt-auto pt-8">
              <div className="flex gap-4">
                <button className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors">
                  再生
                </button>
                <DownloadButton
                  musicId={music.id}
                  audioUrl={music.audioUrl}
                  title={music.title}
                  artist={music.artist}
                />
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

## 再生回数トラッキング

### ステップ 3: プレイヤーコンポーネントの更新

**ファイル名**: `components/music/MusicPlayer.tsx`（一部更新）

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
// ... 既存のインポート

interface MusicPlayerProps {
  musicId: number; // 追加
  audioUrl: string;
  title: string;
  artist: string;
}

export function MusicPlayer({ musicId, audioUrl, title, artist }: MusicPlayerProps) {
  // ... 既存のstate

  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);

  // ... 既存のuseEffect

  // 再生開始時に再生回数をカウント
  useEffect(() => {
    const trackPlay = async () => {
      if (isPlaying && !hasTrackedPlay) {
        try {
          await fetch(`/api/music/${musicId}/play`, {
            method: 'POST',
          });
          setHasTrackedPlay(true);
        } catch (error) {
          console.error('Failed to track play:', error);
        }
      }
    };

    trackPlay();
  }, [isPlaying, hasTrackedPlay, musicId]);

  // ... 残りのコード
}
```

### ステップ 4: 音楽カードへの再生回数表示

**ファイル名**: `components/music/MusicCard.tsx`（既に実装済み）

```typescript
// 既存のMusicCardコンポーネントにplay_countが表示されていることを確認
<div className="flex items-center gap-1">
  <TrendingUp className="h-3.5 w-3.5" />
  <span>{music.playCount.toLocaleString()} 再生</span>
</div>
```

---

## 統計情報の表示

### ステップ 5: 統計情報コンポーネント

**ファイル名**: `components/music/MusicStats.tsx`

```typescript
import { TrendingUp, Download, Music, Clock } from 'lucide-react';
import { getMusicStats } from '@/lib/db/queries';
import { formatDuration } from '@/lib/utils';

export async function MusicStats() {
  const stats = await getMusicStats();

  const statItems = [
    {
      icon: Music,
      label: '総音楽数',
      value: stats.totalMusic.toLocaleString(),
      color: 'text-primary-600',
      bg: 'bg-primary-100',
    },
    {
      icon: TrendingUp,
      label: '総再生回数',
      value: stats.totalPlays.toLocaleString(),
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: Download,
      label: '総ダウンロード数',
      value: stats.totalDownloads.toLocaleString(),
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Clock,
      label: '平均楽曲時間',
      value: formatDuration(stats.averageDuration),
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### ステップ 6: ランディングページへの統合

**ファイル名**: `app/page.tsx`（統計セクション追加）

```typescript
import { MusicStats } from '@/components/music/MusicStats';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ... 既存のヒーローセクション */}

      {/* 統計セクション（新規追加） */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display">
              プラットフォーム統計
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Kaleido AI Musicの現在の統計情報
            </p>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-lg bg-gray-100 h-24" />
                ))}
              </div>
            }
          >
            <MusicStats />
          </Suspense>
        </div>
      </section>

      {/* ... 残りのセクション */}
    </div>
  );
}
```

---

## アップロード機能実装

### ステップ 7: アップロードフォームコンポーネント

**ファイル名**: `components/upload/MusicUploadForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, Image as ImageIcon, Music } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Category } from '@/lib/db/schema';

interface MusicUploadFormProps {
  categories: Category[];
}

export function MusicUploadForm({ categories }: MusicUploadFormProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  // フォームデータ
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    category: '',
    tags: '',
    aiPlatform: '',
    genre: '',
    mood: '',
    tempo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile || !imageFile) {
      alert('音楽ファイルと画像ファイルを選択してください');
      return;
    }

    setIsUploading(true);

    try {
      // 1. ファイルをアップロード
      const [audioUploadRes, imageUploadRes] = await Promise.all([
        uploadFile(audioFile, 'audio'),
        uploadFile(imageFile, 'image'),
      ]);

      if (!audioUploadRes.ok || !imageUploadRes.ok) {
        throw new Error('ファイルのアップロードに失敗しました');
      }

      const audioData = await audioUploadRes.json();
      const imageData = await imageUploadRes.json();

      // 2. 音楽メタデータを作成
      const duration = await getAudioDuration(audioFile);

      const musicData = {
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        audioUrl: audioData.url,
        imageUrl: imageData.url,
        duration: Math.floor(duration),
        fileSize: audioFile.size,
        category: formData.category,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        aiPlatform: formData.aiPlatform || undefined,
        genre: formData.genre || undefined,
        mood: formData.mood || undefined,
        tempo: formData.tempo ? parseInt(formData.tempo, 10) : undefined,
      };

      // 3. データベースに保存
      const createRes = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(musicData),
      });

      if (!createRes.ok) {
        throw new Error('音楽の作成に失敗しました');
      }

      const result = await createRes.json();

      alert('音楽をアップロードしました！');
      router.push(`/music/${result.data.id}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  // ファイルアップロード関数
  const uploadFile = async (file: File, type: 'audio' | 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  // 音楽ファイルの長さを取得
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', reject);
      audio.src = URL.createObjectURL(file);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ファイルアップロード */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* 音楽ファイル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            音楽ファイル <span className="text-red-500">*</span>
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 hover:bg-gray-100 transition-colors">
            <Music className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {audioFile ? audioFile.name : 'MP3ファイルを選択'}
            </span>
            <input
              type="file"
              accept="audio/mpeg,audio/mp3"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="hidden"
              required
            />
          </label>
        </div>

        {/* 画像ファイル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カバー画像 <span className="text-red-500">*</span>
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 hover:bg-gray-100 transition-colors">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {imageFile ? imageFile.name : '画像ファイルを選択'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="hidden"
              required
            />
          </label>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            アーティスト <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>
      </div>

      {/* 説明 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* カテゴリとタグ */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          >
            <option value="">選択してください</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タグ（カンマ区切り）
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="例: チルアウト, 作業用, リラックス"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* オプション情報 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">生成AI</label>
          <input
            type="text"
            value={formData.aiPlatform}
            onChange={(e) => setFormData({ ...formData, aiPlatform: e.target.value })}
            placeholder="例: Suno AI"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ジャンル</label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            placeholder="例: インディーポップ"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">BPM</label>
          <input
            type="number"
            value={formData.tempo}
            onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
            placeholder="例: 120"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isUploading} size="lg">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              アップロード中...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              アップロード
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
```

### ステップ 8: アップロードAPI

**ファイル名**: `app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { uploadMusic, uploadImage } from '@/lib/storage/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'audio' | 'image';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File is required' },
        { status: 400 }
      );
    }

    let url: string;
    if (type === 'audio') {
      url = await uploadMusic(file);
    } else if (type === 'image') {
      url = await uploadImage(file);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

### ステップ 9: アップロードページ

**ファイル名**: `app/upload/page.tsx`

```typescript
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
```

---

## ファイルバリデーション

### ステップ 10: バリデーション強化

**ファイル名**: `lib/storage/upload.ts`（更新版）

```typescript
import { put, del } from '@vercel/blob';

const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadMusic(file: File): Promise<string> {
  // ファイルタイプチェック
  if (!file.type.startsWith('audio/')) {
    throw new Error('音楽ファイル形式が正しくありません');
  }

  // ファイルサイズチェック
  if (file.size > MAX_AUDIO_SIZE) {
    throw new Error('音楽ファイルのサイズは50MB以下にしてください');
  }

  const timestamp = Date.now();
  const filename = `music/${timestamp}-${sanitizeFilename(file.name)}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return blob.url;
}

export async function uploadImage(file: File): Promise<string> {
  // ファイルタイプチェック
  if (!file.type.startsWith('image/')) {
    throw new Error('画像ファイル形式が正しくありません');
  }

  // ファイルサイズチェック
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('画像ファイルのサイズは10MB以下にしてください');
  }

  const timestamp = Date.now();
  const filename = `images/${timestamp}-${sanitizeFilename(file.name)}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

// ファイル名のサニタイズ
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}
```

---

## 動作確認

### ステップ 11: テスト

**テスト項目:**

1. **ダウンロード機能**
   - ダウンロードボタンをクリックしてファイルがダウンロードされる
   - ダウンロード数がデータベースで増加する
   - ファイル名が正しく設定される

2. **再生回数トラッキング**
   - 音楽を再生すると再生回数が増加する
   - 1回の再生で1回のみカウントされる

3. **アップロード機能**
   - 音楽ファイルと画像をアップロードできる
   - フォームバリデーションが動作する
   - アップロード後に音楽詳細ページにリダイレクトされる
   - データベースに正しく保存される

4. **ファイルバリデーション**
   - ファイルサイズ制限が機能する
   - ファイル形式チェックが機能する

---

## 成果物チェックリスト

### ダウンロード機能

- [ ] `components/music/DownloadButton.tsx` が作成されている
- [ ] ダウンロードボタンが動作する
- [ ] ダウンロード数がカウントされる
- [ ] ファイル名が適切に設定される

### 再生回数トラッキング

- [ ] 再生開始時に再生回数が増加する
- [ ] 重複カウントが防止されている

### 統計情報

- [ ] `components/music/MusicStats.tsx` が作成されている
- [ ] 統計情報が正しく表示される
- [ ] ランディングページに統計セクションがある

### アップロード機能

- [ ] `components/upload/MusicUploadForm.tsx` が作成されている
- [ ] `app/upload/page.tsx` が作成されている
- [ ] `app/api/upload/route.ts` が作成されている
- [ ] ファイルアップロードが動作する
- [ ] フォーム送信が動作する

### バリデーション

- [ ] ファイルサイズ制限が機能する
- [ ] ファイル形式チェックが機能する
- [ ] エラーメッセージが適切に表示される

---

## 次のステップ

Phase 5が完了したら、Phase 6「モバイル最適化」に進みます。

**次のドキュメント**: `20251023_06-mobile-optimization.md`

Phase 6では以下を実装します:
- レスポンシブデザイン調整
- タッチ操作最適化
- パフォーマンスチューニング

---

## まとめ

Phase 5では、ダウンロード機能と統計トラッキング、アップロード機能を実装しました。

**達成したこと:**
- ✅ ダウンロード機能
- ✅ 再生回数トラッキング
- ✅ ダウンロード数トラッキング
- ✅ 統計情報表示
- ✅ 管理者向けアップロード機能
- ✅ ファイルバリデーション

**所要時間:** 約1日（8時間）

次のPhaseに進む準備が整いました！

---

**ドキュメント作成者**: AI Agent (Claude)
**作成日**: 2025年10月23日
**バージョン**: 1.0
