/**
 * Geometry of the hero's scroll narrative: how its scroll range divides into
 * stages, and how long a stage-to-stage particle transition takes.
 *
 * This lives in lib/ rather than components/three for the same reason
 * sceneQuality does: both consumers need the same answer and only one of them is
 * WebGL. Hero.tsx drives its DOM copy from these values and ParticleScene drives
 * the letterform morph from them. Two hand-maintained copies of the boundaries
 * is precisely how the DOM text and the particles drifted apart — the DOM had
 * them inline in useTransform calls, the field had them in HERO_STAGE_HOLDS, and
 * neither knew when the other changed. Nothing here may import three.
 */

/**
 * Number of stages in the hero narrative. Matches PARTICLE_STAGES in Hero and
 * the four blocks of DOM copy it renders.
 */
export const HERO_STAGE_COUNT = 4;

/** Height of the hero section, in viewport heights. */
export const HERO_SCROLL_VH = 500;

/**
 * Progress each stage owns.
 *
 * Equal division, which is the entire point of deriving it rather than writing
 * the boundaries out: every stage gets the same scroll distance. The section is
 * a fixed height scrubbed from "start start" to "end end", so progress maps
 * linearly onto pixels — an equal split of progress *is* an equal split of
 * scroll. At 500vh that is 125vh of section per stage, or 100vh of actual
 * scrolling once the sticky viewport is accounted for.
 */
export const HERO_STAGE_SPAN = 1 / HERO_STAGE_COUNT;

/**
 * Seconds one full disperse-and-reform between two stages takes.
 *
 * Fixed, and deliberately independent of how fast the user scrolled across the
 * boundary — a scrubbed morph is over in two frames on a flick and never reads
 * as a transition at all.
 *
 * Kept under a second because it does not get the frame to itself: Lenis is
 * configured with duration 1.2, so the scroll position the crossing is detected
 * from is already an eased version of the wheel input. A longer morph stacks on
 * top of that inertia and the field ends up still reassembling well after the
 * page has stopped moving.
 */
export const HERO_MORPH_SECONDS = 0.9;

/**
 * Share of a stage's span spent fading its DOM copy in and out at each end.
 *
 * Only visible on the fallback path. When particle typography is active the copy
 * is present but visually hidden, so these ramps animate nothing a sighted user
 * sees — the particles are the visible treatment. The boundaries still have to
 * agree, which is why this is derived from the same span.
 */
const DOM_FADE_RATIO = 0.22;

/** Progress at which `stage` begins. Boundary i sits at the start of stage i. */
export function heroStageStart(stage: number): number {
  return stage * HERO_STAGE_SPAN;
}

/**
 * Which stage a progress value falls in, 0-indexed and clamped.
 *
 * The clamp matters at the extremes: progress 1.0 floors to HERO_STAGE_COUNT,
 * which is one past the last stage and would index past both the copy array and
 * the packed letterform attributes.
 */
export function heroStageAt(progress: number): number {
  const raw = Math.floor(progress / HERO_STAGE_SPAN);
  return Math.min(HERO_STAGE_COUNT - 1, Math.max(0, raw));
}

export interface HeroStageKeyframes {
  /** Strictly increasing progress stops: enter, held, held, exit. */
  times: [number, number, number, number];
  opacity: [number, number, number, number];
  scale: [number, number, number, number];
  y: [number, number, number, number];
}

/**
 * Framer Motion keyframes for a stage's DOM copy, on the shared boundaries.
 *
 * Four stops rather than three so a stage can fade in, hold across the middle of
 * its span, and fade out, all inside its own slice. Both ramps sit within the
 * stage's own range on purpose: consecutive stages then hand over exactly at the
 * boundary with no window where two headings are both part-way visible.
 *
 * The first and last stages are asymmetric because they are the entry and exit
 * of the whole section — stage 0 is already on screen when progress is 0, and
 * the closing call to action stays put rather than fading back out into nothing.
 */
export function heroStageKeyframes(stage: number): HeroStageKeyframes {
  const start = heroStageStart(stage);
  const end = start + HERO_STAGE_SPAN;
  const fade = HERO_STAGE_SPAN * DOM_FADE_RATIO;

  const times: [number, number, number, number] = [
    start,
    start + fade,
    end - fade,
    end,
  ];

  if (stage === 0) {
    return {
      times,
      opacity: [1, 1, 1, 0],
      scale: [1, 1, 1, 0.8],
      y: [0, 0, 0, -100],
    };
  }

  if (stage === HERO_STAGE_COUNT - 1) {
    return {
      times,
      opacity: [0, 1, 1, 1],
      scale: [1, 1, 1, 1],
      y: [20, 0, 0, 0],
    };
  }

  return {
    times,
    opacity: [0, 1, 1, 0],
    scale: [0.8, 1, 1, 1.2],
    y: [50, 0, 0, -50],
  };
}
