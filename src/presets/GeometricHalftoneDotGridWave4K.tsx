import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface GeometricHalftoneDotGridWave4KProps {
  dotSpacing?: number;
  maxRadius?: number;
  minRadius?: number;
  waveDisp?: number;
  waveFreq?: number;
  squircleAmount?: number;
}

/**
 * GeometricHalftoneDotGridWave4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-contrast monochrome geometric halftone dot grid undulating in 3D radial waves.
 * Perfectly calibrated for Adobe Stock, Vecteezy, and Shutterstock motion backgrounds.
 */
export const GeometricHalftoneDotGridWave4K: React.FC<GeometricHalftoneDotGridWave4KProps> = ({
  dotSpacing = 50,
  maxRadius = 15.5,
  minRadius = 1.8,
  waveDisp = 22.0,
  waveFreq = 3.8,
  squircleAmount = 0.35,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = width;
    const H = height;
    const CX = W / 2;
    const CY = H / 2;
    const TOTAL_FRAMES = 720;
    const TOTAL_DURATION = 12.000;
    const LOOP_CYCLES = 4; // 4 integer wave cycles -> 100% seamless loop
    const OMEGA = (LOOP_CYCLES * Math.PI * 2) / TOTAL_DURATION;

    const t = (frame % TOTAL_FRAMES) / fps;

    // 1. Pure Pitch Black Base (#000000)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // 2. Halftone Dot Grid Calculations
    const cols = Math.ceil(W / dotSpacing) + 2;
    const rows = Math.ceil(H / dotSpacing) + 2;
    const startX = (W - (cols - 1) * dotSpacing) / 2;
    const startY = (H - (rows - 1) * dotSpacing) / 2;

    const maxD = Math.sqrt(CX * CX + CY * CY);
    const k = (waveFreq * Math.PI * 2) / maxD;
    const p = 3.2;

    for (let r = 0; r < rows; r++) {
      const basePy = startY + r * dotSpacing;

      for (let c = 0; c < cols; c++) {
        const basePx = startX + c * dotSpacing;

        const dx = basePx - CX;
        const dy = basePy - CY;

        const dCirc = Math.sqrt(dx * dx + dy * dy);
        const dSquircle = Math.pow(
          Math.pow(Math.abs(dx * 1.0), p) + Math.pow(Math.abs(dy * 1.777), p),
          1.0 / p
        );

        const dist = (1.0 - squircleAmount) * dCirc + squircleAmount * dSquircle;

        const phi1 = dist * k - OMEGA * t;
        const w1 = Math.sin(phi1);

        const phi2 = (dx * 0.707 + dy * 0.707) * k * 0.65 - OMEGA * t;
        const w2 = Math.sin(phi2) * 0.28;

        const waveVal = (w1 + w2) / 1.28;

        // Non-linear elevation shaping for sharp optical halftone contrast
        const elevation = (waveVal + 1.0) * 0.5;
        const shapedElev = Math.pow(elevation, 1.85);

        // Dot radius modulation
        const radius = minRadius + (maxRadius - minRadius) * shapedElev;

        // Lateral displacement towards wave crests
        const dispMagnitude = waveDisp * Math.cos(phi1);
        const normDist = dCirc > 0.001 ? dCirc : 1.0;
        const px = basePx + (dx / normDist) * dispMagnitude;
        const py = basePy + (dy / normDist) * dispMagnitude;

        // Color & Opacity: Crisp White (#FFFFFF) to Soft Gray (#A0A0A0)
        const alpha = 0.20 + 0.80 * shapedElev;
        const grayVal = Math.round(160 + (255 - 160) * shapedElev);

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${grayVal}, ${grayVal}, ${grayVal}, ${alpha})`;
        ctx.fill();

        // Core highlight for bright dots
        if (radius > 8.5) {
          ctx.beginPath();
          ctx.arc(px, py, radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.fill();
        }
      }
    }
  }, [frame, width, height, fps, dotSpacing, maxRadius, minRadius, waveDisp, waveFreq, squircleAmount]);

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000000" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};
