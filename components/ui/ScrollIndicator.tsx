"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin red progress rail pinned to the right edge. Ported from App.tsx. */
export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed right-0 top-0 bottom-0 w-[2px] bg-red-600 z-[60] origin-top"
      style={{ scaleY }}
    />
  );
}
