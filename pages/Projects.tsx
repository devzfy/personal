
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';

const Projects: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-8xl font-serif mb-8"
          >
            Archive.
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
            A curated list of projects, experiments, and collaborations that showcase my approach to frontend architecture and design.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {PROJECTS.map((project, index) => (
            <div key={project.id} className="group cursor-default">
              <ProjectCard project={project} index={index} />
              <div className="mt-8 px-2 flex justify-between items-start opacity-60 group-hover:opacity-100 transition-opacity">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(t => (
                      <span key={t} className="text-[10px] text-white/50">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Impact</h4>
                  <p className="text-[10px] text-red-600">{project.metrics[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
