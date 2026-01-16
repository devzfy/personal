
import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('devzfy@gmail.com');
    alert('Email address copied to clipboard!');
  };

  return (
    <footer id="contact" className="py-32 px-6 md:px-12 bg-black border-t border-white/10 overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-8">Let's Connect</h2>
          <h3 className="text-5xl md:text-8xl font-serif mb-12">Interested in <br /> working together?</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16">
            <a 
              href="mailto:devzfy@gmail.com"
              className="group flex items-center space-x-4 px-10 py-5 bg-red-600 hover:bg-white text-white hover:text-black transition-all duration-300 w-full md:w-auto"
            >
              <span className="uppercase text-sm font-bold tracking-widest">Email Me</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            
            <button 
              onClick={handleCopyEmail}
              className="px-10 py-5 border border-white/20 hover:border-white transition-colors uppercase text-sm font-bold tracking-widest w-full md:w-auto"
            >
              Copy Email
            </button>
          </div>

          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-white/40 text-xs tracking-widest uppercase">
            <div className="flex space-x-12">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">GitHub</a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">Telegram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">LinkedIn</a>
            </div>
            
            <p>&copy; {new Date().getFullYear()} Javokhir Shokirov. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Contact;
