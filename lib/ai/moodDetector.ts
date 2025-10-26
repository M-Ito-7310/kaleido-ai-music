import type { Music } from '@/lib/db/schema';

/**
 * Mood Detection System
 *
 * Classifies tracks into moods based on metadata (category, tags, BPM estimates)
 * Lightweight alternative to ML-based mood detection
 */

export type Mood = 'happy' | 'sad' | 'energetic' | 'calm' | 'romantic' | 'melancholic';

export interface MoodClassification {
  mood: Mood;
  confidence: number; // 0-1
}

/**
 * Mood keywords mapping
 */
const MOOD_KEYWORDS: Record<Mood, string[]> = {
  happy: ['happy', 'upbeat', 'cheerful', 'joyful', 'positive', 'bright', 'fun', 'party'],
  sad: ['sad', 'melancholy', 'sorrow', 'blue', 'lonely', 'crying', 'tearful'],
  energetic: ['energetic', 'intense', 'powerful', 'aggressive', 'fast', 'hype', 'workout', 'gym'],
  calm: ['calm', 'peaceful', 'relaxing', 'ambient', 'chill', 'soft', 'meditation', 'sleep'],
  romantic: ['romantic', 'love', 'passion', 'tender', 'intimate', 'valentine'],
  melancholic: ['melancholic', 'nostalgic', 'wistful', 'bittersweet', 'longing'],
};

/**
 * Category to mood mapping
 */
const CATEGORY_MOOD_MAP: Record<string, Mood[]> = {
  'Electronic': ['energetic', 'happy'],
  'Rock': ['energetic', 'happy'],
  'Pop': ['happy', 'romantic'],
  'Classical': ['calm', 'melancholic'],
  'Jazz': ['calm', 'romantic'],
  'Ambient': ['calm'],
  'Hip Hop': ['energetic', 'happy'],
  'R&B': ['romantic', 'calm'],
  'Country': ['happy', 'melancholic'],
  'Indie': ['melancholic', 'calm'],
};

/**
 * Detect mood from track metadata
 *
 * @param track - Music track to analyze
 * @returns Array of mood classifications with confidence scores
 */
export function detectMood(track: Music): MoodClassification[] {
  const classifications: Map<Mood, number> = new Map();

  // Initialize all moods with 0 score
  const allMoods: Mood[] = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'melancholic'];
  allMoods.forEach((mood) => classifications.set(mood, 0));

  // Score based on category
  if (track.category && CATEGORY_MOOD_MAP[track.category]) {
    for (const mood of CATEGORY_MOOD_MAP[track.category]) {
      classifications.set(mood, (classifications.get(mood) || 0) + 0.3);
    }
  }

  // Score based on tags and title/artist
  const searchText = [
    track.title,
    track.artist,
    ...(track.tags || []),
  ]
    .join(' ')
    .toLowerCase();

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        classifications.set(mood as Mood, (classifications.get(mood as Mood) || 0) + 0.2);
      }
    }
  }

  // Estimate energy from duration (longer tracks tend to be calmer)
  if (track.duration > 300) {
    // > 5 minutes
    classifications.set('calm', (classifications.get('calm') || 0) + 0.1);
  } else if (track.duration < 180) {
    // < 3 minutes
    classifications.set('energetic', (classifications.get('energetic') || 0) + 0.1);
  }

  // Convert to array and sort by confidence
  const result: MoodClassification[] = Array.from(classifications.entries())
    .map(([mood, score]) => ({
      mood,
      confidence: Math.min(score, 1.0), // Cap at 1.0
    }))
    .filter((c) => c.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  return result.length > 0 ? result : [{ mood: 'calm', confidence: 0.5 }];
}

/**
 * Get primary mood for a track
 */
export function getPrimaryMood(track: Music): Mood {
  const moods = detectMood(track);
  return moods[0]?.mood || 'calm';
}

/**
 * Filter tracks by mood
 *
 * @param tracks - All tracks
 * @param targetMood - Desired mood
 * @param minConfidence - Minimum confidence threshold (0-1)
 */
export function getTracksByMood(
  tracks: Music[],
  targetMood: Mood,
  minConfidence: number = 0.3
): Music[] {
  return tracks
    .map((track) => ({
      track,
      moods: detectMood(track),
    }))
    .filter(({ moods }) => {
      const moodMatch = moods.find((m) => m.mood === targetMood);
      return moodMatch && moodMatch.confidence >= minConfidence;
    })
    .sort((a, b) => {
      const aConf = a.moods.find((m) => m.mood === targetMood)?.confidence || 0;
      const bConf = b.moods.find((m) => m.mood === targetMood)?.confidence || 0;
      return bConf - aConf;
    })
    .map(({ track }) => track);
}

/**
 * Generate a mood-based playlist
 *
 * @param tracks - All available tracks
 * @param mood - Target mood
 * @param length - Desired playlist length
 */
export function generateMoodPlaylist(tracks: Music[], mood: Mood, length: number = 20): Music[] {
  const moodTracks = getTracksByMood(tracks, mood, 0.2);

  // Shuffle for variety
  const shuffled = [...moodTracks].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, length);
}
