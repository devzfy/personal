"use client";

import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

interface SceneEffectsProps {
  /** False on small screens — mipmap Bloom is the expensive pass here. */
  enableBloom: boolean;
  bloomIntensity: number;
}

/**
 * Postprocessing stack, kept in its own module so React.lazy can split the
 * `postprocessing` bundle out of the initial load.
 *
 * On the Bloom threshold: pure red has a relative luminance of 0.2126, and these
 * particles are small and semi-transparent, so their composited value on black
 * lands well under any conventional threshold — Bloom would do nothing at all.
 * The fragment shader therefore pushes core brightness above 1.0 (the composer
 * runs half-float buffers, so that survives), and the threshold sits at 0.2 so
 * only those cores bloom while the soft rims do not. The per-particle gain
 * spread means a subset glows rather than the whole field hazing over.
 *
 * The composer tree is branched instead of using a conditional child, because
 * @react-three/postprocessing introspects EffectComposer's children to build the
 * pass chain and a null in that list is a needless risk.
 */
export default function SceneEffects({
  enableBloom,
  bloomIntensity,
}: SceneEffectsProps) {
  // Grain: SCREEN rather than OVERLAY. On a near-black backdrop OVERLAY leaves
  // the noise invisible; SCREEN lifts it just enough to read as film grain.
  const grain = (
    <Noise
      premultiply
      blendFunction={BlendFunction.SCREEN}
      opacity={0.03}
    />
  );

  // Deliberately weak. Hero already paints a DOM inset shadow vignette over the
  // canvas (`shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]`) plus a black top/bottom
  // gradient; a conventional 0.5 darkness here stacked with those and visibly
  // dimmed the whole field. High offset + low darkness adds edge falloff
  // without a second helping of the same effect.
  const vignette = <Vignette offset={0.5} darkness={0.28} eskil={false} />;

  if (!enableBloom) {
    // multisampling={0} — nothing in this scene has geometric edges that MSAA
    // would help, and it is a real cost on the devices that land here.
    return (
      <EffectComposer multisampling={0}>
        {grain}
        {vignette}
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.6}
      />
      {grain}
      {vignette}
    </EffectComposer>
  );
}
