import React from "react";
import { useVideoConfig } from "remotion";
import { TheatricalVolumetricSpotlightCanvas } from "../craft/TheatricalVolumetricSpotlightCanvas";

/**
 * QuantumPlexusEnergyPillar4K (Rebuilt as 1:1 Theatrical Volumetric Spotlight)
 * Stock Motion Graphics Video 05/81
 * Reference: istockphoto-1284702817-640_adpp_is.mp4 (14.1s)
 *
 * 1:1 Authentic Re-creation:
 * - Vertical theatrical stage spotlight beam descending from ceiling
 * - Ice-cyan / incandescent white core with royal blue volumetric light striations (God rays)
 * - Glowing specular elliptical reflection hotspot on the stage floor
 * - Hundreds of illuminated micro-dust motes and floating particles swirling gently in the beam
 * - 100% Solid Pure #000000 background for effortless Screen / Add compositing
 */
export const QuantumPlexusEnergyPillar4K: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <TheatricalVolumetricSpotlightCanvas width={width} height={height} />
    </div>
  );
};
