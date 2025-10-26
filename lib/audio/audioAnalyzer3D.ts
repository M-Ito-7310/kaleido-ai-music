/**
 * 3D Audio Analyzer
 *
 * Enhanced audio analyzer for 3D visualizations with frequency data extraction
 */

export class AudioAnalyzer3D {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private rafId: number | null = null;

  constructor(
    private fftSize: number = 2048,
    private smoothingTimeConstant: number = 0.8
  ) {}

  /**
   * Connect audio element to analyzer
   */
  connect(audioElement: HTMLAudioElement): void {
    if (!audioElement) return;

    try {
      // Create audio context if not exists
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      // Create analyzer node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;

      // Create data array for frequency data
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;

      // Connect source to analyser
      if (!this.source) {
        this.source = this.audioContext.createMediaElementSource(audioElement);
      }

      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Failed to connect audio analyzer:', error);
    }
  }

  /**
   * Get current frequency data
   */
  getFrequencyData(): Uint8Array<ArrayBuffer> | null {
    if (!this.analyser || !this.dataArray) return null;

    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray as Uint8Array<ArrayBuffer>;
  }

  /**
   * Get time domain data (waveform)
   */
  getTimeDomainData(): Uint8Array<ArrayBuffer> | null {
    if (!this.analyser || !this.dataArray) return null;

    this.analyser.getByteTimeDomainData(this.dataArray);
    return this.dataArray as Uint8Array<ArrayBuffer>;
  }

  /**
   * Get average frequency across all bins
   */
  getAverageFrequency(): number {
    const data = this.getFrequencyData();
    if (!data) return 0;

    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length / 255; // Normalize to 0-1
  }

  /**
   * Get frequency data for specific range
   */
  getFrequencyRange(startHz: number, endHz: number): number {
    if (!this.analyser || !this.audioContext) return 0;

    const data = this.getFrequencyData();
    if (!data) return 0;

    const nyquist = this.audioContext.sampleRate / 2;
    const startIndex = Math.floor((startHz / nyquist) * data.length);
    const endIndex = Math.floor((endHz / nyquist) * data.length);

    let sum = 0;
    for (let i = startIndex; i < endIndex; i++) {
      sum += data[i];
    }

    return sum / (endIndex - startIndex) / 255; // Normalize to 0-1
  }

  /**
   * Get bass (20-250 Hz)
   */
  getBass(): number {
    return this.getFrequencyRange(20, 250);
  }

  /**
   * Get mids (250-2000 Hz)
   */
  getMids(): number {
    return this.getFrequencyRange(250, 2000);
  }

  /**
   * Get treble (2000-20000 Hz)
   */
  getTreble(): number {
    return this.getFrequencyRange(2000, 20000);
  }

  /**
   * Get frequency bands for visualizer (like equalizer)
   */
  getFrequencyBands(numBands: number = 32): number[] {
    const data = this.getFrequencyData();
    if (!data) return new Array(numBands).fill(0);

    const bands: number[] = [];
    const samplesPerBand = Math.floor(data.length / numBands);

    for (let i = 0; i < numBands; i++) {
      const start = i * samplesPerBand;
      const end = start + samplesPerBand;
      let sum = 0;

      for (let j = start; j < end; j++) {
        sum += data[j];
      }

      bands.push(sum / samplesPerBand / 255); // Normalize to 0-1
    }

    return bands;
  }

  /**
   * Resume audio context (required for autoplay policies)
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.dataArray = null;
  }
}
