
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SERVICES } from '../constants';

const PinnedServices: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-white text-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6">
        
        {/* Fixed Title */}
        <div className="absolute top-12 left-12">
           <h2 className="text-xs font-bold tracking-[0.4em] text-red-600 uppercase mb-2">Capabilities</h2>
           <p className="text-2xl font-serif">Selected Services</p>
        </div>

        <div className="max-w-4xl w-full relative h-96">
          {SERVICES.map((service, index) => {
            const step = 1 / SERVICES.length;
            const start = index * step;
            const end = (index + 1) * step;
            
            // Define focus points
            const opacity = useTransform(
              scrollYProgress, 
              [start, start + step * 0.2, end - step * 0.2, end], 
              [0, 1, 1, 0]
            );
            const scale = useTransform(
              scrollYProgress, 
              [start, start + step * 0.2, end - step * 0.2, end], 
              [0.8, 1, 1, 1.2]
            );
            const y = useTransform(
              scrollYProgress, 
              [start, start + step * 0.2, end - step * 0.2, end], 
              [50, 0, 0, -50]
            );

            return (
              <motion.div
                key={service.id}
                style={{ opacity, scale, y }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                <div className="mb-8 text-red-600">
                   <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-4xl md:text-7xl font-serif mb-6 leading-none">{service.title}</h3>
                <p className="text-xl text-black/60 max-w-xl mx-auto leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-12 text-[10px] font-bold tracking-[0.5em] uppercase text-red-600/30">
                  0{index + 1} / 0{SERVICES.length}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-black/5">
          <motion.div 
            className="h-full bg-red-600" 
            style={{ scaleX: scrollYProgress, originX: 0 }}
          />
        </div>
      </div>
    </section>
  );
};

export default PinnedServices;
