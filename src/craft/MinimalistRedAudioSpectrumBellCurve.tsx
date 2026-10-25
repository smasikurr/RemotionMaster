import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface MinimalistRedAudioSpectrumBellCurveProps {
  barCount?: number;
  color?: string;
  glow?: boolean;
}

export const MinimalistRedAudioSpectrumBellCurve: React.FC<
  MinimalistRedAudioSpectrumBellCurveProps
> = ({ barCount = 62, color = '#ff1e2d', glow = true }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const time = frame / 60.0;

  // Exact reference geometry
  const totalSpan = 3100; // 80.7% of 3840 screen width
  const startX = (width - totalSpan) / 2;
  const stepX = totalSpan / (barCount - 1);
  const barWidth = 18;
  const barRadius = barWidth / 2;
  const baselineY = 1260; // 58.3% of 2160 screen height
  const minHeight = 36; // Exact resting pill height in wings

  // Gaussian Bell Curve parameters
  const centerIdx = (barCount - 1) / 2; // 30.5
  const baseSigma = 6.4;

  // Smooth audio harmonic rhythms & breathing pulses
  // Beat pulsation at ~124 BPM
  const bpm = 124;
  const beatPeriod = 60 / bpm;
  const beatPhase = (time % beatPeriod) / beatPeriod;
  const kick = Math.exp(-beatPhase * 3.5) * 0.22;

  // Organic audio modulations
  const wave1 = Math.sin(time * 3.8) * 0.14;
  const wave2 = Math.sin(time * 7.2) * 0.08;
  const wave3 = Math.cos(time * 1.6) * 0.12;

  // Total amplitude multiplier
  const totalAmp = Math.max(0.65, 0.88 + kick + wave1 + wave2 + wave3);

  // Peak height reaches ~1120px in center
  const maxPeakHeight = 1120;

  const bars = Array.from({ length: barCount }, (_, i) => {
    const x = startX + i * stepX;

    const distFromCenter = Math.abs(i - centerIdx);

    // Subtle width breathing of the bell curve
    const sigma = baseSigma * (1.0 + Math.sin(time * 2.5) * 0.04);

    // Pure mathematical normal distribution envelope (smooth bell curve, no jagged noise)
    const gaussian = Math.exp(-Math.pow(distFromCenter, 2) / (2 * Math.pow(sigma, 2)));

    // Subtle traveling wave across the bell curve
    const waveRipple = Math.sin(time * 8.0 - distFromCenter * 0.25) * 0.04 * gaussian;

    // Calculate bar height
    const dynamicHeight = gaussian * maxPeakHeight * totalAmp + waveRipple * maxPeakHeight;
    const finalHeight = Math.max(minHeight, dynamicHeight);

    // Bar rises upward from baseline
    const y = baselineY - finalHeight;

    return {
      x,
      y,
      height: finalHeight,
    };
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: 'block',
          filter: glow
            ? 'drop-shadow(0px 0px 6px rgba(255, 30, 45, 0.65)) drop-shadow(0px 0px 20px rgba(255, 30, 45, 0.30))'
            : 'none',
        }}
      >
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x - barWidth / 2}
            y={bar.y}
            width={barWidth}
            height={bar.height}
            rx={barRadius}
            ry={barRadius}
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
};
