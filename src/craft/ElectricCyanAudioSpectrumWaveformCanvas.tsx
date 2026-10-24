import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";

export interface ElectricCyanAudioSpectrumWaveformCanvasProps {
  width?: number;
  height?: number;
  numBars?: number;
  style?: React.CSSProperties;
}

export const ElectricCyanAudioSpectrumWaveformCanvas: React.FC<ElectricCyanAudioSpectrumWaveformCanvasProps> = ({
  width = 3840,
  height = 2160,
  numBars = 68,
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Pure Pitch-Black Void
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const cy = Math.floor(height / 2);
    const marginX = 380;
    const spanW = width - 2 * marginX;
    const barPitch = spanW / numBars;
    const tSec = frame / 60.0;

    // Deterministic PRNG
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9973.123 + Math.floor(tSec * 14.0) * 1337.54) * 43758.5453;
      return x - Math.floor(x);
    };

    // Calculate bar heights
    const barData: { x: number; h: number; bw: number }[] = [];
    for (let i = 0; i < numBars; i++) {
      const u = i / (numBars - 1);
      const x = marginX + i * barPitch + barPitch * 0.5;

      // Full-width natural audio envelope
      const env = 0.35 + 0.65 * Math.pow(Math.sin(u * Math.PI), 0.7);
      const wave =
        Math.abs(
          Math.sin(i * 0.36 + tSec * 4.0) * 0.55 +
            Math.cos(i * 0.22 - tSec * 2.8) * 0.45 +
            Math.sin(i * 0.85 + tSec * 5.8) * 0.35 +
            Math.cos(i * 1.30 - tSec * 4.6) * 0.25
        ) / 1.6;

      const jitter = 0.68 + seededRandom(i * 97) * 0.82;
      const h = Math.max(22.0, env * wave * jitter * 290.0);
      const bw = Math.max(6.0, Math.min(28.0, h * 0.14));

      barData.push({ x, h, bw });
    }

    // PASS 1: Broad Radiant Cyan Ambient Bloom
    ctx.save();
    ctx.shadowColor = "rgba(0, 229, 255, 0.95)";
    ctx.shadowBlur = 60;
    ctx.fillStyle = "rgba(0, 215, 255, 0.55)";

    for (let i = 0; i < numBars; i++) {
      const { x, h, bw } = barData[i];
      const yTop = cy - h;
      const yBot = cy + h;

      ctx.beginPath();
      ctx.moveTo(x - bw * 1.65, cy);
      ctx.lineTo(x, yTop - 14);
      ctx.lineTo(x + bw * 1.65, cy);
      ctx.lineTo(x, yBot + 14);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // PASS 2: Medium Electric Ice-Blue Flare
    ctx.save();
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 28;
    ctx.fillStyle = "#38bdf8";

    for (let i = 0; i < numBars; i++) {
      const { x, h, bw } = barData[i];
      const yTop = cy - h;
      const yBot = cy + h;

      ctx.beginPath();
      ctx.moveTo(x - bw, cy);
      ctx.lineTo(x, yTop);
      ctx.lineTo(x + bw, cy);
      ctx.lineTo(x, yBot);
      ctx.closePath();
      ctx.fill();
    }

    // Luminous horizontal laser baseline
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(marginX - 15, cy);
    ctx.lineTo(width - marginX + 15, cy);
    ctx.stroke();
    ctx.restore();

    // PASS 3: Razor-Sharp Hot White Core & Needle Flares
    ctx.save();
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < numBars; i++) {
      const { x, h, bw } = barData[i];
      const innerBw = Math.max(2.4, bw * 0.45);
      const innerH = h * 0.78;

      ctx.beginPath();
      ctx.moveTo(x - innerBw, cy);
      ctx.lineTo(x, cy - innerH);
      ctx.lineTo(x + innerBw, cy);
      ctx.lineTo(x, cy + innerH);
      ctx.closePath();
      ctx.fill();

      // Optical laser needle flares for prominent peaks
      if (h > 110.0) {
        const needleH = h * 0.45;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, cy - h - needleH);
        ctx.lineTo(x, cy + h + needleH);
        ctx.stroke();

        // Tip cross glints
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 9, cy - h);
        ctx.lineTo(x + 9, cy - h);
        ctx.moveTo(x - 9, cy + h);
        ctx.lineTo(x + 9, cy + h);
        ctx.stroke();
      }
    }

    // Incandescent white core baseline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(marginX - 15, cy);
    ctx.lineTo(width - marginX + 15, cy);
    ctx.stroke();
    ctx.restore();
  }, [frame, width, height, numBars]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};
