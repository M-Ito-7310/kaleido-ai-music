import { NextRequest, NextResponse } from 'next/server';
import { getMusicById, updateMusic, deleteMusic } from '@/lib/db/queries';
import type { ApiResponse } from '@/types/api';
import type { Music } from '@/lib/db/schema';
import { z } from 'zod';

// GET /api/music/[id] - 音楽詳細を取得
export async function GET(
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

    const music = await getMusicById(id);

    if (!music) {
      return NextResponse.json(
        {
          success: false,
          error: 'Music not found',
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

// PUT /api/music/[id] - 音楽を更新
const updateMusicSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  artist: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string()).optional(),
  aiPlatform: z.string().max(100).optional(),
  genre: z.string().max(100).optional(),
  mood: z.string().max(100).optional(),
  tempo: z.number().optional(),
  isPublished: z.number().min(0).max(1).optional(),
});

export async function PUT(
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

    const body = await request.json();
    const validatedData = updateMusicSchema.parse(body);

    const updatedMusic = await updateMusic(id, validatedData);

    if (!updatedMusic) {
      return NextResponse.json(
        {
          success: false,
          error: 'Music not found',
        } as ApiResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMusic,
      message: 'Music updated successfully',
    } as ApiResponse<Music>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.errors.map((e) => e.message).join(', '),
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

// DELETE /api/music/[id] - 音楽を削除
export async function DELETE(
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

    await deleteMusic(id);

    return NextResponse.json({
      success: true,
      message: 'Music deleted successfully',
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
