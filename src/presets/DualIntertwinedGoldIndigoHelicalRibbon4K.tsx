import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ConcentricNeonRadarArcsCanvas } from "../craft/ConcentricNeonRadarArcsCanvas";

/**
 * DualIntertwinedGoldIndigoHelicalRibbon4K (Video 34)
 * 1:1 Recreation of reference: istockphoto-2201244782-640_adpp_is.mp4
 *
 * Subject: Concentric Glowing Neon Circular Radar Arcs HUD Loader in Warm Gold & Indigo Blue
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (600 frames / 10.0s)
 * - 100% Solid Pure Black #000000 base
 * - Concentric glowing neon circular tracks with alternating rotation directions
 * - Tail-to-head luminescence taper and white-hot specular cores
 * - Center bullseye glowing ring and pulsating core dot
 * - 4 corner zones strictly pure black (lum = 0.000)
 */
export const DualIntertwinedGoldIndigoHelicalRibbon4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        width,
        height,
        overflow: "hidden",
      }}
    >
      <ConcentricNeonRadarArcsCanvas
        width={width}
        height={height}
        frame={frame}
        fps={fps}
      />
    </AbsoluteFill>
  );
};
