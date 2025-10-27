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
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Create HTML Audio Element
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous'; // Enable CORS for Web Audio API
      this.audioElement.preload = 'auto';

      // Add event listeners
      this.audioElement.addEventListener('timeupdate', this.handleTimeUpdate);
      this.audioElement.addEventListener('ended', this.handleEnded);
      this.audioElement.addEventListener('loadedmetadata', this.handleLoadedMetadata);

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

  private handleTimeUpdate = () => {
    if (this.onTimeUpdateCallback && this.audioElement) {
      const currentTime = this.audioElement.currentTime;
      console.log('[AudioPlayer] Time update:', currentTime, '/', this.audioElement.duration);
      this.onTimeUpdateCallback(currentTime);
    }
  };

  private handleEnded = () => {
    console.log('[AudioPlayer] Track ended');
    if (this.onEndedCallback) {
      this.onEndedCallback();
    }
  };

  private handleLoadedMetadata = () => {
    console.log('[AudioPlayer] Loaded metadata (event), duration:', this.audioElement?.duration);
  };

  onTimeUpdate(callback: (time: number) => void) {
    this.onTimeUpdateCallback = callback;
  }

  onEnded(callback: () => void) {
    this.onEndedCallback = callback;
  }

  async loadTrack(url: string): Promise<void> {
    if (!this.audioElement) return;

    try {
      console.log('[AudioPlayer] Loading track:', url);

      // Stop current playback
      this.stop();

      // Set the audio source
      this.audioElement.src = url;

      // Wait for metadata to be loaded to get duration
      await new Promise<void>((resolve, reject) => {
        if (!this.audioElement) {
          reject(new Error('Audio element not initialized'));
          return;
        }

        const onCanPlay = () => {
          console.log('[AudioPlayer] Can play - ready to start playback');
          this.audioElement?.removeEventListener('canplay', onCanPlay);
          this.audioElement?.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: ErrorEvent | Event) => {
          console.error('[AudioPlayer] Error loading audio:', e);
          this.audioElement?.removeEventListener('canplay', onCanPlay);
          this.audioElement?.removeEventListener('error', onError);
          reject(new Error('Failed to load audio'));
        };

        this.audioElement.addEventListener('canplay', onCanPlay, { once: true });
        this.audioElement.addEventListener('error', onError, { once: true });

        // Load the audio
        this.audioElement.load();
      });

      console.log('[AudioPlayer] Track loaded successfully, duration:', this.getDuration());
    } catch (error) {
      console.error('[AudioPlayer] Failed to load audio:', error);
      throw error;
    }
  }

  play(): void {
    if (!this.audioElement || !this.audioContext) return;

    console.log('[AudioPlayer] Play called, audio context state:', this.audioContext.state);

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      console.log('[AudioPlayer] Resuming audio context');
      this.audioContext.resume();
    }

    // Play the audio
    this.audioElement.play()
      .then(() => {
        console.log('[AudioPlayer] Play started successfully');
      })
      .catch((error) => {
        console.error('[AudioPlayer] Failed to play audio:', error);
      });
  }

  pause(): void {
    if (!this.audioElement) return;
    console.log('[AudioPlayer] Pause called');
    this.audioElement.pause();
  }

  stop(): void {
    if (!this.audioElement) return;
    console.log('[AudioPlayer] Stop called');
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
    if (!this.audioElement) return 0;
    const time = this.audioElement.currentTime;
    return isNaN(time) ? 0 : time;
  }

  getDuration(): number {
    if (!this.audioElement) return 0;
    const duration = this.audioElement.duration;
    return isNaN(duration) || !isFinite(duration) ? 0 : duration;
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

    // Remove event listeners
    if (this.audioElement) {
      this.audioElement.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.audioElement.removeEventListener('ended', this.handleEnded);
      this.audioElement.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
    }

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

    // Clear callbacks
    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
  }
}
