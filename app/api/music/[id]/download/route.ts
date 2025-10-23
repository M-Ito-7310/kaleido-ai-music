import { NextRequest, NextResponse } from 'next/server';
import { incrementDownloadCount } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';

// POST /api/music/[id]/download - ダウンロード回数をインクリメント
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid music ID',
        } as ApiResponse,
        { status: 400 }
      );
    }

    await incrementDownloadCount(id);

    return NextResponse.json({
      success: true,
      message: 'Download count incremented',
    } as ApiResponse);
  } catch (error) {
    console.error('Error incrementing download count:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to increment download count',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
