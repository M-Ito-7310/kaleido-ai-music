import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/**
 * ローディングスケルトンコンポーネント
 * コンテンツの形状を模倣したプレースホルダー
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
    />
  );
}

/**
 * 音楽カード用スケルトン
 */
export function MusicCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* サムネイル */}
      <Skeleton className="aspect-square w-full" />

      {/* 情報 */}
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />

        {/* メタデータ */}
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * プレイヤー用スケルトン
 */
export function PlayerSkeleton() {
  return (
    <div className="rounded-lg bg-gray-100 p-6">
      <Skeleton className="h-5 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-2 w-full mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-2 w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * グリッド用スケルトン
 */
export function MusicGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <MusicCardSkeleton key={i} />
      ))}
    </div>
  );
}
