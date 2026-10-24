import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export interface GrainyTextureSkillProps {
  opacity?: number;
  baseColor?: string;
  baseFrequency?: number;
  numOctaves?: number;
  animate?: boolean;
  blendMode?: "overlay" | "soft-light" | "screen" | "multiply" | "color-dodge";
  style?: React.CSSProperties;
}

/**
 * GrainyTextureSkill
 *
 * Professional High-Density Micro-Grain & Film Texture Layer
 * Extracted & Adapted from cjimmy/grainy-gradients & CSS-Tricks specifications
 *
 * Provides authentic analog film grain, eliminates 8-bit color banding,
 * and adds tactile richness to 4K Remotion compositions.
 */
export const GrainyTextureSkill: React.FC<GrainyTextureSkillProps> = ({
  opacity = 0.08,
  baseColor = "#23272f",
  baseFrequency = 0.85,
  numOctaves = 4,
  animate = true,
  blendMode = "overlay",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const seed = animate ? frame % 60 : 42;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: baseColor,
        pointerEvents: "none",
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity,
          mixBlendMode: blendMode,
          pointerEvents: "none",
        }}
      >
        <filter id={`pro-grain-filter-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.85 0"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#pro-grain-filter-${seed})`}
        />
      </svg>
    </AbsoluteFill>
  );
};
