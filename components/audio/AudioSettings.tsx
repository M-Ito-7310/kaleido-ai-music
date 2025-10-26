'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2 } from 'lucide-react';
import { Equalizer } from './Equalizer';
import { AudioEffects } from './AudioEffects';
import type { AudioSettings as AudioSettingsType } from '@/lib/audio/audioProcessor';
import { DEFAULT_AUDIO_SETTINGS } from '@/lib/audio/audioProcessor';
import { loadAudioSettings, saveAudioSettings } from '@/lib/db/indexedDB';
import type { AudioPlayer } from '@/lib/audio/player';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  audioPlayer: AudioPlayer | null;
}

/**
 * AudioSettings Panel
 *
 * Complete audio settings interface with EQ and effects
 */
export function AudioSettings({ isOpen, onClose, audioPlayer }: AudioSettingsProps) {
  const [settings, setSettings] = useState<AudioSettingsType>(DEFAULT_AUDIO_SETTINGS);

  // Load settings from IndexedDB on mount
  useEffect(() => {
    loadAudioSettings().then((savedSettings) => {
      if (savedSettings) {
        setSettings(savedSettings);
        if (audioPlayer) {
          audioPlayer.applyAudioSettings(savedSettings);
        }
      }
    });
  }, [audioPlayer]);

  // Save settings whenever they change
  const updateSettings = (newSettings: AudioSettingsType) => {
    setSettings(newSettings);
    if (audioPlayer) {
      audioPlayer.applyAudioSettings(newSettings);
    }
    saveAudioSettings(newSettings);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 md:inset-x-auto md:left-1/2 md:w-full md:max-w-2xl md:-translate-x-1/2"
            role="dialog"
            aria-labelledby="audio-settings-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary-100 p-2 dark:bg-primary-900/30">
                  <Settings2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h2
                  id="audio-settings-title"
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Audio Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Close audio settings"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {/* Equalizer Section */}
              <Equalizer
                gains={settings.eq.gains}
                enabled={settings.eq.enabled}
                preset={settings.eq.preset}
                onGainsChange={(gains) =>
                  updateSettings({
                    ...settings,
                    eq: { ...settings.eq, gains },
                  })
                }
                onEnabledChange={(enabled) =>
                  updateSettings({
                    ...settings,
                    eq: { ...settings.eq, enabled },
                  })
                }
                onPresetChange={(preset) =>
                  updateSettings({
                    ...settings,
                    eq: { ...settings.eq, preset },
                  })
                }
              />

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Effects Section */}
              <AudioEffects
                effects={settings.effects}
                onEffectsChange={(effects) =>
                  updateSettings({
                    ...settings,
                    effects,
                  })
                }
              />

              {/* Reset All Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => updateSettings(DEFAULT_AUDIO_SETTINGS)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Reset All
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
