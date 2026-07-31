import type { Project, Service } from "./types";

/*
 * ---------------------------------------------------------------------------
 * BEFORE DEPLOYING — two things in here are not real yet:
 *
 * 1. liveUrl / githubUrl are example.com placeholders. They are deliberately
 *    obvious rather than plausible-looking (github.com/devzfy/<something>
 *    would read as real and 404). Replace them with real URLs, or delete the
 *    fields — the case study only renders a button when the field is set, so
 *    deleting them is safe and leaves no gap. These are client projects, so
 *    for most of them "no public link" is probably the correct answer.
 *
 * 2. The problem / approach / result copy is inferred from the metrics and
 *    tech stack below, not from any source document. It is plausible and
 *    internally consistent, but it is not attested — read it for factual
 *    accuracy before it represents you.
 *
 * imageUrl is intentionally left unset. Per-project openGraph images are
 * generated at build time from this data (app/projects/[slug]/opengraph-image.tsx),
 * so no stock placeholder is needed. Set imageUrl only when you have a real
 * project image to show in the page hero.
 * ---------------------------------------------------------------------------
 */

export const PROJECTS: Project[] = [
  {
    id: "elearning",
    title: "Global E-learning Platform",
    description:
      "Engineered the frontend of a large-scale education platform for 2.5 million+ learners.",
    longDescription:
      "Frontend engineering for an education platform serving more than 2.5 million active learners. The work centred on the Next.js and TypeScript application layer — component architecture, state management with Redux, motion design with Framer Motion — together with the performance work that brought load times down by 30%.",
    problem:
      "Serving 2.5 million active learners puts every frontend decision under load. Slow paint on the heaviest course routes and an inconsistent component model were costing engagement at exactly the moment a learner decides whether to keep going.",
    approach:
      "Rebuilt the application layer on Next.js and TypeScript behind a strict component contract, moved shared state into Redux with predictable selectors, and treated motion as part of the interface rather than decoration. The performance work went straight at the render path: bundle splitting, image strategy, and removing layout thrash on the routes that carried the most traffic.",
    result:
      "Load times improved by 30% and engagement rose 20% on the back of the UX changes — on a codebase 2.5 million active users now depend on.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "Framer Motion",
    ],
    metrics: [
      "2.5M+ active users",
      "30% improvement in load times",
      "Increased engagement by 20% through UX optimizations",
    ],
    // PLACEHOLDER LINKS — see the note at the top of this file.
    liveUrl: "https://example.com/elearning-platform",
    githubUrl: "https://example.com/elearning-repo",
  },
  {
    id: "ecommerce",
    title: "E-commerce Web App Overhaul",
    description:
      "Revamped a legacy e-commerce site with Next.js and modern UI components, integrating Stripe.",
    longDescription:
      "A full overhaul of a legacy storefront. The old frontend was replaced with a Next.js application built on a modern component architecture using shadcn/ui, with the Stripe API wired in for multi-method payments and a checkout flow rebuilt to complete 50% faster.",
    problem:
      "A legacy storefront where checkout was the bottleneck. Every additional payment method meant more branching through code that was already difficult to change safely, so the cost of each new option kept rising.",
    approach:
      "Replaced the legacy frontend with a Next.js application on a composable shadcn/ui component layer, and rebuilt checkout around the Stripe API so an additional payment method became configuration rather than a new code path. Product and order data moved onto PostgreSQL.",
    result:
      "Checkout completes 50% faster, multi-method payments work without special-casing, and the component architecture makes the next change cheap instead of risky.",
    techStack: ["React", "Next.js", "Stripe API", "shadcn/ui", "PostgreSQL"],
    metrics: [
      "Modern component architecture",
      "Seamless multi-payment integration",
      "50% faster checkout flow",
    ],
    // PLACEHOLDER LINK — see the note at the top of this file.
    liveUrl: "https://example.com/storefront",
  },
  {
    id: "logistics",
    title: "Real-time Logistics Dashboard",
    description:
      "Handles 5,000+ daily operations and ~1,000 concurrent users with real-time data visualization.",
    longDescription:
      "A real-time operations dashboard handling over 5,000 daily operations for roughly 1,000 concurrent users. Live asset positions stream in over Socket.io and are visualised with D3.js, alongside a built-in predictive analytics view and a real-time chat channel between customers and the company. Data latency dropped by 60%.",
    problem:
      "Operations teams were making decisions on stale data. At 5,000+ daily operations and roughly 1,000 concurrent users, polling could not keep the picture current, and customers had no direct line to the company from inside the product.",
    approach:
      "Moved live asset positions onto Socket.io streams and visualised them with D3.js, with TanStack Query owning server state so the interface never re-fetched what it already had. A predictive analytics view sits on the same stream, as does a real-time chat channel between customers and the company.",
    result:
      "Data latency fell 60%, 5,000+ assets are tracked live, and roughly 1,000 concurrent users now work from the same current picture instead of their own stale copies.",
    techStack: [
      "React",
      "Socket.io",
      "D3.js",
      "Node.js",
      "TypeScript",
      "TanStack Query",
    ],
    metrics: [
      "60% reduction in data latency",
      "Real-time tracking of 5k+ assets",
      "Built-in predictive analytics view",
      "Built a real-time chat between customers and company",
    ],
    // PLACEHOLDER LINK — see the note at the top of this file.
    githubUrl: "https://example.com/logistics-repo",
  },
  {
    id: "admin-crm",
    title: "Enterprise Admin Dashboard",
    description:
      "Internal tools managing 10k+ records with automated workflows to cut manual operations.",
    longDescription:
      "Internal tooling for managing more than 10,000 customer records. Twelve core business workflows were automated, halving manual data entry, and a real-time chat channel between leads and admins was built on Socket.io. Data is surfaced through Chart.js dashboards with TanStack Query handling server state.",
    problem:
      "Internal teams were hand-carrying more than 10,000 customer records through processes that existed only as convention. The cost was not only the hours — it was the error rate that comes with any manual data entry at that volume.",
    approach:
      "Automated twelve core business workflows behind a single admin surface, with TanStack Query managing server state and Chart.js turning record-level data into something a manager can act on. Leads and admins talk over a Socket.io channel inside the same tool.",
    result:
      "Manual data entry halved, twelve workflows now run without intervention, and 10,000+ records sit under one roof with an audit trail instead of in spreadsheets.",
    techStack: ["React", "TanStack Query", "Tailwind", "Chart.js", "Socket.io"],
    metrics: [
      "50% less manual data entry",
      "Managed 10,000+ customer records",
      "Automated 12 core business workflows",
      "Built a real-time chat between leads and admins",
    ],
  },
];

