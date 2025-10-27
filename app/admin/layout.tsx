'use client';

import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // 管理者ページは独立したレイアウトで、通常のヘッダー・フッターを表示しない
  // ログインページではAdminHeaderも表示しない
  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && <AdminHeader />}
      <main>{children}</main>
    </div>
  );
}
