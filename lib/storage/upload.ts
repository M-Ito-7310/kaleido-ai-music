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