export const SERVICES: Service[] = [
  {
    id: "ui-dev",
    title: "Interactive UI Development",
    description:
      "Fluid, Responsive UI Development – Building interfaces with Javascript/TypeScript (React/Next) and Tailwind that feel smooth on every device.",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    id: "mobile-app",
    title: "Mobile App Development",
    description:
      "Cross-platform mobile apps built with React Native – native feel, fast delivery, and a single codebase.",
    icon: "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
  },
  {
    id: "telegram-bot",
    title: "Telegram Bot Development",
    description:
      "Building robust Telegram bots with Node.js and Telegraf – automated, secure, and fast messaging workflows.",
    icon: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description:
      "Seamlessly integrating AI into web and mobile products — from intelligent chat to automated workflows and data-driven features.",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z",
  },
  {
    id: "desktop-app",
    title: "Desktop App (Electron)",
    description:
      "Cross-platform desktop apps using Electron.js — combining web tech with native performance.",
    icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25",
  },
  {
    id: "performance",
    title: "Performance Optimization",
    description:
      "Optimizing for speed and load times, achieving 20–40% faster page loads in production environments.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    id: "motion-webgl",
    title: "Advanced Animations & WebGL",
    description:
      "Crafting standout experiences with Framer Motion, GSAP, and Three.js for that extra wow-factor.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

/** Slugs for /projects/[slug] — driven by Project.id. */
export function getProjectSlugs(): string[] {
  return PROJECTS.map((project) => project.id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.id === slug);
}

/** 0-based position, used for the "Case Study 0N" label. */
export function getProjectIndex(slug: string): number {
  return PROJECTS.findIndex((project) => project.id === slug);
}

/**
 * The next project in the array, wrapping around at the end so the case study
 * pages form a loop. Returns undefined only if the slug is unknown.
 */
export function getNextProject(slug: string): Project | undefined {
  const index = getProjectIndex(slug);
  if (index === -1) return undefined;
  return PROJECTS[(index + 1) % PROJECTS.length];
}

export interface ParsedMetric {
  /** The headline figure, e.g. "2.5M+", "30%", "12". Null when the metric is qualitative. */
  value: string | null;
  /** The metric with the figure removed, or the whole string when there is no figure. */
  label: string;
  /**
   * True when the figure led the string and was cleanly lifted out of the
   * label. False means the label still contains the figure. Callers with tight
   * space (the openGraph card) can prefer the clean ones.
   */
  leads: boolean;
}

/**
 * Splits a metric string into a big number and its caption.
 *
 * The figure is only lifted out of the caption when it leads the string
 * ("2.5M+ active users" -> "2.5M+" / "active users"). When it sits mid-sentence
 * the caption is left whole, because removing it strands the preposition —
 * "Increased engagement by 20% through UX optimizations" would otherwise become
 * "Increased engagement by through UX optimizations". The figure repeats in
 * those cases, which is redundant but always grammatical.
 *
 * Metrics with no figure at all ("Modern component architecture") return
 * value: null and get rendered as statements instead.
 */
export function parseMetric(metric: string): ParsedMetric {
  const match = metric.match(/\d[\d.,]*\s*(?:%|[MKk]\+?|x)?\+?/);
  if (!match) {
    return { value: null, label: metric, leads: false };
  }

  const value = match[0].trim();
  const leads = match.index === 0;
  if (!leads) {
    return { value, label: metric, leads: false };
  }

  const label = metric.slice(match[0].length).replace(/\s{2,}/g, " ").trim();
  return {
    value,
    label: label.length > 0 ? label : metric,
    leads: true,
  };
}
