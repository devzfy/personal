
import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-6">Services</h2>
            <h3 className="text-4xl md:text-6xl font-serif leading-tight">
              Value I Bring to Your Projects.
            </h3>
          </div>
          <p className="text-black/60 max-w-sm mb-2 text-lg">
            Focused on delivering premium digital experiences through cutting-edge engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 overflow-hidden border border-black/10">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 hover:bg-black group transition-all duration-500 cursor-default"
            >
              <div className="w-12 h-12 mb-10 flex items-center justify-center text-red-600 group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-6 group-hover:text-white transition-colors">{service.title}</h4>
              <p className="text-sm text-black/60 leading-relaxed group-hover:text-white/60 transition-colors">
                {service.description}
              </p>
              <div className="mt-10 w-0 h-[1px] bg-red-600 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
