import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7日間

// メモリベースのセッションストア（開発用）
const sessionStore = new Map<string, { userId: string; expiresAt: Date }>();

/**
 * 新しいセッションを作成
 */
export async function createSession(userId: string): Promise<string> {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  console.log('[Session] Creating new session for userId:', userId);

  // メモリにセッションを保存
  sessionStore.set(sessionId, { userId, expiresAt });

  console.log('[Session] Session created in memory:', sessionId);

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

  console.log('[Session] Validating session. SessionId:', sessionId ? 'exists' : 'missing');

  if (!sessionId) {
    console.log('[Session] No session cookie found');
    return false;
  }

  // メモリからセッションを取得
  const session = sessionStore.get(sessionId);

  if (!session) {
    console.log('[Session] Session not found in memory');
    return false;
  }

  // セッションの有効期限をチェック
  if (new Date() > session.expiresAt) {
    console.log('[Session] Session expired');
    sessionStore.delete(sessionId);
    return false;
  }

  console.log('[Session] Session valid');
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

  // メモリからセッションを取得
  const session = sessionStore.get(sessionId);

  if (!session || new Date() > session.expiresAt) {
    if (session) {
      sessionStore.delete(sessionId);
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
    sessionStore.delete(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * 期限切れセッションをクリーンアップ
 * （定期的に実行することを推奨）
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const now = new Date();
  let count = 0;

  for (const [sessionId, session] of sessionStore.entries()) {
    if (now > session.expiresAt) {
      sessionStore.delete(sessionId);
      count++;
    }
  }

  console.log('[Session] Cleaned up expired sessions:', count);
  return count;
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
