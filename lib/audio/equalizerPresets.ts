/**
 * Equalizer Presets
 *
 * 10-band equalizer presets for different music genres
 * Frequency bands: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz
 * Values range from -12dB to +12dB
 */

export interface EqualizerBand {
  frequency: number;
  label: string;
}

export interface EqualizerPreset {
  name: string;
  description: string;
  gains: number[]; // dB values for each band
}

/**
 * 10-band equalizer frequencies
 */
export const EQ_BANDS: EqualizerBand[] = [
  { frequency: 32, label: '32Hz' },
  { frequency: 64, label: '64Hz' },
  { frequency: 125, label: '125Hz' },
  { frequency: 250, label: '250Hz' },
  { frequency: 500, label: '500Hz' },
  { frequency: 1000, label: '1kHz' },
  { frequency: 2000, label: '2kHz' },
  { frequency: 4000, label: '4kHz' },
  { frequency: 8000, label: '8kHz' },
  { frequency: 16000, label: '16kHz' },
];

/**
 * Equalizer presets
 */
export const EQUALIZER_PRESETS: Record<string, EqualizerPreset> = {
  flat: {
    name: 'Flat',
    description: 'No equalization (neutral sound)',
    gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  rock: {
    name: 'Rock',
    description: 'Enhanced bass and treble for rock music',
    gains: [5, 4, 3, 1, -1, -1, 0, 2, 3, 4],
  },
  pop: {
    name: 'Pop',
    description: 'Balanced with slight bass and treble boost',
    gains: [2, 3, 4, 3, 0, -1, -1, 1, 2, 3],
  },
  jazz: {
    name: 'Jazz',
    description: 'Warm mid-range for jazz instruments',
    gains: [3, 2, 0, 2, 3, 2, 0, -1, 1, 2],
  },
  classical: {
    name: 'Classical',
    description: 'Natural sound with enhanced high frequencies',
    gains: [0, 0, 0, 0, 0, -1, -1, 0, 2, 3],
  },
  electronic: {
    name: 'Electronic',
    description: 'Deep bass and crisp highs for electronic music',
    gains: [6, 5, 3, 0, -2, -1, 0, 2, 4, 5],
  },
  bassBoost: {
    name: 'Bass Boost',
    description: 'Maximum low-end enhancement',
    gains: [8, 7, 5, 3, 0, 0, 0, 0, 0, 0],
  },
  vocalBoost: {
    name: 'Vocal Boost',
    description: 'Enhanced mid-range for vocal clarity',
    gains: [0, 0, -1, 2, 4, 4, 3, 1, 0, 0],
  },
};

/**
 * Get preset names
 */
export function getPresetNames(): string[] {
  return Object.keys(EQUALIZER_PRESETS);
}

/**
 * Get preset by name
 */
export function getPreset(name: string): EqualizerPreset | null {
  return EQUALIZER_PRESETS[name] || null;
}

/**
 * Validate EQ gains array
 */
export function validateGains(gains: number[]): boolean {
  if (gains.length !== 10) return false;
  return gains.every((gain) => gain >= -12 && gain <= 12);
}
