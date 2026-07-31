import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single place where GSAP plugins get registered.
 *
 * Client components are still evaluated on the server during SSR, so the
 * registration is guarded. The imports themselves are SSR-safe (ScrollTrigger
 * does not touch `window` at module scope), but `registerPlugin` is not
 * something we want running in a Node render pass.
 *
 * Import gsap and ScrollTrigger from here — never directly from "gsap" — so a
 * component can never end up using an unregistered plugin.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
