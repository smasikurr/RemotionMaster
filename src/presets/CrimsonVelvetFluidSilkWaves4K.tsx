import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CrimsonVelvetFluidWavesCanvas } from "../craft/CrimsonVelvetFluidWavesCanvas";

/**
 * CrimsonVelvetFluidSilkWaves4K (Video 36)
 * 1:1 Recreation of reference: istockphoto-2203153538-640_adpp_is.mp4
 *
 * Subject: Full-Frame Cinematic Deep Crimson Velvet Fabric & Silk Waves
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (900 frames / 15.0s seamless loop)
 * - Full-frame undulating crimson velvet fabric folds with diagonal drapery
 * - Micro-fiber grazing velvet sheen and deep wine/burgundy shadows
 * - Zero blue/green contamination — pure rich monochromatic crimson
 */
export const CrimsonVelvetFluidSilkWaves4K: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0003",
        width,
        height,
        overflow: "hidden",
      }}
    >
      <CrimsonVelvetFluidWavesCanvas
        width={width}
        height={height}
        speed={0.35}
        scale={1.0}
        brightness={1.0}
      />
    </AbsoluteFill>
  );
};
