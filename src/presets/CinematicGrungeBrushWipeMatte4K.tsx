import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const CinematicGrungeBrushWipeMatte4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Wipe transition from Frame 30 to Frame 240
  const wipeProgress = interpolate(frame, [30, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hold white until Frame 450, then wipe out to black
  const exitProgress = interpolate(frame, [450, 570], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Synthesize 48 dynamic diagonal brush streaks and bristle splatters
  const brushStrokes = useMemo(() => {
    const list = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 14.23 + 89.12) * 43758.5453;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.sin(i * 35.67 + 43.21) * 23421.631;
      const r2 = seed2 - Math.floor(seed2);

      // Offset along diagonal normal (-width to +width)
      const diagOffset = (i / count) * (width + height + 800) - 400;
      const strokeW = 80 + r1 * 120;
      const jitter = (r2 - 0.5) * 80;

      list.push({
        id: i,
        diagOffset,
        strokeW,
        jitter,
        delay: r1 * 40,
      });
    }
    return list;
  }, [width, height]);

  // Overall diagonal displacement calculation
  const totalTravel = width + height + 1200;
  const currentDisplacement = wipeProgress * totalTravel - 600;
  const exitDisplacement = exitProgress * totalTravel;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Pure solid black base, zero gradient
        width,
        height,
        overflow: "hidden",
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
          <filter id="brushRoughness" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Diagonal Grunge Brush Streaks */}
        <g filter="url(#brushRoughness)">
          {brushStrokes.map((s) => {
            const x1 = currentDisplacement + s.diagOffset + s.jitter;
            const y1 = -400;
            const x2 = x1 - (height + 800);
            const y2 = height + 400;

            if (currentDisplacement < s.diagOffset - 600) return null;

            return (
              <line
                key={s.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFFFFF"
                strokeWidth={s.strokeW}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Exit Wipe Layer back to solid black */}
        {exitProgress > 0 && (
          <g filter="url(#brushRoughness)">
            {brushStrokes.map((s) => {
              const x1 = exitDisplacement + s.diagOffset + s.jitter;
              const y1 = -400;
              const x2 = x1 - (height + 800);
              const y2 = height + 400;

              return (
                <line
                  key={`exit-${s.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#000000"
                  strokeWidth={s.strokeW + 20}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
