export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';
import { getMusicList, createMusic } from '@/lib/db/queries';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Music } from '@/lib/db/schema';
import { z } from 'zod';

// 認証チェックヘルパー
async function checkAuth() {
  const isAuthenticated = await validateSession();
  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        error: '認証が必要です',
      } as ApiResponse,
      { status: 401 }
    );
  }
  return null;
}

// GET /api/admin/music - 音楽一覧を取得（管理者専用）
export async function GET(request: NextRequest) {
  // 認証チェック
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;

    // クエリパラメータを取得
    const category = searchParams.get('category') || undefined;
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',') : undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('sortBy') as 'latest' | 'popular' | 'downloads') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 音楽リストを取得
    const musicList = await getMusicList({
      category,
      tags,
      search,
      sortBy,
      limit,
      offset,
    });

    // レスポンス
    const response: PaginatedResponse<Music> = {
      success: true,
      data: musicList,
      pagination: {
        total: musicList.length,
        limit,
        offset,
        hasMore: musicList.length === limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching music list:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch music list',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST /api/admin/music - 新しい音楽を作成（管理者専用）
const createMusicSchema = z.object({
  title: z.string().min(1).max(255),
  artist: z.string().min(1).max(255).default('Unknown Artist'),
  description: z.string().optional(),
  audioUrl: z.string().url(),
  imageUrl: z.string().default(''),
  duration: z.number().positive(),
  fileSize: z.number().positive().optional(),
  category: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  aiPlatform: z.string().max(100).nullable().optional(),
  shareLink: z.string().url().nullable().optional().or(z.literal('')),
  youtubeUrl: z.string().url().nullable().optional().or(z.literal('')),
  genre: z.string().max(100).nullable().optional(),
  mood: z.string().max(100).nullable().optional(),
  tempo: z.number().optional(),
});

export async function POST(request: NextRequest) {
  // 認証チェック
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    // バリデーション
    const validatedData = createMusicSchema.parse(body);

    // 音楽を作成（isPublishedを明示的に1に設定してすぐに公開）
    const newMusic = await createMusic({
      ...validatedData,
      isPublished: 1,
    });

    return NextResponse.json(
      {
        success: true,
        data: newMusic,
        message: 'Music created successfully',
      } as ApiResponse<Music>,
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.issues.map((e) => e.message).join(', '),
        } as ApiResponse,
        { status: 400 }
      );
    }

    console.error('Error creating music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
