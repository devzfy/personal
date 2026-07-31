import type { Metadata } from "next";
import TransitionLink from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[10px] uppercase tracking-[0.4em] text-red-600 mb-6 block">
        Error 404
      </span>
      <h1 className="text-5xl md:text-8xl font-serif mb-8">Lost the thread.</h1>
      <div className="h-[1px] w-32 bg-red-600 mb-10" />
      <p className="text-white/40 text-lg max-w-md mb-12">
        This page does not exist. The archive is probably where you were headed.
      </p>
      <div className="flex flex-col sm:flex-row gap-6">
        <TransitionLink
          href="/"
          className="px-10 py-5 bg-red-600 hover:bg-white text-white hover:text-black transition-all duration-300 uppercase text-sm font-bold tracking-widest"
        >
          Back Home
        </TransitionLink>
        <TransitionLink
          href="/projects"
          className="px-10 py-5 border border-white/20 hover:border-white transition-colors uppercase text-sm font-bold tracking-widest"
        >
          View Archive
        </TransitionLink>
      </div>
    </div>
  );
}
