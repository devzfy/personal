"use client";

import { motion } from "framer-motion";
import { getServices } from "@/lib/projects";
import { useLanguage } from "@/components/providers/LanguageProvider";

/**
 * Grid variant of the services section.
 *
 * Carried over as-is for parity: it was already unreferenced in the Vite app
 * (Home renders PinnedServices instead). Kept so the alternative layout is not
 * lost, but nothing imports it yet.
 */
export default function Services() {
  const { locale, dictionary } = useLanguage();
  const services = getServices(locale);

  return (
    <section className="py-32 px-6 md:px-12 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-6">
              {dictionary.services.eyebrow}
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif leading-tight">
              {dictionary.services.gridTitle}
            </h3>
          </div>
          <p className="text-black/60 max-w-sm mb-2 text-lg">
            {dictionary.services.gridDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 overflow-hidden border border-black/10">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 hover:bg-black group transition-all duration-500 cursor-default"
            >
              <div className="w-12 h-12 mb-10 flex items-center justify-center text-red-600 group-hover:text-white transition-colors">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={service.icon}
                  />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-6 group-hover:text-white transition-colors">
                {service.title}
              </h4>
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
}
