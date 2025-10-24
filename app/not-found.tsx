import Link from 'next/link';
import { Home, Music } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <Music className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              <Home className="mr-2 h-4 w-4" />
              ホームへ
            </Button>
          </Link>
          <Link href="/library">
            <Button variant="outline">
              <Music className="mr-2 h-4 w-4" />
              ライブラリへ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
