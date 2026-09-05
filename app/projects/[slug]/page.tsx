import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import FadeIn from "@/components/ui/FadeIn";
import TransitionLink from "@/components/ui/TransitionLink";
import {
  getNextProject,
  getProjectBySlug,
  getProjectIndex,
  getProjectSlugs,
  parseMetric,
} from "@/lib/projects";
import { projectGraph } from "@/lib/schema";
import { absoluteUrl, getSite } from "@/lib/site";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

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
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const site = getSite(locale);
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    return { title: dictionary.project.notFound };
  }

  const description = project.longDescription ?? project.description;
  const url = absoluteUrl(`/projects/${project.id}`);

  /*
   * When a project has its own imageUrl, that wins. Otherwise the openGraph
   * image is left to opengraph-image.tsx in this folder, which renders a
   * branded card per project at build time — so this omits `images` entirely
   * rather than falling back to the generic site preview.
   */
  const images = project.imageUrl
    ? [
        {
          url: project.imageUrl,
          alt: `${project.title} — case study`,
        },
      ]
    : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — ${site.name}`,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.name}`,
      description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };
}

const sectionHeading =
  "text-xs font-bold tracking-[0.4em] text-red-600 uppercase mb-8";
const body = "text-white/60 text-lg leading-relaxed";

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const project = getProjectBySlug(slug, locale);

  if (!project) notFound();

  const index = getProjectIndex(slug);
  const next = getNextProject(slug, locale);

  const narrative = [
    { label: dictionary.project.problem, copy: project.problem },
    { label: dictionary.project.approach, copy: project.approach },
    { label: dictionary.project.result, copy: project.result },
  ].filter((section): section is { label: string; copy: string } =>
    Boolean(section.copy),
  );


  return (
    <div className="pt-40 pb-32 px-6 md:px-12 bg-black min-h-screen">
      <JsonLd data={projectGraph(project, locale)} />

      <article className="max-w-4xl mx-auto">
        <FadeIn>
          <TransitionLink
            href="/projects"
            data-cursor="hover"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-red-600 transition-colors mb-16"
          >
            <span aria-hidden="true">&larr;</span> {dictionary.project.back}
          </TransitionLink>
        </FadeIn>

        {/* ---------------------------------------------------------- hero */}
        <header className="mb-24">
          <FadeIn>
            <span className="text-[10px] uppercase tracking-[0.4em] text-red-600 mb-6 block">
              {dictionary.project.caseStudy} 0{index + 1}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif mb-8 leading-[1.1]">
              {project.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="h-[1px] w-32 bg-red-600 mb-10" />
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-white/60 text-xl leading-relaxed mb-10">
              {project.description}
            </p>

            {/* Same badge treatment as ProjectCard, so the archive and the
                case study read as one system. */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] uppercase tracking-widest text-white/30 px-2 py-1 border border-white/5 bg-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeIn>

          {(project.liveUrl || project.githubUrl) && (
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="px-8 py-4 bg-red-600 hover:bg-white text-white hover:text-black transition-all duration-300 uppercase text-xs font-bold tracking-widest text-center"
                  >
                    {dictionary.project.viewLive}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="px-8 py-4 border border-white/20 hover:border-white transition-colors uppercase text-xs font-bold tracking-widest text-center"
                  >
                    {dictionary.project.source}
                  </a>
                )}
              </div>
            </FadeIn>
          )}
        </header>

        {/* Only rendered when a project has a real image of its own. */}
        {project.imageUrl && (
          <FadeIn delay={0.2}>
            <div className="relative aspect-16/10 w-full mb-24 overflow-hidden border border-white/10">
              <Image
                src={project.imageUrl}
                alt={dictionary.project.interfaceAlt(project.title)}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </FadeIn>
        )}

        {/* ------------------------------------------------------ overview */}
        {project.longDescription && (
          <FadeIn delay={0.4}>
            <section className="mb-20 border-t border-white/5 pt-12">
              <h2 className={sectionHeading}>{dictionary.project.overview}</h2>
              <p className={body}>{project.longDescription}</p>
            </section>
          </FadeIn>
        )}

        {/* ------------------------------- problem / approach / result body */}
        {narrative.length > 0 && (
          <div className="mb-20 border-t border-white/5 pt-12 space-y-16">
            {narrative.map((section) => (
              <FadeIn key={section.label} delay={0.2}>
                <section>
                  <h2 className={sectionHeading}>{section.label}</h2>
                  <p className={body}>{section.copy}</p>
                </section>
              </FadeIn>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------- metrics */}
        <FadeIn delay={0.2}>
          <section className="mb-20 border-t border-white/5 pt-12">
            <h2 className={sectionHeading}>{dictionary.project.impact}</h2>
            <ul className="grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
              {project.metrics.map((metric) => {
                const { value, label } = parseMetric(metric);
                return (
                  <li
                    key={metric}
                    className="bg-black p-8 md:p-10 flex flex-col justify-end"
                  >
                    {value ? (
                      <>
                        <p className="font-serif text-5xl md:text-6xl text-red-600 leading-none mb-4">
                          {value}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-white/50 leading-relaxed">
                          {label}
                        </p>
                      </>
                    ) : (
                      <p className="flex items-start text-sm uppercase tracking-widest text-white/80 leading-relaxed">
                        <span className="text-red-600 mr-3" aria-hidden="true">
                          •
                        </span>
                        {label}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </FadeIn>

        {/* -------------------------------------------------- next project */}
        {next && (
          <nav
            aria-label={dictionary.project.nextAria}
            className="border-t border-white/10 pt-12"
          >
            <TransitionLink
              href={`/projects/${next.id}`}
              data-cursor="hover"
              className="group block"
            >
              <span className="block text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4">
                {dictionary.project.next}
              </span>
              <span className="flex items-baseline justify-between gap-6">
                <span className="text-3xl md:text-5xl font-serif group-hover:text-red-600 group-hover:italic transition-all">
                  {next.title}
                </span>
                <span
                  aria-hidden="true"
                  className="text-red-600 text-2xl group-hover:translate-x-2 transition-transform"
                >
                  &rarr;
                </span>
              </span>
            </TransitionLink>
          </nav>
        )}

        <div className="mt-24 border-t border-white/5 pt-16 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-10">
            {dictionary.project.similar}
          </h2>
          <TransitionLink
            href="/contact"
            data-cursor="hover"
            className="inline-block px-10 py-5 bg-red-600 hover:bg-white text-white hover:text-black transition-all duration-300 uppercase text-sm font-bold tracking-widest"
          >
            {dictionary.project.startConversation}
          </TransitionLink>
        </div>
      </article>
    </div>
  );
}
