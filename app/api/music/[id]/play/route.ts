import { NextRequest, NextResponse } from 'next/server';
import { incrementPlayCount } from '@/lib/db/queries';

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

    // 再生回数をインクリメント
    await incrementPlayCount(musicId);

    return NextResponse.json({
      success: true,
      message: 'Play count incremented',
    });
  } catch (error) {
    console.error('Play tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track play',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
