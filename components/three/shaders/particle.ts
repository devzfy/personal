import { SIMPLEX_NOISE_3D } from "./simplexNoise.glsl";

/**
 * Vertex shader for the particle field.
 *
 * Two things used to happen in JS every frame and now happen here:
 *   - the size pulse, previously material.size = 0.003 + sin(p * PI) * 0.005
 *   - the point-size attenuation, previously handled by PointsMaterial
 *
 * gl_PointSize deliberately reproduces three's own sizeAttenuation formula
 * (size * pixelRatio * (viewportHeight / 2) / -mvPosition.z) so swapping
 * PointsMaterial for a ShaderMaterial does not change how large the particles
 * appear. uScale is fed size.height * 0.5 and uPixelRatio the renderer dpr,
 * which is what three passes its own points shader.
 *
 * The simplex drift is applied to the position before the model-view transform,
 * so it is independent of the rigid group rotation still driven from useFrame —
 * the field breathes while the sphere spins.
 */
export const PARTICLE_VERTEX_SHADER = /* glsl */ `
#define PI 3.141592653589793

uniform float uTime;
uniform float uProgress;
uniform float uBaseSize;
uniform float uPulse;
uniform float uPixelRatio;
uniform float uScale;
uniform float uDriftAmp;
uniform float uMorph;
uniform float uMorphMax;
uniform float uStagger;
uniform float uTextMorph;
uniform float uTextStage;
uniform float uTextScale;
uniform float uTextDepth;
uniform float uScatter;

attribute float aSeed;
attribute vec3 aShape1;
attribute vec3 aShape2;
/*
 * The four stage letterforms, packed two per attribute.
 *
 * Text is flat, so each target only needs xy — four targets fit in two vec4s
 * instead of four vec3s. That matters because the field already spends
 * position + aShape1 + aShape2 + aSeed, and WebGL only guarantees 16 vertex
 * attributes (8 on WebGL1).
 */
attribute vec4 aTextA; // stage 0 in .xy, stage 1 in .zw
attribute vec4 aTextB; // stage 2 in .xy, stage 3 in .zw

varying float vSeed;

${SIMPLEX_NOISE_3D}

/**
 * Piecewise blend across the shape sequence:
 *   sphere (position) -> aShape1 (cloud) -> aShape2 (grid) -> back to sphere.
 *
 * A chain of clamped mixes rather than dynamic indexing, because GLSL cannot
 * index attributes at runtime. Each mix only engages once the previous one has
 * saturated, so at t=1.5 the first is fully applied and the second is halfway —
 * which is exactly a piecewise interpolation, for the cost of three mixes.
 * The final leg returns to the position attribute, so three buffers cover
 * four phases.
 */
vec3 shapeAt(float t) {
  vec3 p = position;
  p = mix(p, aShape1, clamp(t, 0.0, 1.0));
  p = mix(p, aShape2, clamp(t - 1.0, 0.0, 1.0));
  p = mix(p, position, clamp(t - 2.0, 0.0, 1.0));
  return p;
}

/** Same clamped-mix trick across the four letterform targets. */
vec2 textTargetAt(float stage) {
  vec2 p = aTextA.xy;
  p = mix(p, aTextA.zw, clamp(stage, 0.0, 1.0));
  p = mix(p, aTextB.xy, clamp(stage - 1.0, 0.0, 1.0));
  p = mix(p, aTextB.zw, clamp(stage - 2.0, 0.0, 1.0));
  return p;
}

/**
 * The field lives inside a group rotated +45deg about z, which is what turns the
 * lattice phase into a diagonal matrix. Text has to survive that, so it is
 * pre-rotated by -45deg here and comes out upright once the group transform is
 * applied. (The spin on x/y is separately eased to rest from the CPU side while
 * text is held — a shader cannot undo an accumulating object rotation.)
 */
vec2 unrotate45(vec2 p) {
  const float C = 0.70710678118;
  return vec2(p.x * C + p.y * C, -p.x * C + p.y * C);
}

void main() {
  // Per-particle stagger inside the current transition. Without it every
  // particle departs and arrives on the same frame, which reads as one rigid
  // object deforming instead of a field reorganising.
  float m = clamp(uMorph, 0.0, uMorphMax);
  float phase = floor(m);
  float f = fract(m);
  float local = clamp((f - aSeed * uStagger) / max(1e-4, 1.0 - uStagger), 0.0, 1.0);
  float t = phase + smoothstep(0.0, 1.0, local);

  vec3 base = shapeAt(t);

  // Noise is sampled from the *sphere* position, not the morphed one, so each
  // particle keeps a stable drift signature through the morph and the field
  // does not develop artefacts where the grid bunches points together.
  float nt = uTime * 0.18;
  vec3 field = position * 0.9 + vec3(aSeed * 4.0);
  vec3 drift = vec3(
    snoise(field + vec3(nt, 0.0, 0.0)),
    snoise(field + vec3(0.0, nt, 0.0)),
    snoise(field + vec3(0.0, 0.0, nt))
  );

  // Drift opens up a little as the scroll narrative advances.
  float amp = uDriftAmp * (0.6 + uProgress * 0.8);

  // ...but is damped hard near the lattice phase. At full amplitude the drift
  // (~0.115 world units at that scroll position) is more than 3x the lattice
  // spacing (2.2 / 64 ~= 0.035), which erases the structure completely and
  // leaves the grid looking like another cloud. Damping lets it resolve.
  float gridness = 1.0 - abs(clamp(t, 1.0, 3.0) - 2.0);
  amp *= mix(1.0, 0.12, gridness);

  // And removed entirely once text is forming: drift on the order of a stroke
  // width is exactly what makes particle typography unreadable.
  amp *= 1.0 - uTextMorph;

  vec3 idle = base + drift * amp;

  // Letterform target. Depth is a thin per-particle spread rather than a flat
  // plane, so the text still catches the perspective and does not look pasted on.
  vec2 flat2d = unrotate45(textTargetAt(uTextStage)) * uTextScale;
  vec3 textPos = vec3(flat2d, (aSeed - 0.5) * uTextDepth);

  vec3 displaced = mix(idle, textPos, uTextMorph);

  // Scatter, applied on top of the blend rather than between the two shapes.
  // Interpolating letterform A straight into letterform B reads as text
  // sliding; pushing every particle out along its own sphere normal first and
  // letting it fall back in reads as the field coming apart. Branchless: at
  // uScatter = 0 this is a no-op. position is on a shell of r >= 1.4, so the
  // normalize can never see a zero vector.
  displaced += normalize(position) * uScatter * (0.5 + aSeed * 1.5);

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Same 0.003 -> 0.008 -> 0.005 curve as before, but the pulse is damped while
  // text is held: fat soft points blur the letterforms into illegibility.
  float size = uBaseSize + sin(uProgress * PI) * uPulse * (1.0 - uTextMorph * 0.75);
  size *= 0.75 + aSeed * 0.5;

  gl_PointSize = size * uPixelRatio * (uScale / -mvPosition.z);

  vSeed = aSeed;
}
`;

