"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { useRouteTransition } from "@/components/providers/RouteTransitionProvider";

type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * next/link plus the curtain wipe.
 *
 * Deliberately a wrapper component rather than a document-level click
 * interceptor: hijacking every click globally means owning every edge case on
 * the page, whereas this only affects links that opt in, and anything it does
 * not recognise falls straight through to normal next/link behaviour.
 * Prefetching is untouched, since this still renders a real next/link.
 */
export default function TransitionLink({
  href,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const transition = useRouteTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    // No provider (or a consumer already handled it) — behave like next/link.
    if (!transition || event.defaultPrevented) return;

    // Leave new-tab / new-window / download intents to the browser.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const anchorTarget = event.currentTarget.target;
    if (anchorTarget && anchorTarget !== "_self") return;

    // Only internal path navigations. External URLs, mailto:, tel: and bare
    // hash links all fall through untouched.
    if (typeof href !== "string" || !href.startsWith("/")) return;

    event.preventDefault();
    transition.navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
