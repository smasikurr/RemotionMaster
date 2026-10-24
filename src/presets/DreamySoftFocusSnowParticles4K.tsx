import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const DreamySoftFocusSnowParticles4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 600;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 580, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Synthesize 180 soft bokeh snow particles across 4 depth tiers
  const bokehFlakes = useMemo(() => {
    const list = [];
    const count = 180;

    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 14.73 + 89.21) * 43758.5453;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.sin(i * 32.19 + 45.67) * 23421.631;
      const r2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 68.45 + 17.89) * 31415.926;
      const r3 = seed3 - Math.floor(seed3);

      // Depth tier 0 to 3
      const tier = r1 < 0.4 ? 0 : r1 < 0.7 ? 1 : r1 < 0.9 ? 2 : 3;

      let radius = 4 + r2 * 4;
      let blurTier = 1;
      let opacity = 0.5 + r3 * 0.35;
      let speedMulti = 1;

      if (tier === 1) {
        radius = 9 + r2 * 7;
        blurTier = 2;
        opacity = 0.45 + r3 * 0.3;
        speedMulti = 1.6;
      } else if (tier === 2) {
        radius = 18 + r2 * 14;
        blurTier = 3;
        opacity = 0.35 + r3 * 0.25;
        speedMulti = 2.4;
      } else if (tier === 3) {
        radius = 35 + r2 * 25; // Large foreground bokeh orbs
        blurTier = 4;
        opacity = 0.22 + r3 * 0.18;
        speedMulti = 3.5;
      }

      // Mathematical seamless looping speed: wrapHeight must divide integer multiples
      const wrapHeight = height + 300;
      const baseCycles = 1 + tier;
      const exactSpeedY = (baseCycles * wrapHeight) / totalFrames;

      list.push({
        id: i,
        startX: r1 * width,
        startY: r2 * wrapHeight,
        radius,
        blurTier,
        opacity,
        exactSpeedY,
        swayAmp: 25 + r3 * 40,
        swayFreq: 1 + (i % 3),
        pulseSpeed: 0.05 + r2 * 0.04,
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
          <filter id="bokeh1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="bokeh2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <filter id="bokeh3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
          </filter>
          <filter id="bokeh4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" />
          </filter>
        </defs>

        {bokehFlakes.map((b) => {
          const wrapHeight = height + 300;
          const currentY =
            ((b.startY + b.exactSpeedY * frame + 150) % wrapHeight) - 150;

          // Sinusoidal horizontal drift
          const swayPhase = (frame / totalFrames) * Math.PI * 2 * b.swayFreq;
          const currentX =
            (b.startX + Math.sin(swayPhase) * b.swayAmp + width) % width;

          // Gentle luminance breathing
          const pulse = Math.sin(frame * b.pulseSpeed + b.id) * 0.15;
          const finalOp = Math.max(0.05, Math.min(1, b.opacity + pulse));

          const filterUrl = `url(#bokeh${b.blurTier})`;

          return (
            <circle
              key={`bokeh-snow-${b.id}`}
              cx={currentX}
              cy={currentY}
              r={b.radius}
              fill="#FFFFFF"
              opacity={finalOp}
              filter={filterUrl}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
