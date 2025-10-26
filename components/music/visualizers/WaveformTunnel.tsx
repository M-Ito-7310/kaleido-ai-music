'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Waveform Tunnel Visualizer
 *
 * Creates a tunnel effect that reacts to audio frequency data
 */

interface WaveformTunnelProps {
  frequencyData: Uint8Array;
  segments?: number;
  radius?: number;
  color?: string;
  emissiveColor?: string;
}

export function WaveformTunnel({
  frequencyData,
  segments = 100,
  radius = 0.5,
  color = '#06b6d4',
  emissiveColor = '#9333ea',
}: WaveformTunnelProps) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const pathRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  useFrame(({ clock }) => {
    if (!tubeRef.current) return;

    const time = clock.getElapsedTime();

    // Create dynamic tunnel path based on frequency data
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const frequencyIndex = Math.floor(t * frequencyData.length);
      const amplitude = frequencyData[frequencyIndex] / 255;

      // Create spiral tunnel path with frequency-based displacement
      const angle = t * Math.PI * 4 + time * 0.5;
      const radialOffset = amplitude * 2;

      points.push(
        new THREE.Vector3(
          Math.sin(angle) * (radialOffset + 1),
          Math.cos(angle) * (radialOffset + 1),
          -t * 15
        )
      );
    }

    // Update curve and geometry
    const curve = new THREE.CatmullRomCurve3(points);
    pathRef.current = curve;

    // Create new tube geometry
    const newGeometry = new THREE.TubeGeometry(curve, segments, radius, 8, false);

    // Dispose old geometry and update
    if (tubeRef.current.geometry) {
      tubeRef.current.geometry.dispose();
    }
    tubeRef.current.geometry = newGeometry;

    // Move tunnel forward
    tubeRef.current.position.z = (time % 15) * 1;
  });

  return (
    <mesh ref={tubeRef}>
      <tubeGeometry args={[new THREE.CatmullRomCurve3([]), segments, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        emissive={emissiveColor}
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.7}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
