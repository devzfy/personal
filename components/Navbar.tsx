
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-6 flex justify-between items-center ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent'
      }`}
    >
      <Link to="/" className="flex items-center space-x-2 group">
        <span className="text-2xl font-serif tracking-tighter group-hover:text-red-600 transition-colors">JS.</span>
      </Link>

      <div className="flex items-center space-x-8 text-sm font-medium tracking-widest uppercase">
        <Link 
          to="/" 
          className={`hover:text-red-600 transition-colors ${location.pathname === '/' ? 'text-red-600 underline underline-offset-8' : 'text-white/60'}`}
        >
          Work
        </Link>
        <Link 
          to="/projects" 
          className={`hover:text-red-600 transition-colors ${location.pathname === '/projects' ? 'text-red-600 underline underline-offset-8' : 'text-white/60'}`}
        >
          Archive
        </Link>
        <Link 
          to="/contact" 
          className={`px-4 py-2 border border-white/20 hover:border-red-600 hover:bg-red-600 transition-all duration-300 ${location.pathname === '/contact' ? 'bg-red-600 border-red-600 text-white' : 'text-white'}`}
        >
          Contact
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
