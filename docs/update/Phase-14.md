# Phase 14: Advanced Audio Settings

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 2-3 hours

## Overview
高度なオーディオ設定の実装。10バンドイコライザー、オーディオエフェクト（リバーブ、エコー、バスブースト）、クロスフェード、ギャップレス再生、音量正規化、空間オーディオにより、プロレベルの音質調整を提供します。

## Technologies to Use
- Web Audio API (BiquadFilterNode, ConvolverNode, GainNode)
- Audio Worklet (custom DSP)
- HRTF (Head-Related Transfer Function)
- Canvas API (visualizer for EQ)

## Dependencies

No new dependencies (uses Web Audio API)

## Files to Create

1. **components/audio/Equalizer.tsx** - 10-band EQ component
2. **components/audio/AudioEffects.tsx** - Effects panel (reverb, echo, bass boost)
3. **components/audio/SpatialAudio.tsx** - 3D audio positioning controls
4. **lib/audio/equalizerPresets.ts** - EQ preset definitions
5. **lib/audio/audioProcessor.ts** - Web Audio API setup and processing
6. **lib/audio/spatialAudio.ts** - HRTF and spatial audio calculations
7. **worklets/audio-processor.js** - Audio Worklet for custom DSP
8. **hooks/useEqualizer.ts** - EQ state management
9. **hooks/useAudioEffects.ts** - Effects management

## Key Features

### 1. 10-Band Equalizer

