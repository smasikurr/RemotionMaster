import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * MinimalistTealAudioSpectrumWhite4K - Stock Motion Graphics Video 13/81
 * Reference: istockphoto-1479372672-640_adpp_is.mp4 (15.85s)
 *
 * Strict Stock Quality Directives:
 * 1. 1:1 Pixel-by-Pixel Fidelity to Reference:
 *    - Pure Solid White (#ffffff) studio background
 *    - Deep Teal / Aqua Turquoise (#00897b to #26a69a) audio spectrum bars
 *    - Full canvas width spread (99.0% of canvas width: X from 35px to 3805px in 4K)
 *    - Continuous horizontal horizon zero-axis line at Y=1080
 *    - Stationary in-place vertical rods (anchored to fixed columns, NO horizontal wave drift)
 * 2. 6-Phase Keyframed Musical Dynamic Arc ("Aga Gora Matha")
 * 3. Native 4K UHD 3840x2160 @ 60 FPS
 */
export const MinimalistTealAudioSpectrumWhite4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig(); // 3840 x 2160, 60fps

  const centerY = height / 2; // 1080
  const time = frame / fps;

  // 1. Structured 6-Phase Keyframed Musical Dynamic Arc (600 frames = 10s)
  // Phase 1 (0-60): Intro subtle voice/podcast heartbeat
  // Phase 2 (60-180): Outward energy build
  // Phase 3 (180-300): Climax energetic speech/music drop
  // Phase 4 (300-420): Breakdown groove
  // Phase 5 (420-540): Secondary melodic swell
  // Phase 6 (540-600): Smooth resolve back to loop point
  const phaseEnergy = useMemo(() => {
    if (frame < 60) return interpolate(frame, [0, 60], [0.3, 0.7]);
    if (frame < 180) return interpolate(frame, [60, 180], [0.7, 1.1]);
    if (frame < 300) return 1.25 + Math.sin(frame * 0.1) * 0.25; // Climax swell
    if (frame < 420) return 0.7 + Math.sin(frame * 0.05) * 0.15; // Breakdown
    if (frame < 540) return 0.95 + Math.sin(frame * 0.07) * 0.2; // Secondary swell
    return interpolate(frame, [540, 600], [0.95, 0.3]); // Seamless resolve
  }, [frame]);

  // Outward width activation gating
  const spreadFactor = useMemo(() => {
    if (frame < 60) return 0.5;
    if (frame < 180) return interpolate(frame, [60, 180], [0.5, 1.0]);
    if (frame < 300) return 1.0;
    if (frame < 420) return 0.88;
    if (frame < 540) return 0.96;
    return interpolate(frame, [540, 600], [0.96, 0.5]);
  }, [frame]);

  // 2. 140 Stationary Vertical Equalizer Bars spanning 99.0% of canvas width
  const barCount = 140;
  const startX = 35;
  const endX = width - 35; // 3805
  const colSpacing = (endX - startX) / (barCount - 1); // ~27.12 px
  const barWidth = 14.0; // Bold, crisp minimalist rods

  const bars = useMemo(() => {
    const list: Array<{
      index: number;
      x: number;
      normDist: number;
      seed: number;
      freq: number;
      maxAmp: number;
    }> = [];

    const midIdx = (barCount - 1) / 2;

    for (let i = 0; i < barCount; i++) {
      const x = startX + i * colSpacing;
      const normDist = Math.abs(i - midIdx) / midIdx; // [0 at center, 1 at edges]
      const seed = Math.sin(i * 149.3 + 271.9) * 38291.5453;
      const freq = 1.1 + (Math.sin(i * 0.19) * 0.5 + 0.5) * 3.2;
      // Frequency envelope: taller vocal/mid-range presence with dynamic flanks
      const maxAmp = 180 + Math.sin(normDist * Math.PI) * 360 + (i % 6) * 35;

      list.push({
        index: i,
        x,
        normDist,
        seed: Math.abs(seed) % 100.0,
        freq,
        maxAmp,
      });
    }
    return list;
  }, [barCount, startX, colSpacing]);

  // 3. Compute in-place vertical oscillation for each stationary bar
  const renderedBars = useMemo(() => {
    return bars.map((b) => {
      const isWithinSpread = b.normDist <= spreadFactor;
      const spreadAtten = isWithinSpread
        ? 1.0 - Math.pow(b.normDist / Math.max(0.01, spreadFactor), 3) * 0.25
        : 0.06;

      // In-place vertical bounce (NO horizontal traveling wave)
      const osc = Math.pow(Math.abs(Math.sin(time * b.freq * 2.5 + b.seed)), 1.5);
      const subOsc = Math.sin(time * (b.freq * 1.6) + b.seed * 1.8) * 0.2;
      const combinedBounce = Math.max(0.04, osc + subOsc);

      // Height extending vertically up and down from horizon
      const halfHeight = Math.max(
        10,
        b.maxAmp * combinedBounce * phaseEnergy * spreadAtten
      );

      return {
        x: b.x,
        yTop: centerY - halfHeight,
        height: halfHeight * 2,
        alpha: isWithinSpread ? Math.min(1.0, 0.45 + combinedBounce * 0.55) : 0.12,
      };
    });
  }, [bars, time, phaseEnergy, spreadFactor, centerY]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Deep Teal to Vibrant Aqua Bar Gradient */}
          <linearGradient id="tealBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26a69a" />
            <stop offset="35%" stopColor="#00897b" />
            <stop offset="50%" stopColor="#004d40" />
            <stop offset="65%" stopColor="#00897b" />
            <stop offset="100%" stopColor="#26a69a" />
          </linearGradient>

          {/* Crisp Specular Tip Dot Gradient */}
          <radialGradient id="tealCapGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#80cbc4" />
            <stop offset="100%" stopColor="#00897b" />
          </radialGradient>
        </defs>

        {/* 1. HORIZONTAL HORIZON ZERO-AXIS BASELINE (Spans full canvas width) */}
        <line
          x1={startX}
          y1={centerY}
          x2={endX}
          y2={centerY}
          stroke="#00695c"
          strokeWidth={3.5}
          opacity={0.85}
        />

        {/* 2. STATIONARY IN-PLACE VERTICAL TEAL SPECTRUM BARS */}
        {renderedBars.map((rb, idx) => (
          <g key={`bar-${idx}`}>
            {/* Main Vertical Bar */}
            <rect
              x={rb.x - barWidth / 2}
              y={rb.yTop}
              width={barWidth}
              height={rb.height}
              rx={barWidth / 2}
              ry={barWidth / 2}
              fill="url(#tealBarGrad)"
              opacity={rb.alpha}
            />

            {/* Top Specular Cap Dot */}
            <circle
              cx={rb.x}
              cy={rb.yTop}
              r={barWidth * 0.45}
              fill="url(#tealCapGrad)"
              opacity={rb.alpha}
            />

            {/* Bottom Specular Cap Dot */}
            <circle
              cx={rb.x}
              cy={rb.yTop + rb.height}
              r={barWidth * 0.45}
              fill="url(#tealCapGrad)"
              opacity={rb.alpha}
            />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
