'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import type { Category, Music } from '@/lib/db/schema';

interface MusicEditFormProps {
  music: Music;
  categories: Category[];
}

export function MusicEditForm({ music, categories }: MusicEditFormProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // フォームデータ
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(music.imageUrl);
  const [formData, setFormData] = useState({
    title: music.title,
    description: music.description || '',
    category: music.category,
    tags: Array.isArray(music.tags) ? music.tags.join(', ') : '',
    mood: music.mood || '',
    aiPlatform: music.aiPlatform || '',
    shareLink: music.shareLink || '',
  });

  // 画像ファイル選択時のプレビュー
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 更新処理
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let imageUrl = music.imageUrl;

      // 画像が変更されている場合はアップロード
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('type', 'image');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error('画像のアップロードに失敗しました');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // 音楽情報を更新
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        imageUrl,
        category: formData.category,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      // オプションフィールドは値がある場合のみ追加
      if (formData.mood) updateData.mood = formData.mood;
      if (formData.aiPlatform) updateData.aiPlatform = formData.aiPlatform;
      if (formData.shareLink) updateData.shareLink = formData.shareLink;

      // デバッグ用：送信データをコンソールに出力
      console.log('🔍 DEBUG - Form Data:', formData);
      console.log('🔍 DEBUG - Update Data (送信内容):', updateData);
      console.log('🔍 DEBUG - aiPlatform value:', formData.aiPlatform, 'Type:', typeof formData.aiPlatform);
      console.log('🔍 DEBUG - Update Data contains aiPlatform?', 'aiPlatform' in updateData, 'Value:', updateData.aiPlatform);
      console.log('🔍 DEBUG - JSON stringify:', JSON.stringify(updateData, null, 2));

      const updateRes = await fetch(`/api/admin/music/${music.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.message || '更新に失敗しました');
      }

      alert('音楽情報を更新しました！');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Update error:', error);
      alert(error instanceof Error ? error.message : '更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const deleteRes = await fetch(`/api/admin/music/${music.id}`, {
        method: 'DELETE',
      });

      if (!deleteRes.ok) {
        const errorData = await deleteRes.json();
        throw new Error(errorData.message || '削除に失敗しました');
      }

      alert('音楽を削除しました');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : '削除に失敗しました');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* サムネイルプレビュー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サムネイル画像
          </label>
          <div className="flex items-start gap-4">
            {/* プレビュー */}
            {imagePreview && (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={imagePreview}
                  alt="サムネイル"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* ファイル選択 */}
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 hover:bg-gray-100 transition-colors flex-1">
              <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {imageFile ? imageFile.name : '新しい画像を選択（任意）'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* タイトル */}
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Platform（任意）
            </label>
            <select
              value={formData.aiPlatform}
              onChange={(e) => setFormData({ ...formData, aiPlatform: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">選択してください</option>
              <option value="Suno AI">Suno AI</option>
              <option value="Udio">Udio</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </div>

        {/* 共有リンク */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            共有リンク（任意）
          </label>
          <input
            type="url"
            value={formData.shareLink}
            onChange={(e) => setFormData({ ...formData, shareLink: e.target.value })}
            placeholder="例: https://suno.com/song/..."
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* ボタン */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isUpdating || isDeleting}
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            削除
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isUpdating || isDeleting}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isUpdating || isDeleting}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  更新中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  更新
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* 削除確認モーダル */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={music.title}
        isDeleting={isDeleting}
      />
    </>
  );
}
