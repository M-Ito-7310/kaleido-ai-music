export const dynamic = 'force-dynamic';
import { getMusicList } from '@/lib/db/queries';
import { MusicGrid } from '@/components/music/MusicGrid';

export const metadata = {
  title: '音楽ライブラリ - Kaleido AI Music',
  description: 'AI生成音楽のライブラリ。様々なジャンル、ムードの音楽を視聴・ダウンロードできます。',
};

export default async function LibraryPage() {
  const musicList = await getMusicList({ limit: 20 });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">音楽ライブラリ</h1>
          <p className="mt-2 text-gray-600">
            AI生成音楽を視聴・ダウンロードできます
          </p>
        </div>

        <MusicGrid musicList={musicList} />
      </div>
    </div>
  );
}
