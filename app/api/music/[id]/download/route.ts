import { NextRequest, NextResponse } from 'next/server';
import { incrementDownloadCount } from '@/lib/db/queries';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const musicId = parseInt(params.id, 10);

    if (isNaN(musicId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid music ID' },
        { status: 400 }
      );
    }

    // ダウンロード数をインクリメント
    await incrementDownloadCount(musicId);

    return NextResponse.json({
      success: true,
      message: 'Download count incremented',
    });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track download',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
