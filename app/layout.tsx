import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Kaleido AI Music - AI生成音楽ライブラリ',
    template: '%s | Kaleido AI Music',
  },
  description:
    'AI生成音楽を展示・共有できるプラットフォーム。Suno AI、Udio等で生成した音楽を視聴・ダウンロードできます。',
  keywords: ['AI音楽', 'AI Music', 'Suno AI', 'Udio', '音楽ライブラリ', '無料音楽'],
  authors: [{ name: 'Kaleido Future' }],
  creator: 'Kaleido Future',
  metadataBase: new URL('https://kaleidoaimusic.kaleidofuture.com'),
  openGraph: {
    title: 'Kaleido AI Music - AI生成音楽ライブラリ',
    description: 'AI生成音楽を展示・共有できるプラットフォーム',
    type: 'website',
    locale: 'ja_JP',
    url: 'https://kaleidoaimusic.kaleidofuture.com',
    siteName: 'Kaleido AI Music',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kaleido AI Music',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaleido AI Music - AI生成音楽ライブラリ',
    description: 'AI生成音楽を展示・共有できるプラットフォーム',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // PWA対応
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kaleido Music',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
