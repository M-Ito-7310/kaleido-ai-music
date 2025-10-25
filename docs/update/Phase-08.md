# Phase 8: 3D Audio Visualization

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 3-4 hours

## Overview
Three.jsとWebGLを使用した3Dオーディオビジュアライザーの実装。リアルタイムの周波数データに基づく美しい3Dグラフィックスで、音楽体験を視覚的に拡張します。

## Technologies to Use
- Three.js ^0.160.0
- @react-three/fiber ^8.15.0
- @react-three/drei ^9.92.0
- Web Audio API
- WebGL 2.0
- GLSL Shaders

## Files to Create

### Create
1. **components/music/3DVisualizer.tsx** - Main 3D visualizer component
2. **components/music/visualizers/SphereVisualizer.tsx** - Sphere-based visualization
3. **components/music/visualizers/WaveformTunnel.tsx** - Tunnel effect
4. **components/music/visualizers/ParticleField.tsx** - 3D particle system
5. **lib/audio/audioAnalyzer3D.ts** - Enhanced audio analyzer for 3D
6. **shaders/audioReactive.vert** - Vertex shader
7. **shaders/audioReactive.frag** - Fragment shader

### Modify
- components/music/FullScreenPlayer.tsx - Add 3D visualizer option
- components/music/GlobalPlayer.tsx - 3D visualizer toggle

## Dependencies to Add

```json
{
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0"
}
```

## Key Features to Implement

### 1. Reactive 3D Sphere

```typescript
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ReactiveSphereProps {
  frequencyData: Uint8Array;
  radius?: number;
}

export function ReactiveSphere({ frequencyData, radius = 2 }: ReactiveSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.IcosahedronGeometry>(null);

  // Create geometry with more subdivisions for smoother deformation
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(radius, 6),
    [radius]
  );

  useFrame(() => {
    if (!meshRef.current || !geometryRef.current) return;

    const positions = geometryRef.current.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      vertex.normalize();

      // Map frequency data to vertices
      const frequencyIndex = Math.floor(
        (i / positions.count) * frequencyData.length
      );
      const amplitude = frequencyData[frequencyIndex] / 255;

      // Displace vertex outward based on frequency
      const displacement = radius + amplitude * 0.5;
      vertex.multiplyScalar(displacement);

      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positions.needsUpdate = true;

    // Rotate mesh
    meshRef.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry ref={geometryRef} args={[radius, 6]} />
      <meshStandardMaterial
        color="#9333ea"
        roughness={0.2}
        metalness={0.8}
        wireframe={false}
      />
    </mesh>
  );
}
```

### 2. Waveform Tunnel

```typescript
export function WaveformTunnel({ frequencyData }: { frequencyData: Uint8Array }) {
  const tubeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!tubeRef.current) return;

    // Create tunnel path
    const path = new THREE.CatmullRomCurve3(
      Array.from({ length: 100 }, (_, i) => {
        const t = i / 100;
        const frequency = frequencyData[Math.floor(t * frequencyData.length)] / 255;

        return new THREE.Vector3(
          Math.sin(t * Math.PI * 2) * frequency * 2,
          Math.cos(t * Math.PI * 2) * frequency * 2,
          -t * 10
        );
      })
    );

    // Update geometry
    const geometry = new THREE.TubeGeometry(path, 100, 0.5, 8, false);
    tubeRef.current.geometry.dispose();
    tubeRef.current.geometry = geometry;

    // Move camera through tunnel
    tubeRef.current.position.z = (clock.getElapsedTime() % 10) * 1;
  });

  return (
    <mesh ref={tubeRef}>
      <tubeGeometry args={[null, 100, 0.5, 8, false]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#9333ea"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
```

### 3. 3D Particle Field

```typescript
export function ParticleField({ frequencyData }: { frequencyData: Uint8Array }) {
  const particlesRef = useRef<THREE.Points>(null);

  // Create particle positions
  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    return positions;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      // Get frequency for this particle
      const frequencyIndex = Math.floor(
        (i / positions.count) * frequencyData.length
      );
      const amplitude = frequencyData[frequencyIndex] / 255;

      // Animate particle based on frequency
      const y = positions.getY(i);
      positions.setY(i, y + amplitude * 0.1);

      // Wrap around
      if (positions.getY(i) > 10) {
        positions.setY(i, -10);
      }
    }

    positions.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#06b6d4"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}
```

### 4. Main 3D Visualizer Component

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';

type VisualizerType = 'sphere' | 'tunnel' | 'particles' | 'all';

interface Visualizer3DProps {
  audioElement: HTMLAudioElement | null;
  type?: VisualizerType;
}

