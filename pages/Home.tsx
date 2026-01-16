
import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import PinnedServices from '../components/PinnedServices';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';
import Contact from '../components/Contact';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <About />
      <PinnedServices />
      
      <section className="py-32 px-6 md:px-12 bg-black relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-6">Selected Work</h2>
              <h3 className="text-4xl md:text-5xl font-serif leading-tight">Notable Successes.</h3>
            </div>
            <Link 
              to="/projects" 
              className="text-xs uppercase tracking-widest font-bold border-b border-red-600 pb-2 hover:text-red-600 transition-colors"
            >
              View Full Archive
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.slice(0, 4).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Contact />

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        className="text-center py-8 text-[10px] uppercase tracking-[1em]"
      >
        JS • PRECISE • EMOTIVE
      </motion.div>
    </div>
  );
};

export default Home;
