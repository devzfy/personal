"use client";

import { useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getServices } from "@/lib/projects";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useLanguage } from "@/components/providers/LanguageProvider";

/**
 * Pinned, scrubbed horizontal scroll-through of the services.
 *
 * Replaces the previous Framer Motion version, which used a 500vh section with
 * `sticky top-0` and one useTransform triple per slide. The design language is
 * unchanged — white stage, black type, red accents, Playfair titles, the
 * "Capabilities / Selected Services" block top-left, the per-panel counter and
 * the bottom progress rail. What changed is the transition: panels now travel
 * horizontally instead of cross-fading in place, which is what makes a real
 * `pin: true` worthwhile.
 *
 * Panel emphasis is computed analytically from scroll progress rather than by
 * measuring each panel every frame — no getBoundingClientRect in the scroll
 * handler, so there is no forced layout per frame.
 */
export default function PinnedServices() {
  const { locale, dictionary } = useLanguage();
  const services = getServices(locale);
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!root || !pin || !track || !bar) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
      const inners = gsap.utils.toArray<HTMLElement>("[data-panel-inner]", track);
      if (panels.length === 0) return;

      const setBar = gsap.quickSetter(bar, "scaleX");
      // NB: quickSetter only handles single transform properties. Passing
      // "scale" makes GSAP resolve it to "scaleX,scaleY" and then try to set
      // that as an attribute, which throws InvalidCharacterError and takes the
      // whole React root down with it. Hence the two explicit axes.
      const setters = inners.map((el) => ({
        opacity: gsap.quickSetter(el, "opacity"),
        scaleX: gsap.quickSetter(el, "scaleX"),
        scaleY: gsap.quickSetter(el, "scaleY"),
        y: gsap.quickSetter(el, "y", "px"),
      }));

      // Re-measured on every ScrollTrigger refresh, then reused each frame.
      let distance = 0;
      let panelWidth = 0;
      const measure = () => {
        panelWidth = track.scrollWidth / panels.length;
        distance = Math.max(0, track.scrollWidth - pin.clientWidth);
      };

      /**
       * `position` is where the viewport sits in panel units, so panel i is
       * centred when position === i. Distance from centre drives the fade,
       * which keeps the first and last panels fully opaque at the extremes.
       */
      const render = (progress: number) => {
        const position = panelWidth > 0 ? (progress * distance) / panelWidth : 0;
        setters.forEach((set, i) => {
          const offset = Math.min(1, Math.abs(i - position));
          const scale = 1 - offset * 0.12;
          set.opacity(1 - offset);
          set.scaleX(scale);
          set.scaleY(scale);
          set.y(offset * 40);
        });
        setBar(progress);
      };

      measure();
      gsap.set(bar, { scaleX: 0 });
      render(0);

      gsap.to(track, {
        x: () => -distance,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          // Vertical travel is expressed in viewport heights rather than track
          // width, so the section does not get twice as long on a wide monitor.
          end: () => `+=${(panels.length - 1) * window.innerHeight}`,
          pin,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onRefresh: (self) => {
            measure();
            render(self.progress);
          },
          onUpdate: (self) => render(self.progress),
        },
      });
    });

    // Reduced motion: no pin, no scroll-jacking. The track becomes a normal
    // snap-scrolling carousel the user drives themselves, and everything stays
    // legible without any animation.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
      pin.classList.add("overflow-x-auto", "snap-x", "snap-mandatory");
      panels.forEach((panel) => panel.classList.add("snap-center"));
      gsap.set(bar, { scaleX: 1 });

      return () => {
        pin.classList.remove("overflow-x-auto", "snap-x", "snap-mandatory");
        panels.forEach((panel) => panel.classList.remove("snap-center"));
      };
    });

    return () => {
      // Reverts both media branches: kills the tween and its ScrollTrigger,
      // removes the pin spacer and strips every inline style GSAP wrote.
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative bg-white text-black">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Fixed Title */}
        <div className="absolute top-12 left-6 md:left-12 z-10">
          <h2 className="text-xs font-bold tracking-[0.4em] text-red-600 uppercase mb-2">
            {dictionary.services.eyebrow}
          </h2>
          <p className="text-2xl font-serif">{dictionary.services.title}</p>
        </div>

        <div
          ref={trackRef}
          className="flex h-full w-max will-change-transform"
          aria-label={dictionary.services.aria}
        >
          {services.map((service, index) => (
            <article
              key={service.id}
              data-panel
              className="w-screen shrink-0 h-full flex items-center justify-center px-6"
            >
              <div
                data-panel-inner
                className="max-w-4xl w-full flex flex-col items-center justify-center text-center"
              >
                <div className="mb-8 text-red-600">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d={service.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-4xl md:text-7xl font-serif mb-6 leading-none">
                  {service.title}
                </h3>
                <p className="text-xl text-black/60 max-w-xl mx-auto leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-12 text-[10px] font-bold tracking-[0.5em] uppercase text-red-600/30">
                  0{index + 1} / 0{services.length}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-black/5 z-10">
          <div ref={barRef} className="h-full bg-red-600 origin-left" />
        </div>
      </div>
    </section>
  );
}
