import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';
import { uploadMusic, uploadImage } from '@/lib/storage/upload';

export async function POST(request: NextRequest) {
  console.log('[Upload API] Request received');

  // 認証チェック
  const isAuthenticated = await validateSession();
  console.log('[Upload API] Authentication check:', isAuthenticated);

  if (!isAuthenticated) {
    console.error('[Upload API] Authentication failed - session invalid');
    return NextResponse.json(
      { success: false, error: '認証が必要です' },
      { status: 401 }
    );
  }

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
