import { getProjects, getServices } from "./projects";
import { SAME_AS, SITE, SOCIALS, absoluteUrl, getSite } from "./site";
import type { Project } from "./types";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "./i18n";

/**
 * schema.org builders.
 *
 * Everything is emitted as an @graph of nodes with stable @id values, so the
 * nodes can reference each other instead of repeating themselves. The point of
 * that is entity resolution: each case study names the Person as its author by
 * @id, which is what lets a crawler tie the projects to the same entity as the
 * homepage rather than treating them as unrelated pages.
 *
 * @id values are permanent identifiers — changing one breaks the links, so they
 * are defined once here and never inlined at a call site.
 */

export type JsonLdNode = Record<string, unknown>;

export const SCHEMA_ID = {
  person: absoluteUrl("/#person"),
  website: absoluteUrl("/#website"),
  archive: absoluteUrl("/projects#collection"),
  project: (slug: string) => absoluteUrl(`/projects/${slug}#project`),
} as const;

/** Reference to another node in the graph, rather than a nested copy of it. */
function ref(id: string): JsonLdNode {
  return { "@id": id };
}

/**
 * Minimal self-describing Person reference.
 *
 * A bare { "@id": ... } is valid and merges with the full definition on the
 * homepage, but it leaves a page unresolvable on its own — a crawler reading
 * only a case study would find an author it cannot name. Carrying @type, name
 * and url makes each page self-sufficient while @id still ties it to the same
 * entity, which is the cheap way to get both.
 */
function personRef(locale: Locale): JsonLdNode {
  const site = getSite(locale);
  return {
    "@type": "Person",
    "@id": SCHEMA_ID.person,
    name: site.name,
    url: site.url,
  };
}

/** Same idea for the archive, so isPartOf is meaningful on a case study page. */
function archiveRef(locale: Locale): JsonLdNode {
  const dictionary = getDictionary(locale);
  return {
    "@type": "CollectionPage",
    "@id": SCHEMA_ID.archive,
    name: dictionary.nav.archive,
    url: absoluteUrl("/projects"),
  };
}

/** Case studies have no real screenshots yet, so the generated card stands in. */
function projectImage(project: Project): string {
  return project.imageUrl
    ? absoluteUrl(project.imageUrl)
    : absoluteUrl(`/projects/${project.id}/opengraph-image`);
}

export function personNode(locale: Locale = DEFAULT_LOCALE): JsonLdNode {
  const site = getSite(locale);
  return {
    "@type": "Person",
    "@id": SCHEMA_ID.person,
    name: site.name,
    alternateName: "devzfy",
    url: site.url,
    image: absoluteUrl(site.ogImage.url),
    jobTitle: site.jobTitle,
    description: site.description,
    email: `mailto:${site.email}`,
    sameAs: SAME_AS,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressCountry: site.location.countryCode,
    },
    knowsAbout: getServices(locale).map((service) => service.title),
    knowsLanguage: ["en", "uz", "ru"],
    worksFor: { "@type": "Organization", name: "Independent / Freelance" },
  };
}

export function websiteNode(locale: Locale = DEFAULT_LOCALE): JsonLdNode {
  const site = getSite(locale);
  return {
    "@type": "WebSite",
    "@id": SCHEMA_ID.website,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: locale,
    publisher: ref(SCHEMA_ID.person),
    author: ref(SCHEMA_ID.person),
  };
}

/**
 * One project as a CreativeWork.
 *
 * CreativeWork rather than SoftwareApplication on purpose: these pages are case
 * studies about the work, not listings for software anyone can install. Google's
 * SoftwareApplication rich result also expects `offers` or `aggregateRating`,
 * neither of which is meaningful here, and marking it up that way would just
 * generate "missing field" warnings in Search Console. additionalType still
 * records what the thing actually is.
 *
 * No date fields: there is no real datePublished for these, and inventing one
 * would be a factual claim rather than markup.
 */
