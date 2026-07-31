"use client";

import { Suspense, lazy, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  createCloud,
  createGrid,
  createSphere,
  morphFromProgress,
} from "./particleShapes";
import {
  PARTICLE_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
} from "./shaders/particle";
import { TRAIL_FRAGMENT_SHADER, TRAIL_VERTEX_SHADER } from "./shaders/trail";

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

/** Samples in the cursor trail. */
const TRAIL_COUNT = 56;

/** Reused every frame so the trail allocates nothing. */
const TMP = new THREE.Vector3();

interface Quality {
  particleCount: number;
  enableBloom: boolean;
  bloomIntensity: number;
  /** Cursor trail: desktop pointers only. */
  enableTrail: boolean;
  /** 3 = sphere -> cloud -> grid -> sphere. 1 = sphere -> cloud only. */
  morphPhases: number;
  /** Multiplier on rotation speed. */
  motionScale: number;
  /** Simplex drift amplitude, in world units. */
  driftAmp: number;
}

const HIGH: Quality = {
  particleCount: 4000,
  enableBloom: true,
  bloomIntensity: 0.85,
  enableTrail: true,
  morphPhases: 3,
  motionScale: 1,
  driftAmp: 0.08,
};

function detectQuality(): Quality {
  if (typeof window === "undefined") return HIGH;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const smallScreen = window.innerWidth < 768;
  // Same query the custom cursor gates on, so the trail and the cursor appear
  // and disappear together rather than on different rules.
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  return {
    particleCount: reduceMotion || smallScreen ? 900 : 4000,
    // Bloom is skipped rather than merely dialled down on small screens: the
    // cost is the mipmap blur chain itself, so a lower intensity would still
    // pay most of the price. Grain and vignette are single cheap passes and
    // stay on, which keeps the treatment recognisable.
    enableBloom: !smallScreen,
    bloomIntensity: 0.85,
    enableTrail: finePointer && !smallScreen && !reduceMotion,
    // Reduced sequence keeps one gentle reform instead of three, so the cheap
    // path still changes shape but never whips the field across the frame.
    morphPhases: reduceMotion || smallScreen ? 1 : 3,
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

  // One buffer per formation. Three cover four phases, because the last leg
  // morphs back to `position`.
  const shapes = useMemo(() => {
    const count = quality.particleCount;
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();

    return {
      sphere: createSphere(count),
      cloud: createCloud(count),
      grid: createGrid(count),
      seeds,
    };
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
      uMorph: { value: 0 },
      uMorphMax: { value: quality.morphPhases },
      // Fraction of each transition spent staggering particle departures.
      uStagger: { value: 0.4 },
    }),
    [quality.driftAmp, quality.morphPhases],
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
    const targetX = state.pointer.x * 0.1;
    const targetY = state.pointer.y * 0.1;
    points.position.x += (targetX - points.position.x) * 0.05;
    points.position.y += (targetY - points.position.y) * 0.05;

    // Scale the whole sphere as we scroll deeper.
    const targetScale = 1 + progress * 0.5;
    points.scale.setScalar(
      THREE.MathUtils.lerp(points.scale.x, targetScale, 0.1),
    );

    // --- uniforms, not per-frame material mutation -------------------------
    uniforms.uTime.value += delta * quality.motionScale;
    uniforms.uProgress.value = progress;
    uniforms.uOpacity.value = 0.4 + progress * 0.4;
    uniforms.uMorph.value = morphFromProgress(progress, quality.morphPhases);

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
            args={[shapes.sphere, 3]}
          />
          <bufferAttribute attach="attributes-aShape1" args={[shapes.cloud, 3]} />
          <bufferAttribute attach="attributes-aShape2" args={[shapes.grid, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[shapes.seeds, 1]} />
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

/**
 * Fading point tail that follows the cursor on the z=0 plane.
 *
 * Sits outside the rotated group on purpose: the trail tracks the pointer in
 * screen space, so inheriting the field's 45deg rotation would send it off at an
 * angle to the actual cursor.
 *
 * drei exposes a `Trail` component and meshline is installed, so this was a
 * choice rather than a workaround — see the note in shaders/trail.ts. The
 * deciding factor was that MeshLineMaterial's colour cannot be driven from the
 * uProgress uniform, so keeping the trail in step with the field's red -> white
 * transition would have meant writing to a material every frame, which is the
 * pattern step 5 deliberately removed.
 */
function CursorTrail({ progress }: { progress: number }) {
  const positionAttr = useRef<THREE.BufferAttribute>(null);
  const head = useRef(new THREE.Vector3());
  const seeded = useRef(false);

  const { positions, indices } = useMemo(() => {
    const positions = new Float32Array(TRAIL_COUNT * 3);
    const indices = new Float32Array(TRAIL_COUNT);
    for (let i = 0; i < TRAIL_COUNT; i++) indices[i] = i;
    return { positions, indices };
  }, []);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uGain: { value: 1.8 },
      uHeadSize: { value: 0.05 },
      uCount: { value: TRAIL_COUNT },
      uPixelRatio: { value: 1 },
      uScale: { value: 450 },
    }),
    [],
  );

  useFrame((state) => {
    const attr = positionAttr.current;
    if (!attr) return;

    // viewport width/height are world units at z=0 for this camera, so the
    // pointer maps onto the plane without an unproject.
    TMP.set(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      0,
    );

    if (!seeded.current) {
      // Fill the whole trail with the first sample, otherwise the tail streaks
      // in from the origin on the first frame.
      for (let i = 0; i < TRAIL_COUNT; i++) {
        positions[i * 3] = TMP.x;
        positions[i * 3 + 1] = TMP.y;
        positions[i * 3 + 2] = TMP.z;
      }
      head.current.copy(TMP);
      seeded.current = true;
    } else {
      // Easing the head gives the trail the same slight lag as the DOM cursor
      // ring, and closes the gaps a fast flick would otherwise leave.
      head.current.lerp(TMP, 0.3);
      positions.copyWithin(3, 0, (TRAIL_COUNT - 1) * 3);
      positions[0] = head.current.x;
      positions[1] = head.current.y;
      positions[2] = head.current.z;
    }

    attr.needsUpdate = true;

    uniforms.uProgress.value = progress;
    uniforms.uPixelRatio.value = state.viewport.dpr;
    uniforms.uScale.value = state.size.height * 0.5;
  });

  return (
    <points frustumCulled={false} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute
          ref={positionAttr}
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aIndex" args={[indices, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={TRAIL_VERTEX_SHADER}
        fragmentShader={TRAIL_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface ParticleSceneProps {
  progress?: number;
}

/**
 * Scroll-reactive particle field with shape morphing, a cursor trail, and a
 * bloom / grain / vignette stack.
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
        {quality.enableTrail && <CursorTrail progress={progress} />}
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
