import { Music, Category, Tag } from '@/lib/db/schema';

// 音楽詳細型（関連データを含む）
export interface MusicWithDetails extends Music {
  categoryInfo?: Category;
  tagsList?: Tag[];
}

// 音楽フィルター型
export interface MusicFilter {
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'latest' | 'popular' | 'downloads';
  limit?: number;
  offset?: number;
}

// 音楽統計型
export interface MusicStats {
  totalPlays: number;
  totalDownloads: number;
  totalMusic: number;
  averageDuration: number;
}

// ファイルアップロード型
export interface MusicUploadData {
  title: string;
  artist: string;
  description?: string;
  category: string;
  tags: string[];
  aiPlatform?: string;
  genre?: string;
  mood?: string;
  tempo?: number;
}

// 音楽カード表示用型
export interface MusicCardData {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  duration: number;
  category: string;
  playCount: number;
  createdAt: Date;
}
