"use client";

import { Suspense, lazy, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  PARTICLE_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
} from "./shaders/particle";

/**
 * The postprocessing bundle is the heaviest thing in this scene, so it is split
 * behind React.lazy and rendered inside a Suspense boundary within the Canvas.
 *
 * The existing next/dynamic({ ssr: false }) around ParticleScene already keeps
 * three and R3F out of the initial page bundle, but it pulls the whole scene in
 * as one chunk. Splitting again here means the particles start rendering as soon
 * as three is ready, and the effects composite in when postprocessing arrives,
 * instead of the canvas waiting on both.
 */
const SceneEffects = lazy(() => import("./SceneEffects"));

interface Quality {
  particleCount: number;
  enableBloom: boolean;
  bloomIntensity: number;
  /** Multiplier on rotation speed. */
  motionScale: number;
  /** Simplex drift amplitude, in world units. */
  driftAmp: number;
}

const HIGH: Quality = {
  particleCount: 4000,
  enableBloom: true,
  bloomIntensity: 0.85,
  motionScale: 1,
  driftAmp: 0.08,
};

function detectQuality(): Quality {
  if (typeof window === "undefined") return HIGH;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const smallScreen = window.innerWidth < 768;

  return {
    particleCount: reduceMotion || smallScreen ? 900 : 4000,
    // Bloom is skipped rather than merely dialled down on small screens: the
    // cost is the mipmap blur chain itself, so a lower intensity would still
    // pay most of the price. Grain and vignette are single cheap passes and
    // stay on, which keeps the treatment recognisable.
    enableBloom: !smallScreen,
    bloomIntensity: 0.85,
    motionScale: reduceMotion ? 0.25 : 1,
    driftAmp: reduceMotion ? 0.03 : 0.08,
  };
}

interface ParticleFieldProps {
  progress: number;
  quality: Quality;
}

function ParticleField({ progress, quality }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const count = quality.particleCount;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 0.6;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random();
    }

    return { positions, seeds };
  }, [quality.particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uBaseSize: { value: 0.003 },
      uPulse: { value: 0.005 },
      uOpacity: { value: 0.4 },
      uGain: { value: 1.35 },
      uPixelRatio: { value: 1 },
      uScale: { value: 450 },
      uDriftAmp: { value: quality.driftAmp },
    }),
    [quality.driftAmp],
  );

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    // --- unchanged from the imperative version -----------------------------
    // Base rotation influenced by scroll progress; speed peaks mid-transition.
    const speedMultiplier =
      (1 + Math.sin(progress * Math.PI) * 5) * quality.motionScale;
    points.rotation.x += 0.001 * speedMultiplier;
    points.rotation.y += 0.0015 * speedMultiplier;

    // Mouse interaction remains subtle.
    const targetX = state.mouse.x * 0.1;
    const targetY = state.mouse.y * 0.1;
    points.position.x += (targetX - points.position.x) * 0.05;
    points.position.y += (targetY - points.position.y) * 0.05;

    // Scale the whole sphere as we scroll deeper.
    const targetScale = 1 + progress * 0.5;
    points.scale.setScalar(
      THREE.MathUtils.lerp(points.scale.x, targetScale, 0.1),
    );

    // --- now uniforms instead of per-frame material mutation ---------------
    uniforms.uTime.value += delta * quality.motionScale;
    uniforms.uProgress.value = progress;
    uniforms.uOpacity.value = 0.4 + progress * 0.4;

    // Mirrors what three feeds its own points shader, so point sizes match the
    // previous PointsMaterial exactly and survive the dpr cap unchanged.
    uniforms.uPixelRatio.value = state.viewport.dpr;
    uniforms.uScale.value = state.size.height * 0.5;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={PARTICLE_VERTEX_SHADER}
          fragmentShader={PARTICLE_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}

interface ParticleSceneProps {
  progress?: number;
}

/**
 * Scroll-reactive particle field with a bloom / grain / vignette stack.
 *
 * Always import this through next/dynamic with { ssr: false } — a WebGL canvas
 * cannot be server-rendered.
 */
export default function ParticleScene({ progress = 0 }: ParticleSceneProps) {
  // Sampled once on mount. Deliberately not reactive to resize: reacting would
  // mean rebuilding the position and seed buffers mid-scroll, which is a worse
  // trade than a phone in landscape keeping its 900-particle budget.
  const [quality] = useState(detectQuality);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        // Retina would otherwise render at 2x (a 2880x1800 buffer on a 1440x900
        // canvas). Capping at 1.5 cuts that by ~44% of the pixels; particle size
        // is unaffected because gl_PointSize multiplies by the same dpr.
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1.5] }}
      >
        <ambientLight intensity={0.8} />
        <ParticleField progress={progress} quality={quality} />
        <Suspense fallback={null}>
          <SceneEffects
            enableBloom={quality.enableBloom}
            bloomIntensity={quality.bloomIntensity}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
