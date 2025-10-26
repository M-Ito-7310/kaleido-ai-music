'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Radio } from 'lucide-react';
import type { Music } from '@/lib/db/schema';
import { type Mood, generateMoodPlaylist } from '@/lib/ai/moodDetector';
import { usePlayer } from '@/lib/contexts/PlayerContext';

interface AIRadioProps {
  allTracks: Music[];
}

/**
 * AI Radio Component
 *
 * Features:
 * - Mood-based radio stations
 * - Auto-generated playlists
 * - One-click start
 */
export function AIRadio({ allTracks }: AIRadioProps) {
  const { playTrack } = usePlayer();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const moodStations: { mood: Mood; label: string; icon: string; gradient: string }[] = [
    { mood: 'happy', label: 'Happy Vibes', icon: '😊', gradient: 'from-yellow-400 to-orange-500' },
    { mood: 'energetic', label: 'High Energy', icon: '⚡', gradient: 'from-red-500 to-pink-600' },
    { mood: 'calm', label: 'Chill Out', icon: '🌊', gradient: 'from-blue-400 to-cyan-500' },
    { mood: 'romantic', label: 'Romance', icon: '💕', gradient: 'from-pink-400 to-rose-600' },
    { mood: 'melancholic', label: 'Melancholy', icon: '🌙', gradient: 'from-indigo-500 to-purple-600' },
    { mood: 'sad', label: 'Reflective', icon: '💙', gradient: 'from-slate-500 to-blue-600' },
  ];

  const startRadio = (mood: Mood) => {
    setSelectedMood(mood);
    const playlist = generateMoodPlaylist(allTracks, mood, 50);

    if (playlist.length > 0) {
      playTrack(playlist[0], playlist);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-br from-primary-500 to-purple-600 p-3">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Radio</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Personalized radio stations based on mood
          </p>
        </div>
      </div>

      {/* Mood Stations Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {moodStations.map((station) => (
          <motion.button
            key={station.mood}
            onClick={() => startRadio(station.mood)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all ${
              selectedMood === station.mood
                ? 'ring-4 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
                : ''
            }`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${station.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="text-4xl">{station.icon}</div>
              <div className="text-center">
                <div className="font-semibold">{station.label}</div>
                {selectedMood === station.mood && (
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs">
                    <Radio className="h-3 w-3 animate-pulse" />
                    <span>Playing</span>
                  </div>
                )}
              </div>
            </div>

            {/* Glassmorphism overlay on hover */}
            <div className="absolute inset-0 bg-white/10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>

      {/* Info Card */}
      <div className="rounded-xl bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/50 p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              How AI Radio Works
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our AI analyzes your music library's mood through metadata, tags, and characteristics.
              Select a station to start an endless stream of tracks matching that vibe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
