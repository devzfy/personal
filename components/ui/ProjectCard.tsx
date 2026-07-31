"use client";

import { motion, type Variants } from "framer-motion";
import type { Project } from "@/lib/types";

/**
 * The badges reveal after the card itself has settled. Own whileInView rather
 * than inherited variants, because the card animates with plain object props
 * (initial/whileInView) and so propagates nothing to its children.
 */
const badgeList: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.25 },
  },
};

const badgeItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
  },
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      data-cursor="hover"
      className="group relative flex flex-col bg-white/5 border border-white/10 hover:border-red-600/50 transition-all duration-500 overflow-hidden"
    >
      <div className="p-8 grow">
        <span className="text-[10px] uppercase tracking-[0.4em] text-red-600 mb-4 block opacity-0 group-hover:opacity-100 transition-opacity">
          Case Study 0{index + 1}
        </span>
        <h3 className="text-3xl font-serif mb-4 group-hover:italic transition-all">
          {project.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          {project.description}
        </p>

        <div className="space-y-2 mb-8">
          {project.metrics.map((metric, i) => (
            <div
              key={i}
              className="flex items-start text-xs font-medium uppercase tracking-wider text-white/80"
            >
              <span className="text-red-600 mr-2">•</span>
              {metric}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        variants={badgeList}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="px-8 pb-8 flex flex-wrap gap-2"
      >
        {project.techStack.map((tech) => (
          <motion.span
            key={tech}
            variants={badgeItem}
            className="text-[10px] uppercase tracking-widest text-white/30 px-2 py-1 border border-white/5 bg-white/5"
          >
            {tech}
          </motion.span>
        ))}
      </motion.div>

      {/* Decorative hover element */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </motion.div>
  );
}
