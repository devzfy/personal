"use client";

import { motion } from "framer-motion";

/**
 * Reusable version of the entrance animation already used by the archive header
 * and contact page (opacity + 20px rise, staggered by delay). Same vocabulary as
 * the rest of the site — no new motion behaviour introduced.
 */
export default function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
