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
  private rafId: number | null = null; // requestAnimationFrame ID for time tracking

  constructor() {
    if (typeof window !== 'undefined') {
      console.log('[AudioPlayer] Constructor called');

      // Create HTML Audio Element
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous'; // Enable CORS for Web Audio API
      this.audioElement.preload = 'auto';

      // Add event listeners
      console.log('[AudioPlayer] Adding event listeners');
      this.audioElement.addEventListener('ended', this.handleEnded);
      this.audioElement.addEventListener('loadedmetadata', this.handleLoadedMetadata);
      this.audioElement.addEventListener('playing', () => {
        console.log('[AudioPlayer] playing event fired');
      });
      this.audioElement.addEventListener('pause', () => {
        console.log('[AudioPlayer] pause event fired');
      });

      // Create Web Audio API context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('[AudioPlayer] AudioContext created, state:', this.audioContext.state);

      // Create source node from audio element
      this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
      console.log('[AudioPlayer] MediaElementSourceNode created');

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();

      // Create audio processor for effects
      this.audioProcessor = new AudioProcessor(this.audioContext);

      // Connect: sourceNode → gainNode → destination
      // Bypassing AudioProcessor temporarily to isolate the issue
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      console.log('[AudioPlayer] Audio nodes connected (direct to destination)');
    }
  }

  /**
   * Start tracking playback time using requestAnimationFrame
   * This provides smooth, reliable updates at ~60fps
   */
  private startTimeTracking() {
    // Stop any existing tracking
    this.stopTimeTracking();

    const update = () => {
      if (this.audioElement && !this.audioElement.paused && !this.audioElement.ended) {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;

        console.log('[AudioPlayer] RAF update:', currentTime, '/', duration);

        if (this.onTimeUpdateCallback && !isNaN(currentTime) && !isNaN(duration)) {
          this.onTimeUpdateCallback(currentTime);
        }

        // Continue tracking
        this.rafId = requestAnimationFrame(update);
      } else {
        // Playback stopped, clear RAF
        this.rafId = null;
      }
    };

    console.log('[AudioPlayer] Starting time tracking with RAF');
    this.rafId = requestAnimationFrame(update);
  }

  /**
   * Stop tracking playback time
   */
  private stopTimeTracking() {
    if (this.rafId !== null) {
      console.log('[AudioPlayer] Stopping time tracking');
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private handleEnded = () => {
    console.log('[AudioPlayer] Track ended');
    this.stopTimeTracking();
    if (this.onEndedCallback) {
      this.onEndedCallback();
    }
  };

  private handleLoadedMetadata = () => {
    console.log('[AudioPlayer] Loaded metadata (event), duration:', this.audioElement?.duration);
  };

  onTimeUpdate(callback: (time: number) => void) {
    console.log('[AudioPlayer] onTimeUpdate callback registered');
    this.onTimeUpdateCallback = callback;
  }

  onEnded(callback: () => void) {
    console.log('[AudioPlayer] onEnded callback registered');
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

  async play(): Promise<void> {
    if (!this.audioElement || !this.audioContext) return;

    console.log('[AudioPlayer] Play called, audio context state:', this.audioContext.state);
    console.log('[AudioPlayer] Audio element paused:', this.audioElement.paused, 'ended:', this.audioElement.ended);
    console.log('[AudioPlayer] Audio element src:', this.audioElement.src);

    // Resume audio context if suspended and WAIT for it to be running
    if (this.audioContext.state === 'suspended') {
      console.log('[AudioPlayer] Resuming audio context...');
      await this.audioContext.resume();
      console.log('[AudioPlayer] Audio context resumed, state:', this.audioContext.state);
    }

    // Play the audio (AudioContext is now guaranteed to be running)
    try {
      await this.audioElement.play();
      console.log('[AudioPlayer] Play started successfully');
      console.log('[AudioPlayer] After play - paused:', this.audioElement.paused, 'ended:', this.audioElement.ended);
      console.log('[AudioPlayer] Current time:', this.audioElement.currentTime, 'Duration:', this.audioElement.duration);

      // Start time tracking with requestAnimationFrame
      this.startTimeTracking();
    } catch (error) {
      console.error('[AudioPlayer] Failed to play audio:', error);
    }
  }

  pause(): void {
    if (!this.audioElement) return;
    console.log('[AudioPlayer] Pause called');
    this.audioElement.pause();

    // Stop time tracking
    this.stopTimeTracking();
  }

  stop(): void {
    if (!this.audioElement) return;
    console.log('[AudioPlayer] Stop called');
    this.audioElement.pause();
    this.audioElement.currentTime = 0;

    // Stop time tracking
    this.stopTimeTracking();
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

    // Stop time tracking
    this.stopTimeTracking();

    // Remove event listeners
    if (this.audioElement) {
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
