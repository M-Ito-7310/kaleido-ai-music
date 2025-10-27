'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, Upload, Loader2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function AdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsMobileMenuOpen(false);

    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      } else {
        alert('ログアウトに失敗しました');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('ログアウトに失敗しました');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ・タイトル */}
          <Link href="/admin" className="flex items-center">
            <Shield className="h-6 w-6 text-primary-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900 font-display">
              管理者ダッシュボード
            </h1>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/admin/music/upload"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Upload className="h-4 w-4 mr-1" />
              音楽アップロード
            </Link>

            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              サイトを表示
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ログアウト中...
                </>
              ) : (
                <>
                  <LogOut className="mr-1 h-4 w-4" />
                  ログアウト
                </>
              )}
            </Button>
          </nav>

          {/* モバイルハンバーガーボタン */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="メニューを開く"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/admin/music/upload"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Upload className="h-4 w-4 mr-2" />
                音楽アップロード
              </Link>

              <Link
                href="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                サイトを表示
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ログアウト中...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </>
                )}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
