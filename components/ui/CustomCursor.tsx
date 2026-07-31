"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { gsap } from "@/lib/gsap";

/** Elements opt in with data-cursor="hover". */
const HOVER_SELECTOR = '[data-cursor="hover"]';

/** Fraction of the cursor's offset from the element centre that is applied. */
const MAGNET_STRENGTH = 0.3;
/** Hard cap on the pull, in px, so nothing ever slides far from its slot. */
const MAGNET_MAX = 14;
/** Per-frame lerp factor for easing the pull in and out. */
const MAGNET_EASE = 0.15;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Two-layer cursor: a tight red dot and a looser outline ring that lags behind
 * it. Both are driven by Framer Motion springs off a single mousemove listener,
 * so the ring overshoots and settles instead of sliding linearly.
 *
 * Mounted once in the root layout. Renders nothing at all unless the device
 * reports (pointer: fine), so touch devices get the native behaviour and never
 * have `cursor: none` applied.
 *
 * Magnetic pull writes to the element's standalone `translate` property rather
 * than `transform`. That is deliberate: ProjectCard is a Framer Motion
 * component whose `transform` is library-owned, and per spec `translate` is
 * applied alongside `transform` rather than replacing it, so the two compose
 * instead of overwriting each other. The one constraint this creates is that a
 * data-cursor="hover" element must not also use Tailwind translate-* utilities,
 * since Tailwind v4 compiles those to the same property.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Tight spring: the dot sits essentially under the pointer.
  const dotX = useSpring(mouseX, { stiffness: 1500, damping: 65, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 1500, damping: 65, mass: 0.2 });

  // Loose spring: the ring trails and overshoots.
  const ringX = useSpring(mouseX, { stiffness: 170, damping: 17, mass: 0.55 });
  const ringY = useSpring(mouseY, { stiffness: 170, damping: 17, mass: 0.55 });

  const ringScale = useSpring(1, { stiffness: 300, damping: 24 });
  const opacity = useSpring(0, { stiffness: 300, damping: 34 });

  // Fine pointers only. Re-evaluated on change so plugging in a mouse works.
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // The native cursor is only hidden while the custom one is actually up.
  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor-active");
    return () => document.body.classList.remove("custom-cursor-active");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const magnetismEnabled = !prefersReducedMotion;

    let hovered: HTMLElement | null = null;
    // Kept separate from `hovered` so the element can ease back to rest after
    // the pointer has already left it.
    let magnet: HTMLElement | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const release = (el: HTMLElement) => {
      // removeProperty rather than "0px", so the element goes back to whatever
      // the stylesheet says instead of carrying a dead inline override.
      el.style.removeProperty("translate");
    };

    const handleMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      opacity.set(1);

      if (!magnetismEnabled || !hovered) return;
      const rect = hovered.getBoundingClientRect();
      targetX = clamp(
        (event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH,
        -MAGNET_MAX,
        MAGNET_MAX,
      );
      targetY = clamp(
        (event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH,
        -MAGNET_MAX,
        MAGNET_MAX,
      );
    };

    // One delegated listener: pointerover fires on every element transition,
    // so moving onto plain content resolves to null and clears the state.
    const handleOver = (event: Event) => {
      const target = event.target;
      const match =
        target instanceof Element
          ? target.closest<HTMLElement>(HOVER_SELECTOR)
          : null;
      if (match === hovered) return;

      hovered = match;
      ringScale.set(match ? 2.5 : 1);

      if (!magnetismEnabled) return;

      if (match) {
        if (magnet && magnet !== match) release(magnet);
        magnet = match;
        currentX = 0;
        currentY = 0;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    // Shares the ticker that already drives Lenis, so the pull is written on
    // the same frame as the scroll and the springs.
    const tick = () => {
      if (!magnet) return;

      if (!magnet.isConnected) {
        magnet = null;
        currentX = currentY = targetX = targetY = 0;
        return;
      }

      currentX += (targetX - currentX) * MAGNET_EASE;
      currentY += (targetY - currentY) * MAGNET_EASE;

      if (!hovered && Math.abs(currentX) < 0.1 && Math.abs(currentY) < 0.1) {
        release(magnet);
        magnet = null;
        currentX = currentY = 0;
        return;
      }

      magnet.style.translate = `${currentX.toFixed(2)}px ${currentY.toFixed(2)}px`;
    };

    const handleWindowLeave = () => opacity.set(0);
    const handleWindowEnter = () => opacity.set(1);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("pointerover", handleOver, true);
    document.documentElement.addEventListener("mouseleave", handleWindowLeave);
    document.documentElement.addEventListener("mouseenter", handleWindowEnter);
    if (magnetismEnabled) gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("pointerover", handleOver, true);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleWindowLeave,
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleWindowEnter,
      );
      if (magnetismEnabled) gsap.ticker.remove(tick);
      if (magnet) release(magnet);
      ringScale.set(1);
    };
  }, [enabled, prefersReducedMotion, mouseX, mouseY, opacity, ringScale]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-red-600"
        style={{ x: dotX, y: dotY, opacity }}
      />
      {/*
        mix-blend-difference keeps the ring readable over both the black
        sections and the white PinnedServices stage — a plain white ring would
        disappear entirely on the services panel.
      */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 -ml-[18px] -mt-[18px] rounded-full border border-white mix-blend-difference"
        style={{ x: ringX, y: ringY, scale: ringScale, opacity }}
      />
    </>
  );
}
