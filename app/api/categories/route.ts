import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
import type { Category } from '@/lib/db/schema';

// GET /api/categories - カテゴリ一覧を取得
export async function GET() {
  try {
    const categoriesList = await getCategories();

    return NextResponse.json({
      success: true,
      data: categoriesList,
    } as ApiResponse<Category[]>);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
