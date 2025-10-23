import { NextRequest, NextResponse } from 'next/server';
import { incrementPlayCount } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';

// POST /api/music/[id]/play - 再生回数をインクリメント
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

    await incrementPlayCount(id);

    return NextResponse.json({
      success: true,
      message: 'Play count incremented',
    } as ApiResponse);
  } catch (error) {
    console.error('Error incrementing play count:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to increment play count',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
