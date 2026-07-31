/**
 * Samples rendered text into a point cloud via an offscreen 2D canvas.
 *
 * Coordinates come back normalised so that the block's *width* spans
 * [-0.5, 0.5], with y divided by the same factor so the aspect ratio survives.
 * That means one scalar uniform can scale the whole block into world units, and
 * a viewport resize never requires re-sampling.
 */

/** Canvas font size used for sampling. Higher = finer letterform detail. */
const SAMPLE_FONT_PX = 220;
const LINE_HEIGHT = 1.06;
const ALPHA_THRESHOLD = 130;

export interface TextPointCloud {
  /** xy pairs, length `count * 2`. */
  points: Float32Array;
  /** Block height in the same normalised units as x, for reference. */
  height: number;
  /** How many distinct source pixels were available before sampling. */
  sourcePixels: number;
}

/**
 * Resolves the display font and waits for it to actually be usable.
 *
 * Two traps here. next/font emits a *hashed* family name, so hardcoding
 * "Playfair Display" silently samples a fallback serif instead — the name is
 * read from the --font-playfair custom property the root layout sets. And
 * canvas fillText does not wait for webfonts: sampling before the face has
 * loaded produces letterforms from whatever the fallback is, which looks
 * subtly wrong in a way that is easy to miss.
 */
export async function resolveDisplayFont(): Promise<string> {
  const declared = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-playfair")
    .trim();
  const family = declared.length > 0 ? declared : "serif";

  try {
    await document.fonts.load(`700 ${SAMPLE_FONT_PX}px ${family}`);
    await document.fonts.ready;
  } catch {
    // A failed load still leaves a usable fallback; better a fallback serif
    // than no text at all.
  }

  return family;
}

/** Fisher-Yates, so the chosen pixels are spread over the whole glyph set. */
function shuffle(list: Int32Array): void {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = list[i]!;
    list[i] = list[j]!;
    list[j] = tmp;
  }
}

/**
 * Renders `text` (use "\n" for line breaks) and returns `count` sampled points.
 *
 * Sampling is uniform over "on" pixels, so denser strokes receive more points —
 * which is what makes the weight of the typeface survive the translation to
 * dots.
 */
export function sampleTextPoints(
  text: string,
  fontFamily: string,
  count: number,
): TextPointCloud {
  const lines = text.split("\n");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { points: new Float32Array(count * 2), height: 0, sourcePixels: 0 };
  }

  const font = `700 ${SAMPLE_FONT_PX}px ${fontFamily}`;
  ctx.font = font;

  const lineWidths = lines.map((line) => ctx.measureText(line).width);
  const blockWidth = Math.max(1, ...lineWidths);
  const lineStep = SAMPLE_FONT_PX * LINE_HEIGHT;
  const blockHeight = lineStep * lines.length;

  // Padding keeps ascenders/descenders and any overshoot inside the bitmap.
  const padding = SAMPLE_FONT_PX * 0.4;
  canvas.width = Math.ceil(blockWidth + padding * 2);
  canvas.height = Math.ceil(blockHeight + padding * 2);

  // Canvas resize resets context state, so the font has to be set again.
  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  lines.forEach((line, i) => {
    const y = padding + lineStep * (i + 0.5);
    ctx.fillText(line, canvas.width / 2, y);
  });

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Collect indices of lit pixels.
  const lit = new Int32Array(canvas.width * canvas.height);
  let litCount = 0;
  for (let i = 3, px = 0; i < data.length; i += 4, px++) {
    if (data[i]! > ALPHA_THRESHOLD) lit[litCount++] = px;
  }

  const points = new Float32Array(count * 2);
  if (litCount === 0) {
    return { points, height: 0, sourcePixels: 0 };
  }

  const pool = lit.subarray(0, litCount);
  // Shuffling only pays off when there is a surplus to choose from; past that
  // point duplicates are unavoidable and jitter does the work instead.
  if (litCount > count) shuffle(pool as Int32Array);

  // Normalising both axes by width keeps the aspect ratio intact and lets a
  // single uTextScale uniform size the block.
  const norm = 1 / canvas.width;
  const halfH = canvas.height / 2;

  for (let i = 0; i < count; i++) {
    const px = pool[i % litCount]!;
    const x = px % canvas.width;
    const y = Math.floor(px / canvas.width);

    // Sub-pixel jitter: breaks up the pixel grid, and stops repeated samples
    // from stacking into a single bright dot once count exceeds litCount.
    const jx = Math.random() - 0.5;
    const jy = Math.random() - 0.5;

    points[i * 2] = (x + jx - canvas.width / 2) * norm;
    // Canvas y grows downward, world y grows up.
    points[i * 2 + 1] = -(y + jy - halfH) * norm;
  }

  return {
    points,
    height: canvas.height * norm,
    sourcePixels: litCount,
  };
}
