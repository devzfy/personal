import type { Metadata } from "next";
import TransitionLink from "@/components/ui/TransitionLink";

import ArchiveHeader from "@/components/ui/ArchiveHeader";
import ProjectCard from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/lib/projects";
import { SITE, absoluteUrl } from "@/lib/site";

const title = "Archive";
const description =
  "A curated list of projects, experiments, and collaborations that showcase my approach to frontend architecture and design — e-learning at 2.5M+ users, real-time logistics, e-commerce and enterprise dashboards.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/projects"),
    title: `${title} — ${SITE.name}`,
    description,
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
    title: `${title} — ${SITE.name}`,
    description,
    images: [SITE.ogImage.url],
  },
};

export default function ProjectsPage() {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ArchiveHeader />

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {PROJECTS.map((project, index) => (
            <div key={project.id} className="group">
              <TransitionLink
                href={`/projects/${project.id}`}
                aria-label={`Read the ${project.title} case study`}
              >
                <ProjectCard project={project} index={index} />
              </TransitionLink>
              <div className="mt-8 px-2 flex justify-between items-start opacity-60 group-hover:opacity-100 transition-opacity">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-1">
                    Tech Stack
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
                    Impact
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
