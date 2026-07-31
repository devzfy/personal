import type { Project, Service } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "elearning",
    title: "Global E-learning Platform",
    description:
      "Engineered the frontend of a large-scale education platform for 2.5 million+ learners.",
    longDescription:
      "Frontend engineering for an education platform serving more than 2.5 million active learners. The work centred on the Next.js and TypeScript application layer — component architecture, state management with Redux, motion design with Framer Motion — together with the performance work that brought load times down by 30%.",
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
  },
  {
    id: "ecommerce",
    title: "E-commerce Web App Overhaul",
    description:
      "Revamped a legacy e-commerce site with Next.js and modern UI components, integrating Stripe.",
    longDescription:
      "A full overhaul of a legacy storefront. The old frontend was replaced with a Next.js application built on a modern component architecture using shadcn/ui, with the Stripe API wired in for multi-method payments and a checkout flow rebuilt to complete 50% faster.",
    techStack: ["React", "Next.js", "Stripe API", "shadcn/ui", "PostgreSQL"],
    metrics: [
      "Modern component architecture",
      "Seamless multi-payment integration",
      "50% faster checkout flow",
    ],
  },
  {
    id: "logistics",
    title: "Real-time Logistics Dashboard",
    description:
      "Handles 5,000+ daily operations and ~1,000 concurrent users with real-time data visualization.",
    longDescription:
      "A real-time operations dashboard handling over 5,000 daily operations for roughly 1,000 concurrent users. Live asset positions stream in over Socket.io and are visualised with D3.js, alongside a built-in predictive analytics view and a real-time chat channel between customers and the company. Data latency dropped by 60%.",
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
  },
  {
    id: "admin-crm",
    title: "Enterprise Admin Dashboard",
    description:
      "Internal tools managing 10k+ records with automated workflows to cut manual operations.",
    longDescription:
      "Internal tooling for managing more than 10,000 customer records. Twelve core business workflows were automated, halving manual data entry, and a real-time chat channel between leads and admins was built on Socket.io. Data is surfaced through Chart.js dashboards with TanStack Query handling server state.",
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

/** 1-based position, used for the "Case Study 0N" label and prev/next nav. */
export function getProjectIndex(slug: string): number {
  return PROJECTS.findIndex((project) => project.id === slug);
}
