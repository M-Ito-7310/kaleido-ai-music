'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Reactive 3D Sphere Visualizer
 *
 * Sphere that reacts to audio frequency data by displacing vertices
 */

interface SphereVisualizerProps {
  frequencyData: Uint8Array;
  radius?: number;
  color?: string;
  emissiveColor?: string;
  wireframe?: boolean;
}

export function SphereVisualizer({
  frequencyData,
  radius = 2,
  color = '#9333ea',
  emissiveColor = '#06b6d4',
  wireframe = false,
}: SphereVisualizerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.IcosahedronGeometry>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  // Create geometry with high detail for smooth deformation
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(radius, 5),
    [radius]
  );

  // Store original vertex positions
  useEffect(() => {
    if (geometry) {
      const positions = geometry.attributes.position;
      originalPositions.current = new Float32Array(positions.array);
    }
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current || !geometryRef.current || !originalPositions.current) return;

    const positions = geometryRef.current.attributes.position;
    const original = originalPositions.current;
    const vertex = new THREE.Vector3();

    // Update each vertex based on frequency data
    for (let i = 0; i < positions.count; i++) {
      // Get original position
      vertex.set(
        original[i * 3],
        original[i * 3 + 1],
        original[i * 3 + 2]
      );

      // Map vertex to frequency data
      const frequencyIndex = Math.floor(
        (i / positions.count) * frequencyData.length
      );
      const amplitude = frequencyData[frequencyIndex] / 255;

      // Calculate displacement based on audio
      vertex.normalize();
      const displacement = radius + amplitude * 0.8;
      vertex.multiplyScalar(displacement);

      // Update position
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positions.needsUpdate = true;

    // Slow rotation
    meshRef.current.rotation.y += 0.002;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry ref={geometryRef} args={[radius, 5]} />
      <meshStandardMaterial
        color={color}
        emissive={emissiveColor}
        emissiveIntensity={0.2}
        roughness={0.2}
        metalness={0.8}
        wireframe={wireframe}
      />
    </mesh>
  );
}