```typescript
// lib/audio/equalizerPresets.ts

export interface EQBand {
  frequency: number;
  type: BiquadFilterType;
  gain: number;
  Q: number;
}

export const EQ_BANDS: EQBand[] = [
  { frequency: 32, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 64, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 125, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 250, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 500, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 1000, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 2000, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 4000, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 8000, type: 'peaking', gain: 0, Q: 1 },
  { frequency: 16000, type: 'peaking', gain: 0, Q: 1 },
];

export const EQ_PRESETS = {
  flat: EQ_BANDS.map((band) => ({ ...band, gain: 0 })),

  rock: [
    { ...EQ_BANDS[0], gain: 5 },   // 32 Hz: +5dB
    { ...EQ_BANDS[1], gain: 3 },   // 64 Hz: +3dB
    { ...EQ_BANDS[2], gain: -2 },  // 125 Hz: -2dB
    { ...EQ_BANDS[3], gain: -3 },  // 250 Hz: -3dB
    { ...EQ_BANDS[4], gain: -1 },  // 500 Hz: -1dB
    { ...EQ_BANDS[5], gain: 2 },   // 1 kHz: +2dB
    { ...EQ_BANDS[6], gain: 4 },   // 2 kHz: +4dB
    { ...EQ_BANDS[7], gain: 6 },   // 4 kHz: +6dB
    { ...EQ_BANDS[8], gain: 5 },   // 8 kHz: +5dB
    { ...EQ_BANDS[9], gain: 4 },   // 16 kHz: +4dB
  ],

  pop: [
    { ...EQ_BANDS[0], gain: -2 },
    { ...EQ_BANDS[1], gain: -1 },
    { ...EQ_BANDS[2], gain: 0 },
    { ...EQ_BANDS[3], gain: 2 },
    { ...EQ_BANDS[4], gain: 4 },
    { ...EQ_BANDS[5], gain: 4 },
    { ...EQ_BANDS[6], gain: 2 },
    { ...EQ_BANDS[7], gain: 0 },
    { ...EQ_BANDS[8], gain: -1 },
    { ...EQ_BANDS[9], gain: -2 },
  ],

  classical: [
    { ...EQ_BANDS[0], gain: 0 },
    { ...EQ_BANDS[1], gain: 0 },
    { ...EQ_BANDS[2], gain: 0 },
    { ...EQ_BANDS[3], gain: 0 },
    { ...EQ_BANDS[4], gain: -2 },
    { ...EQ_BANDS[5], gain: -2 },
    { ...EQ_BANDS[6], gain: -2 },
    { ...EQ_BANDS[7], gain: 3 },
    { ...EQ_BANDS[8], gain: 4 },
    { ...EQ_BANDS[9], gain: 5 },
  ],

  jazz: [
    { ...EQ_BANDS[0], gain: 3 },
    { ...EQ_BANDS[1], gain: 2 },
    { ...EQ_BANDS[2], gain: 0 },
    { ...EQ_BANDS[3], gain: 2 },
    { ...EQ_BANDS[4], gain: -2 },
    { ...EQ_BANDS[5], gain: -2 },
    { ...EQ_BANDS[6], gain: 0 },
    { ...EQ_BANDS[7], gain: 2 },
    { ...EQ_BANDS[8], gain: 3 },
    { ...EQ_BANDS[9], gain: 4 },
  ],

  electronic: [
    { ...EQ_BANDS[0], gain: 6 },
    { ...EQ_BANDS[1], gain: 5 },
    { ...EQ_BANDS[2], gain: 2 },
    { ...EQ_BANDS[3], gain: 0 },
    { ...EQ_BANDS[4], gain: -2 },
    { ...EQ_BANDS[5], gain: 2 },
    { ...EQ_BANDS[6], gain: 3 },
    { ...EQ_BANDS[7], gain: 4 },
    { ...EQ_BANDS[8], gain: 5 },
    { ...EQ_BANDS[9], gain: 6 },
  ],

  bassBoost: [
    { ...EQ_BANDS[0], gain: 8 },
    { ...EQ_BANDS[1], gain: 7 },
    { ...EQ_BANDS[2], gain: 5 },
    { ...EQ_BANDS[3], gain: 3 },
    { ...EQ_BANDS[4], gain: 0 },
    { ...EQ_BANDS[5], gain: 0 },
    { ...EQ_BANDS[6], gain: 0 },
    { ...EQ_BANDS[7], gain: 0 },
    { ...EQ_BANDS[8], gain: 0 },
    { ...EQ_BANDS[9], gain: 0 },
  ],

  vocalBoost: [
    { ...EQ_BANDS[0], gain: -3 },
    { ...EQ_BANDS[1], gain: -2 },
    { ...EQ_BANDS[2], gain: -1 },
    { ...EQ_BANDS[3], gain: 2 },
    { ...EQ_BANDS[4], gain: 4 },
    { ...EQ_BANDS[5], gain: 5 },
    { ...EQ_BANDS[6], gain: 4 },
    { ...EQ_BANDS[7], gain: 2 },
    { ...EQ_BANDS[8], gain: 0 },
    { ...EQ_BANDS[9], gain: 0 },
  ],

  trebleBoost: [
    { ...EQ_BANDS[0], gain: 0 },
    { ...EQ_BANDS[1], gain: 0 },
    { ...EQ_BANDS[2], gain: 0 },
    { ...EQ_BANDS[3], gain: 0 },
    { ...EQ_BANDS[4], gain: 0 },
    { ...EQ_BANDS[5], gain: 2 },
    { ...EQ_BANDS[6], gain: 4 },
    { ...EQ_BANDS[7], gain: 6 },
    { ...EQ_BANDS[8], gain: 7 },
    { ...EQ_BANDS[9], gain: 8 },
  ],
};
```

### 2. Audio Processor Setup

