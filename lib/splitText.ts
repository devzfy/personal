/**
 * Minimal text splitter.
 *
 * GSAP's SplitText is a paid Club plugin, so this covers what the site actually
 * needs: split a string into lines (on "\n"), words, and optionally characters,
 * as plain data. Rendering is left to the component, which means the split
 * happens during render on the server too — the real sentence ends up in the
 * static HTML instead of being assembled by client-side JS.
 */

export type SplitMode = "word" | "char";

export interface SplitWord {
  text: string;
  /** Populated in "char" mode; empty in "word" mode. */
  chars: string[];
}

export type SplitLine = SplitWord[];

/** Array.from (not .split("")) so astral characters are not torn in half. */
function toChars(word: string): string[] {
  return Array.from(word);
}

export function splitText(text: string, mode: SplitMode = "word"): SplitLine[] {
  return text.split("\n").map((line) =>
    line
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => ({
        text: word,
        chars: mode === "char" ? toChars(word) : [],
      })),
  );
}

/** Total animated units, useful for deriving a sensible stagger. */
export function countUnits(lines: SplitLine[], mode: SplitMode): number {
  return lines.reduce(
    (sum, line) =>
      sum +
      (mode === "char"
        ? line.reduce((n, word) => n + word.chars.length, 0)
        : line.length),
    0,
  );
}
