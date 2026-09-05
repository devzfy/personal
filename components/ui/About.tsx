"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import SplitTextReveal from "@/components/ui/SplitTextReveal";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function About() {
  const { dictionary } = useLanguage();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={targetRef}
      id="about"
      className="py-32 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative aspect-square md:aspect-auto md:h-[600px] overflow-hidden group"
        >
          {/*
            Deliberately still a plain <img>: it is parallaxed by a MotionValue,
            and next/image would change both the layout behaviour and require a
            remotePatterns entry for picsum. Swap this for a real, locally hosted
            portrait and next/image when one exists.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            style={{ y: imgY, scale: 1.2 }}
            src="https://picsum.photos/seed/engineer/800/1000"
            alt={dictionary.about.portraitAlt}
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
          <div className="absolute inset-0 border border-white/10 m-6 pointer-events-none" />
          <div className="absolute bottom-12 right-0 bg-red-600 p-8 transform translate-x-1/2 hidden md:block">
            <p className="text-4xl font-serif italic leading-none">5+</p>
            <p className="text-xs uppercase tracking-widest mt-2">
              {dictionary.about.years}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-6">
            {dictionary.about.eyebrow}
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
            <SplitTextReveal
              text={dictionary.about.title}
              stagger={0.055}
            />
          </h3>
          <div className="space-y-6 text-white/60 text-lg leading-relaxed">
            {dictionary.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-serif italic mb-1">2.5M+</p>
              <p className="text-xs uppercase tracking-widest opacity-40">
                {dictionary.about.learners}
              </p>
            </div>
            <div>
              <p className="text-3xl font-serif italic mb-1">50%</p>
              <p className="text-xs uppercase tracking-widest opacity-40">
                {dictionary.about.efficiency}
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {[
              "JavaScript",
              "React",
              "TypeScript",
              "Next.js",
              "Redux",
              "Tanstack Query",
              "Socket.IO",
              "GSAP",
              "WebGL",
              "Three.js",
              "Electron.js",
              "Webpack",
              "React Native",
              "AI Integrations",
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-white/5 border border-white/10 text-xs uppercase tracking-widest hover:border-red-600 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mt-24 border-t border-white/10 pt-16"
      >
        <h3 className="max-w-2xl text-3xl md:text-4xl font-serif leading-tight mb-10">
          {dictionary.about.principlesTitle}
        </h3>
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {dictionary.about.principles.map((principle, index) => (
            <article key={principle.title} className="bg-black p-8 md:p-10">
              <span className="block text-[10px] tracking-[0.4em] text-red-600 mb-6">
                0{index + 1}
              </span>
              <h4 className="text-xl font-serif mb-4">{principle.title}</h4>
              <p className="text-sm leading-relaxed text-white/50">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