export function projectNode(
  project: Project,
  locale: Locale = DEFAULT_LOCALE,
): JsonLdNode {
  const url = absoluteUrl(`/projects/${project.id}`);

  return {
    "@type": "CreativeWork",
    "@id": SCHEMA_ID.project(project.id),
    additionalType: "https://schema.org/WebApplication",
    name: project.title,
    headline: project.title,
    description: project.longDescription ?? project.description,
    abstract: project.description,
    url,
    image: projectImage(project),
    inLanguage: locale,
    genre: getDictionary(locale).project.caseStudy,
    keywords: project.techStack.join(", "),
    author: personRef(locale),
    creator: personRef(locale),
    isPartOf: archiveRef(locale),
    mainEntityOfPage: url,
    // The metrics are the substance of each case study, so they are exposed as
    // machine-readable claims rather than being left as prose only.
    subjectOf: project.metrics.map((metric) => ({
      "@type": "Statement",
      text: metric,
    })),
  };
}

export function breadcrumbNode(
  trail: ReadonlyArray<{ name: string; path: string }>,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Homepage: the site, the person, and the profile page they are the subject of. */
export function homeGraph(locale: Locale = DEFAULT_LOCALE): JsonLdNode {
  const site = getSite(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode(locale),
      personNode(locale),
      {
        "@type": "ProfilePage",
        "@id": absoluteUrl("/#webpage"),
        url: site.url,
        name: `${site.name} — ${site.jobTitle}`,
        isPartOf: ref(SCHEMA_ID.website),
        about: ref(SCHEMA_ID.person),
        mainEntity: ref(SCHEMA_ID.person),
        primaryImageOfPage: absoluteUrl(site.ogImage.url),
      },
    ],
  };
}

/** Archive: a CollectionPage plus an ordered ItemList of every case study. */
export function archiveGraph(locale: Locale = DEFAULT_LOCALE): JsonLdNode {
  const dictionary = getDictionary(locale);
  const projects = getProjects(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": SCHEMA_ID.archive,
        url: absoluteUrl("/projects"),
        name: dictionary.nav.archive,
        description: dictionary.project.archiveDescription,
        isPartOf: ref(SCHEMA_ID.website),
        author: personRef(locale),
        mainEntity: {
          "@type": "ItemList",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            url: absoluteUrl(`/projects/${project.id}`),
          })),
        },
      },
      breadcrumbNode([
        { name: dictionary.nav.work, path: "/" },
        { name: dictionary.nav.archive, path: "/projects" },
      ]),
    ],
  };
}

/** Case study: the work itself, its page, and the trail to it. */
export function projectGraph(
  project: Project,
  locale: Locale = DEFAULT_LOCALE,
): JsonLdNode {
  const path = `/projects/${project.id}`;
  const dictionary = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      projectNode(project, locale),
      {
        "@type": "WebPage",
        "@id": absoluteUrl(`${path}#webpage`),
        url: absoluteUrl(path),
        name: `${project.title} — ${SITE.name}`,
        isPartOf: ref(SCHEMA_ID.website),
        about: ref(SCHEMA_ID.project(project.id)),
        mainEntity: ref(SCHEMA_ID.project(project.id)),
        primaryImageOfPage: projectImage(project),
        author: personRef(locale),
      },
      breadcrumbNode([
        { name: dictionary.nav.work, path: "/" },
        { name: dictionary.nav.archive, path: "/projects" },
        { name: project.title, path },
      ]),
    ],
  };
}

/** Contact: a ContactPage carrying the reachable channels. */
export function contactGraph(locale: Locale = DEFAULT_LOCALE): JsonLdNode {
  const dictionary = getDictionary(locale);
  const site = getSite(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": absoluteUrl("/contact#webpage"),
        url: absoluteUrl("/contact"),
        name: `${dictionary.nav.contact} — ${site.name}`,
        isPartOf: ref(SCHEMA_ID.website),
        about: ref(SCHEMA_ID.person),
        mainEntity: {
          "@type": "Person",
          "@id": SCHEMA_ID.person,
          name: site.name,
          email: `mailto:${site.email}`,
          url: site.url,
          sameAs: [SOCIALS.telegram, SOCIALS.linkedin, SOCIALS.instagram],
          address: {
            "@type": "PostalAddress",
            addressLocality: site.location.city,
            addressCountry: site.location.countryCode,
          },
        },
      },
      breadcrumbNode([
        { name: dictionary.nav.work, path: "/" },
        { name: dictionary.nav.contact, path: "/contact" },
      ]),
    ],
  };
}
