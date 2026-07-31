import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import FadeIn from "@/components/ui/FadeIn";
import {
  PROJECTS,
  getProjectBySlug,
  getProjectIndex,
  getProjectSlugs,
} from "@/lib/projects";
import { SITE, absoluteUrl } from "@/lib/site";

interface PageProps {
  // Next 16: route params arrive as a Promise.
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

/** Anything outside generateStaticParams 404s instead of rendering on demand. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const description = project.longDescription ?? project.description;
  const url = absoluteUrl(`/projects/${project.id}`);

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — ${SITE.name}`,
      description,
      images: [
        {
          url: SITE.ogImage.url,
          width: SITE.ogImage.width,
          height: SITE.ogImage.height,
          alt: `${project.title} — case study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${SITE.name}`,
      description,
      images: [SITE.ogImage.url],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const index = getProjectIndex(slug);
  const previous = index > 0 ? PROJECTS[index - 1] : undefined;
  const next = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : undefined;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Work", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Archive",
        item: absoluteUrl("/projects"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: absoluteUrl(`/projects/${project.id}`),
      },
    ],
  };

  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-black min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-4xl mx-auto">
        <FadeIn>
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-red-600 transition-colors mb-16"
          >
            <span aria-hidden="true">&larr;</span> Back to Archive
          </Link>
        </FadeIn>

        <header className="mb-24">
          <FadeIn>
            <span className="text-[10px] uppercase tracking-[0.4em] text-red-600 mb-6 block">
              Case Study 0{index + 1}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif mb-8 leading-[1.1]">
              {project.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="h-[1px] w-32 bg-red-600 mb-10" />
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-white/60 text-xl leading-relaxed">
              {project.description}
            </p>
          </FadeIn>
        </header>

        {project.longDescription ? (
          <FadeIn delay={0.4}>
            <section className="mb-20 border-t border-white/5 pt-12">
              <h2 className="text-xs font-bold tracking-[0.4em] text-red-600 uppercase mb-8">
                Overview
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                {project.longDescription}
              </p>
            </section>
          </FadeIn>
        ) : null}

        <FadeIn delay={0.4}>
          <section className="mb-20 border-t border-white/5 pt-12">
            <h2 className="text-xs font-bold tracking-[0.4em] text-red-600 uppercase mb-8">
              Impact
            </h2>
            <ul className="grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
              {project.metrics.map((metric) => (
                <li
                  key={metric}
                  className="bg-black p-8 text-sm font-medium uppercase tracking-wider text-white/80"
                >
                  <span className="text-red-600 mr-2" aria-hidden="true">
                    •
                  </span>
                  {metric}
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>

        <FadeIn delay={0.4}>
          <section className="mb-20 border-t border-white/5 pt-12">
            <h2 className="text-xs font-bold tracking-[0.4em] text-red-600 uppercase mb-8">
              Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-xs uppercase tracking-widest hover:border-red-600 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        <nav
          aria-label="Other case studies"
          className="border-t border-white/10 pt-12 grid sm:grid-cols-2 gap-8"
        >
          {previous ? (
            <Link
              href={`/projects/${previous.id}`}
              className="group text-left sm:col-start-1"
            >
              <span className="block text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3">
                Previous
              </span>
              <span className="block text-xl font-serif group-hover:text-red-600 transition-colors">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.id}`}
              className="group text-left sm:col-start-2 sm:text-right"
            >
              <span className="block text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3">
                Next
              </span>
              <span className="block text-xl font-serif group-hover:text-red-600 transition-colors">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>

        <div className="mt-24 border-t border-white/5 pt-16 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-10">
            Interested in something similar?
          </h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-red-600 hover:bg-white text-white hover:text-black transition-all duration-300 uppercase text-sm font-bold tracking-widest"
          >
            Start a Conversation
          </Link>
        </div>
      </article>
    </div>
  );
}
