"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis
 * advance on the same frame.
 *
 * Why the ticker instead of a raw requestAnimationFrame loop: with two
 * independent loops, ScrollTrigger can read a scroll position that Lenis has
 * not written yet, which shows up as pinned sections juddering by a frame.
 * `gsap.ticker.lagSmoothing(0)` is required too — by default GSAP clamps large
 * deltas after a stall, which would make Lenis and the real scroll position
 * disagree.
 *
 * Renders nothing; it is a side-effect-only provider.
 */
export default function SmoothScrollProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis is created once for the lifetime of the layout. Recreating it per
  // route (what this did before GSAP) would detach and re-attach the ticker
  // callback on every navigation for no benefit.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;

    // Every Lenis scroll frame tells ScrollTrigger to re-evaluate.
    lenis.on("scroll", ScrollTrigger.update);

    // Lenis's rAF is driven by GSAP's ticker. Ticker time is in seconds,
    // lenis.raf expects milliseconds.
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      // Restore GSAP's documented defaults so nothing else inherits our config.
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // The App Router keeps this layout mounted across navigations, so scroll
  // position and every ScrollTrigger measurement have to be reset by hand.
  useEffect(() => {
    const lenis = lenisRef.current;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);

    // This effect runs before the incoming page's own effects (it sits earlier
    // in the tree), so the refresh is deferred by two frames: one for the new
    // components to register their triggers, one for layout to settle.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [pathname]);

  return null;
}
