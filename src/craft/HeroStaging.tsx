import React from "react";
import { AbsoluteFill } from "remotion";

export interface HeroStagingProps {
  width: number;
  height: number;
  children: React.ReactNode;
  ambientGrid?: boolean;
}

/**
 * HeroStaging Component
 * Enforces elite commercial stock standards:
 * 1. 100% Pure Solid Black (#000000) base with zero gradients.
 * 2. Guaranteed clean borders with generous negative space / breathing room.
 * 3. Pre-configured multi-pass cinematic specular glow filters.
 * 4. Zero corner clutter.
 */
export const HeroStaging: React.FC<HeroStagingProps> = ({
  width,
  height,
  children,
  ambientGrid = true,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Pure solid black base, strictly zero gradient
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          {/* Dual-Pass Cinematic Specular Optical Glow */}
          <filter id="cinematicGlow" x="-50%" y="-50%" width="200%" height="200%">
            {/* Pass 1: Tight specular core */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="coreBlur" />
            {/* Pass 2: Wide atmospheric bloom */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="bloomBlur" />
            <feMerge>
              <feMergeNode in="bloomBlur" />
              <feMergeNode in="coreBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ultra-Soft Atmospheric Bokeh Falloff */}
          <filter id="bokehFalloff" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
          </filter>
        </defs>

        {/* Ambient Subtle Grid Lines (Low contrast 5% opacity for depth without clutter) */}
        {ambientGrid && (
          <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={`h-grid-${i}`}
                x1="0"
                y1={i * 120}
                x2={width}
                y2={i * 120}
                strokeDasharray="4 24"
              />
            ))}
            {Array.from({ length: 32 }).map((_, i) => (
              <line
                key={`v-grid-${i}`}
                x1={i * 120}
                y1="0"
                x2={i * 120}
                y2={height}
                strokeDasharray="4 24"
              />
            ))}
          </g>
        )}
      </svg>

      {/* Central Hero Container with Safe Negative Space */}
      <div
        style={{
          width: width * 0.75, // 75% width leaves 25% clean breathing room
          height: height * 0.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
