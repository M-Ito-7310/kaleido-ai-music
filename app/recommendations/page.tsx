'use client';

import { useState, useEffect } from 'react';
import { RecommendationGrid } from '@/components/music/RecommendationGrid';
import { AIRadio } from '@/components/music/AIRadio';
import type { Music } from '@/lib/db/schema';
import { Loader2 } from 'lucide-react';

/**
 * Recommendations Page
 *
 * Features:
 * - AI Radio with mood-based stations
 * - Personalized recommendations based on listening history
 */
export default function RecommendationsPage() {
  const [allTracks, setAllTracks] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTracks() {
      try {
        const response = await fetch('/api/music');
        if (!response.ok) throw new Error('Failed to fetch music');
        const data = await response.json();
        setAllTracks(data);
      } catch (error) {
        console.error('Error loading tracks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTracks();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* AI Radio Section */}
      <AIRadio allTracks={allTracks} />

      {/* Personalized Recommendations Section */}
      <RecommendationGrid allTracks={allTracks} limit={18} title="Recommended for You" />
    </div>
  );
}
