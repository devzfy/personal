/**
 * Cursor trail, drawn as a tail of fading points rather than a line or ribbon.
 *
 * Two reasons it is points and not a line: WebGL ignores `linewidth` on
 * virtually every platform, so a THREE.Line trail is stuck at one pixel; and a
 * point tail shares the field's own visual language, so Bloom treats it as more
 * of the same glowing dots instead of a solid band laid over them.
 *
 * aIndex is 0 at the head and uCount-1 at the tail, so both size and alpha can
 * taper along the trail from a single attribute.
 */
export const TRAIL_VERTEX_SHADER = /* glsl */ `
uniform float uPixelRatio;
uniform float uScale;
uniform float uHeadSize;
uniform float uCount;

attribute float aIndex;

varying float vFade;

void main() {
  float fade = 1.0 - aIndex / max(1.0, uCount - 1.0);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // pow biases the taper toward the head, so the trail has a bright tip and a
  // long thin wake rather than a uniform stripe.
  gl_PointSize = uHeadSize * pow(fade, 1.5) * uPixelRatio * (uScale / -mvPosition.z);

  vFade = fade;
}
`;

export const TRAIL_FRAGMENT_SHADER = /* glsl */ `
uniform float uProgress;
uniform float uGain;

varying float vFade;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  float alpha = smoothstep(0.5, 0.1, dist) * pow(vFade, 1.4);

  // Tracks the field's red -> white transition but only partway, so the trail
  // stays the warm accent at every scroll position instead of going white.
  vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0), uProgress * 0.65);

  gl_FragColor = vec4(color * uGain, alpha);
}
`;
