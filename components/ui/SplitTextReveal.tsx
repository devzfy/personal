"use client";

import { Fragment, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { splitText, type SplitMode } from "@/lib/splitText";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

interface SplitTextRevealProps {
  /** Use "\n" for a line break. */
  text: string;
  by?: SplitMode;
  /** Seconds between units. */
  stagger?: number;
  duration?: number;
  /** ScrollTrigger `start`. */
  start?: string;
  delay?: number;
  className?: string;
}

/**
 * Word- or character-level scroll-triggered reveal.
 *
 * Renders a block-level <span>, so the caller keeps ownership of the heading
 * element and its typography:
 *
 *   <h3 className="text-5xl font-serif">
 *     <SplitTextReveal text={"Based in Uzbekistan,\nWorking Globally."} />
 *   </h3>
 *
 * Notes on the markup:
 * - Real space characters sit between word masks, so textContent reads as a
 *   proper sentence. Relying on flex `gap` for word spacing (as Hero does)
 *   leaves the words run together for anything reading textContent.
 * - Each unit sits in an overflow-hidden mask with pb/-mb of equal size, which
 *   widens the clip box enough for descenders without changing line metrics.
 * - The hidden start state is applied by gsap.from() inside a layout effect, not
 *   by CSS, so the text stays visible if JS never runs.
 */
export default function SplitTextReveal({
  text,
  by = "word",
  stagger = 0.045,
  duration = 0.9,
  start = "top 85%",
  delay = 0,
  className,
}: SplitTextRevealProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const lines = splitText(text, by);

  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]", el);
      if (targets.length === 0) return;

      gsap.from(targets, {
        yPercent: 115,
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      });
    });

    // Reverts the tween, its ScrollTrigger and every inline style GSAP added.
    return () => mm.revert();
  }, [text, by, stagger, duration, start, delay]);

  return (
    <span ref={rootRef} className={className ?? "block"}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 ? <br /> : null}
          {line.map((word, wordIndex) => (
            <Fragment key={`${lineIndex}-${wordIndex}`}>
              {wordIndex > 0 ? " " : null}
              {by === "char" ? (
                // Chars stay grouped per word so a word never wraps mid-way.
                <span className="inline-block whitespace-nowrap">
                  {word.chars.map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom"
                    >
                      <span data-reveal className="inline-block">
                        {char}
                      </span>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
                  <span data-reveal className="inline-block">
                    {word.text}
                  </span>
                </span>
              )}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </span>
  );
}
