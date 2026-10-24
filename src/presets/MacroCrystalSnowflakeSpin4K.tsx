import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const MacroCrystalSnowflakeSpin4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 580, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous gentle rotation (seamless 360 deg or multiple over 600 frames: 600 * 0.6 = 360 deg)
  const spinAngle = (frame * 0.6) % 360;

  // Gentle 3D floating and tilting wobble
  const floatY = Math.sin(frame * 0.04) * 25;
  const tiltX = Math.sin(frame * 0.03) * 6;
  const tiltY = Math.cos(frame * 0.035) * 6;

  // Sparkling crystalline frost facets
  const sparklePhase = (frame * 0.1) % (Math.PI * 2);

  // Background ambient drifting frost micro-crystals
  const backgroundCrystals = useMemo(() => {
    const list = [];
    for (let i = 0; i < 40; i++) {
      const seedX = Math.sin(i * 17.13 + 31.7) * 43758.5453;
      const seedY = Math.sin(i * 53.41 + 19.3) * 23421.631;
      const posX = ((seedX - Math.floor(seedX)) * width);
      const posY = ((seedY - Math.floor(seedY)) * height);
      const size = 3 + (i % 5) * 2;
      const speed = 0.5 + (i % 4) * 0.4;
      list.push({ posX, posY, size, speed, id: i });
    }
    return list;
  }, [width, height]);

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Pure solid black base, zero gradient
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: masterFade,
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
          <filter id="iceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Drifting Frost Particles */}
        <g fill="#E1F5FE">
          {backgroundCrystals.map((c) => {
            const currentY = (c.posY + frame * c.speed * 2) % height;
            const driftX = Math.sin((frame + c.id * 15) * 0.03) * 30;
            const op = Math.sin((frame + c.id * 10) * 0.06) * 0.35 + 0.45;
            return (
              <circle
                key={`frost-${c.id}`}
                cx={c.posX + driftX}
                cy={currentY}
                r={c.size}
                opacity={op}
                filter="url(#iceGlow)"
              />
            );
          })}
        </g>

        {/* MAIN MACRO CRYSTAL SNOWFLAKE */}
        <g
          transform={`translate(${centerX}, ${centerY + floatY}) rotate(${spinAngle})`}
          filter="url(#iceGlow)"
        >
          {/* Hexagonal Core Plate */}
          <polygon
            points={Array.from({ length: 6 })
              .map((_, i) => {
                const angle = (i * 60 * Math.PI) / 180;
                return `${Math.cos(angle) * 70},${Math.sin(angle) * 70}`;
              })
              .join(" ")}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <polygon
            points={Array.from({ length: 6 })
              .map((_, i) => {
                const angle = (i * 60 * Math.PI) / 180;
                return `${Math.cos(angle) * 35},${Math.sin(angle) * 35}`;
              })
              .join(" ")}
            fill="#E0F7FA"
            stroke="#80DEEA"
            strokeWidth="3"
            opacity="0.85"
          />

          {/* 6 Primary Crystalline Arms */}
          {Array.from({ length: 6 }).map((_, armIdx) => {
            const armAngle = armIdx * 60;
            return (
              <g key={`arm-${armIdx}`} transform={`rotate(${armAngle})`}>
                {/* Main Spine */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-460"
                  stroke="#FFFFFF"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Sub-Branch Level 1 (Inner) */}
                <g transform="translate(0, -140)">
                  <line x1="0" y1="0" x2="-80" y2="-50" stroke="#E0F7FA" strokeWidth="4" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="80" y2="-50" stroke="#E0F7FA" strokeWidth="4" strokeLinecap="round" />
                  {/* Micro sub-branches */}
                  <line x1="-50" y1="-31" x2="-65" y2="-10" stroke="#B2EBF2" strokeWidth="2.5" />
                  <line x1="50" y1="-31" x2="65" y2="-10" stroke="#B2EBF2" strokeWidth="2.5" />
                </g>

                {/* Sub-Branch Level 2 (Major Mid) */}
                <g transform="translate(0, -260)">
                  <line x1="0" y1="0" x2="-140" y2="-80" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="140" y2="-80" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Secondary twigs */}
                  <line x1="-80" y1="-45" x2="-110" y2="-20" stroke="#80DEEA" strokeWidth="3" />
                  <line x1="80" y1="-45" x2="110" y2="-20" stroke="#80DEEA" strokeWidth="3" />
                  <line x1="-100" y1="-57" x2="-120" y2="-85" stroke="#E0F7FA" strokeWidth="2.5" />
                  <line x1="100" y1="-57" x2="120" y2="-85" stroke="#E0F7FA" strokeWidth="2.5" />
                </g>

                {/* Sub-Branch Level 3 (Outer) */}
                <g transform="translate(0, -360)">
                  <line x1="0" y1="0" x2="-75" y2="-45" stroke="#E0F7FA" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="75" y2="-45" stroke="#E0F7FA" strokeWidth="3.5" strokeLinecap="round" />
                </g>

                {/* Tip Diamond Crystal */}
                <polygon
                  points="0,-490 -16,-460 0,-430 16,-460"
                  fill="#E0F7FA"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                {/* Glowing Prismatic Diamond at Mid Branch */}
                <polygon
                  points="0,-275 -12,-260 0,-245 12,-260"
                  fill="#80DEEA"
                  opacity={Math.sin(frame * 0.08 + armIdx) * 0.4 + 0.6}
                />
              </g>
            );
          })}

          {/* Center Crystal Core Star */}
          <circle cx="0" cy="0" r="16" fill="#FFFFFF" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
