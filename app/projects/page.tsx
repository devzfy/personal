import type { Metadata } from "next";
import TransitionLink from "@/components/ui/TransitionLink";

import JsonLd from "@/components/JsonLd";
import ArchiveHeader from "@/components/ui/ArchiveHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import { getProjects } from "@/lib/projects";
import { archiveGraph } from "@/lib/schema";
import { absoluteUrl, getSite } from "@/lib/site";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const site = getSite(locale);
  const title = dictionary.nav.archive;
  const description = dictionary.project.archiveMetaDescription;

  return {
    title,
    description,
    alternates: { canonical: "/projects" },
    openGraph: {
      type: "website",
      url: absoluteUrl("/projects"),
      title: `${title} — ${site.name}`,
      description,
      images: [site.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      images: [site.ogImage.url],
    },
  };
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const projects = getProjects(locale);

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-black min-h-screen">
      <JsonLd data={archiveGraph(locale)} />

      <div className="max-w-7xl mx-auto">
        <ArchiveHeader />

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <div key={project.id} className="group">
              <TransitionLink
                href={`/projects/${project.id}`}
                aria-label={dictionary.home.caseStudyAria(project.title)}
              >
                <ProjectCard project={project} index={index} />
              </TransitionLink>
              <div className="mt-8 px-2 flex justify-between items-start opacity-60 group-hover:opacity-100 transition-opacity">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">
                    {dictionary.project.techStack}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <span key={t} className="text-[10px] text-white/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">
                    {dictionary.project.impact}
                  </h4>
                  <p className="text-[10px] text-red-600">
                    {project.metrics[0]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
