import { put, del } from '@vercel/blob';

/**
 * 音楽ファイルをアップロード
 */
export async function uploadMusic(file: File): Promise<string> {
  if (!file.type.startsWith('audio/')) {
    throw new Error('File must be an audio file');
  }

  const timestamp = Date.now();
  const filename = `music/${timestamp}-${file.name}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return blob.url;
}

/**
 * 画像ファイルをアップロード
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image file');
  }

  const timestamp = Date.now();
  const filename = `images/${timestamp}-${file.name}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type,
  });

  return blob.url;
}

/**
 * ファイルを削除
 */
export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

/**
 * ファイルサイズをバリデーション
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * ファイルタイプをバリデーション
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => file.type.startsWith(type));
}
