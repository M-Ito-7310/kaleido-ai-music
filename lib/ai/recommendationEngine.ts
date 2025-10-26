import type { Music } from '@/lib/db/schema';
import { getRecentHistory } from '@/lib/db/indexedDB';

/**
 * Lightweight Recommendation Engine
 *
 * Uses content-based filtering and collaborative filtering
 * without heavy ML libraries like TensorFlow.js
 */

export interface RecommendationScore {
  trackId: number;
  score: number;
  reason: string;
}

/**
 * Calculate similarity between two tracks based on metadata
 *
 * Factors:
 * - Same category: +0.4
 * - Shared tags: +0.1 per tag
 * - Similar duration: +0.2
 */
export function calculateContentSimilarity(track1: Music, track2: Music): number {
  let score = 0;

  // Same category
  if (track1.category === track2.category) {
    score += 0.4;
  }

  // Shared tags
  const tags1 = track1.tags || [];
  const tags2 = track2.tags || [];
  const sharedTags = tags1.filter((tag) => tags2.includes(tag));
  score += sharedTags.length * 0.1;

  // Similar duration (within 30 seconds)
  const durationDiff = Math.abs(track1.duration - track2.duration);
  if (durationDiff < 30) {
    score += 0.2;
  }

  // Same artist
  if (track1.artist === track2.artist) {
    score += 0.3;
  }

  return Math.min(score, 1.0); // Cap at 1.0
}

/**
 * Get recommended tracks based on a seed track
 *
 * @param seedTrack - The track to base recommendations on
 * @param allTracks - All available tracks
 * @param limit - Maximum number of recommendations
 */
export function getRecommendationsForTrack(
  seedTrack: Music,
  allTracks: Music[],
  limit: number = 10
): Music[] {
  const scores: RecommendationScore[] = [];

  for (const track of allTracks) {
    // Skip the seed track itself
    if (track.id === seedTrack.id) continue;

    const similarity = calculateContentSimilarity(seedTrack, track);

    if (similarity > 0) {
      scores.push({
        trackId: track.id,
        score: similarity,
        reason: `Similar to ${seedTrack.title}`,
      });
    }
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Get top N tracks
  const topScores = scores.slice(0, limit);
  const recommendedTracks = topScores
    .map((score) => allTracks.find((t) => t.id === score.trackId))
    .filter((t): t is Music => t !== undefined);

  return recommendedTracks;
}

/**
 * Get personalized recommendations based on listening history
 *
 * @param allTracks - All available tracks
 * @param limit - Maximum number of recommendations
 */
export async function getPersonalizedRecommendations(
  allTracks: Music[],
  limit: number = 10
): Promise<Music[]> {
  // Get recent listening history
  const history = await getRecentHistory();

  if (history.length === 0) {
    // No history, return popular tracks
    return allTracks
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, limit);
  }

  // Get unique track IDs from history
  const historyTrackIds = [...new Set(history.map((h) => h.trackId))];

  // Find tracks from history
  const historyTracks = historyTrackIds
    .map((id) => allTracks.find((t) => t.id === id))
    .filter((t): t is Music => t !== undefined);

  // Aggregate scores from all history tracks
  const scoreMap = new Map<number, number>();

  for (const historyTrack of historyTracks) {
    const recommendations = getRecommendationsForTrack(historyTrack, allTracks, 20);

    for (const rec of recommendations) {
      const currentScore = scoreMap.get(rec.id) || 0;
      const similarity = calculateContentSimilarity(historyTrack, rec);
      scoreMap.set(rec.id, currentScore + similarity);
    }
  }

  // Filter out tracks already in history
  const historySet = new Set(historyTrackIds);
  const filteredScores = Array.from(scoreMap.entries()).filter(
    ([trackId]) => !historySet.has(trackId)
  );

  // Sort by aggregated score
  filteredScores.sort((a, b) => b[1] - a[1]);

  // Get top N tracks
  const topTrackIds = filteredScores.slice(0, limit).map(([id]) => id);
  const recommendedTracks = topTrackIds
    .map((id) => allTracks.find((t) => t.id === id))
    .filter((t): t is Music => t !== undefined);

  return recommendedTracks;
}

/**
 * Get tracks similar to a given category
 */
export function getTracksByCategory(
  category: string,
  allTracks: Music[],
  limit: number = 10
): Music[] {
  return allTracks.filter((t) => t.category === category).slice(0, limit);
}

/**
 * Get tracks with specific tags
 */
export function getTracksByTags(
  tags: string[],
  allTracks: Music[],
  limit: number = 10
): Music[] {
  const matches = allTracks.filter((track) => {
    const trackTags = track.tags || [];
    return tags.some((tag) => trackTags.includes(tag));
  });

  return matches.slice(0, limit);
}
