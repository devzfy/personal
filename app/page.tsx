import type { Metadata } from "next";
import TransitionLink from "@/components/ui/TransitionLink";

import Hero from "@/components/ui/Hero";
import About from "@/components/ui/About";
import PinnedServices from "@/components/ui/PinnedServices";
import ProjectCard from "@/components/ui/ProjectCard";
import Contact from "@/components/ui/Contact";
import Signature from "@/components/ui/Signature";
import SplitTextReveal from "@/components/ui/SplitTextReveal";
import { PROJECTS, SERVICES } from "@/lib/projects";
import { SITE, SAME_AS, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.jobTitle}`,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    // Matches the old index.html; `profile` would change how some scrapers
    // render the card, and this is a structural port.
    type: "website",
    url: absoluteUrl("/"),
    title: `${SITE.name} — ${SITE.jobTitle}`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage.url,
        width: SITE.ogImage.width,
        height: SITE.ogImage.height,
        alt: SITE.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.jobTitle}`,
    description: SITE.description,
    images: [SITE.ogImage.url],
  },
};

/** schema.org Person, emitted as JSON-LD in the static HTML. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": absoluteUrl("/#person"),
  name: SITE.name,
  alternateName: "devzfy",
  url: SITE.url,
  image: absoluteUrl(SITE.ogImage.url),
  jobTitle: SITE.jobTitle,
  description: SITE.description,
  email: `mailto:${SITE.email}`,
  sameAs: SAME_AS,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location.city,
    addressCountry: SITE.location.countryCode,
  },
  knowsAbout: SERVICES.map((service) => service.title),
  knowsLanguage: ["en", "uz", "ru"],
  worksFor: {
    "@type": "Organization",
    name: "Independent / Freelance",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output of a local constant — no user input involved.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="flex flex-col">
        <Hero />
        <About />
        <PinnedServices />

        <section className="py-32 px-6 md:px-12 bg-black relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-6">
                  Selected Work
                </h2>
                <h3 className="text-4xl md:text-5xl font-serif leading-tight">
                  <SplitTextReveal text="Notable Successes." />
                </h3>
              </div>
              <TransitionLink
                href="/projects"
                className="text-xs uppercase tracking-widest font-bold border-b border-red-600 pb-2 hover:text-red-600 transition-colors"
              >
                View Full Archive
              </TransitionLink>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {PROJECTS.slice(0, 4).map((project, index) => (
                <TransitionLink
                  key={project.id}
                  href={`/projects/${project.id}`}
                  aria-label={`Read the ${project.title} case study`}
                >
                  <ProjectCard project={project} index={index} />
                </TransitionLink>
              ))}
            </div>
          </div>
        </section>

        <Contact />
        <Signature />
      </div>
    </>
  );
}
