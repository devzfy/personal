"use client";

import { useCallback, useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { HERO_MORPH_SECONDS, heroStageAt } from "@/lib/heroStages";

export interface TextFormation {
  /** 1 = letterform fully assembled, 0 = field entirely dispersed. */
  morph: number;
  /** Which stage's letterform is currently targeted, 0-indexed. */
  stage: number;
  /** 0..1, peaks at full dispersion. Drives uScatter and uBurst. */
  scatter: number;
}

/**
 * Position within one disperse-and-reform.
 *
 * 0 and 1 are both "assembled"; 0.5 is peak dispersion. Held in a mutable object
 * because that is what GSAP tweens — a ref means the tween can run at 60fps
 * without a React render per frame, and useFrame reads whatever the latest value
 * is when it happens to run.
 */
interface Arc {
  value: number;
}

/** 0 at both ends of the arc, 1 at the midpoint. */
function disperseFromArc(value: number): number {
  const triangle = 1 - Math.abs(value * 2 - 1);
  // Smoothstepped so the peak and both ends have zero velocity. Without it the
  // reversal at peak dispersion is a visible corner: particles stop travelling
  // outward and start travelling back on the same frame.
  return triangle * triangle * (3 - 2 * triangle);
}

/**
 * Time-based stage transitions for the particle typography.
 *
 * Scroll position decides *which* stage is current and *when* the handover
 * starts. It has no say in how fast the handover runs — that is a fixed-duration
 * GSAP tween, so a slow scroll and a fast flick produce the same animation. The
 * previous version derived the morph value straight from progress, which meant
 * the transition was only ever as long as the scroll that drove it: a flick past
 * a boundary consumed the whole disperse-and-reform in a couple of frames.
 *
 * Holding is still scroll-driven in the sense that staying inside a stage's span
 * keeps its letterform assembled and nothing tweens at all.
 *
 * Returns a reader rather than state, for the same reason the arc is a ref:
 * re-rendering the R3F tree every frame to carry a float is exactly the pattern
 * this scene avoids elsewhere.
 */
export function useTextFormation(
  progress: number,
  enabled: boolean,
): () => TextFormation {
  const arc = useRef<Arc>({ value: 1 });
  /** Letterform being left behind; shown for the first half of the arc. */
  const from = useRef(0);
  /** Letterform being assembled; shown from peak dispersion onward. */
  const to = useRef(0);
  const adopted = useRef(false);
  const formation = useRef<TextFormation>({ morph: 1, stage: 0, scatter: 0 });

  const stage = enabled ? heroStageAt(progress) : 0;

  useEffect(() => {
    if (!enabled) return;

    // First run has nothing to transition from — adopt the stage silently so a
    // load part-way into the hero does not open with a disperse.
    if (!adopted.current) {
      adopted.current = true;
      from.current = stage;
      to.current = stage;
      arc.current.value = 1;
      return;
    }

    if (to.current === stage) return;

    // Resume from wherever the field actually is rather than restarting the arc,
    // which would snap a half-dispersed field back to assembled. When a reform
    // is already under way (value past the midpoint) the position is mirrored
    // onto the dispersing half: dispersion is symmetric about 0.5, so the
    // mirrored point looks identical and the particles simply carry on outward.
    const current = arc.current.value;
    arc.current.value = current > 0.5 ? 1 - current : current;

    // Whatever is on screen is what we are leaving, which is not necessarily the
    // stage we were last heading for.
    from.current = formation.current.stage;
    to.current = stage;

    gsap.to(arc.current, {
      value: 1,
      // Scaled by the distance left so the arc always advances at one rate. A
      // fixed duration here would make a re-trigger near the end of a transition
      // crawl through its short remaining distance.
      duration: HERO_MORPH_SECONDS * (1 - arc.current.value),
      ease: "none",
      // Replaces the in-flight tween instead of running a second one against the
      // same object, which is what makes scrubbing back and forth over a
      // boundary well behaved.
      overwrite: true,
    });
  }, [stage, enabled]);

  // Tweens outlive the component otherwise: GSAP holds the target, so an
  // unmounted scene would keep being animated until the arc settled.
  useEffect(() => {
    const target = arc.current;
    return () => {
      gsap.killTweensOf(target);
    };
  }, []);

  return useCallback(() => {
    const value = arc.current.value;
    const disperse = disperseFromArc(value);

    formation.current.morph = 1 - disperse;
    formation.current.scatter = disperse;
    // Swapped at peak dispersion, the one moment the letterform contributes
    // nothing to what is on screen, so retargeting is invisible. Interpolating A
    // straight into B instead would read as text sliding.
    formation.current.stage = value < 0.5 ? from.current : to.current;

    return formation.current;
  }, []);
}
