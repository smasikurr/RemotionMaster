import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * LiquidInkSpreadLumaMatte4K
 * High-contrast black fractal ink droplets blossoming on white background as transition luma matte.
 * 4K UHD (3840x2160) @ 60 FPS, 8s transition (480 frames).
 */
export const LiquidInkSpreadLumaMatte4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineCap = "round";

    const drops = [
      { start: 0, x: 0.5, y: 0.5, maxR: 2600, speed: 1.2 },
      { start: 30, x: 0.35, y: 0.4, maxR: 1800, speed: 1.0 },
      { start: 50, x: 0.65, y: 0.55, maxR: 1900, speed: 1.1 },
      { start: 80, x: 0.25, y: 0.65, maxR: 1600, speed: 0.9 },
      { start: 110, x: 0.75, y: 0.35, maxR: 1700, speed: 1.0 },
      { start: 140, x: 0.5, y: 0.25, maxR: 1500, speed: 0.8 },
      { start: 170, x: 0.5, y: 0.75, maxR: 1500, speed: 0.8 },
      { start: 200, x: 0.15, y: 0.3, maxR: 1400, speed: 0.9 },
      { start: 220, x: 0.85, y: 0.7, maxR: 1400, speed: 0.9 },
    ];

    drops.forEach((drop, dIdx) => {
      const localFrame = frame - drop.start;
      if (localFrame > 0) {
        const progress = Math.min(1, (localFrame / 220) * drop.speed);
        const radius = progress * drop.maxR;
        const cx = width * drop.x;
        const cy = height * drop.y;

        ctx.beginPath();
        const steps = 72;
        for (let s = 0; s <= steps; s++) {
          const angle = (s / steps) * Math.PI * 2;
          const wobble =
            Math.sin(angle * 7 + dIdx * 3) * (radius * 0.12) +
            Math.sin(angle * 13 + dIdx * 5) * (radius * 0.06) +
            Math.cos(angle * 19) * (radius * 0.03);
          const r = radius + wobble;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;

          if (s === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.fill();

        const numTendrils = 14 + (dIdx % 6);
        for (let t = 0; t < numTendrils; t++) {
          const tAngle = (t / numTendrils) * Math.PI * 2 + dIdx * 0.4;
          const tLen = radius * (1.1 + (t % 3) * 0.15);
          const tx = cx + Math.cos(tAngle) * tLen;
          const ty = cy + Math.sin(tAngle) * tLen;

          ctx.beginPath();
          ctx.arc(tx, ty, Math.max(3, radius * 0.04), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }, [frame, width, height]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
