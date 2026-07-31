import type { JsonLdNode } from "@/lib/schema";

/**
 * Emits a JSON-LD script tag.
 *
 * dangerouslySetInnerHTML is required — React escapes text children, which would
 * corrupt the JSON. The input is always a locally built object from lib/schema.ts
 * with no user or request data in it, so there is nothing to inject.
 *
 * The `<` escape guards the one case that still matters: a literal "</script>"
 * appearing inside a string value would otherwise close the tag early.
 */
export default function JsonLd({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
