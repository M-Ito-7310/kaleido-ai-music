import { EQ_BANDS } from './equalizerPresets';

/**
 * Audio Processor
 *
 * Manages equalizer and audio effects using Web Audio API
 */

export interface AudioSettings {
  eq: {
    enabled: boolean;
    preset: string;
    gains: number[]; // 10 values, -12dB to +12dB
  };
  effects: {
    reverb: {
      enabled: boolean;
      type: 'small' | 'hall' | 'cathedral';
      wet: number; // 0-1
    };
    delay: {
      enabled: boolean;
      time: number; // seconds
      feedback: number; // 0-1
    };
  };
  crossfade: number; // seconds
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  eq: {
    enabled: false,
    preset: 'flat',
    gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  effects: {
    reverb: {
      enabled: false,
      type: 'hall',
      wet: 0.3,
    },
    delay: {
      enabled: false,
      time: 0.3,
      feedback: 0.3,
    },
  },
  crossfade: 2,
};

/**
 * AudioProcessor class
 * Manages all audio processing nodes
 */
export class AudioProcessor {
  private audioContext: AudioContext;
  private eqFilters: BiquadFilterNode[] = [];
  private delayNode: DelayNode | null = null;
  private delayFeedbackNode: GainNode | null = null;
  private delayWetNode: GainNode | null = null;
  private delayDryNode: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbWetNode: GainNode | null = null;
  private reverbDryNode: GainNode | null = null;
  private outputNode: GainNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.outputNode = audioContext.createGain();
    this.initializeEqualizer();
    this.initializeDelay();
    this.initializeReverb();
  }

  /**
   * Initialize 10-band equalizer
   */
  private initializeEqualizer(): void {
    EQ_BANDS.forEach((band) => {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = band.frequency;
      filter.Q.value = 1.0;
      filter.gain.value = 0;
      this.eqFilters.push(filter);
    });
  }

  /**
   * Initialize delay effect
   */
  private initializeDelay(): void {
    this.delayNode = this.audioContext.createDelay(5.0);
    this.delayFeedbackNode = this.audioContext.createGain();
    this.delayWetNode = this.audioContext.createGain();
    this.delayDryNode = this.audioContext.createGain();

    this.delayNode.delayTime.value = 0.3;
    this.delayFeedbackNode.gain.value = 0.3;
    this.delayWetNode.gain.value = 0;
    this.delayDryNode.gain.value = 1;
  }

  /**
   * Initialize reverb effect
   */
  private initializeReverb(): void {
    this.reverbNode = this.audioContext.createConvolver();
    this.reverbWetNode = this.audioContext.createGain();
    this.reverbDryNode = this.audioContext.createGain();

    this.reverbWetNode.gain.value = 0;
    this.reverbDryNode.gain.value = 1;

    // Generate impulse response for reverb
    this.generateReverbImpulse('hall');
  }

  /**
   * Generate impulse response for reverb
   */
  private generateReverbImpulse(type: 'small' | 'hall' | 'cathedral'): void {
    if (!this.reverbNode) return;

    const durations = {
      small: 0.5,
      hall: 2.0,
      cathedral: 4.0,
    };

    const duration = durations[type];
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    this.reverbNode.buffer = impulse;
  }

  /**
   * Connect audio source through processing chain
   */
  connectSource(source: AudioNode): void {
    let currentNode: AudioNode = source;

    // Connect through EQ filters
    this.eqFilters.forEach((filter) => {
      currentNode.connect(filter);
      currentNode = filter;
    });

    // Connect delay effect
    if (this.delayNode && this.delayFeedbackNode && this.delayWetNode && this.delayDryNode) {
      currentNode.connect(this.delayDryNode);
      currentNode.connect(this.delayNode);
      this.delayNode.connect(this.delayFeedbackNode);
      this.delayFeedbackNode.connect(this.delayNode);
      this.delayNode.connect(this.delayWetNode);

      this.delayDryNode.connect(this.outputNode);
      this.delayWetNode.connect(this.outputNode);
    }

    // Connect reverb effect
    if (this.reverbNode && this.reverbWetNode && this.reverbDryNode) {
      this.outputNode.connect(this.reverbDryNode);
      this.outputNode.connect(this.reverbNode);
      this.reverbNode.connect(this.reverbWetNode);

      this.reverbDryNode.connect(this.audioContext.destination);
      this.reverbWetNode.connect(this.audioContext.destination);
    } else {
      this.outputNode.connect(this.audioContext.destination);
    }
  }

  /**
   * Apply equalizer settings
   */
  applyEqualizer(gains: number[], enabled: boolean): void {
    this.eqFilters.forEach((filter, index) => {
      filter.gain.value = enabled ? gains[index] : 0;
    });
  }

  /**
   * Apply delay settings
   */
  applyDelay(time: number, feedback: number, enabled: boolean): void {
    if (!this.delayNode || !this.delayFeedbackNode || !this.delayWetNode || !this.delayDryNode) {
      return;
    }

    this.delayNode.delayTime.value = time;
    this.delayFeedbackNode.gain.value = feedback;
    this.delayWetNode.gain.value = enabled ? 0.5 : 0;
    this.delayDryNode.gain.value = enabled ? 0.5 : 1;
  }

  /**
   * Apply reverb settings
   */
  applyReverb(type: 'small' | 'hall' | 'cathedral', wet: number, enabled: boolean): void {
    if (!this.reverbWetNode || !this.reverbDryNode) return;

    this.generateReverbImpulse(type);
    this.reverbWetNode.gain.value = enabled ? wet : 0;
    this.reverbDryNode.gain.value = enabled ? 1 - wet : 1;
  }

  /**
   * Apply all audio settings
   */
  applySettings(settings: AudioSettings): void {
    this.applyEqualizer(settings.eq.gains, settings.eq.enabled);
    this.applyDelay(
      settings.effects.delay.time,
      settings.effects.delay.feedback,
      settings.effects.delay.enabled
    );
    this.applyReverb(
      settings.effects.reverb.type,
      settings.effects.reverb.wet,
      settings.effects.reverb.enabled
    );
  }

  /**
   * Get output node to connect to destination or gain
   */
  getOutputNode(): GainNode {
    return this.outputNode;
  }

  /**
   * Disconnect and clean up
   */
  disconnect(): void {
    this.eqFilters.forEach((filter) => filter.disconnect());
    this.delayNode?.disconnect();
    this.delayFeedbackNode?.disconnect();
    this.delayWetNode?.disconnect();
    this.delayDryNode?.disconnect();
    this.reverbNode?.disconnect();
    this.reverbWetNode?.disconnect();
    this.reverbDryNode?.disconnect();
    this.outputNode.disconnect();
  }
}
