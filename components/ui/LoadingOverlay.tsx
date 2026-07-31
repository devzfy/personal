"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * The 2s intro screen from App.tsx.
 *
 * The original early-returned this instead of the whole app, which in an SSR
 * setup would mean the served HTML contained the loader and none of the page.
 * Here it renders as a sibling overlay: the markup is identical (it was already
 * `fixed inset-0 bg-black z-[100]`, i.e. opaque and full-screen), so it looks
 * the same, but crawlers and the static HTML still get the real page.
 * Body scroll is locked while it is up, matching the original's unmounted page.
 */
export default function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-serif mb-4 tracking-tighter">JS</h1>
        <div className="w-48 h-[1px] bg-white/20 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-red-600"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        <p className="mt-4 text-xs tracking-widest uppercase opacity-40">
          Loading Excellence
        </p>
      </motion.div>
    </div>
  );
}
