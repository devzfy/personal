"use client";

import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { detectSceneQuality, type SceneQuality } from "@/lib/sceneQuality";

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
import { resolveDisplayFont, sampleTextPoints } from "./textPoints";
import { useTextFormation } from "./useTextFormation";

/**
 * The postprocessing bundle is the heaviest thing in this scene, so it is split
 * behind React.lazy and rendered inside a Suspense boundary within the Canvas.
 *
 * The existing next/dynamic({ ssr: false }) around ParticleScene already keeps
 * three and R3F out of the initial page bundle, but it pulls the whole scene in
 * as one chunk. Splitting again here means the particles start rendering as soon
 * as three is ready, and the effects composite in when postprocessing arrives.
 */
const SceneEffects = lazy(() => import("./SceneEffects"));

/** Samples in the cursor trail. */
const TRAIL_COUNT = 56;

/** Fraction of the viewport width the letterforms span. */
const TEXT_WIDTH_RATIO = 0.78;

/** How far particles are pushed out at the peak of a scatter, in world units. */
const SCATTER_AMPLITUDE = 0.5;

/** Seconds the opening convergence into the first phrase takes. */
const INTRO_SECONDS = 1.6;

/** Reused every frame so the trail allocates nothing. */
const TMP = new THREE.Vector3();

interface TextBuffers {
  /** stage 0 xy in .xy, stage 1 xy in .zw */
  a: Float32Array;
  /** stage 2 xy in .xy, stage 3 xy in .zw */
  b: Float32Array;
  sourcePixels: number[];
}

/**
 * Samples the four stage phrases into packed vec4 attributes.
 *
 * Runs once, after the webfont is confirmed loaded. Text is 2D, so four targets
 * fit into two vec4s rather than four vec3 attributes.
 */
