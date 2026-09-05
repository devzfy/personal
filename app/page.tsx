import type { Metadata } from "next";
import TransitionLink from "@/components/ui/TransitionLink";

import Hero from "@/components/ui/Hero";
import About from "@/components/ui/About";
import PinnedServices from "@/components/ui/PinnedServices";
import ProjectCard from "@/components/ui/ProjectCard";
import Contact from "@/components/ui/Contact";
import Signature from "@/components/ui/Signature";
import SplitTextReveal from "@/components/ui/SplitTextReveal";
import JsonLd from "@/components/JsonLd";
import { getProjects } from "@/lib/projects";
import { homeGraph } from "@/lib/schema";
import { absoluteUrl, getSite } from "@/lib/site";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite(await getLocale());
  return {
    title: `${site.name} — ${site.jobTitle}`,
    description: site.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: absoluteUrl("/"),
      title: `${site.name} — ${site.jobTitle}`,
      description: site.description,
      images: [site.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.jobTitle}`,
      description: site.description,
      images: [site.ogImage.url],
    },
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const projects = getProjects(locale);

  return (
    <>
      <JsonLd data={homeGraph(locale)} />

      <div className="flex flex-col">
        <Hero />
        <About />
        <PinnedServices />

        <section className="py-32 px-6 md:px-12 bg-black relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-sm font-medium tracking-[0.4em] text-red-600 uppercase mb-6">
                  {dictionary.home.selectedWork}
                </h2>
                <h3 className="text-4xl md:text-5xl font-serif leading-tight">
                  <SplitTextReveal text={dictionary.home.notableSuccesses} />
                </h3>
                <p className="mt-6 max-w-xl text-white/45 leading-relaxed">
                  {dictionary.home.featuredDescription}
                </p>
              </div>
              <TransitionLink
                href="/projects"
                className="text-xs uppercase tracking-widest font-bold border-b border-red-600 pb-2 hover:text-red-600 transition-colors"
              >
                {dictionary.home.viewArchive}
              </TransitionLink>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project, index) => (
                <TransitionLink
                  key={project.id}
                  href={`/projects/${project.id}`}
                  aria-label={dictionary.home.caseStudyAria(project.title)}
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
