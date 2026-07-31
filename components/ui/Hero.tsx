"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

import { detectSceneQuality } from "@/lib/sceneQuality";

// WebGL cannot be server-rendered, so the canvas is client-only.
const ParticleScene = dynamic(
  () => import("@/components/three/ParticleScene"),
  { ssr: false },
);

/**
 * The same four phrases as the DOM copy below, with explicit line breaks.
 *
 * Line breaks are hand-placed rather than auto-wrapped because legibility of
 * particle typography is driven by glyph size: fewer characters per line means
 * bigger glyphs and more points each. Content matches the DOM exactly, so the
 * visible text and the text a crawler reads never diverge.
 */
const PARTICLE_STAGES = [
  "Crafting\nProducts That\nResonate",
  "Whatever it is —\nwe make it real.",
  "Where Precision\nMeets Emotion.",
  "Continue\nExploring",
] as const;

/**
 * Visually hidden, still announced. Applied inline rather than via Tailwind's
 * `sr-only` because these blocks already carry w-full / absolute utilities that
 * would win or lose against it depending on CSS emission order, which is not
 * something to leave to chance.
 */
const VISUALLY_HIDDEN: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Wraps a stage's copy. When the particles are spelling it out, the text stays
 * in the DOM for screen readers and crawlers — step 1's SEO work depends on the
 * h1 being real content — but is taken off screen.
 */
function StageCopy({
  hidden,
  children,
}: {
  hidden: boolean;
  children: ReactNode;
}) {
  return <div style={hidden ? VISUALLY_HIDDEN : undefined}>{children}</div>;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollValue, setScrollValue] = useState(0);

  /**
   * Whether the particles take over the copy. Resolved after mount, so the
   * server still renders visible text — that keeps the no-JS and crawler view
   * intact and avoids a hydration mismatch.
   */
  const [particleText, setParticleText] = useState(false);
  useEffect(() => {
    setParticleText(detectSceneQuality().enableTextTypography);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Sync scroll progress to state to pass to ParticleScene.
  // `MotionValue.onChange` was removed in Framer Motion 11; `.on("change", …)`
  // is the current equivalent and returns the same unsubscribe function.
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setScrollValue(v));
  }, [scrollYProgress]);

  // Stage 1: Initial Headline (0 - 0.2)
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  // Stage 2: "Whatever it is — we make it real." (0.25 - 0.45)
  const s2Opacity = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.45],
    [0, 1, 0],
  );
  const s2Scale = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.45],
    [0.8, 1, 1.2],
  );
  const s2Y = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [50, 0, -50]);

  // Stage 3: Mission Statement (0.55 - 0.75)
  const s3Opacity = useTransform(
    scrollYProgress,
    [0.55, 0.65, 0.75],
    [0, 1, 0],
  );
  const s3Scale = useTransform(
    scrollYProgress,
    [0.55, 0.65, 0.75],
    [0.9, 1, 1.1],
  );
  const s3Y = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [50, 0, -50]);

  // Stage 4: Call to Action (0.85 - 1.0)
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.95], [20, 0]);

  // Entrance Animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.4 },
    },
  };

  const wordVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
    },
  };

  const nameVariants: Variants = {
    hidden: { opacity: 0, letterSpacing: "1em", y: -10 },
    visible: {
      opacity: 1,
      letterSpacing: "0.3em",
      y: 0,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const headlineText = "Crafting Products That Resonate";

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <ParticleScene
          progress={scrollValue}
          textStages={particleText ? PARTICLE_STAGES : undefined}
        />

        {/* Stage 1: Initial Hero Texts */}
        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
          className="absolute z-10 max-w-5xl w-full text-center px-6 pointer-events-none"
        >
          <StageCopy hidden={particleText}>
          <motion.span
            variants={nameVariants}
            initial="hidden"
            animate="visible"
            className="text-red-600 font-medium uppercase text-xs mb-8 block"
          >
            Javokhir Shokirov
          </motion.span>

          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-8xl font-serif mb-8 leading-[1.1] tracking-tight flex flex-wrap justify-center gap-x-[0.3em]"
          >
            {headlineText.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2">
                <motion.span variants={wordVariants} className="inline-block">
                  {word === "Resonate" ? (
                    <span className="italic">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          </StageCopy>
        </motion.div>

        {/* Stage 2: Vision Statement */}
        <motion.div
          style={{ opacity: s2Opacity, y: s2Y, scale: s2Scale }}
          className="absolute z-10 max-w-4xl w-full text-center px-6 pointer-events-none"
        >
          <StageCopy hidden={particleText}>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Whatever it is — <br /> we make it{" "}
              <span className="text-red-600 italic">real.</span>
            </h2>
          </StageCopy>
        </motion.div>

        {/* Stage 3: Mission Statement */}
        <motion.div
          style={{ opacity: s3Opacity, y: s3Y, scale: s3Scale }}
          className="absolute z-10 max-w-4xl w-full text-center px-6 pointer-events-none"
        >
          <StageCopy hidden={particleText}>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              Where Precision <br /> Meets{" "}
              <span className="text-red-600 italic">Emotion.</span>
            </h2>
          </StageCopy>
        </motion.div>

        {/* Stage 4: CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute z-10 text-center px-6 pointer-events-none"
        >
          <StageCopy hidden={particleText}>
            <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] mb-12">
              Continue Exploring
            </p>
          </StageCopy>
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-[1px] h-20 bg-gradient-to-b from-red-600 to-transparent"
            />
          </div>
        </motion.div>

        {/* Dynamic Vignette and Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />
      </div>
    </section>
  );
}
