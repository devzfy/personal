import { ImageResponse } from "next/og";

import { getProjectBySlug, getProjectSlugs, parseMetric } from "@/lib/projects";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study preview";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

/**
 * Per-project openGraph card, rendered at build time.
 *
 * This exists so the case studies do not need placeholder screenshots: each one
 * gets a real, on-brand preview generated from the data that is already there,
 * instead of every project sharing the generic site image. Satori (which backs
 * ImageResponse) only understands inline styles and needs an explicit `display`
 * on any element with more than one child, hence the verbosity.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const title = project?.title ?? SITE.name;
  // Prefer metrics whose figure was cleanly lifted out of the caption, so the
  // card never shows the same number twice in a three-word label. Falls back to
  // any numeric metric if a project has no cleanly-split ones.
  const numeric = project?.metrics.map(parseMetric).filter((m) => m.value) ?? [];
  const clean = numeric.filter((m) => m.leads);
  const headline = (clean.length > 0 ? clean : numeric).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          padding: "72px",
          borderTop: "12px solid #dc2626",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#dc2626",
              fontSize: 22,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
            }}
          >
            Case Study
          </div>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 78,
              lineHeight: 1.05,
              marginTop: 28,
              maxWidth: 940,
            }}
          >
            {title}
          </div>
        </div>

        {headline.length > 0 ? (
          <div style={{ display: "flex", gap: "56px" }}>
            {headline.map((metric) => (
              <div
                key={metric.label}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div style={{ display: "flex", color: "#dc2626", fontSize: 52 }}>
                  {metric.value}
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 20,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginTop: 10,
                    maxWidth: 260,
                  }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "rgba(255,255,255,0.45)",
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>{SITE.name}</div>
          <div style={{ display: "flex" }}>devzfy.uz</div>
        </div>
      </div>
    ),
    size,
  );
}
