import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HeroStaging } from "../craft/HeroStaging";

/**
 * MinimalOscilloscopeWaveform4K - Stock Motion Graphics Video 02/81
 * Reference: istockphoto-1192608139-640_adpp_is.mp4 (15.0s)
 *
 * Strict Fix based on User Feedback:
 * 1. ZERO LEFT-TO-RIGHT DRIFT! Stationary in-place vertical bouncing only!
 * 2. EXACT COLOR PALETTE AS IS: Authentic monochromatic studio silver-white rods with specular caps
 * 3. NO extra curved squiggly lines!
 * 4. ZERO blobs or background gradients (100% Solid Pure #000000 base)
 * 5. 100% Centered on 4K canvas (Cx: 0.50, Cy: 0.50)
 * 6. Structured keyframed musical dynamics ("Aga Gora Matha")
 */
export const MinimalOscilloscopeWaveform4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  // Hero container bounded strictly to central safe viewport
  const heroW = 2800;
  const heroH = 1000;
  const centerX = heroW * 0.5;
  const centerY = heroH * 0.5;

  const time = frame / fps;

  // =========================================================================
  // STRUCTURED KEYFRAMED MOTION ENVELOPE ("AGA GORA MATHA")
  // =========================================================================
  const dynamicKeyframeAmp = interpolate(
    frame,
    [0, 60, 140, 210, 260, 340, 420, 500, 560, 600],
    [0.18, 0.55, 0.80, 1.30, 0.80, 0.35, 0.90, 1.25, 0.40, 0.18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Transient audio flutter kick
  const audioKick = Math.pow(Math.max(0, Math.sin(time * 9.5)), 8) * 0.45;
  const totalAmp = dynamicKeyframeAmp * (1.0 + audioKick);

  // High-density vertical frequency bars (72 bars)
  const barCount = 72;
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const normDist = (i - (barCount - 1) / 2) / ((barCount - 1) / 2);
      const absDist = Math.abs(normDist);
      const envelope = Math.exp(-Math.pow(absDist * 1.9, 2));

      // Fixed pseudo-random seed per bar to PREVENT left-to-right traveling wave
      const seed = Math.sin(i * 997.3) * 1000.0;
      const f1 = 8.0 + (i % 5) * 3.1;
      const f2 = 14.0 + (i % 7) * 2.7;

      return { id: i, normDist, absDist, envelope, seed, f1, f2 };
    });
  }, [barCount]);

  const barHeights = useMemo(() => {
    return bars.map((b) => {
      // IN-PLACE VERTICAL BOUNCING: NO traveling horizontal wave term!
      const pulse1 = Math.abs(Math.sin(time * b.f1 + b.seed));
      const pulse2 = Math.abs(Math.cos(time * b.f2 + b.seed * 1.3));
      const flutter = Math.sin(time * 36.0 + b.seed) * 0.15;

      const rawVal = (pulse1 * 0.60 + pulse2 * 0.30 + flutter + audioKick) * b.envelope * totalAmp;
      return Math.max(6, rawVal * 360);
    });
  }, [bars, time, totalAmp, audioKick]);

  return (
    <HeroStaging width={width} height={height} ambientGrid={false}>
      <div
        style={{
          width: heroW,
          height: heroH,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg
          width={heroW}
          height={heroH}
          viewBox={`0 0 ${heroW} ${heroH}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            {/* Specular Glow Filters */}
            <filter id="studioGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="sharpCore" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="softBloom" />
              <feMerge>
                <feMergeNode in="softBloom" />
                <feMergeNode in="sharpCore" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Monochromatic Bar Gradient */}
            <linearGradient id="monoBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#888888" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Layer 1: Studio Horizon Axis Line */}
          <line
            x1={centerX - 1100}
            y1={centerY}
            x2={centerX + 1100}
            y2={centerY}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={1.5}
            strokeDasharray="4 8"
          />

          {/* Layer 2: Stationary In-Place Vertical Oscilloscope Bars */}
          <g filter="url(#studioGlow)">
            {bars.map((b, idx) => {
              const h = barHeights[idx];
              const bx = (heroW - (barCount * 17)) * 0.5 + idx * 17;
              return (
                <g key={`b-${b.id}`}>
                  <rect
                    x={bx}
                    y={centerY - h / 2}
                    width={5.5}
                    height={h}
                    rx={2.5}
                    fill="url(#monoBarGrad)"
                    opacity={b.envelope * 0.90 * totalAmp}
                  />
                  {/* Top Cap Dot */}
                  <circle
                    cx={bx + 2.75}
                    cy={centerY - h / 2 - 4}
                    r={2.5}
                    fill="#ffffff"
                    opacity={b.envelope * 0.98 * totalAmp}
                  />
                  {/* Bottom Cap Dot */}
                  <circle
                    cx={bx + 2.75}
                    cy={centerY + h / 2 + 4}
                    r={2.5}
                    fill="#ffffff"
                    opacity={b.envelope * 0.85 * totalAmp}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </HeroStaging>
  );
};
