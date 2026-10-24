import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HeroStaging } from "../craft/HeroStaging";
import { KineticEnergyCore } from "../craft/KineticEnergyCore";

/**
 * EliteHeroMotionShowcase4K
 * Demonstrates the V2 Self-Learning Motion Design Standard:
 * - 100% Solid Flat Black (#000000) base, zero gradients.
 * - Commanding Visual Hierarchy: Centered Hero subject dominating 70% of visual weight.
 * - Complete absence of generic corner dummy text / HUD clutter.
 * - Organic Anticipation & Harmonic Idle Breathing.
 * - Seamless 600-frame 10-second loop at 4K 60 FPS.
 */
export const EliteHeroMotionShowcase4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Master fade loop (frame 0 to 15 fade in, frame 585 to 600 fade out for perfect seamless loop)
  const masterFade = interpolate(frame, [0, 15, 585, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: "100%", height: "100%", opacity: masterFade }}>
      <HeroStaging width={width} height={height} ambientGrid={true}>
        <KineticEnergyCore
          primaryColor="#00E5FF"
          secondaryColor="#7C4DFF"
          size={720}
        />
      </HeroStaging>
    </div>
  );
};
