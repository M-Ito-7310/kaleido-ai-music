'use client';

import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AudioAnalyzer3D } from '@/lib/audio/audioAnalyzer3D';
import { SphereVisualizer } from './visualizers/SphereVisualizer';
import { WaveformTunnel } from './visualizers/WaveformTunnel';
import { ParticleField } from './visualizers/ParticleField';

/**
 * 3D Audio Visualizer Component
 *
 * Main component that integrates all 3D visualizer types with audio analysis
 */

type VisualizerType = 'sphere' | 'tunnel' | 'particles' | 'all';

interface Visualizer3DProps {
  audioElement: HTMLAudioElement | null;
  type?: VisualizerType;
  enablePostProcessing?: boolean;
  className?: string;
}

function Scene({
  analyzer,
  type,
  enablePostProcessing,
}: {
  analyzer: AudioAnalyzer3D;
  type: VisualizerType;
  enablePostProcessing: boolean;
}) {
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(analyzer.getFrequencyData()?.length || 1024)
  );

  // Update frequency data on each frame
  useEffect(() => {
    let rafId: number;

    const updateData = () => {
      const data = analyzer.getFrequencyData();
      if (data) {
        setFrequencyData(new Uint8Array(data));
      }
      rafId = requestAnimationFrame(updateData);
    };

    updateData();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [analyzer]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={15}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#9333ea" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[0, 10, -10]} intensity={0.6} color="#ffffff" />

      {/* Visualizers */}
      {(type === 'sphere' || type === 'all') && (
        <SphereVisualizer
          frequencyData={frequencyData}
          radius={2}
          color="#9333ea"
          emissiveColor="#06b6d4"
        />
      )}

      {(type === 'tunnel' || type === 'all') && (
        <WaveformTunnel
          frequencyData={frequencyData}
          segments={80}
          radius={0.4}
          color="#06b6d4"
          emissiveColor="#9333ea"
        />
      )}

      {(type === 'particles' || type === 'all') && (
        <ParticleField
          frequencyData={frequencyData}
          count={type === 'all' ? 3000 : 5000}
          size={0.05}
          color="#06b6d4"
          spread={20}
        />
      )}

      {/* Environment */}
      <fog attach="fog" args={['#000000', 8, 20]} />

      {/* Post-processing effects */}
      {enablePostProcessing && (
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      )}
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-white">Loading 3D Visualizer...</p>
      </div>
    </div>
  );
}

export function Visualizer3D({
  audioElement,
  type = 'sphere',
  enablePostProcessing = true,
  className = '',
}: Visualizer3DProps) {
  const [analyzer] = useState(() => new AudioAnalyzer3D(2048, 0.8));
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') || canvas.getContext('webgl');
      setWebGLSupported(!!gl);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  // Connect audio element to analyzer
  useEffect(() => {
    if (!audioElement || !webGLSupported) return;

    try {
      analyzer.connect(audioElement);
      analyzer.resume();
      setIsReady(true);
    } catch (error) {
      console.error('Failed to connect audio analyzer:', error);
    }

    return () => {
      analyzer.disconnect();
    };
  }, [audioElement, analyzer, webGLSupported]);

  // Fallback for non-WebGL browsers
  if (!webGLSupported) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="text-center text-white">
          <p className="text-lg font-semibold">3D Visualizer Not Supported</p>
          <p className="mt-2 text-sm text-gray-400">
            Your browser does not support WebGL
          </p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return <LoadingFallback />;
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#000000']} />
          <Scene
            analyzer={analyzer}
            type={type}
            enablePostProcessing={enablePostProcessing}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
