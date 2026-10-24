import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HeroStaging } from "../craft/HeroStaging";

/**
 * ColorfulAudioSpectrumWave4K - Stock Motion Graphics Video 01/81
 * Reference: istockphoto-1124719368-640_adpp_is.mp4 (7.47s)
 *
 * Strict Fix based on User Feedback:
 * 1. ZERO LEFT-TO-RIGHT DRIFT! Stationary in-place vertical frequency bouncing only!
 * 2. EXACT COLOR PALETTE AS IS: Authentic high-contrast silver/white studio rods with specular glow caps (matching the reference video directly)
 * 3. NO extra curved squiggly lines!
 * 4. ZERO blobs or background gradients (100% Solid Pure #000000 base)
 * 5. 100% Centered on 4K canvas (Cx: 0.50, Cy: 0.50)
 * 6. Structured keyframed musical dynamics ("Aga Gora Matha")
 */
export const ColorfulAudioSpectrumWave4K: React.FC = () => {
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
    [0, 60, 120, 180, 225, 270, 360, 420, 480, 540, 600],
    [0.18, 0.60, 0.85, 1.00, 1.40, 0.70, 0.40, 0.85, 1.30, 0.45, 0.18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Musical transient pulse (~128 BPM electronic tempo)
  const bpmRate = (128 / 60) * Math.PI * 2;
  const beatKick = Math.pow(Math.max(0, Math.sin(time * bpmRate)), 6) * 0.45;
  const totalAmp = dynamicKeyframeAmp * (1.0 + beatKick);

  // Number of vertical spectrum rods (64 bars)
  const barCount = 64;
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const normDist = (i - (barCount - 1) / 2) / ((barCount - 1) / 2);
      const absDist = Math.abs(normDist);
      const envelope = Math.exp(-Math.pow(absDist * 1.85, 2));

      // Fixed pseudo-random seed per bar to PREVENT left-to-right traveling wave
      const seed = Math.sin(i * 127.1) * 43758.5453;
      const f1 = 9.0 + (i % 6) * 2.8;
      const f2 = 15.0 + (i % 8) * 3.2;

      return { id: i, normDist, absDist, envelope, seed, f1, f2 };
    });
  }, [barCount]);

  const barHeights = useMemo(() => {
    return bars.map((b) => {
      // IN-PLACE VERTICAL BOUNCING: NO traveling horizontal wave term!
      const pulse1 = Math.abs(Math.sin(time * b.f1 + b.seed));
      const pulse2 = Math.abs(Math.cos(time * b.f2 + b.seed * 1.4));
      const flutter = Math.sin(time * 38.0 + b.seed) * 0.15;

      const rawVal = (pulse1 * 0.55 + pulse2 * 0.35 + flutter + beatKick) * b.envelope * totalAmp;
      return Math.max(6, rawVal * 380);
    });
  }, [bars, time, totalAmp, beatKick]);

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
            <filter id="studioWhiteGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="sharpCore" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="softBloom" />
              <feMerge>
                <feMergeNode in="softBloom" />
                <feMergeNode in="sharpCore" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* High-Contrast Silver/White Studio Rod Gradient */}
            <linearGradient id="silverBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#e0e0e0" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#888888" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Layer 1: Studio Horizon Axis Line */}
          <line
            x1={centerX - 1100}
            y1={centerY}
            x2={centerX + 1100}
            y2={centerY}
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth={1.5}
            strokeDasharray="4 8"
          />

          {/* Layer 2: Stationary In-Place Vertical Spectrum Equalizer Rods */}
          <g filter="url(#studioWhiteGlow)">
            {bars.map((b, idx) => {
              const h = barHeights[idx];
              const bx = (heroW - (barCount * 18)) * 0.5 + idx * 18;
              return (
                <g key={`bar-${b.id}`}>
                  {/* Top Half Rod */}
                  <rect
                    x={bx}
                    y={centerY - h / 2}
                    width={7.0}
                    height={h}
                    rx={3.0}
                    fill="url(#silverBarGrad)"
                    opacity={b.envelope * 0.95 * totalAmp}
                  />
                  {/* Specular White Cap Dot Top */}
                  <circle
                    cx={bx + 3.5}
                    cy={centerY - h / 2 - 4}
                    r={3.0}
                    fill="#ffffff"
                    opacity={b.envelope * 0.98 * totalAmp}
                  />
                  {/* Specular White Cap Dot Bottom */}
                  <circle
                    cx={bx + 3.5}
                    cy={centerY + h / 2 + 4}
                    r={3.0}
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