/**
 * Fragment shader.
 *
 * Holds the red -> white transition that used to be material.color.setRGB()
 * per frame, now a single mix on uProgress. Points are drawn as soft discs
 * rather than the hard squares PointsMaterial gave, which is what makes Bloom
 * read as a glow instead of a grid of bright squares.
 */
export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
uniform float uProgress;
uniform float uOpacity;
uniform float uGain;
uniform float uTextMorph;
uniform float uBurst;

varying float vSeed;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Solid core with a soft rim. The inner stop is deliberately not near 0:
  // a falloff all the way to the centre drops the average alpha well below the
  // hard square PointsMaterial used to draw, which reads as the whole field
  // getting dimmer. It tightens further while text is held, for crisper edges.
  float inner = mix(0.2, 0.34, uTextMorph);
  float alpha = smoothstep(0.5, inner, dist);

  vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0), uProgress);

  // Push cores above 1.0 so they clear Bloom's luminance threshold. The
  // composer runs on half-float buffers, so >1 survives to the bloom pass
  // instead of being clipped at the render target. Range starts at 1.0, so no
  // particle ends up dimmer than before, and scaling red past 1 clamps back to
  // pure red on display — it intensifies the colour rather than shifting it.
  color *= uGain * (1.0 + vSeed * 0.8);

  // Letterforms have to be read, not merely sensed, so opacity is lifted while
  // text is held instead of staying on the scroll-driven curve. The burst gets
  // most of the same lift: at the peak of a scatter uTextMorph is 0, and on the
  // plain curve the dispersing particles faded out so far that the transition
  // read as the text vanishing rather than coming apart.
  float lift = max(uTextMorph, uBurst * 0.8);
  float opacity = mix(uOpacity, min(1.0, uOpacity + 0.5), lift);

  gl_FragColor = vec4(color, alpha * opacity);
}
`;
