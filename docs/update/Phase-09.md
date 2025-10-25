# Phase 9: AI-Driven Features

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 4-5 hours

## Overview
AI搭載機能の実装。機械学習による楽曲レコメンデーション、自動プレイリスト生成、AI Radioモード、音楽分析と気分検出を実現します。

## Technologies to Use
- TensorFlow.js ^4.15.0
- Web Worker (heavy computation)
- IndexedDB (model caching)
- Gemini API / OpenAI API (optional server-side)

## Dependencies to Add

```json
{
  "@tensorflow/tfjs": "^4.15.0",
  "@tensorflow-models/universal-sentence-encoder": "^1.3.3"
}
```

## Key Features to Implement

### 1. Music Recommendation Engine

**Algorithm**: Collaborative Filtering + Content-Based

```typescript
interface MusicFeatures {
  tempo: number; // BPM
  energy: number; // 0-1
  danceability: number; // 0-1
  valence: number; // mood, 0-1
  acousticness: number; // 0-1
  genres: string[];
}

class RecommendationEngine {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Load pre-trained model or create new
    this.model = await tf.loadLayersModel('/models/recommendation/model.json');
  }

  async getSimilarTracks(trackId: number, count: number = 10): Promise<Music[]> {
    const trackFeatures = await this.extractFeatures(trackId);
    const allTracks = await getAllTracks();

    // Calculate similarity scores
    const scores = allTracks.map((track) => ({
      track,
      score: this.cosineSimilarity(trackFeatures, track.features),
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((s) => s.track);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB);
  }
}
```

### 2. Auto-Playlist Generation

```typescript
interface PlaylistCriteria {
  mood?: 'happy' | 'sad' | 'energetic' | 'calm';
  duration?: number; // minutes
  genre?: string[];
  tempo?: { min: number; max: number };
}

async function generatePlaylist(
  criteria: PlaylistCriteria,
  seedTracks?: Music[]
): Promise<Music[]> {
  const allTracks = await getAllTracks();

  // Filter by criteria
  let filtered = allTracks.filter((track) => {
    if (criteria.genre && !criteria.genre.includes(track.genre)) return false;
    if (criteria.tempo) {
      if (track.tempo < criteria.tempo.min || track.tempo > criteria.tempo.max) return false;
    }
    if (criteria.mood && track.mood !== criteria.mood) return false;
    return true;
  });

  // If seed tracks provided, find similar
  if (seedTracks && seedTracks.length > 0) {
    const engine = new RecommendationEngine();
    const similar = await Promise.all(
      seedTracks.map((track) => engine.getSimilarTracks(track.id, 5))
    );
    filtered = [...new Set(similar.flat())];
  }

  // Optimize playlist flow (tempo, energy transitions)
  const optimized = optimizePlaylistFlow(filtered);

  // Limit by duration
  if (criteria.duration) {
    const maxDuration = criteria.duration * 60; // to seconds
    let totalDuration = 0;
    optimized = optimized.filter((track) => {
      if (totalDuration + track.duration > maxDuration) return false;
      totalDuration += track.duration;
      return true;
    });
  }

  return optimized;
}

function optimizePlaylistFlow(tracks: Music[]): Music[] {
  // Sort by tempo and energy for smooth transitions
  return tracks.sort((a, b) => {
    const tempoWeight = 0.6;
    const energyWeight = 0.4;
    const aScore = a.tempo * tempoWeight + a.energy * energyWeight;
    const bScore = b.tempo * tempoWeight + b.energy * energyWeight;
    return aScore - bScore;
  });
}
```

### 3. AI Radio Mode

```typescript
class AIRadio {
  private currentStation: Music[] = [];
  private playHistory: Music[] = [];
  private userPreferences: Map<string, number> = new Map();

  async startRadio(seedTrack: Music) {
    this.currentStation = [seedTrack];

    // Generate initial queue
    const similar = await this.generateNextTracks(seedTrack, 10);
    this.currentStation.push(...similar);

    return this.currentStation;
  }

  async onTrackFinished(track: Music, wasSkipped: boolean) {
    this.playHistory.push(track);

    // Update preferences
    if (wasSkipped) {
      this.adjustPreference(track.genre, -0.1);
      this.adjustPreference(track.artist, -0.05);
    } else {
      this.adjustPreference(track.genre, 0.1);
      this.adjustPreference(track.artist, 0.05);
    }

    // Generate next track based on current preferences
    const nextTrack = await this.generateNextTrack();
    this.currentStation.push(nextTrack);

    return nextTrack;
  }

  private async generateNextTrack(): Promise<Music> {
    // Get recent track features
    const recentTracks = this.playHistory.slice(-5);
    const avgFeatures = this.averageFeatures(recentTracks);

    // Find similar track not recently played
    const candidates = await getAllTracks();
    const filtered = candidates.filter(
      (t) => !this.playHistory.slice(-20).find((h) => h.id === t.id)
    );

    // Score by similarity + user preferences
    const scored = filtered.map((track) => {
      const featureSimilarity = this.cosineSimilarity(avgFeatures, track.features);
      const genrePreference = this.userPreferences.get(track.genre) || 0;
      const artistPreference = this.userPreferences.get(track.artist) || 0;

      const score =
        featureSimilarity * 0.6 + genrePreference * 0.25 + artistPreference * 0.15;

      return { track, score };
    });

    return scored.sort((a, b) => b.score - a.score)[0].track;
  }

  private adjustPreference(key: string, delta: number) {
    const current = this.userPreferences.get(key) || 0;
    this.userPreferences.set(key, Math.max(-1, Math.min(1, current + delta)));
  }
}
```

