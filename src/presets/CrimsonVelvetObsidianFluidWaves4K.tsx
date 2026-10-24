import React from "react";
import { AbsoluteFill } from "remotion";
import { CrimsonVelvetFluidWavesCanvas } from "../craft/CrimsonVelvetFluidWavesCanvas";

/**
 * CrimsonVelvetObsidianFluidWaves4K
 *
 * True 1:1 Volumetric Crimson Velvet & Midnight Obsidian Satin Fluid Waves
 * Faithfully matches iStock reference: istockphoto-2216000586-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (900 frames / 15.0s seamless loop)
 * - 4K WebGL Harmonic Fluid Vector Field Shading
 * - Rich deep crimson red velvet folds with specular ruby crest highlights
 * - Secondary midnight steel-blue / obsidian drapery shadows
 * - Deep inky black void base for premium microstock compositing
 * - Zero artificial flat line strokes, 100% pure procedural mathematical craft
 */
export const CrimsonVelvetObsidianFluidWaves4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020204" }}>
      <CrimsonVelvetFluidWavesCanvas width={3840} height={2160} />
    </AbsoluteFill>
  );
};
