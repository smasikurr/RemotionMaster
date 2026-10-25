import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { RoyalSapphireSilkFluidWavesCanvas } from "../craft/RoyalSapphireSilkFluidWavesCanvas";

/**
 * RoyalSapphireSilkFluidWaves4K (Video 53)
 * 1:1 Recreation of reference: istockphoto-2235740763-640_adpp_is.mp4
 *
 * Subject: Full-Frame Cinematic Royal Sapphire Silk Fluid Drapery Waves
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (600 frames / 10.0s seamless loop)
 * - Full-frame undulating royal sapphire silk fabric folds with diagonal drapery
 * - Cyan-ice grazing specular crest sheen and deep ocean midnight navy troughs
 * - Broadcast Rec.709 compliant, smooth 60fps CFR
 */
export const RoyalSapphireSilkFluidWaves4K: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030826",
        width,
        height,
        overflow: "hidden",
      }}
    >
      <RoyalSapphireSilkFluidWavesCanvas
        width={width}
        height={height}
        speed={0.35}
        scale={1.0}
        brightness={1.0}
      />
    </AbsoluteFill>
  );
};
