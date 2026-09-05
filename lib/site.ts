import { DEFAULT_LOCALE, getDictionary, type Locale } from "./i18n";

/**
 * Single source of truth for identity + SEO.
 * Used by metadata, JSON-LD, sitemap and robots.
 */
export const SITE = {
  url: "https://devzfy.uz",
  name: "Javokhir Shokirov",
  shortName: "JS.",
  jobTitle: getDictionary(DEFAULT_LOCALE).site.jobTitle,
  locale: "uz_UZ",
  description: getDictionary(DEFAULT_LOCALE).site.description,
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
    alt: getDictionary(DEFAULT_LOCALE).site.ogAlt,
  },
} as const;

const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

export function getSite(locale: Locale = DEFAULT_LOCALE) {
  const dictionary = getDictionary(locale);
  return {
    ...SITE,
    jobTitle: dictionary.site.jobTitle,
    description: dictionary.site.description,
    locale: OPEN_GRAPH_LOCALES[locale],
    ogImage: { ...SITE.ogImage, alt: dictionary.site.ogAlt },
  };
}

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
