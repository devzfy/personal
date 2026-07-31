export interface Project {
  /** Stable identifier, also used as the URL slug for /projects/[slug]. */
  id: string;
  title: string;
  description: string;
  /** Longer overview rendered at the top of the case study body. */
  longDescription?: string;
  /**
   * Narrative body of the case study. Copy is inferred from `metrics` and
   * `techStack` rather than from any source document, so it needs a factual
   * once-over before it goes live.
   */
  problem?: string;
  approach?: string;
  result?: string;
  techStack: string[];
  metrics: string[];
  /**
   * Optional in-page hero visual and openGraph override. Drop a file in
   * public/projects/ and point at it; the case study and generateMetadata both
   * pick it up automatically. Unset means the generated OG image is used.
   */
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Raw SVG path data, rendered inside a 24x24 viewBox. */
  icon: string;
}
