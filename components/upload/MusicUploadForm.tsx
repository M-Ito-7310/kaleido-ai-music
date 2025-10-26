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
    description: '',
    category: '',
    tags: '',
    mood: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      alert('音楽ファイルを選択してください');
      return;
    }

    setIsUploading(true);

    try {
      // 1. ファイルをアップロード
      const uploadPromises: Promise<Response>[] = [uploadFile(audioFile, 'audio')];

      if (imageFile) {
        uploadPromises.push(uploadFile(imageFile, 'image'));
      }

      const uploadResults = await Promise.all(uploadPromises);
      const audioUploadRes = uploadResults[0];
      const imageUploadRes = uploadResults[1];

      if (!audioUploadRes.ok) {
        throw new Error('音楽ファイルのアップロードに失敗しました');
      }

      if (imageFile && !imageUploadRes?.ok) {
        throw new Error('画像ファイルのアップロードに失敗しました');
      }

      const audioData = await audioUploadRes.json();
      const imageData = imageFile ? await imageUploadRes.json() : null;

      // 2. 音楽メタデータを作成
      const duration = await getAudioDuration(audioFile);

      const musicData = {
        title: formData.title,
        artist: 'Unknown Artist',
        description: formData.description,
        audioUrl: audioData.url,
        imageUrl: imageData?.url || '',
        duration: Math.floor(duration),
        fileSize: audioFile.size,
        category: formData.category,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        mood: formData.mood || undefined,
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
            カバー画像（任意）
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 hover:bg-gray-100 transition-colors">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {imageFile ? imageFile.name : '画像ファイルを選択（省略可）'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 基本情報 */}
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ムード</label>
        <input
          type="text"
          value={formData.mood}
          onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
          placeholder="例: リラックス, エネルギッシュ"
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
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
