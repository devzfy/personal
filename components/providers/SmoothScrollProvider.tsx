"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Initializes Lenis for the "scroll jacked" feel, with the exact same options
 * as the old App.tsx PageWrapper. Re-created on every route change, which is
 * what the router-based version did via its [location.pathname] dependency.
 *
 * Renders nothing — it is a side-effect-only provider.
 */
export default function SmoothScrollProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // App Router keeps the layout mounted across navigations, so reset the
    // scroll position before handing control to a fresh Lenis instance.
    window.scrollTo(0, 0);

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

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      // The original never cancelled its rAF loop, which leaked a frame
      // callback per navigation. Cancelling first, then destroying.
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
