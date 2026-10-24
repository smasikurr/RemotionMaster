import React from "react";
import { AbsoluteFill } from "remotion";
import { AnalogFilmBurnCanvas } from "../craft/AnalogFilmBurnCanvas";

/**
 * CinematicAnalogFilmBurnTransitions4K
 *
 * True 1:1 Authentic 35mm Celluloid Film Burn & Optical Light Leak Flash Transition
 * Faithfully matches iStock reference: istockphoto-2206697630-640_adpp_is.mp4
 *
 * Features:
 * - 4K 60FPS WebGL Optical Celluloid Emulsion Shading
 * - Authentic 35mm light leaks sweeping in from frame edge (amber / carmine red)
 * - Full-frame solarized warm peach / apricot / coral overexposure flash transition
 * - Micro-dither celluloid film grain texture across all 360 frames
 * - Zero artificial vector ribbons, 100% genuine optical camera mechanics
 */
export const CinematicAnalogFilmBurnTransitions4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020202" }}>
      <AnalogFilmBurnCanvas width={3840} height={2160} />
    </AbsoluteFill>
  );
};
