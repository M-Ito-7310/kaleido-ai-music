export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getMusicList } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
import type { Music } from '@/lib/db/schema';

// GET /api/music/popular - 再生数上位の音楽を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '3', 10);

    // 再生数でソートして上位を取得
    const popularMusic = await getMusicList({
      sortBy: 'popular',
      limit,
      offset: 0,
    });

    const response: ApiResponse<Music[]> = {
      success: true,
      data: popularMusic,
      message: `Top ${popularMusic.length} popular music retrieved successfully`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching popular music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch popular music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
