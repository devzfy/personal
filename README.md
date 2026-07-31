# devzfy.uz — Javokhir Shokirov

Personal portfolio. Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script      | What it does                              |
| ----------- | ----------------------------------------- |
| `dev`       | Dev server (Turbopack)                    |
| `build`     | Production build, prerenders every route  |
| `start`     | Serve the production build                |
| `typecheck` | `tsc --noEmit`                            |

## Structure

```
app/
  layout.tsx              root layout: fonts, metadata, Lenis + loader + nav
  page.tsx                Home — Hero, About, PinnedServices, Selected Work, Contact
  projects/page.tsx       Archive
  projects/[slug]/page.tsx  Case study (generateStaticParams over PROJECTS)
  contact/page.tsx        Contact form
  sitemap.ts / robots.ts
components/
  ui/                     Presentational sections
  three/ParticleScene.tsx R3F particle field — always via next/dynamic({ ssr: false })
  providers/              Lenis smooth scroll, per-route fade
lib/
  projects.ts             PROJECTS + SERVICES data and slug helpers
  site.ts                 Identity, social handles and SEO constants
  types.ts                Project / Service interfaces
```

`lib/site.ts` is the single source of truth for the canonical URL, social handles
and OG image — metadata, the Person JSON-LD and the sitemap all read from it.

## Adding a project

Append to `PROJECTS` in `lib/projects.ts`. The `id` becomes the URL slug, and the
case study page, archive card, sitemap entry and static params follow automatically.
