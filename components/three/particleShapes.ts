/**
 * Target formations for the particle morph.
 *
 * Every generator returns a Float32Array of `count * 3`, so each buffer is a
 * drop-in alternative position attribute and the vertex shader can blend
 * between them per-vertex. Index i means the same particle in every shape.
 *
 * Sphere and cloud are generated independently rather than being correlated,
 * so particle i has no relationship between its sphere slot and its cloud slot.
 * That is deliberate: the uncorrelated version reads as the field genuinely
 * reforming, where a correlated one just looks like the sphere inflating.
 * The grid, by contrast, is ordered by index, so the morph into it reads as
 * particles snapping into a lattice.
 */

/** The existing formation: a shell between r=1.4 and r=2.0. */
export function createSphere(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.4 + Math.random() * 0.6;
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
}

/**
 * Dispersed cloud: same directions, far wider radial spread. The sqrt on the
 * random keeps it from clumping at the centre, so it thins out toward the edges
 * instead of looking like a solid ball.
 */
export function createCloud(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.5 + Math.sqrt(Math.random()) * 2.4;
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi);
  }
  return out;
}

/**
 * Flat square lattice on the XY plane with a little z jitter for depth.
 *
 * Extent is kept near the visible frustum height at z=0 (~2.3 world units for
 * the default 75deg camera at distance 1.5) so the lattice mostly stays on
 * screen even after the scroll-driven scale-up. The parent group's 45deg z
 * rotation turns it into a diagonal dot matrix rather than a square grid.
 */
export function createGrid(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const side = Math.ceil(Math.sqrt(count));
  const extent = 2.2;
  const step = side > 1 ? extent / (side - 1) : 0;

  for (let i = 0; i < count; i++) {
    const col = i % side;
    const row = Math.floor(i / side);
    out[i * 3] = col * step - extent / 2;
    out[i * 3 + 1] = row * step - extent / 2;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return out;
}

/**
 * Scroll-progress windows during which each morph runs, in hero-progress units.
 *
 * The hero is 500vh, so 0.20 of progress is 100vh — about one viewport of
 * scroll per morph, which is what makes it read as a transition rather than a
 * snap. The windows sit in the gaps between the hero's four text stages
 * (visible at 0-0.15, 0.25-0.45, 0.55-0.75, 0.85-1.0), so the field reforms
 * while the copy is swapping and holds still while a line is being read.
 */
const MORPH_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [0.13, 0.33],
  [0.43, 0.63],
  [0.73, 0.93],
];

/** Single broad window for the reduced 2-shape sequence. */
const SIMPLE_WINDOW: readonly [number, number] = [0.2, 0.8];

/**
 * Maps hero scroll progress to the shader's uMorph value.
 *
 * Returns 0..phases, where each whole number is a settled shape and the
 * fractional part is a transition. Summing clamped ramps rather than
 * branching means the value is monotonic and continuous by construction —
 * it cannot jump if a scroll event skips a window.
 */
export function morphFromProgress(progress: number, phases: number): number {
  const windows = phases <= 1 ? [SIMPLE_WINDOW] : MORPH_WINDOWS.slice(0, phases);

  let morph = 0;
  for (const window of windows) {
    const [start, end] = window;
    const span = end - start;
    if (span <= 0) continue;
    morph += Math.min(1, Math.max(0, (progress - start) / span));
  }
  return morph;
}

/**
 * The hero's four text stages, as the scroll-progress ranges over which each is
 * held. These are the same boundaries Hero.tsx already uses to drive its Framer
 * Motion opacity for the DOM copy — deliberately shared rather than duplicated,
 * so the particle typography and the (visually hidden) DOM text can never drift
 * out of sync.
 */
export const HERO_STAGE_HOLDS: ReadonlyArray<readonly [number, number]> = [
  [0.0, 0.15],
  [0.25, 0.45],
  [0.55, 0.75],
  [0.85, 1.0],
];

export interface TextFormation {
  /** 0 = idle formation, 1 = fully assembled letterforms. */
  morph: number;
  /** Which stage's letterform is active, 0-3. */
  stage: number;
  /** 0..1, peaks halfway through a transition. */
  scatter: number;
}

/**
 * Maps hero progress onto the text formation state.
 *
 * Inside a stage's hold the letterform is fully assembled. Between two stages
 * the morph dips to 0 and back to 1, and the active stage index flips exactly at
 * the midpoint — the moment morph is 0 and the particles are entirely in the
 * idle formation, so swapping which letterform is targeted is invisible. That is
 * what avoids letterform A visibly sliding into letterform B.
 */
export function textFormationFromProgress(progress: number): TextFormation {
  const last = HERO_STAGE_HOLDS.length - 1;

  for (let i = 0; i <= last; i++) {
    const hold = HERO_STAGE_HOLDS[i];
    if (!hold) continue;
    if (progress >= hold[0] && progress <= hold[1]) {
      return { morph: 1, stage: i, scatter: 0 };
    }
  }

  for (let i = 0; i < last; i++) {
    const current = HERO_STAGE_HOLDS[i];
    const next = HERO_STAGE_HOLDS[i + 1];
    if (!current || !next) continue;

    const from = current[1];
    const to = next[0];
    if (progress <= from || progress >= to) continue;

    const mid = (from + to) / 2;
    const half = Math.max(1e-4, mid - from);
    // 1 at either edge of the gap, 0 at the midpoint.
    const edge = Math.min(1, Math.abs(progress - mid) / half);

    return {
      morph: edge * edge * (3 - 2 * edge), // smoothstep
      stage: progress < mid ? i : i + 1,
      scatter: 1 - edge,
    };
  }

  // Past the final hold (or before the first), stay on the nearest letterform.
  return progress < 0.5
    ? { morph: 1, stage: 0, scatter: 0 }
    : { morph: 1, stage: last, scatter: 0 };
}
