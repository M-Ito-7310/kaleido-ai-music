import { NextRequest, NextResponse } from 'next/server';
import { createSession, validatePassword } from '@/lib/auth/session';
import { z } from 'zod';

const loginSchema = z.object({
  password: z.string().min(1, 'パスワードを入力してください'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { password } = result.data;

    // パスワードを検証
    if (!validatePassword(password)) {
      return NextResponse.json(
        { success: false, error: 'パスワードが正しくありません' },
        { status: 401 }
      );
    }

    // セッションを作成
    await createSession('admin');

    return NextResponse.json({
      success: true,
      message: 'ログインに成功しました',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ログインに失敗しました',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
