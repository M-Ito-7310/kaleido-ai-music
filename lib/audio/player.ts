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
      // Create HTML Audio Element
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous'; // Enable CORS for Web Audio API
      this.audioElement.preload = 'auto';

      // iOS Safari specific settings for background playback
      // Disable picture-in-picture to improve compatibility
      (this.audioElement as any).disablePictureInPicture = true;

      // Set playsinline to prevent fullscreen on iOS
      this.audioElement.setAttribute('playsinline', '');

      // Important: Set these properties to allow background playback on iOS
      this.audioElement.setAttribute('webkit-playsinline', '');

      // Add event listeners
      this.audioElement.addEventListener('ended', this.handleEnded);
      this.audioElement.addEventListener('loadedmetadata', this.handleLoadedMetadata);

      // Detect iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      // Only use Web Audio API on non-iOS devices
      // iOS Safari has issues with AudioContext in background
      if (!isIOS) {
        // Create Web Audio API context
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create source node from audio element
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);

        // Create gain node for volume control
        this.gainNode = this.audioContext.createGain();

        // Create audio processor for effects
        this.audioProcessor = new AudioProcessor(this.audioContext);

        // Connect: sourceNode → gainNode → destination
        // Note: AudioProcessor is kept for future effects implementation
        // Currently connecting directly to destination for stable playback
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
      } else {
        // iOS: Use HTMLAudioElement directly without Web Audio API
        console.log('iOS detected: Using HTMLAudioElement without Web Audio API');
      }
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

    this.rafId = requestAnimationFrame(update);
  }

  /**
   * Stop tracking playback time
   */
  private stopTimeTracking() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private handleEnded = () => {
    this.stopTimeTracking();
    if (this.onEndedCallback) {
      this.onEndedCallback();
    }
  };

  private handleLoadedMetadata = () => {
    // Metadata loaded - duration is now available
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
      // Stop current playback
      this.stop();

      // Set the audio source
      this.audioElement.src = url;

      // Wait for track to be ready for playback
      await new Promise<void>((resolve, reject) => {
        if (!this.audioElement) {
          reject(new Error('Audio element not initialized'));
          return;
        }

        const onCanPlay = () => {
          this.audioElement?.removeEventListener('canplay', onCanPlay);
          this.audioElement?.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: ErrorEvent | Event) => {
          this.audioElement?.removeEventListener('canplay', onCanPlay);
          this.audioElement?.removeEventListener('error', onError);
          reject(new Error('Failed to load audio'));
        };

        this.audioElement.addEventListener('canplay', onCanPlay, { once: true });
        this.audioElement.addEventListener('error', onError, { once: true });

        // Load the audio
        this.audioElement.load();
      });
    } catch (error) {
      throw error;
    }
  }

  async play(): Promise<void> {
    if (!this.audioElement) return;

    // Resume audio context if suspended and WAIT for it to be running (non-iOS only)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Play the audio
    try {
      await this.audioElement.play();

      // Start time tracking with requestAnimationFrame
      this.startTimeTracking();
    } catch (error) {
      // Playback failed - user may need to interact with page first
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  pause(): void {
    if (!this.audioElement) return;
    this.audioElement.pause();

    // Stop time tracking
    this.stopTimeTracking();
  }

  stop(): void {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.audioElement.currentTime = 0;

    // Stop time tracking
    this.stopTimeTracking();
  }

  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));

    // Set volume on gain node (non-iOS only)
    if (this.gainNode) {
      this.gainNode.gain.value = clampedVolume;
    }

    // Always set volume on audio element (works on all platforms including iOS)
    if (this.audioElement) {
      this.audioElement.volume = clampedVolume;
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
