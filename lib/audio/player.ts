import { AudioProcessor, type AudioSettings, DEFAULT_AUDIO_SETTINGS } from './audioProcessor';

/**
 * HTMLAudioElement-based audio player with Web Audio API integration
 * This implementation avoids CORS issues with Vercel Blob Storage
 * while maintaining audio effects capabilities
 */
export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private audioProcessor: AudioProcessor | null = null;
  private audioSettings: AudioSettings = DEFAULT_AUDIO_SETTINGS;

  constructor() {
    if (typeof window !== 'undefined') {
      // Create HTML Audio Element
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous'; // Enable CORS for Web Audio API
      this.audioElement.preload = 'auto';

      // Create Web Audio API context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create source node from audio element
      this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();

      // Create audio processor for effects
      this.audioProcessor = new AudioProcessor(this.audioContext);

      // Connect: sourceNode → gainNode → processor → destination
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.audioProcessor.getOutputNode());
    }
  }

  async loadTrack(url: string): Promise<void> {
    if (!this.audioElement) return;

    try {
      // Set the audio source
      this.audioElement.src = url;

      // Wait for metadata to be loaded to get duration
      await new Promise<void>((resolve, reject) => {
        if (!this.audioElement) {
          reject(new Error('Audio element not initialized'));
          return;
        }

        const onLoadedMetadata = () => {
          this.audioElement?.removeEventListener('loadedmetadata', onLoadedMetadata);
          this.audioElement?.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: ErrorEvent | Event) => {
          this.audioElement?.removeEventListener('loadedmetadata', onLoadedMetadata);
          this.audioElement?.removeEventListener('error', onError);
          reject(new Error('Failed to load audio'));
        };

        this.audioElement.addEventListener('loadedmetadata', onLoadedMetadata);
        this.audioElement.addEventListener('error', onError);

        // Load the audio
        this.audioElement.load();
      });
    } catch (error) {
      console.error('Failed to load audio:', error);
      throw error;
    }
  }

  play(): void {
    if (!this.audioElement || !this.audioContext) return;

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Play the audio
    this.audioElement.play().catch((error) => {
      console.error('Failed to play audio:', error);
    });
  }

  pause(): void {
    if (!this.audioElement) return;
    this.audioElement.pause();
  }

  stop(): void {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  getCurrentTime(): number {
    return this.audioElement?.currentTime || 0;
  }

  getDuration(): number {
    return this.audioElement?.duration || 0;
  }

  seek(time: number): void {
    if (!this.audioElement) return;
    this.audioElement.currentTime = Math.max(0, Math.min(time, this.getDuration()));
  }

  getIsPlaying(): boolean {
    if (!this.audioElement) return false;
    return !this.audioElement.paused && !this.audioElement.ended;
  }

  /**
   * Apply audio settings (EQ, effects)
   */
  applyAudioSettings(settings: AudioSettings): void {
    this.audioSettings = settings;
    if (this.audioProcessor) {
      this.audioProcessor.applySettings(settings);
    }
  }

  /**
   * Get current audio settings
   */
  getAudioSettings(): AudioSettings {
    return { ...this.audioSettings };
  }

  destroy(): void {
    this.stop();

    // Disconnect audio nodes
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Clean up audio element
    if (this.audioElement) {
      this.audioElement.src = '';
      this.audioElement = null;
    }
  }
}
