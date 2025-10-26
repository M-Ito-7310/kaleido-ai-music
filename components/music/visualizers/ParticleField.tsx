'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Particle Field Visualizer
 *
 * Creates a field of particles that react to audio frequency data
 */

interface ParticleFieldProps {
  frequencyData: Uint8Array;
  count?: number;
  size?: number;
  color?: string;
  spread?: number;
}

export function ParticleField({
  frequencyData,
  count = 5000,
  size = 0.05,
  color = '#06b6d4',
  spread = 20,
}: ParticleFieldProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);

  // Create particle positions and velocities
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    const colorObj = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      // Color with slight variation
      const variation = Math.random() * 0.2;
      colors[i * 3] = colorObj.r + variation;
      colors[i * 3 + 1] = colorObj.g + variation;
      colors[i * 3 + 2] = colorObj.b + variation;

      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    velocitiesRef.current = velocities;

    return { positions, colors };
  }, [count, color, spread]);

  useFrame(() => {
    if (!particlesRef.current || !velocitiesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      // Get frequency for this particle
      const frequencyIndex = Math.floor((i / count) * frequencyData.length);
      const amplitude = frequencyData[frequencyIndex] / 255;

      // Update position based on velocity and frequency
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Apply velocity
      let newX = x + velocities[i * 3];
      let newY = y + velocities[i * 3 + 1] + amplitude * 0.1;
      let newZ = z + velocities[i * 3 + 2];

      // Wrap around boundaries
      const halfSpread = spread / 2;
      if (newX > halfSpread) newX = -halfSpread;
      if (newX < -halfSpread) newX = halfSpread;
      if (newY > halfSpread) newY = -halfSpread;
      if (newY < -halfSpread) newY = halfSpread;
      if (newZ > halfSpread) newZ = -halfSpread;
      if (newZ < -halfSpread) newZ = halfSpread;

      positions.setXYZ(i, newX, newY, newZ);
    }

    positions.needsUpdate = true;

    // Rotate the entire particle field slowly
    particlesRef.current.rotation.y += 0.0005;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
