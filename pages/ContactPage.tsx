
import React from 'react';
import { motion } from 'framer-motion';
import ThreeCanvas from '../components/ThreeCanvas';

const ContactPage: React.FC = () => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('devzfy@gmail.com');
    alert('Email address copied to clipboard!');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6">
      <ThreeCanvas />
      
      <div className="relative z-10 max-w-7xl mx-auto text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-8 block">
            Let's Start a Conversation
          </span>
          <h1 className="text-6xl md:text-9xl font-serif mb-16 leading-tight">
            Work <span className="italic">With Me.</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
            <a 
              href="mailto:devzfy@gmail.com"
              className="group relative overflow-hidden flex items-center space-x-4 px-12 py-6 bg-red-600 text-white transition-all duration-500 hover:pr-16"
            >
              <span className="relative z-10 uppercase text-sm font-bold tracking-widest">Send an Email</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </a>
            
            <button 
              onClick={handleCopyEmail}
              className="px-12 py-6 border border-white/20 hover:border-red-600 transition-colors uppercase text-sm font-bold tracking-widest text-white"
            >
              Copy Address
            </button>
          </div>

          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-white/40 text-xs tracking-[0.3em] uppercase">
            <div className="flex flex-col items-center">
              <span className="text-white/20 mb-4 tracking-normal">Socials</span>
              <div className="flex space-x-8">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">GitHub</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">LinkedIn</a>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white/20 mb-4 tracking-normal">Location</span>
              <span className="text-white/60">Tashkent, Uzbekistan</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white/20 mb-4 tracking-normal">Availability</span>
              <span className="text-green-500">Open for Projects</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 text-[10px] tracking-[2em] whitespace-nowrap hidden md:block select-none">
        JAVOKHIR SHOKIROV • JS PREMIUM ENGINEER
      </div>
    </div>
  );
};

export default ContactPage;
