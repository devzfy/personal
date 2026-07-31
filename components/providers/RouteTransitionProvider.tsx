"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Curtain wipe between routes.
 *
 * Why not Next's View Transitions: `experimental.viewTransition` in Next 16.2
 * is a thin wrapper over React's <ViewTransition> component, and React 19.2.4
 * (stable) exports neither `ViewTransition` nor `unstable_ViewTransition` —
 * both are undefined. Enabling the flag would mean moving the app onto a
 * react@experimental build, which is not a trade worth making for a page
 * transition. Revisit when ViewTransition ships in a stable React.
 *
 * Why a curtain rather than a crossfade: the existing AnimatePresence in
 * PageTransition can only play its *enter* half, because the App Router
 * commits the incoming route before the outgoing subtree can animate out
 * (noted when it was built). An overlay sidesteps that entirely — it is
 * independent of the routed subtree, so both halves are real:
 *
 *   idle -> covering -> covered -> revealing -> idle
 *
 * The route change is pushed once the curtain is fully down, so the content
 * swap and the scroll reset both happen behind it and are never visible.
 */

type Phase = "idle" | "covering" | "covered" | "revealing";

interface RouteTransitionValue {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionValue | null>(null);

/** Returns null outside a provider so consumers can fall back to plain links. */
export function useRouteTransition(): RouteTransitionValue | null {
  return useContext(RouteTransitionContext);
}

const DURATION = 0.5;
const EASE = [0.76, 0, 0.24, 1] as const;
/** If a navigation never resolves, lift the curtain anyway rather than trap the user. */
const SAFETY_MS = 2000;

function pathOf(href: string): string {
  return href.split("#")[0] ?? href;
}

export default function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const pendingRef = useRef<string | null>(null);
  const safetyRef = useRef<number | undefined>(undefined);

  const navigate = useCallback(
    (href: string) => {
      // Reduced motion: navigate immediately, no curtain.
      if (prefersReducedMotion) {
        router.push(href);
        return;
      }
      if (phase !== "idle") return;
      if (pathOf(href) === pathname) return;
      pendingRef.current = href;
      setPhase("covering");
    },
    [phase, pathname, prefersReducedMotion, router],
  );

  // Push only once the curtain is all the way down.
  useEffect(() => {
    if (phase !== "covered") return;
    const href = pendingRef.current;
    if (href) router.push(href);

    safetyRef.current = window.setTimeout(() => {
      pendingRef.current = null;
      setPhase("revealing");
    }, SAFETY_MS);

    return () => window.clearTimeout(safetyRef.current);
  }, [phase, router]);

  // Reveal once the router has actually committed the new route.
  useEffect(() => {
    if (phase !== "covered") return;
    const href = pendingRef.current;
    if (!href) return;
    if (pathname !== pathOf(href)) return;
    window.clearTimeout(safetyRef.current);
    pendingRef.current = null;
    setPhase("revealing");
  }, [pathname, phase]);

  const y =
    phase === "idle"
      ? "100%"
      : phase === "revealing"
        ? "-100%"
        : // covering and covered both hold the curtain down
          "0%";

  return (
    <RouteTransitionContext.Provider
      value={{ navigate, isTransitioning: phase !== "idle" }}
    >
      {children}

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ y }}
        // Resetting from -100% back to 100% must not animate, or the curtain
        // would visibly slide back down through the viewport. Both positions
        // are off-screen, so the jump is invisible.
        transition={
          phase === "idle"
            ? { duration: 0 }
            : { duration: DURATION, ease: EASE }
        }
        onAnimationComplete={() => {
          setPhase((current) =>
            current === "covering"
              ? "covered"
              : current === "revealing"
                ? "idle"
                : current,
          );
        }}
        // Swallows clicks while down so a second navigation cannot start
        // mid-transition.
        style={{ pointerEvents: phase === "idle" ? "none" : "auto" }}
        className="fixed inset-0 z-[200] bg-black border-t-2 border-red-600"
      />
    </RouteTransitionContext.Provider>
  );
}
