'use client';

import { useEffect, useState } from 'react';
import { MusicCard } from './MusicCard';
import type { Music } from '@/lib/db/schema';
import { getPersonalizedRecommendations } from '@/lib/ai/recommendationEngine';
import { Loader2 } from 'lucide-react';

interface RecommendationGridProps {
  allTracks: Music[];
  limit?: number;
  title?: string;
}

/**
 * RecommendationGrid component
 *
 * Displays personalized music recommendations based on listening history
 *
 * Features:
 * - Content-based filtering
 * - Collaborative filtering from history
 * - Loading states
 */
export function RecommendationGrid({ allTracks, limit = 12, title = 'Recommended for You' }: RecommendationGridProps) {
  const [recommendations, setRecommendations] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      setIsLoading(true);
      try {
        const recommended = await getPersonalizedRecommendations(allTracks, limit);
        setRecommendations(recommended);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        // Fallback: show random tracks
        const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
        setRecommendations(shuffled.slice(0, limit));
      } finally {
        setIsLoading(false);
      }
    }

    if (allTracks.length > 0) {
      loadRecommendations();
    }
  }, [allTracks, limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Start listening to music to get personalized recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {recommendations.map((track) => (
          <MusicCard key={track.id} music={track} playlist={recommendations} />
        ))}
      </div>
    </div>
  );
}
