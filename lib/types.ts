export interface Project {
  /** Stable identifier, also used as the URL slug for /projects/[slug]. */
  id: string;
  title: string;
  description: string;
  /** Longer overview rendered on the case study page. */
  longDescription?: string;
  techStack: string[];
  metrics: string[];
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