### 4. Mood Detection from Audio

```typescript
import * as tf from '@tensorflow/tfjs';

class MoodDetector {
  private model: tf.LayersModel | null = null;

  async loadModel() {
    this.model = await tf.loadLayersModel('/models/mood-detection/model.json');
  }

  async detectMood(audioBuffer: AudioBuffer): Promise<{
    mood: string;
    confidence: number;
    features: { valence: number; arousal: number; energy: number };
  }> {
    // Extract audio features
    const features = await this.extractAudioFeatures(audioBuffer);

    // Predict mood
    const input = tf.tensor2d([features]);
    const prediction = this.model!.predict(input) as tf.Tensor;
    const probabilities = await prediction.data();

    const moods = ['happy', 'sad', 'energetic', 'calm', 'angry', 'peaceful'];
    const maxIndex = probabilities.indexOf(Math.max(...Array.from(probabilities)));

    return {
      mood: moods[maxIndex],
      confidence: probabilities[maxIndex],
      features: {
        valence: features[0],
        arousal: features[1],
        energy: features[2],
      },
    };
  }

  private async extractAudioFeatures(audioBuffer: AudioBuffer): Promise<number[]> {
    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;

    const dataArray = new Float32Array(analyzer.frequencyBinCount);
    analyzer.getFloatFrequencyData(dataArray);

    // Calculate features
    const spectralCentroid = this.calculateSpectralCentroid(dataArray);
    const spectralRolloff = this.calculateSpectralRolloff(dataArray);
    const zeroCrossingRate = this.calculateZeroCrossingRate(audioBuffer);
    const rms = this.calculateRMS(audioBuffer);

    return [spectralCentroid, spectralRolloff, zeroCrossingRate, rms];
  }
}
```

### 5. Smart Search with Semantic Understanding

```typescript
import * as use from '@tensorflow-models/universal-sentence-encoder';

class SemanticSearch {
  private model: use.UniversalSentenceEncoder | null = null;
  private trackEmbeddings: Map<number, number[]> = new Map();

  async initialize() {
    this.model = await use.load();
    await this.indexAllTracks();
  }

  async search(query: string): Promise<Music[]> {
    const queryEmbedding = await this.model!.embed([query]);
    const queryVector = await queryEmbedding.array();

    // Calculate similarity with all tracks
    const scores = Array.from(this.trackEmbeddings.entries()).map(
      ([trackId, embedding]) => ({
        trackId,
        score: this.cosineSimilarity(queryVector[0], embedding),
      })
    );

    const topResults = scores.sort((a, b) => b.score - a.score).slice(0, 20);

    return Promise.all(topResults.map((r) => getTrackById(r.trackId)));
  }

  private async indexAllTracks() {
    const tracks = await getAllTracks();

    for (const track of tracks) {
      const text = `${track.title} ${track.artist} ${track.genre} ${track.description}`;
      const embedding = await this.model!.embed([text]);
      const vector = await embedding.array();
      this.trackEmbeddings.set(track.id, vector[0]);
    }
  }
}
```

## Performance Considerations

### Web Workers for Heavy Computation
```typescript
// workers/recommendation.worker.ts
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;

  if (type === 'GENERATE_RECOMMENDATIONS') {
    const recommendations = await generateRecommendations(data);
    self.postMessage({ type: 'RECOMMENDATIONS_READY', recommendations });
  }
});
```

### Model Caching in IndexedDB
```typescript
async function cacheModel(modelName: string, modelData: ArrayBuffer) {
  const db = await openDB('ai-models', 1);
  await db.put('models', modelData, modelName);
}

async function loadCachedModel(modelName: string) {
  const db = await openDB('ai-models', 1);
  return await db.get('models', modelName);
}
```

## UI Components

```typescript
// AI Radio Station Card
export function AIRadioCard() {
  const [station, setStation] = useState<Music[] | null>(null);
  const { playTrack } = usePlayer();

  const startRadio = async () => {
    const radio = new AIRadio();
    const tracks = await radio.startRadio(currentTrack);
    setStation(tracks);
    playTrack(tracks[0], tracks);
  };

  return (
    <motion.div className="bg-gradient-to-br from-primary-500 to-accent-DEFAULT rounded-xl p-6">
      <h3 className="text-2xl font-bold text-white mb-2">AI Radio</h3>
      <p className="text-white/80 mb-4">
        Endless music tailored to your taste
      </p>
      <button onClick={startRadio} className="btn-primary">
        Start Radio
      </button>
    </motion.div>
  );
}
```

## Next Steps
➡️ Phase 10: Social Features

## Notes
- TensorFlow.jsでクライアント側AI処理
- プライバシー重視（データはローカル処理）
- Web Workerでメインスレッドをブロックしない
- IndexedDBでモデルキャッシュ
- セマンティック検索で自然言語クエリ対応
