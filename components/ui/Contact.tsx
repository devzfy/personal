"use client";

import { motion } from "framer-motion";
import { SITE, SOCIALS } from "@/lib/site";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Contact() {
  const { dictionary } = useLanguage();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SITE.email);
    alert(dictionary.footer.copied);
  };

  return (
    <footer
      id="contact"
      className="py-32 px-6 md:px-12 bg-black border-t border-white/10 overflow-hidden relative"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-8">
            {dictionary.footer.eyebrow}
          </h2>
          <h3 className="text-5xl md:text-8xl font-serif mb-12">
            {dictionary.footer.title}
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16">
            <a
              href={`mailto:${SITE.email}`}
              data-cursor="hover"
              className="group flex items-center space-x-4 px-10 py-5 bg-red-600 hover:bg-white text-white hover:text-black transition-all duration-300 w-full md:w-auto"
            >
              <span className="uppercase text-sm font-bold tracking-widest">
                {dictionary.footer.email}
              </span>
              <svg
                className="w-5 h-5 group-hover:translate-x-2 transition-transform"
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
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              data-cursor="hover"
              className="px-10 py-5 border border-white/20 hover:border-white transition-colors uppercase text-sm font-bold tracking-widest w-full md:w-auto"
            >
              {dictionary.footer.copy}
            </button>
          </div>

          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-white/40 text-xs tracking-widest uppercase">
            {/* These three pointed at bare github.com / t.me / linkedin.com in the
                original — placeholder hrefs. Now resolved from lib/site.ts so the
                same handles feed the nav, the contact page and the JSON-LD. */}
            <div className="flex space-x-12">
              <a
                href={SOCIALS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href={SOCIALS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 transition-colors"
              >
                Telegram
              </a>
              <a
                href={SOCIALS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 transition-colors"
              >
                LinkedIn
              </a>
            </div>

            <p>
              &copy;{" "}
              <span suppressHydrationWarning>
                {new Date().getFullYear()}
              </span>{" "}
              {SITE.name}. {dictionary.footer.rights}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
