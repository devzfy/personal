/**
 * Single source of truth for identity + SEO.
 * Used by metadata, JSON-LD, sitemap and robots.
 */
export const SITE = {
  url: "https://devzfy.uz",
  name: "Javokhir Shokirov",
  shortName: "JS.",
  jobTitle: "Software Engineer",
  locale: "en_US",
  description:
    "Crafting high-end, interactive, and animated digital experiences — from web apps to mobile apps, Telegram bots, and AI integrations — all engineered with precision to impress.",
  email: "devzfy@gmail.com",
  location: {
    city: "Tashkent",
    country: "Uzbekistan",
    countryCode: "UZ",
  },
  ogImage: {
    url: "/og-preview.png",
    width: 1536,
    height: 1024,
    alt: "Javokhir Shokirov — Software Engineer",
  },
} as const;

export const SOCIALS = {
  github: "https://github.com/devzfy",
  telegram: "https://t.me/devzfy",
  linkedin: "https://linkedin.com/in/devzfy",
  instagram: "https://instagram.com/devzfy",
  facebook: "https://facebook.com/devzfy",
} as const;

/** Profile URLs for the Person JSON-LD `sameAs` field. */
export const SAME_AS: string[] = Object.values(SOCIALS);

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE.url).toString();
}
