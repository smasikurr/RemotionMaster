import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";

export interface StudioWhiteAudioSpectrumWaveformCanvasProps {
  width?: number;
  height?: number;
  barCount?: number;
  barWidth?: number;
  barSpacing?: number;
  color?: string;
  backgroundColor?: string;
  maxHeight?: number;
}

function pseudoNoise(t: number, seed: number): number {
  return (
    0.45 * Math.sin(t * 3.1 + seed * 2.7) +
    0.35 * Math.sin(t * 6.3 + seed * 5.1) +
    0.20 * Math.cos(t * 13.2 + seed * 8.9)
  );
}

// Global dynamic speech/music envelope (always alive with vibrant rhythmic pulses)
function getGlobalRhythm(t: number): number {
  // Continuous energetic cadence with periodic syncopated beats
  const beat =
    0.72 +
    0.18 * Math.sin(t * Math.PI * 3.5) +
    0.10 * Math.cos(t * Math.PI * 7.0);

  // Periodic breath dips (troughs)
  const breath = Math.sin(t * 1.25) * Math.cos(t * 0.85);
  const breathFactor = breath < -0.45 ? 0.35 : 1.0;

  return Math.min(1.0, Math.max(0.35, beat * breathFactor));
}

export const StudioWhiteAudioSpectrumWaveformCanvas: React.FC<StudioWhiteAudioSpectrumWaveformCanvasProps> = ({
  width = 3840,
  height = 2160,
  barCount = 45,
  barWidth = 30,
  barSpacing = 82,
  color = "#ffffff",
  backgroundColor = "#000000",
  maxHeight = 1320,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Solid pitch black background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const cy = height / 2;
    const totalW = (barCount - 1) * barSpacing;
    const startX = (width - totalW) / 2;
    const t = frame / 60; // seconds

    ctx.fillStyle = color;

    const rhythm = getGlobalRhythm(t);

    for (let i = 0; i < barCount; i++) {
      const x = startX + i * barSpacing;
      const u = i / (barCount - 1); // 0.0 to 1.0

      // Traveling harmonic standing waves across bass, mid, and treble
      const w1 = Math.sin(u * Math.PI * 4.8 + t * 4.2);
      const w2 = Math.cos(u * Math.PI * 7.2 - t * 5.6);
      const w3 = Math.sin(u * Math.PI * 2.8 + t * 2.1);
      const w4 = Math.cos(u * Math.PI * 11.0 + t * 7.8);

      // Packet amplitude profile
      let packet =
        0.42 * (w1 * w1) +
        0.30 * (w2 * w2) +
        0.18 * (w3 * w3) +
        0.10 * (w4 * w4);

      // Gentle edge window so leftmost and rightmost bars don't clip harshly
      const edge = Math.sin(u * Math.PI);
      packet *= 0.35 + 0.65 * Math.pow(edge, 0.35);

      // High frequency vocal flutter
      const jitter = 0.82 + 0.32 * pseudoNoise(t * 16.0, i * 3.77);

      const amp = Math.min(1.0, Math.max(0.0, rhythm * packet * jitter));

      if (amp < 0.16) {
        // Silent / quiet trough: crisp circular baseline dot
        const dotR = 8;
        ctx.beginPath();
        ctx.arc(x, cy, dotR, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Active vertical audio bar
        const barH = 70 + amp * (maxHeight - 70);
        const halfH = barH / 2;
        const r = barWidth / 2;

        ctx.beginPath();
        ctx.roundRect(x - r, cy - halfH, barWidth, barH, r);
        ctx.fill();
      }
    }
  }, [frame, width, height, barCount, barWidth, barSpacing, color, backgroundColor, maxHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        backgroundColor: backgroundColor,
      }}
    />
  );
};
