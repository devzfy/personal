"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

/** Animated header block for the /projects archive. Ported from pages/Projects.tsx. */
export default function ArchiveHeader() {
  const { dictionary } = useLanguage();

  return (
    <header className="mb-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-8xl font-serif mb-8"
      >
        {dictionary.project.archiveTitle}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="h-[1px] w-32 bg-red-600 mb-10"
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-white/40 text-lg max-w-xl"
      >
        {dictionary.project.archiveDescription}
      </motion.p>
    </header>
  );
}
