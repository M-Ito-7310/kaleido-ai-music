import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kaleido AI Music - AI生成音楽ライブラリ',
  description:
    'AI生成音楽を展示・共有できるプラットフォーム。Suno AI、Udio等で生成した音楽を視聴・ダウンロードできます。',
  keywords: ['AI音楽', 'AI Music', 'Suno AI', 'Udio', '音楽ライブラリ', '無料音楽'],
  authors: [{ name: 'Kaleido Future' }],
  openGraph: {
    title: 'Kaleido AI Music',
    description: 'AI生成音楽ライブラリプラットフォーム',
    type: 'website',
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