export function Visualizer3D({ audioElement, type = 'sphere' }: Visualizer3DProps) {
  const { dataArray } = useAudioAnalyzer(audioElement);

  if (!dataArray) return null;

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />

        {/* Visualizers */}
        {(type === 'sphere' || type === 'all') && (
          <ReactiveSphere frequencyData={dataArray} />
        )}
        {(type === 'tunnel' || type === 'all') && (
          <WaveformTunnel frequencyData={dataArray} />
        )}
        {(type === 'particles' || type === 'all') && (
          <ParticleField frequencyData={dataArray} />
        )}

        {/* Environment */}
        <fog attach="fog" args={['#000000', 5, 15]} />
      </Canvas>
    </div>
  );
}
```

### 5. Custom Shaders (Audio-Reactive)

#### Vertex Shader
```glsl
// shaders/audioReactive.vert
uniform float uTime;
uniform float uAmplitude;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;

  // Calculate elevation based on position and amplitude
  vec3 newPosition = position;
  float elevation = sin(newPosition.x * 3.0 + uTime) * 0.5;
  elevation += sin(newPosition.y * 3.0 + uTime) * 0.5;
  elevation *= uAmplitude;

  newPosition.z += elevation;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

#### Fragment Shader
```glsl
// shaders/audioReactive.frag
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  // Color based on elevation
  vec3 color1 = vec3(0.58, 0.2, 0.92); // Primary purple
  vec3 color2 = vec3(0.02, 0.71, 0.83); // Accent cyan

  float mixStrength = (vElevation + 0.5) * 0.5;
  vec3 color = mix(color1, color2, mixStrength);

  // Add pulsing glow
  float glow = sin(uTime * 2.0) * 0.5 + 0.5;
  color += glow * 0.2;

  gl_FragColor = vec4(color, 1.0);
}
```

#### Shader Material Component
```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '@/shaders/audioReactive.vert';
import fragmentShader from '@/shaders/audioReactive.frag';

export function ShaderPlane({ amplitude }: { amplitude: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uAmplitude.value = amplitude;
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uAmplitude: { value: 0 },
        }}
      />
    </mesh>
  );
}
```

### 6. Post-Processing Effects

```typescript
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        offset={[0.002, 0.002]}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
```

## Technical Implementation

### Performance Optimizations

1. **Level of Detail (LOD)**
```typescript
import { Lod } from '@react-three/drei';

<Lod>
  <ReactiveSphere distance={0} frequencyData={dataArray} subdivisions={6} />
  <ReactiveSphere distance={5} frequencyData={dataArray} subdivisions={4} />
  <ReactiveSphere distance={10} frequencyData={dataArray} subdivisions={2} />
</Lod>
```

2. **Frustum Culling**
- Automatically handled by Three.js
- Only render objects in camera view

3. **Geometry Instancing**
```typescript
import { Instances, Instance } from '@react-three/drei';

<Instances limit={1000}>
  <sphereGeometry args={[0.1, 8, 8]} />
  <meshStandardMaterial color="#9333ea" />
  {particles.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```

4. **Texture Optimization**
- Use power-of-two textures
- Mipmapping enabled
- Compress textures with basis

### WebGL Fallback

```typescript
export function Visualizer3D({ audioElement }: Props) {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    setWebGLSupported(!!gl);
  }, []);

  if (!webGLSupported) {
    return <AudioVisualizer mode="bars" />; // Fallback to 2D
  }

  return <Canvas>...</Canvas>;
}
```

## Design Specifications

### Visual Styles
1. **Cyberpunk**: Neon colors, grid patterns, glitch effects
2. **Organic**: Flowing shapes, natural movements, soft colors
3. **Geometric**: Sharp angles, precise movements, minimalist
4. **Abstract**: Random patterns, unexpected behaviors, artistic

### Color Schemes
- **Brand**: Purple-cyan gradient
- **Album-based**: Extract from album art
- **Dynamic**: Change based on music genre/mood
- **Rainbow**: Hue rotation over time

### Camera Controls
- **Auto-rotate**: Slow rotation for ambient viewing
- **Manual control**: Touch/mouse drag to rotate
- **Auto-zoom**: Zoom in/out with beat
- **Predefined positions**: Quick camera angle changes

## Accessibility

- Option to disable 3D visualizer (performance/motion sickness)
- Respect `prefers-reduced-motion`
- Provide 2D alternative
- Performance warning on low-end devices

## Performance Targets

- **Desktop**: 60 FPS at 1080p
- **Mobile**: 30 FPS at 720p
- **Low-end**: Fallback to 2D visualizer

## Browser Compatibility

- Chrome/Edge 90+: Full WebGL 2.0 support
- Safari 15+: WebGL 2.0 support
- Firefox 85+: Full support
- Mobile browsers: WebGL 1.0 fallback

## Next Steps
➡️ Phase 9: AI-Driven Features

## Notes
- Three.jsで高品質な3Dビジュアライゼーション
- リアルタイムの周波数データに反応
- カスタムシェーダーで独自のエフェクト
- ポストプロセッシングで洗練された見た目
- パフォーマンスを考慮したLODシステム
- WebGL非対応デバイスへのフォールバック
