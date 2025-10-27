import { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

/**
 * ミドルウェアでセッションを検証
 * ※ Edge Runtimeでは外部モジュール（crypto等）に制限があるため、
 * シンプルなCookie存在チェックのみ行う
 */
export function isAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  return !!sessionCookie?.value;
}
