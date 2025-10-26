'use client';

import type { AudioSettings } from '@/lib/audio/audioProcessor';

interface AudioEffectsProps {
  effects: AudioSettings['effects'];
  onEffectsChange: (effects: AudioSettings['effects']) => void;
}

/**
 * AudioEffects Component
 *
 * Controls for reverb and delay effects
 */
export function AudioEffects({ effects, onEffectsChange }: AudioEffectsProps) {
  const updateReverb = (updates: Partial<AudioSettings['effects']['reverb']>) => {
    onEffectsChange({
      ...effects,
      reverb: { ...effects.reverb, ...updates },
    });
  };

  const updateDelay = (updates: Partial<AudioSettings['effects']['delay']>) => {
    onEffectsChange({
      ...effects,
      delay: { ...effects.delay, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Effects</h3>

      {/* Reverb */}
      <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reverb</label>
          <button
            onClick={() => updateReverb({ enabled: !effects.reverb.enabled })}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              effects.reverb.enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            role="switch"
            aria-checked={effects.reverb.enabled}
            aria-label="Toggle reverb"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                effects.reverb.enabled ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {effects.reverb.enabled && (
          <div className="space-y-3">
            {/* Room Type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Room Type
              </label>
              <select
                value={effects.reverb.type}
                onChange={(e) =>
                  updateReverb({ type: e.target.value as 'small' | 'hall' | 'cathedral' })
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="small">Small Room</option>
                <option value="hall">Hall</option>
                <option value="cathedral">Cathedral</option>
              </select>
            </div>

            {/* Wet/Dry Mix */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Wet: {Math.round(effects.reverb.wet * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={effects.reverb.wet}
                onChange={(e) => updateReverb({ wet: parseFloat(e.target.value) })}
                className="w-full accent-primary-600"
                aria-label="Reverb wet amount"
              />
            </div>
          </div>
        )}
      </div>

      {/* Delay */}
      <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Delay</label>
          <button
            onClick={() => updateDelay({ enabled: !effects.delay.enabled })}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              effects.delay.enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            role="switch"
            aria-checked={effects.delay.enabled}
            aria-label="Toggle delay"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                effects.delay.enabled ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {effects.delay.enabled && (
          <div className="space-y-3">
            {/* Delay Time */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Time: {effects.delay.time.toFixed(2)}s
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={effects.delay.time}
                onChange={(e) => updateDelay({ time: parseFloat(e.target.value) })}
                className="w-full accent-primary-600"
                aria-label="Delay time"
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Feedback: {Math.round(effects.delay.feedback * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.1"
                value={effects.delay.feedback}
                onChange={(e) => updateDelay({ feedback: parseFloat(e.target.value) })}
                className="w-full accent-primary-600"
                aria-label="Delay feedback"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
