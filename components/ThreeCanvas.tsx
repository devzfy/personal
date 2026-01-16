
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;

interface ParticleFieldProps {
  progress: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ progress }) => {
  const ref = useRef<THREE.Points>(null!);
  const materialRef = useRef<any>(null!);
  
  const points = useMemo(() => {
    const p = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 0.6;
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    // Base rotation influenced by scroll progress
    // Speed increases during the middle transition (0.3 to 0.7)
    const speedMultiplier = 1 + (Math.sin(progress * Math.PI) * 5);
    ref.current.rotation.x += 0.001 * speedMultiplier;
    ref.current.rotation.y += 0.0015 * speedMultiplier;
    
    // Mouse interaction remains subtle
    const targetX = state.mouse.x * 0.1;
    const targetY = state.mouse.y * 0.1;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.05;

    // Morph color and size in the material
    if (materialRef.current) {
      // Transition from Red to White and back
      const r = 1;
      const g = THREE.MathUtils.lerp(0, 1, progress);
      const b = THREE.MathUtils.lerp(0, 1, progress);
      materialRef.current.color.setRGB(r, g, b);
      
      // Pulse size based on scroll
      materialRef.current.size = 0.003 + (Math.sin(progress * Math.PI) * 0.005);
    }
    
    // Scale the whole sphere as we scroll deeper
    const targetScale = 1 + progress * 0.5;
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1));
  });

  return (
    <Group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          ref={materialRef}
          transparent
          color="#ff0000"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4 + (progress * 0.4)}
        />
      </Points>
    </Group>
  );
};

interface ThreeCanvasProps {
  progress?: number;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ progress = 0 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1.5] }}>
        <AmbientLight intensity={0.8} />
        <ParticleField progress={progress} />
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;
