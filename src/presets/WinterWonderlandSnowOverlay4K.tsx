import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const WinterWonderlandSnowOverlay4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Total duration: 600 frames (10.000s @ 60fps)
  const totalFrames = 600;

  // Synthesize 240 multi-plane snowflake particles with deterministic pseudorandom seed
  const snowflakes = useMemo(() => {
    const list = [];
    const count = 240;

    for (let i = 0; i < count; i++) {
      // Deterministic PRNG
      const seed1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.sin(i * 39.346 + 11.135) * 23421.631;
      const r2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 71.172 + 84.821) * 31415.926;
      const r3 = seed3 - Math.floor(seed3);

      // Depth layers: 0 (distant, small, slow) to 2 (foreground, large, fast, soft blur)
      const depth = r1 < 0.5 ? 0 : r1 < 0.85 ? 1 : 2;

      let radius = 2.5 + r2 * 3; // depth 0
      let speedY = 2.0 + r3 * 1.5;
      let opacity = 0.45 + r2 * 0.3;
      let blur = 0;

      if (depth === 1) {
        radius = 5.5 + r2 * 4;
        speedY = 3.8 + r3 * 2.2;
        opacity = 0.75 + r2 * 0.25;
        blur = 0.5;
      } else if (depth === 2) {
        radius = 12 + r2 * 10;
        speedY = 6.5 + r3 * 3.5;
        opacity = 0.55 + r2 * 0.35;
        blur = 3.5;
      }

      // To guarantee mathematical seamless loop, total vertical travel in 600 frames
      // must be an integer multiple of (height + margin)
      const wrapHeight = height + 160;
      const numLoops = Math.max(1, Math.round((speedY * totalFrames) / wrapHeight));
      const exactSpeedY = (numLoops * wrapHeight) / totalFrames;

      // Initial coordinates
      const startX = r2 * width;
      const startY = r3 * wrapHeight - 80;
      const swayFreq = 1 + Math.floor(r1 * 4); // integer sway cycles for seamless loop
      const swayAmp = 20 + r3 * 35;

      list.push({
        id: i,
        startX,
        startY,
        exactSpeedY,
        swayFreq,
        swayAmp,
        radius,
        opacity,
        blur,
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
          <filter id="snowGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bokehBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>

        {snowflakes.map((flake) => {
          const wrapHeight = height + 160;
          // Mathematical seamless loop calculation
          const currentY =
            ((flake.startY + flake.exactSpeedY * frame + 80) % wrapHeight) - 80;

          // Seamless sinusoidal horizontal wind drift
          const swayPhase = (frame / totalFrames) * Math.PI * 2 * flake.swayFreq;
          const currentX =
            (flake.startX + Math.sin(swayPhase) * flake.swayAmp + width) % width;

          const isBokeh = flake.depth === 2;

          return (
            <circle
              key={flake.id}
              cx={currentX}
              cy={currentY}
              r={flake.radius}
              fill="#FFFFFF"
              opacity={flake.opacity}
              filter={isBokeh ? "url(#bokehBlur)" : flake.depth === 1 ? "url(#snowGlow)" : undefined}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