```typescript
// lib/audio/audioProcessor.ts

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqNodes: BiquadFilterNode[] = [];
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private gainNode: GainNode | null = null;
  private pannerNode: PannerNode | null = null;

  async initialize(audioElement: HTMLAudioElement) {
    this.audioContext = new AudioContext();
    this.sourceNode = this.audioContext.createMediaElementSource(audioElement);

    // Create EQ filters
    this.eqNodes = EQ_BANDS.map((band) => {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = band.type;
      filter.frequency.value = band.frequency;
      filter.Q.value = band.Q;
      filter.gain.value = band.gain;
      return filter;
    });

    // Create effects nodes
    this.reverbNode = this.audioContext.createConvolver();
    this.delayNode = this.audioContext.createDelay(5);
    this.gainNode = this.audioContext.createGain();
    this.pannerNode = this.audioContext.createPanner();

    // Connect nodes
    let currentNode: AudioNode = this.sourceNode;

    // EQ chain
    for (const filter of this.eqNodes) {
      currentNode.connect(filter);
      currentNode = filter;
    }

    // Effects chain (optional)
    // currentNode.connect(this.reverbNode);
    // this.reverbNode.connect(this.delayNode);

    currentNode.connect(this.gainNode);
    this.gainNode.connect(this.pannerNode);
    this.pannerNode.connect(this.audioContext.destination);

    return this;
  }

  setEQBand(index: number, gain: number) {
    if (this.eqNodes[index]) {
      this.eqNodes[index].gain.value = gain;
    }
  }

  setEQPreset(preset: EQBand[]) {
    preset.forEach((band, index) => {
      if (this.eqNodes[index]) {
        this.eqNodes[index].gain.value = band.gain;
      }
    });
  }

  async setReverb(enabled: boolean, type: 'room' | 'hall' | 'cathedral' = 'room') {
    if (!this.reverbNode || !this.audioContext) return;

    if (enabled) {
      // Load impulse response for reverb
      const impulseResponse = await this.loadImpulseResponse(type);
      this.reverbNode.buffer = impulseResponse;
    } else {
      this.reverbNode.buffer = null;
    }
  }

  private async loadImpulseResponse(type: string): Promise<AudioBuffer> {
    // Load pre-recorded impulse response
    const response = await fetch(`/audio/impulse-responses/${type}.wav`);
    const arrayBuffer = await response.arrayBuffer();
    return this.audioContext!.decodeAudioData(arrayBuffer);
  }

  setDelay(enabled: boolean, time: number = 0.3, feedback: number = 0.3) {
    if (!this.delayNode) return;

    if (enabled) {
      this.delayNode.delayTime.value = time;
      // Create feedback loop
      const feedbackGain = this.audioContext!.createGain();
      feedbackGain.gain.value = feedback;
      this.delayNode.connect(feedbackGain);
      feedbackGain.connect(this.delayNode);
    }
  }

  setSpatialPosition(x: number, y: number, z: number) {
    if (!this.pannerNode) return;

    this.pannerNode.positionX.value = x;
    this.pannerNode.positionY.value = y;
    this.pannerNode.positionZ.value = z;
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
```

### 3. Equalizer Component

```typescript
'use client';

import { useState } from 'react';
import { Sliders } from 'lucide-react';
import { EQ_BANDS, EQ_PRESETS } from '@/lib/audio/equalizerPresets';

export function Equalizer({ audioProcessor }: { audioProcessor: AudioProcessor }) {
  const [gains, setGains] = useState(EQ_BANDS.map((b) => b.gain));
  const [selectedPreset, setSelectedPreset] = useState<string>('flat');

  const handleGainChange = (index: number, value: number) => {
    const newGains = [...gains];
    newGains[index] = value;
    setGains(newGains);
    audioProcessor.setEQBand(index, value);
    setSelectedPreset('custom');
  };

  const applyPreset = (presetName: string) => {
    const preset = EQ_PRESETS[presetName as keyof typeof EQ_PRESETS];
    const newGains = preset.map((band) => band.gain);
    setGains(newGains);
    audioProcessor.setEQPreset(preset);
    setSelectedPreset(presetName);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Sliders className="w-6 h-6" />
        Equalizer
      </h2>

      {/* Presets */}
      <div>
        <label className="block font-semibold mb-2">Presets</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(EQ_PRESETS).map((preset) => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className={`px-4 py-2 rounded-lg capitalize ${
                selectedPreset === preset
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* EQ Sliders */}
      <div className="grid grid-cols-10 gap-2">
        {EQ_BANDS.map((band, index) => (
          <div key={band.frequency} className="flex flex-col items-center">
            {/* Slider */}
            <input
              type="range"
              min="-12"
              max="12"
              step="0.1"
              value={gains[index]}
              onChange={(e) => handleGainChange(index, parseFloat(e.target.value))}
              className="h-32 slider-vertical"
              style={{
                writingMode: 'bt-lr',
                WebkitAppearance: 'slider-vertical',
              }}
              aria-label={`${band.frequency} Hz`}
            />

            {/* Gain value */}
            <span className="text-xs font-semibold mt-2">
              {gains[index] > 0 ? '+' : ''}
              {gains[index].toFixed(1)}
            </span>

            {/* Frequency label */}
            <span className="text-xs text-gray-500 mt-1">
              {band.frequency < 1000
                ? `${band.frequency}Hz`
                : `${band.frequency / 1000}k`}
            </span>
          </div>
        ))}
      </div>

      {/* Reset button */}
      <button
        onClick={() => applyPreset('flat')}
        className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
      >
        Reset to Flat
      </button>
    </div>
  );
}
```

### 4. Audio Effects Panel

```typescript
'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';

