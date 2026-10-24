import React from "react";
import { AbsoluteFill } from "remotion";
import { OpticalDiamondFlareCanvas } from "../craft/OpticalDiamondFlareCanvas";

/**
 * CinematicDiamondStarburstFlare4K
 *
 * True 1:1 Optical Anamorphic Diamond Starburst Lens Flare & Starlight Burst
 * Faithfully matches iStock reference: istockphoto-2205679137-640_adpp_is.mp4
 *
 * Features:
 * - 4K 60FPS WebGL Optical Shading
 * - Razor-sharp horizontal needle beam with soft edge falloff
 * - Vertical diffraction spike with realistic lens falloff
 * - Short 45° and 135° chromatic rainbow dispersion fans (amber / cyan)
 * - Brilliant diamond-shaped specular core with organic scintillation
 * - 100% Solid Pure Black #000000 background for seamless Screen / Add blending
 */
export const CinematicDiamondStarburstFlare4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <OpticalDiamondFlareCanvas width={3840} height={2160} />
    </AbsoluteFill>
  );
};
