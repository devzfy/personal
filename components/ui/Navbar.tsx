"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  LOCALE_NAMES,
  type Locale,
} from "@/lib/i18n";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, dictionary } = useLanguage();

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-6 flex justify-between items-center ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4"
          : "bg-transparent"
      }`}
    >
      <TransitionLink
        href="/"
        data-cursor="hover"
        className="flex items-center space-x-2 group"
      >
        <span className="text-2xl font-serif tracking-tighter group-hover:text-red-600 transition-colors">
          JS.
        </span>
      </TransitionLink>

      <div className="flex items-center gap-2 md:gap-8 text-[9px] sm:text-[10px] md:text-sm font-medium tracking-wider md:tracking-widest uppercase">
        <TransitionLink
          href="/"
          data-cursor="hover"
          className={`hover:text-red-600 transition-colors ${
            pathname === "/"
              ? "text-red-600 underline underline-offset-8"
              : "text-white/60"
          }`}
        >
          {dictionary.nav.work}
        </TransitionLink>
        <TransitionLink
          href="/projects"
          data-cursor="hover"
          className={`hover:text-red-600 transition-colors ${
            pathname.startsWith("/projects")
              ? "text-red-600 underline underline-offset-8"
              : "text-white/60"
          }`}
        >
          {dictionary.nav.archive}
        </TransitionLink>
        <TransitionLink
          href="/contact"
          data-cursor="hover"
          className={`px-2 md:px-4 py-2 border border-white/20 hover:border-red-600 hover:bg-red-600 transition-all duration-300 ${
            pathname === "/contact"
              ? "bg-red-600 border-red-600 text-white"
              : "text-white"
          }`}
        >
          {dictionary.nav.contact}
        </TransitionLink>

        <div
          className="flex items-center gap-1 border-l border-white/20 pl-3 md:pl-5"
          aria-label={dictionary.language.label}
          role="group"
        >
          {LOCALES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => changeLocale(item)}
              aria-pressed={locale === item}
              aria-label={LOCALE_NAMES[item]}
              className={`px-1.5 py-1 transition-colors ${
                locale === item
                  ? "text-red-600"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {LOCALE_LABELS[item]}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
