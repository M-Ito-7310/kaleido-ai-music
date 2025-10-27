import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7日間

// セッションストレージ（本番環境ではRedisなどを使用することを推奨）
// 開発環境ではメモリ内に保存
const sessions = new Map<string, { userId: string; expiresAt: number }>();

/**
 * 新しいセッションを作成
 */
export async function createSession(userId: string): Promise<string> {
  const sessionId = randomUUID();
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;

  sessions.set(sessionId, { userId, expiresAt });

  // Cookieに保存
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return sessionId;
}

/**
 * セッションを検証
 */
export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return false;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return false;
  }

  // セッションの有効期限をチェック
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return false;
  }

  return true;
}

/**
 * セッションを取得
 */
export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = sessions.get(sessionId);

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      sessions.delete(sessionId);
    }
    return null;
  }

  return { userId: session.userId };
}

/**
 * セッションを削除（ログアウト）
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * パスワードを検証
 */
export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return false;
  }

  return password === adminPassword;
}
