'use client';

import { motion } from 'framer-motion';
import { EQ_BANDS, EQUALIZER_PRESETS, getPresetNames } from '@/lib/audio/equalizerPresets';

interface EqualizerProps {
  gains: number[];
  enabled: boolean;
  preset: string;
  onGainsChange: (gains: number[]) => void;
  onEnabledChange: (enabled: boolean) => void;
  onPresetChange: (preset: string) => void;
}

/**
 * Equalizer Component
 *
 * 10-band equalizer with presets
 */
export function Equalizer({
  gains,
  enabled,
  preset,
  onGainsChange,
  onEnabledChange,
  onPresetChange,
}: EqualizerProps) {
  const presetNames = getPresetNames();

  const handleGainChange = (index: number, value: number) => {
    const newGains = [...gains];
    newGains[index] = value;
    onGainsChange(newGains);
    // Switch to custom preset when manually adjusting
    if (preset !== 'custom') {
      onPresetChange('custom');
    }
  };

  const handlePresetChange = (newPreset: string) => {
    onPresetChange(newPreset);
    const presetData = EQUALIZER_PRESETS[newPreset];
    if (presetData) {
      onGainsChange(presetData.gains);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equalizer</h3>
        <button
          onClick={() => onEnabledChange(!enabled)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle equalizer"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              enabled ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Preset Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preset
        </label>
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          disabled={!enabled}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {presetNames.map((name) => (
            <option key={name} value={name}>
              {EQUALIZER_PRESETS[name].name}
            </option>
          ))}
          {preset === 'custom' && <option value="custom">Custom</option>}
        </select>
      </div>

      {/* EQ Sliders */}
      <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
        {EQ_BANDS.map((band, index) => (
          <div key={band.frequency} className="flex flex-col items-center gap-2">
            {/* Gain value display */}
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {gains[index] > 0 ? '+' : ''}
              {gains[index].toFixed(0)}
            </div>

            {/* Vertical slider */}
            <div className="relative h-32 w-8">
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={gains[index]}
                onChange={(e) => handleGainChange(index, parseFloat(e.target.value))}
                disabled={!enabled}
                className="vertical-slider h-full w-full accent-primary-600 disabled:opacity-50"
                style={{
                  WebkitAppearance: 'slider-vertical',
                  width: '8px',
                } as React.CSSProperties}
                aria-label={`${band.label} gain`}
              />
              {/* Center line */}
              <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-gray-400 dark:bg-gray-600" />
            </div>

            {/* Frequency label */}
            <div className="text-xs text-gray-600 dark:text-gray-400">{band.label}</div>
          </div>
        ))}
      </div>

      {/* Reset button */}
      {preset === 'custom' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => handlePresetChange('flat')}
          disabled={!enabled}
          className="w-full rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Reset to Flat
        </motion.button>
      )}
    </div>
  );
}
