import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const SoftVolumetricSnowfallBokeh4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const totalFrames = 600;

  // Synthesize 180 dreamy bokeh snowflakes & floating optical orbs
  const bokehs = useMemo(() => {
    const list = [];
    const count = 180;

    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 19.345 + 56.789) * 43758.5453;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.sin(i * 42.123 + 23.456) * 23421.631;
      const r2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 88.901 + 67.891) * 31415.926;
      const r3 = seed3 - Math.floor(seed3);

      // Depth layer: 0 (ambient micro-snow), 1 (mid-plane crisp snowflakes), 2 (massive soft bokeh disks)
      const layer = r1 < 0.4 ? 0 : r1 < 0.75 ? 1 : 2;

      let radius = 3 + r2 * 4;
      let speedY = 1.8 + r3 * 1.5;
      let opacity = 0.4 + r2 * 0.3;
      let blur = 0;

      if (layer === 1) {
        radius = 8 + r2 * 6;
        speedY = 3.2 + r3 * 2.0;
        opacity = 0.7 + r2 * 0.25;
        blur = 1.5;
      } else if (layer === 2) {
        radius = 24 + r2 * 32; // Giant dreamy bokeh
        speedY = 5.0 + r3 * 3.0;
        opacity = 0.25 + r2 * 0.35;
        blur = 12 + r3 * 10;
      }

      // Mathematical seamless loop calculation
      const wrapHeight = height + 240;
      const numLoops = Math.max(1, Math.round((speedY * totalFrames) / wrapHeight));
      const exactSpeedY = (numLoops * wrapHeight) / totalFrames;

      const startX = r2 * width;
      const startY = r3 * wrapHeight - 120;
      const swayFreq = 1 + Math.floor(r1 * 3);
      const swayAmp = 25 + r3 * 40;

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
        layer,
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
          <filter id="bokehSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {bokehs.map((b) => {
          const wrapHeight = height + 240;
          const curY = ((b.startY + b.exactSpeedY * frame + 120) % wrapHeight) - 120;
          const swayPhase = (frame / totalFrames) * Math.PI * 2 * b.swayFreq;
          const curX = (b.startX + Math.sin(swayPhase) * b.swayAmp + width) % width;

          return (
            <circle
              key={b.id}
              cx={curX}
              cy={curY}
              r={b.radius}
              fill="#FFFFFF"
              opacity={b.opacity}
              filter={b.layer === 2 ? "url(#bokehSoftGlow)" : undefined}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