function useTextBuffers(
  stages: readonly string[] | undefined,
  count: number,
  enabled: boolean,
): TextBuffers | null {
  const [buffers, setBuffers] = useState<TextBuffers | null>(null);

  useEffect(() => {
    if (!enabled || !stages || stages.length === 0) {
      setBuffers(null);
      return;
    }

    let cancelled = false;

    void (async () => {
      const family = await resolveDisplayFont();
      if (cancelled) return;

      const clouds = stages
        .slice(0, 4)
        .map((text) => sampleTextPoints(text, family, count));
      while (clouds.length < 4) clouds.push(clouds[clouds.length - 1]!);

      const a = new Float32Array(count * 4);
      const b = new Float32Array(count * 4);
      const [s0, s1, s2, s3] = clouds as [
        ReturnType<typeof sampleTextPoints>,
        ReturnType<typeof sampleTextPoints>,
        ReturnType<typeof sampleTextPoints>,
        ReturnType<typeof sampleTextPoints>,
      ];

      for (let i = 0; i < count; i++) {
        a[i * 4] = s0.points[i * 2]!;
        a[i * 4 + 1] = s0.points[i * 2 + 1]!;
        a[i * 4 + 2] = s1.points[i * 2]!;
        a[i * 4 + 3] = s1.points[i * 2 + 1]!;
        b[i * 4] = s2.points[i * 2]!;
        b[i * 4 + 1] = s2.points[i * 2 + 1]!;
        b[i * 4 + 2] = s3.points[i * 2]!;
        b[i * 4 + 3] = s3.points[i * 2 + 1]!;
      }

      if (!cancelled) {
        setBuffers({
          a,
          b,
          sourcePixels: clouds.map((c) => c.sourcePixels),
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stages, count, enabled]);

  return buffers;
}

interface ParticleFieldProps {
  progress: number;
  quality: SceneQuality;
  textStages?: readonly string[];
}

function ParticleField({ progress, quality, textStages }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const introRef = useRef(0);

  const textEnabled = quality.enableTextTypography && Boolean(textStages);
  const text = useTextBuffers(textStages, quality.particleCount, textEnabled);

  /**
   * Letterform transitions run on their own clock. Scroll decides which stage is
   * current and when a handover begins; the tween decides how fast it plays, so
   * the morph looks the same whether the boundary was crossed slowly or flicked
   * past. Read once per frame — it is a ref behind the scenes, not state.
   */
  const readFormation = useTextFormation(progress, textEnabled);

  // One buffer per formation. Three cover four phases, because the last leg
  // morphs back to the position attribute.
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

  // Zeroed placeholders until sampling finishes; uTextMorph stays 0 until then,
  // so they are never visible.
  const textFallback = useMemo(
    () => new Float32Array(quality.particleCount * 4),
    [quality.particleCount],
  );

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
      uStagger: { value: 0.4 },
      uTextMorph: { value: 0 },
      uTextStage: { value: 0 },
      uTextScale: { value: 2.8 },
      uTextDepth: { value: 0.16 },
      uScatter: { value: 0 },
      uBurst: { value: 0 },
    }),
    [quality.driftAmp, quality.morphPhases],
  );

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    // Opening convergence: time-based rather than scroll-based, so the field
    // assembles into the first phrase on arrival instead of requiring a scroll.
    if (text && introRef.current < 1) {
      introRef.current = Math.min(1, introRef.current + delta / INTRO_SECONDS);
    }
    const intro = text ? introRef.current * introRef.current : 0;

    const formation = readFormation();
    const textMorph = text ? formation.morph * intro : 0;

    // Rotation and scale are eased to rest as text assembles. A shader cannot
    // undo an accumulating object rotation, and a spinning, growing letterform
    // is not readable.
    const spin =
      (1 + Math.sin(progress * Math.PI) * 5) * quality.motionScale * (1 - textMorph);
    points.rotation.x += 0.001 * spin;
    points.rotation.y += 0.0015 * spin;
    if (textMorph > 0) {
      const pull = 0.08 * textMorph;
      points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, 0, pull);
      points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, 0, pull);
    }

    // Mouse interaction remains subtle, and doubles as a little parallax on the
    // assembled text.
    const targetX = state.pointer.x * 0.1;
    const targetY = state.pointer.y * 0.1;
    points.position.x += (targetX - points.position.x) * 0.05;
    points.position.y += (targetY - points.position.y) * 0.05;

    // Scroll-driven growth, pulled back to 1 while text is held so letterform
    // size stays predictable.
    const scrollScale = 1 + progress * 0.5;
    const wanted = THREE.MathUtils.lerp(scrollScale, 1, textMorph);
    points.scale.setScalar(THREE.MathUtils.lerp(points.scale.x, wanted, 0.1));

    // --- uniforms, not per-frame material mutation -------------------------
    uniforms.uTime.value += delta * quality.motionScale;
    uniforms.uProgress.value = progress;
    uniforms.uOpacity.value = 0.4 + progress * 0.4;
    uniforms.uMorph.value = morphFromProgress(progress, quality.morphPhases);

    uniforms.uTextMorph.value = textMorph;
    uniforms.uTextStage.value = formation.stage;
    uniforms.uScatter.value = text
      ? formation.scatter * SCATTER_AMPLITUDE * intro
      : 0;
    uniforms.uBurst.value = text ? formation.scatter * intro : 0;
    // Normalised letterforms span [-0.5, 0.5] in x, so this is the block's world
    // width. Driven from the viewport each frame, which is why a resize never
    // requires re-sampling the text.
    uniforms.uTextScale.value = state.viewport.width * TEXT_WIDTH_RATIO;

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
          <bufferAttribute
            attach="attributes-aTextA"
            args={[text?.a ?? textFallback, 4]}
          />
          <bufferAttribute
            attach="attributes-aTextB"
            args={[text?.b ?? textFallback, 4]}
          />
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
 * choice rather than a workaround. MeshLineMaterial's colour cannot be driven
 * from the uProgress uniform, so keeping the trail in step with the field's
 * red -> white transition would have meant writing to a material every frame,
 * which is the pattern step 5 deliberately removed.
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
  /**
   * Phrases the particles should assemble into, one per hero stage. Use "\n" for
   * line breaks. Omit to keep the field purely decorative — which is what the
   * contact page does.
   */
  textStages?: readonly string[];
}

/**
 * Scroll-reactive particle field: shape morphing, cursor trail, optional
 * particle typography, and a bloom / grain / vignette stack.
 *
 * Always import this through next/dynamic with { ssr: false } — a WebGL canvas
 * cannot be server-rendered.
 */
export default function ParticleScene({
  progress = 0,
  textStages,
}: ParticleSceneProps) {
  // Sampled once on mount. Deliberately not reactive to resize: reacting would
  // mean rebuilding the position and seed buffers mid-scroll, which is a worse
  // trade than a phone in landscape keeping its reduced budget.
  const [quality] = useState(detectSceneQuality);

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
        <ParticleField
          progress={progress}
          quality={quality}
          textStages={textStages}
        />
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
