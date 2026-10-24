import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * StudioCyberAudioSpectrum4K - Stock Motion Graphics Video 11/81
 * Reference: istockphoto-1458621317-640_adpp_is.mp4 (10.04s)
 *
 * Strict Stock Quality Directives (User Rules):
 * 1. 1:1 Pixel-by-Pixel Fidelity to Reference:
 *    - Full canvas width spread (97.4% canvas width: X from 60px to 3780px in 4K)
 *    - 160 stationary in-place vertical rods mirrored symmetrically around center Y=1080
 *    - Studio Electric Cyan / Cyber Blue / Specular White palette
 *    - ZERO blobs (100% pure flat solid black #000000 background)
 *    - ZERO extra curved squiggly lines across bars
 *    - NO left-to-right traveling wave (each rod anchored to fixed column, bouncing vertically in place)
 * 2. Structured 6-Phase Keyframed Musical Dynamic Arc ("Aga Gora Matha")
 * 3. Native 4K UHD 3840x2160 @ 60 FPS
 */
export const StudioCyberAudioSpectrum4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig(); // 3840 x 2160, 60fps

  const centerY = height / 2; // 1080
  const time = frame / fps;

  // 1. Structured 6-Phase Musical Arc (0 to 600 frames = 10.0s)
  // Phase 1 (0-60): Intro minimal bass heartbeat
  // Phase 2 (60-180): Outward expansion & build-up
  // Phase 3 (180-300): CLIMAX BEAT DROP (full width explosion)
  // Phase 4 (300-420): Breakdown groove
  // Phase 5 (420-540): Secondary energetic swell
  // Phase 6 (540-600): Smooth resolve back to loop point
  const phaseEnergy = useMemo(() => {
    if (frame < 60) return interpolate(frame, [0, 60], [0.25, 0.65]);
    if (frame < 180) return interpolate(frame, [60, 180], [0.65, 1.05]);
    if (frame < 300) return 1.25 + Math.sin(frame * 0.12) * 0.25; // Climax drop!
    if (frame < 420) return 0.65 + Math.sin(frame * 0.05) * 0.15; // Breakdown
    if (frame < 540) return 0.95 + Math.sin(frame * 0.08) * 0.20; // Secondary swell
    return interpolate(frame, [540, 600], [0.95, 0.25]); // Seamless loop resolve
  }, [frame]);

  // Width expansion factor (at intro only center bars active, expanding outward to 97.4% full canvas)
  const spreadFactor = useMemo(() => {
    if (frame < 60) return 0.45;
    if (frame < 180) return interpolate(frame, [60, 180], [0.45, 1.0]);
    if (frame < 300) return 1.0;
    if (frame < 420) return 0.85;
    if (frame < 540) return 0.95;
    return interpolate(frame, [540, 600], [0.95, 0.45]);
  }, [frame]);

  // 2. Generate 160 stationary vertical frequency columns across 97.4% of canvas
  const barCount = 160;
  const startX = 60;
  const endX = width - 60; // 3780
  const totalSpan = endX - startX;
  const colSpacing = totalSpan / (barCount - 1); // ~23.39 px
  const barWidth = 9.5; // Crisp, sharp vertical rods

  const bars = useMemo(() => {
    const list: Array<{
      index: number;
      x: number;
      normDistFromCenter: number;
      seed: number;
      freq: number;
      maxAmp: number;
    }> = [];

    const midIdx = (barCount - 1) / 2;

    for (let i = 0; i < barCount; i++) {
      const x = startX + i * colSpacing;
      const normDist = Math.abs(i - midIdx) / midIdx; // [0 at center, 1 at ends]
      const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      // Fixed frequency per column (NO horizontal wave drift)
      const freq = 1.2 + (Math.sin(i * 0.22) * 0.5 + 0.5) * 3.5;
      // Audio frequency response curve: active bass in center, sharp highs at flanks
      const maxAmp = 200 + Math.sin(normDist * Math.PI) * 420 + (i % 7) * 45;

      list.push({
        index: i,
        x,
        normDistFromCenter: normDist,
        seed: Math.abs(seed) % 100.0,
        freq,
        maxAmp,
      });
    }
    return list;
  }, [barCount, startX, colSpacing]);

  // 3. Compute dynamic vertical height for each stationary bar
  const renderedBars = useMemo(() => {
    return bars.map((b) => {
      // Outward active gating based on spreadFactor
      const isWithinSpread = b.normDistFromCenter <= spreadFactor;
      const spreadAttenuation = isWithinSpread
        ? 1.0 - Math.pow(b.normDistFromCenter / Math.max(0.01, spreadFactor), 4) * 0.35
        : 0.08;

      // In-place vertical oscillation (each bar stays at its own fixed X position)
      const osc = Math.pow(Math.abs(Math.sin(time * b.freq * 2.4 + b.seed)), 1.6);
      const secondaryOsc = Math.sin(time * (b.freq * 1.5) + b.seed * 2.1) * 0.25;
      const combinedBounce = Math.max(0.05, osc + secondaryOsc);

      // Height in pixels (mirrored symmetrically up and down from centerY=1080)
      const halfHeight = Math.max(
        12,
        b.maxAmp * combinedBounce * phaseEnergy * spreadAttenuation
      );

      // Color computation based on amplitude and position (matches reference exactly):
      // Quiet bars: Studio slate cyan `rgba(60, 95, 135, 0.45)`
      // Active bars: Electric cyan `rgba(0, 229, 255, 0.95)`
      // Peak tips: Specular white `rgba(240, 255, 255, 1.0)`
      const isPeak = combinedBounce > 0.75 && isWithinSpread;
      const barColor = isPeak
        ? 'url(#peakBarGrad)'
        : b.normDistFromCenter > 0.7
        ? 'url(#outerBarGrad)'
        : 'url(#centerBarGrad)';

      return {
        x: b.x,
        yTop: centerY - halfHeight,
        yBottom: centerY + halfHeight,
        height: halfHeight * 2,
        isPeak,
        isWithinSpread,
        alpha: Math.min(1.0, (0.35 + combinedBounce * 0.65) * phaseEnergy),
        barColor,
      };
    });
  }, [bars, time, phaseEnergy, spreadFactor, centerY]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Active Center Bar Gradient */}
          <linearGradient id="centerBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#0066ff" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#0066ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.95" />
          </linearGradient>

          {/* High Energy Peak Bar Gradient */}
          <linearGradient id="peakBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#80f0ff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#0044ff" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#80f0ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Outer Flank Bar Gradient */}
          <linearGradient id="outerBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00b0ff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#002b80" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00b0ff" stopOpacity="0.85" />
          </linearGradient>

          {/* Specular Cap Bloom Filter */}
          <filter id="capGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. HORIZON AUDIO ZERO-AXIS LINE */}
        <line
          x1={startX}
          y1={centerY}
          x2={endX}
          y2={centerY}
          stroke="rgba(0, 180, 255, 0.25)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
        />

        {/* 2. STATIONARY IN-PLACE VERTICAL AUDIO EQUALIZER RODS */}
        {renderedBars.map((rb, idx) => (
          <g key={`bar-${idx}`}>
            {/* Vertical Bar Body */}
            <rect
              x={rb.x - barWidth / 2}
              y={rb.yTop}
              width={barWidth}
              height={rb.height}
              rx={barWidth / 2}
              ry={barWidth / 2}
              fill={rb.barColor}
              opacity={rb.alpha}
            />

            {/* Specular Top Cap Dot */}
            <circle
              cx={rb.x}
              cy={rb.yTop}
              r={barWidth * 0.55}
              fill="#ffffff"
              opacity={Math.min(1.0, rb.alpha * 1.3)}
              filter={rb.isPeak ? 'url(#capGlow)' : undefined}
            />

            {/* Specular Bottom Cap Dot */}
            <circle
              cx={rb.x}
              cy={rb.yBottom}
              r={barWidth * 0.55}
              fill="#ffffff"
              opacity={Math.min(1.0, rb.alpha * 1.3)}
              filter={rb.isPeak ? 'url(#capGlow)' : undefined}
            />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