export function AudioEffects({ audioProcessor }: { audioProcessor: AudioProcessor }) {
  const [reverb, setReverb] = useState(false);
  const [reverbType, setReverbType] = useState<'room' | 'hall' | 'cathedral'>('room');
  const [delay, setDelay] = useState(false);
  const [delayTime, setDelayTime] = useState(0.3);
  const [delayFeedback, setDelayFeedback] = useState(0.3);

  const toggleReverb = (enabled: boolean) => {
    setReverb(enabled);
    audioProcessor.setReverb(enabled, reverbType);
  };

  const toggleDelay = (enabled: boolean) => {
    setDelay(enabled);
    audioProcessor.setDelay(enabled, delayTime, delayFeedback);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Wand2 className="w-6 h-6" />
        Audio Effects
      </h2>

      {/* Reverb */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Reverb</span>
          <button
            onClick={() => toggleReverb(!reverb)}
            className={`w-14 h-8 rounded-full transition-colors ${
              reverb ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${
                reverb ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {reverb && (
          <div>
            <label className="block text-sm mb-2">Room Type</label>
            <select
              value={reverbType}
              onChange={(e) => {
                const type = e.target.value as 'room' | 'hall' | 'cathedral';
                setReverbType(type);
                audioProcessor.setReverb(true, type);
              }}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="room">Room</option>
              <option value="hall">Hall</option>
              <option value="cathedral">Cathedral</option>
            </select>
          </div>
        )}
      </div>

      {/* Delay/Echo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Delay/Echo</span>
          <button
            onClick={() => toggleDelay(!delay)}
            className={`w-14 h-8 rounded-full transition-colors ${
              delay ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${
                delay ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {delay && (
          <>
            <div>
              <label className="block text-sm mb-2">
                Delay Time: {delayTime.toFixed(2)}s
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={delayTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value);
                  setDelayTime(time);
                  audioProcessor.setDelay(true, time, delayFeedback);
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Feedback: {(delayFeedback * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.1"
                value={delayFeedback}
                onChange={(e) => {
                  const feedback = parseFloat(e.target.value);
                  setDelayFeedback(feedback);
                  audioProcessor.setDelay(true, delayTime, feedback);
                }}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

### 5. Crossfade Implementation

```typescript
// lib/audio/crossfade.ts

export class CrossfadeManager {
  private audioContext: AudioContext;
  private currentGain: GainNode;
  private nextGain: GainNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.currentGain = audioContext.createGain();
    this.nextGain = audioContext.createGain();
    this.nextGain.gain.value = 0;
  }

  crossfade(duration: number = 2) {
    const now = this.audioContext.currentTime;

    // Fade out current track
    this.currentGain.gain.linearRampToValueAtTime(1, now);
    this.currentGain.gain.linearRampToValueAtTime(0, now + duration);

    // Fade in next track
    this.nextGain.gain.linearRampToValueAtTime(0, now);
    this.nextGain.gain.linearRampToValueAtTime(1, now + duration);

    // Swap gains after crossfade
    setTimeout(() => {
      const temp = this.currentGain;
      this.currentGain = this.nextGain;
      this.nextGain = temp;
      this.nextGain.gain.value = 0;
    }, duration * 1000);
  }
}
```

## Next Steps
➡️ Phase 15: Mobile Optimizations

## Notes
- Web Audio APIで高度な音質調整を実現
- 10バンドEQで精密な周波数コントロール
- 8種類のプリセットで簡単設定
- リバーブ・ディレイエフェクトで音楽に深みを追加
- クロスフェードで滑らかなトラック移行
- 空間オーディオで3D音響体験
- 全設定をIndexedDBに永続化
