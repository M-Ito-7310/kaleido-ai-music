import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth/middleware';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 管理者ページへのアクセスをチェック
  if (pathname.startsWith('/admin')) {
    // ログインページは除外
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 認証チェック
    if (!isAuthenticated(request)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
