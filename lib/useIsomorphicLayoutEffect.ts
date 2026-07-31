import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server.
 *
 * GSAP setup has to run before the browser paints, otherwise `gsap.from()`
 * applies its start state one frame late and the un-animated text flashes.
 * Plain useLayoutEffect logs a warning during SSR, hence the swap.
 *
 * This is the same trick `useGSAP()` from @gsap/react does; done inline to
 * avoid pulling in another dependency for ten lines of code.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
