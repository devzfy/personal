"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

/** The "JS • PRECISE • EMOTIVE" strip at the very bottom of the home page. */
export default function Signature() {
  const { dictionary } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.1 }}
      className="text-center py-8 text-[10px] uppercase tracking-[1em]"
    >
      {dictionary.signature}
    </motion.div>
  );
}
