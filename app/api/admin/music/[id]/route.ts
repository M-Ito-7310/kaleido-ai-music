export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateSession } from '@/lib/auth/session';
import { getMusicById, updateMusic, deleteMusic } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
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

// GET /api/admin/music/[id] - 音楽詳細を取得（管理者専用）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 認証チェック
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const musicId = parseInt(params.id, 10);

    if (isNaN(musicId)) {
      return NextResponse.json(
        {
          success: false,
          error: '無効なIDです',
        } as ApiResponse,
        { status: 400 }
      );
    }

    const music = await getMusicById(musicId);

    if (!music) {
      return NextResponse.json(
        {
          success: false,
          error: '音楽が見つかりません',
        } as ApiResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: music,
    } as ApiResponse<Music>);
  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// PATCH /api/admin/music/[id] - 音楽を更新（管理者専用）
const updateMusicSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  artist: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
  aiPlatform: z.string().max(100).nullable().optional(),
  shareLink: z.string().url().nullable().optional().or(z.literal('')),
  youtubeUrl: z.string().url().nullable().optional().or(z.literal('')),
  genre: z.string().max(100).nullable().optional(),
  mood: z.string().max(100).nullable().optional(),
  tempo: z.number().optional(),
  isPublished: z.number().min(0).max(1).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 認証チェック
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const musicId = parseInt(params.id, 10);

    if (isNaN(musicId)) {
      return NextResponse.json(
        {
          success: false,
          error: '無効なIDです',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 音楽が存在するか確認
    const existingMusic = await getMusicById(musicId);
    if (!existingMusic) {
      return NextResponse.json(
        {
          success: false,
          error: '音楽が見つかりません',
        } as ApiResponse,
        { status: 404 }
      );
    }

    const body = await request.json();

    // バリデーション
    const validatedData = updateMusicSchema.parse(body);

    // 音楽を更新
    const updatedMusic = await updateMusic(musicId, validatedData);

    // 関連ページのキャッシュを無効化（タグや件数、カテゴリが変更された可能性があるため）
    revalidatePath('/', 'layout'); // すべてのページを再検証
    revalidatePath('/');
    revalidatePath('/library');
    revalidatePath('/admin/music');
    revalidatePath(`/music/${musicId}`); // 詳細ページも更新

    return NextResponse.json({
      success: true,
      data: updatedMusic,
      message: '音楽情報を更新しました',
    } as ApiResponse<Music>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'バリデーションエラー',
          message: error.issues.map((e) => e.message).join(', '),
        } as ApiResponse,
        { status: 400 }
      );
    }

    console.error('Error updating music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE /api/admin/music/[id] - 音楽を削除（管理者専用）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 認証チェック
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const musicId = parseInt(params.id, 10);

    if (isNaN(musicId)) {
      return NextResponse.json(
        {
          success: false,
          error: '無効なIDです',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 音楽が存在するか確認
    const existingMusic = await getMusicById(musicId);
    if (!existingMusic) {
      return NextResponse.json(
        {
          success: false,
          error: '音楽が見つかりません',
        } as ApiResponse,
        { status: 404 }
      );
    }

    // 音楽を削除
    await deleteMusic(musicId);

    // 関連ページのキャッシュを無効化（件数、タグ、カテゴリが変更されるため）
    revalidatePath('/', 'layout'); // すべてのページを再検証
    revalidatePath('/');
    revalidatePath('/library');
    revalidatePath('/admin/music');

    return NextResponse.json({
      success: true,
      message: '音楽を削除しました',
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting music:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete music',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
