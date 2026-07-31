/**
 * Single source of truth for the scene's capability tiers.
 *
 * This lives outside components/three on purpose: Hero needs the same answer as
 * ParticleScene (it has to know whether to show its DOM headings or hand them
 * over to the particles), and importing it must not drag three.js into the
 * initial bundle. Nothing in this module touches three.
 */

export interface SceneQuality {
  particleCount: number;
  enableBloom: boolean;
  bloomIntensity: number;
  /** Cursor trail: desktop pointers only. */
  enableTrail: boolean;
  /** 3 = sphere -> cloud -> grid -> sphere. 1 = sphere -> cloud only. */
  morphPhases: number;
  /**
   * Particles assemble into the hero copy. When false, Hero keeps rendering its
   * own Framer Motion text and the field stays decorative.
   */
  enableTextTypography: boolean;
  /** Multiplier on rotation speed. */
  motionScale: number;
  /** Simplex drift amplitude, in world units. */
  driftAmp: number;
}

/**
 * Point budget when the particles have to spell something.
 *
 * Legibility is a function of points per glyph, not total points. The hero copy
 * runs to ~36 glyphs across three lines, so 4000 points gives ~110 per glyph,
 * which renders as a suggestion of a letter rather than a letter. 14000 puts it
 * near 390 per glyph. It is still a single draw call — the extra cost is vertex
 * shader work, not CPU.
 */
const TEXT_PARTICLE_COUNT = 14000;

const DEFAULT_QUALITY: SceneQuality = {
  particleCount: 4000,
  enableBloom: true,
  bloomIntensity: 0.85,
  enableTrail: true,
  morphPhases: 3,
  enableTextTypography: true,
  motionScale: 1,
  driftAmp: 0.08,
};

export function detectSceneQuality(): SceneQuality {
  if (typeof window === "undefined") return DEFAULT_QUALITY;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const smallScreen = window.innerWidth < 768;
  // Same query the custom cursor gates on, so the trail and the cursor appear
  // and disappear together rather than on different rules.
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  // Particle typography is the one effect that is dropped wholesale rather than
  // degraded. A sparse version is not a lesser version of readable text, it is
  // unreadable text, and the DOM headings it replaces are the page's actual
  // h1 — better to keep those than to render an approximation of them.
  const enableTextTypography = !reduceMotion && !smallScreen;

  return {
    particleCount: enableTextTypography
      ? TEXT_PARTICLE_COUNT
      : reduceMotion || smallScreen
        ? 900
        : 4000,
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
    enableTextTypography,
    motionScale: reduceMotion ? 0.25 : 1,
    driftAmp: reduceMotion ? 0.03 : 0.08,
  };
}
