"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Per-route fade, ported from the PageWrapper in App.tsx.
 *
 * Caveat carried over from the port: in the App Router the exit half of this
 * animation does not fire on navigation, because the router commits the new
 * route's children before the old subtree can animate out. The enter fade
 * (keyed on pathname) behaves exactly as before. Wiring up true exit
 * transitions needs a router-event bridge and belongs with the later
 * animation work, not this structural port.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
