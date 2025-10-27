'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GlobalPlayer } from '@/components/music/GlobalPlayer';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import { ScreenReaderAnnouncer } from '@/components/accessibility/ScreenReaderAnnouncer';
import { GamificationOverlay } from '@/components/gamification/GamificationOverlay';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // 管理者ページでは通常のレイアウト要素を表示しない
    return <>{children}</>;
  }

  // 通常のページでは全てのレイアウト要素を表示
  return (
    <>
      {/* Accessibility Features */}
      <ScreenReaderAnnouncer />

      {/* Main App */}
      <OfflineIndicator />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <GlobalPlayer />
      <InstallPrompt />

      {/* Gamification Overlay */}
      <GamificationOverlay />
    </>
  );
}
