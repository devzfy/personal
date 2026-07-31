import { SIMPLEX_NOISE_3D } from "./simplexNoise.glsl";

/**
 * Vertex shader for the particle field.
 *
 * Two things used to happen in JS every frame and now happen here:
 *   - the size pulse, previously `material.size = 0.003 + sin(p * PI) * 0.005`
 *   - the point-size attenuation, previously handled by PointsMaterial
 *
 * `gl_PointSize` deliberately reproduces three's own sizeAttenuation formula
 * (`size * pixelRatio * (viewportHeight / 2) / -mvPosition.z`) so swapping
 * PointsMaterial for a ShaderMaterial does not change how large the particles
 * appear. uScale is fed `size.height * 0.5` and uPixelRatio the renderer dpr,
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

attribute float aSeed;
attribute vec3 aShape1;
attribute vec3 aShape2;

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

  vec3 displaced = base + drift * amp;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Same 0.003 -> 0.008 -> 0.003 curve as the imperative version, plus a small
  // per-particle variation so the field is not perfectly uniform.
  float size = uBaseSize + sin(uProgress * PI) * uPulse;
  size *= 0.75 + aSeed * 0.5;

  gl_PointSize = size * uPixelRatio * (uScale / -mvPosition.z);

  vSeed = aSeed;
}
`;

/**
 * Fragment shader.
 *
 * Holds the red -> white transition that used to be `material.color.setRGB()`
 * per frame, now a single mix on uProgress. Points are drawn as soft discs
 * rather than the hard squares PointsMaterial gave, which is what makes Bloom
 * read as a glow instead of a grid of bright squares.
 */
export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
uniform float uProgress;
uniform float uOpacity;
uniform float uGain;

varying float vSeed;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Solid core with a soft rim. The inner stop is deliberately not near 0:
  // a falloff all the way to the centre drops the average alpha well below the
  // hard square PointsMaterial used to draw, which reads as the whole field
  // getting dimmer.
  float alpha = smoothstep(0.5, 0.2, dist);

  vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0), uProgress);

  // Push cores above 1.0 so they clear Bloom's luminance threshold. The
  // composer runs on half-float buffers, so >1 survives to the bloom pass
  // instead of being clipped at the render target. Range starts at 1.0, so no
  // particle ends up dimmer than before, and scaling red past 1 clamps back to
  // pure red on display — it intensifies the colour rather than shifting it.
  color *= uGain * (1.0 + vSeed * 0.8);

  gl_FragColor = vec4(color, alpha * uOpacity);
}
`;
