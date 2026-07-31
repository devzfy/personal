"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-6 flex justify-between items-center ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4"
          : "bg-transparent"
      }`}
    >
      <Link
        href="/"
        data-cursor="hover"
        className="flex items-center space-x-2 group"
      >
        <span className="text-2xl font-serif tracking-tighter group-hover:text-red-600 transition-colors">
          JS.
        </span>
      </Link>

      <div className="flex items-center space-x-8 text-sm font-medium tracking-widest uppercase">
        <Link
          href="/"
          data-cursor="hover"
          className={`hover:text-red-600 transition-colors ${
            pathname === "/"
              ? "text-red-600 underline underline-offset-8"
              : "text-white/60"
          }`}
        >
          Work
        </Link>
        <Link
          href="/projects"
          data-cursor="hover"
          className={`hover:text-red-600 transition-colors ${
            pathname.startsWith("/projects")
              ? "text-red-600 underline underline-offset-8"
              : "text-white/60"
          }`}
        >
          Archive
        </Link>
        <Link
          href="/contact"
          data-cursor="hover"
          className={`px-4 py-2 border border-white/20 hover:border-red-600 hover:bg-red-600 transition-all duration-300 ${
            pathname === "/contact"
              ? "bg-red-600 border-red-600 text-white"
              : "text-white"
          }`}
        >
          Contact
        </Link>
      </div>
    </motion.nav>
  );
}
