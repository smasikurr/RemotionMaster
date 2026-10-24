import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * MinimalistPodcastMusicPlayerUI4K - Stock Motion Graphics Video 14/81
 * Reference: istockphoto-1487345486-640_adpp_is.mp4 (6.89s)
 *
 * Strict Stock Quality Directives:
 * 1. 1:1 Pixel-by-Pixel Fidelity to Reference:
 *    - Pure Solid Black (#000000) base for seamless Screen/Add/Luma blending
 *    - Left Modern Pause Button (||) with crisp rounded pill geometry
 *    - Right Studio Audio Spectrum Equalizer Waveform track (84% of canvas width)
 *    - Monochrome Studio Silver-White (#ffffff) with played/unplayed progress fill
 *    - Stationary in-place vertical bouncing rods (NO traveling wave drift)
 * 2. 6-Phase Keyframed Musical Dynamic Arc ("Aga Gora Matha")
 * 3. Native 4K UHD 3840x2160 @ 60 FPS
 */
export const MinimalistPodcastMusicPlayerUI4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig(); // 3840 x 2160, 60fps

  const centerY = height / 2; // 1080
  const time = frame / fps;

  // 1. Structured 6-Phase Musical Dynamic Arc
  const phaseEnergy = useMemo(() => {
    if (frame < 60) return interpolate(frame, [0, 60], [0.35, 0.75]);
    if (frame < 180) return interpolate(frame, [60, 180], [0.75, 1.1]);
    if (frame < 300) return 1.3 + Math.sin(frame * 0.12) * 0.25; // Climax drop
    if (frame < 420) return 0.75 + Math.sin(frame * 0.05) * 0.15; // Breakdown
    if (frame < 540) return 1.0 + Math.sin(frame * 0.08) * 0.2; // Secondary swell
    return interpolate(frame, [540, 600], [1.0, 0.35]); // Seamless resolve
  }, [frame]);

  // Track playback progress (scrubber moves smoothly from 0% to 100% across the 10 seconds)
  const trackProgress = frame / durationInFrames;

  // 2. Geometry Layout (spans from X=320px to X=3520px in 4K UHD)
  // Left: Pause Icon
  const pauseX = 360;
  const pauseBarW = 34;
  const pauseBarH = 260;
  const pauseGap = 32;

  // Right: Audio Waveform Spectrum Bars
  const waveStartX = 560;
  const waveEndX = width - 320; // 3520
  const totalWaveW = waveEndX - waveStartX; // 2960 px
  const barCount = 88;
  const colSpacing = totalWaveW / (barCount - 1); // ~34.02 px
  const barWidth = 16.0;

  const currentScrubberX = waveStartX + trackProgress * totalWaveW;

  const bars = useMemo(() => {
    const list: Array<{
      index: number;
      x: number;
      seed: number;
      freq: number;
      maxAmp: number;
    }> = [];

    for (let i = 0; i < barCount; i++) {
      const x = waveStartX + i * colSpacing;
      const seed = Math.sin(i * 137.9 + 293.1) * 41923.5453;
      const freq = 1.2 + (Math.sin(i * 0.25) * 0.5 + 0.5) * 3.5;
      const normX = i / (barCount - 1);
      // Realistic vocal/podcast frequency curve with dynamic rhythm
      const maxAmp = 120 + Math.sin(normX * Math.PI) * 280 + (i % 5) * 35;

      list.push({
        index: i,
        x,
        seed: Math.abs(seed) % 100.0,
        freq,
        maxAmp,
      });
    }
    return list;
  }, [barCount, waveStartX, colSpacing]);

  // 3. Compute in-place vertical bouncing per bar
  const renderedBars = useMemo(() => {
    return bars.map((b) => {
      // In-place vertical bounce (NO horizontal wave drift)
      const osc = Math.pow(Math.abs(Math.sin(time * b.freq * 2.4 + b.seed)), 1.5);
      const subOsc = Math.sin(time * (b.freq * 1.5) + b.seed * 2.0) * 0.2;
      const combinedBounce = Math.max(0.06, osc + subOsc);

      const halfHeight = Math.max(14, b.maxAmp * combinedBounce * phaseEnergy);

      // Played vs Unplayed State
      const isPlayed = b.x <= currentScrubberX;

      return {
        x: b.x,
        yTop: centerY - halfHeight,
        height: halfHeight * 2,
        isPlayed,
        alpha: isPlayed ? 1.0 : 0.4,
      };
    });
  }, [bars, time, phaseEnergy, currentScrubberX, centerY]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Crisp Specular Glow for Played Elements */}
          <filter id="playerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="playedBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e0e0e0" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <linearGradient id="unplayedBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#808080" />
            <stop offset="50%" stopColor="#505050" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
        </defs>

        {/* 1. LEFT MODERN PAUSE BUTTON (||) */}
        <g>
          {/* Pause Bar 1 */}
          <rect
            x={pauseX}
            y={centerY - pauseBarH / 2}
            width={pauseBarW}
            height={pauseBarH}
            rx={pauseBarW / 2}
            ry={pauseBarW / 2}
            fill="#ffffff"
            filter="url(#playerGlow)"
          />
          {/* Pause Bar 2 */}
          <rect
            x={pauseX + pauseBarW + pauseGap}
            y={centerY - pauseBarH / 2}
            width={pauseBarW}
            height={pauseBarH}
            rx={pauseBarW / 2}
            ry={pauseBarW / 2}
            fill="#ffffff"
            filter="url(#playerGlow)"
          />
        </g>

        {/* 2. AUDIO WAVEFORM SPECTRUM BARS */}
        {renderedBars.map((rb, idx) => (
          <g key={`bar-${idx}`}>
            <rect
              x={rb.x - barWidth / 2}
              y={rb.yTop}
              width={barWidth}
              height={rb.height}
              rx={barWidth / 2}
              ry={barWidth / 2}
              fill={rb.isPlayed ? 'url(#playedBarGrad)' : 'url(#unplayedBarGrad)'}
              opacity={rb.alpha}
              filter={rb.isPlayed && rb.height > 250 ? 'url(#playerGlow)' : undefined}
            />
          </g>
        ))}

        {/* 3. SUBTLE TRACK TIMELINE UNDERPINNING AXIS */}
        <line
          x1={waveStartX}
          y1={centerY}
          x2={waveEndX}
          y2={centerY}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={2}
        />
        <line
          x1={waveStartX}
          y1={centerY}
          x2={currentScrubberX}
          y2={centerY}
          stroke="#ffffff"
          strokeWidth={2.5}
          opacity={0.8}
        />
      </svg>
    </AbsoluteFill>
  );
};
