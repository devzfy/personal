
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={targetRef} id="about" className="py-32 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative aspect-square md:aspect-auto md:h-[600px] overflow-hidden group"
        >
          <motion.img 
            style={{ y: imgY, scale: 1.2 }}
            src="https://picsum.photos/seed/engineer/800/1000" 
            alt="Javokhir Shokirov Portrait" 
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
          <div className="absolute inset-0 border border-white/10 m-6 pointer-events-none" />
          <div className="absolute bottom-12 right-0 bg-red-600 p-8 transform translate-x-1/2 hidden md:block">
            <p className="text-4xl font-serif italic leading-none">4+</p>
            <p className="text-xs uppercase tracking-widest mt-2">Years of Exp</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-6">Expertise & Story</h2>
          <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
            Based in Uzbekistan,<br /> Working Globally.
          </h3>
          <div className="space-y-6 text-white/60 text-lg leading-relaxed">
            <p>
              Frontend Engineer with 4+ years of experience building high-quality web applications 
              with modern JavaScript/TypeScript (React, Next.js, Astro), emphasizing robust, scalable, 
              high-performance solutions.
            </p>
            <p>
              Expert in React, TypeScript, and animation libraries, with a strong eye for UI/UX and detail. 
              My work focuses on bridging the gap between functional code and aesthetic brilliance.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-serif italic mb-1">2.5M+</p>
              <p className="text-xs uppercase tracking-widest opacity-40">Learners Served</p>
            </div>
            <div>
              <p className="text-3xl font-serif italic mb-1">50%</p>
              <p className="text-xs uppercase tracking-widest opacity-40">Efficiency Gained</p>
            </div>
          </div>
          
          <div className="mt-12 flex flex-wrap gap-3">
            {['React', 'TypeScript', 'Next.js', 'Framer Motion', 'Three.js', 'Tailwind', 'GSAP'].map(skill => (
              <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 text-xs uppercase tracking-widest hover:border-red-600 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
