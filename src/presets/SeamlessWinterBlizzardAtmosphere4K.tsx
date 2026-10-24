import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const SeamlessWinterBlizzardAtmosphere4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const totalFrames = 600;

  // Synthesize 360 dynamic blizzard particles across 3 depth tiers
  const particles = useMemo(() => {
    const list = [];
    const count = 360;

    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 15.123 + 45.678) * 43758.5453;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.sin(i * 28.456 + 89.101) * 23421.631;
      const r2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 63.789 + 12.345) * 31415.926;
      const r3 = seed3 - Math.floor(seed3);

      const depth = r1 < 0.6 ? 0 : r1 < 0.9 ? 1 : 2;

      let radius = 1.8 + r2 * 2.2;
      let speedY = 4.0 + r3 * 2.5;
      let speedX = 3.5 + r2 * 3.0; // Diagonal wind storm
      let opacity = 0.4 + r2 * 0.3;
      let streakLength = 8 + r3 * 16;

      if (depth === 1) {
        radius = 4.0 + r2 * 3.5;
        speedY = 7.0 + r3 * 3.5;
        speedX = 6.0 + r2 * 4.0;
        opacity = 0.7 + r2 * 0.25;
        streakLength = 20 + r3 * 28;
      } else if (depth === 2) {
        radius = 8.0 + r2 * 6.0;
        speedY = 11.0 + r3 * 5.0;
        speedX = 9.0 + r2 * 5.0;
        opacity = 0.5 + r2 * 0.3;
        streakLength = 40 + r3 * 45;
      }

      // Seamless loop loop counts
      const wrapHeight = height + 200;
      const wrapWidth = width + 400;

      const numLoopsY = Math.max(1, Math.round((speedY * totalFrames) / wrapHeight));
      const exactSpeedY = (numLoopsY * wrapHeight) / totalFrames;

      const numLoopsX = Math.max(1, Math.round((speedX * totalFrames) / wrapWidth));
      const exactSpeedX = (numLoopsX * wrapWidth) / totalFrames;

      const startX = r2 * wrapWidth - 200;
      const startY = r3 * wrapHeight - 100;

      list.push({
        id: i,
        startX,
        startY,
        exactSpeedX,
        exactSpeedY,
        radius,
        opacity,
        streakLength,
        depth,
      });
    }
    return list;
  }, [width, height, totalFrames]);

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
          <filter id="blizzardGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {particles.map((p) => {
          const wrapHeight = height + 200;
          const wrapWidth = width + 400;

          const curY = ((p.startY + p.exactSpeedY * frame + 100) % wrapHeight) - 100;
          const curX = ((p.startX + p.exactSpeedX * frame + 200) % wrapWidth) - 200;

          // Blizzard wind angle (~35 degrees)
          const angleRad = (35 * Math.PI) / 180;
          const x2 = curX - Math.sin(angleRad) * p.streakLength;
          const y2 = curY - Math.cos(angleRad) * p.streakLength;

          return (
            <line
              key={p.id}
              x1={curX}
              y1={curY}
              x2={x2}
              y2={y2}
              stroke="#FFFFFF"
              strokeWidth={p.radius * 1.5}
              strokeLinecap="round"
              opacity={p.opacity}
              filter={p.depth === 2 ? "url(#blizzardGlow)" : undefined}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
