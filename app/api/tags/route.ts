import { NextRequest, NextResponse } from 'next/server';
import { getTags } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
import type { Tag } from '@/lib/db/schema';

// GET /api/tags - タグ一覧を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const tagsList = await getTags(limit);

    return NextResponse.json({
      success: true,
      data: tagsList,
    } as ApiResponse<Tag[]>);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tags',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
