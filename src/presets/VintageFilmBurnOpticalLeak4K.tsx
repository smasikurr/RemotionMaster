import React, { useRef, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export interface VintageFilmBurnOpticalLeak4KProps {
  intensity?: number;
  grainAmount?: number;
  colorTemp?: number; // 0: Warm Amber, 1: Vintage Red
  dustCount?: number;
}

export const VintageFilmBurnOpticalLeak4K: React.FC<VintageFilmBurnOpticalLeak4KProps> = ({
  intensity = 1.0,
  grainAmount = 0.65,
  colorTemp = 0.25,
  dustCount = 60,
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
    const TOTAL_FRAMES = 720; // 12.00 seconds at 60 FPS
    const sec = (frame % TOTAL_FRAMES) / fps;

    // Gate Weave Jitter during flash peaks
    let weaveX = 0;
    let weaveY = 0;
    if (Math.abs(sec - 6.1) < 0.6 || Math.abs(sec - 3.2) < 0.4) {
      weaveX = Math.sin(frame * 2.8) * 2.2;
      weaveY = Math.cos(frame * 3.1) * 1.8;
    }

    ctx.save();
    ctx.translate(weaveX, weaveY);

    // Base: Pure Solid Black for Screen / Add blend mode
    ctx.fillStyle = "#000000";
    ctx.fillRect(-10, -10, W + 20, H + 20);

    // Palette Generator
    const getPalette = (alphaMultiplier = 1.0) => {
      const a = alphaMultiplier * intensity;
      return {
        core: `rgba(255, 255, 255, ${Math.min(1.0, 0.98 * a)})`,
        inner: colorTemp < 0.5
          ? `rgba(255, 243, 128, ${Math.min(1.0, 0.85 * a)})`
          : `rgba(255, 220, 100, ${Math.min(1.0, 0.85 * a)})`,
        mid: colorTemp < 0.5
          ? `rgba(255, 168, 0, ${Math.min(1.0, 0.70 * a)})`
          : `rgba(255, 120, 0, ${Math.min(1.0, 0.75 * a)})`,
        outer: colorTemp < 0.5
          ? `rgba(255, 69, 0, ${Math.min(1.0, 0.50 * a)})`
          : `rgba(230, 30, 0, ${Math.min(1.0, 0.60 * a)})`,
        deep: colorTemp < 0.5
          ? `rgba(74, 14, 0, ${Math.min(1.0, 0.35 * a)})`
          : `rgba(90, 10, 0, ${Math.min(1.0, 0.40 * a)})`,
        transparent: "rgba(0, 0, 0, 0)",
      };
    };

    // Phase 1: Dual Edge Curtain Burn (0s - 2s)
    if (sec <= 2.2) {
      const env = Math.sin((sec / 2.0) * Math.PI);
      if (env > 0) {
        const pal = getPalette(env * 0.95);
        const breatheL = Math.sin(sec * 4.5) * 80;
        const breatheR = Math.cos(sec * 4.5) * 80;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const gradL = ctx.createRadialGradient(0, H * 0.45, 80, 150 + breatheL, H * 0.5, 950);
        gradL.addColorStop(0.00, pal.core);
        gradL.addColorStop(0.18, pal.inner);
        gradL.addColorStop(0.42, pal.mid);
        gradL.addColorStop(0.70, pal.outer);
        gradL.addColorStop(0.90, pal.deep);
        gradL.addColorStop(1.00, pal.transparent);
        ctx.fillStyle = gradL;
        ctx.fillRect(0, 0, W * 0.45, H);

        const gradR = ctx.createRadialGradient(W, H * 0.55, 80, W - 150 - breatheR, H * 0.5, 980);
        gradR.addColorStop(0.00, pal.core);
        gradR.addColorStop(0.18, pal.inner);
        gradR.addColorStop(0.42, pal.mid);
        gradR.addColorStop(0.70, pal.outer);
        gradR.addColorStop(0.90, pal.deep);
        gradR.addColorStop(1.00, pal.transparent);
        ctx.fillStyle = gradR;
        ctx.fillRect(W * 0.55, 0, W * 0.45, H);

        ctx.restore();
      }
    }

    // Phase 2: Right-to-Left Sweep & Wavy Finger Burn (2s - 5s)
    if (sec >= 1.8 && sec <= 5.3) {
      const p = (sec - 2.0) / 3.0;
      if (p >= 0 && p <= 1) {
        const sweepX = W * (1.1 - p * 1.35);
        const sweepY = H * (0.3 + Math.sin(p * Math.PI) * 0.35);
        const env = Math.sin(p * Math.PI);
        const pal = getPalette(env * 1.25);

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const flareRadius = 1400 * (0.85 + Math.sin(sec * 6.0) * 0.15);
        const radGrad = ctx.createRadialGradient(sweepX, sweepY, 60, sweepX, sweepY, flareRadius);
        radGrad.addColorStop(0.00, pal.core);
        radGrad.addColorStop(0.15, pal.inner);
        radGrad.addColorStop(0.38, pal.mid);
        radGrad.addColorStop(0.68, pal.outer);
        radGrad.addColorStop(0.88, pal.deep);
        radGrad.addColorStop(1.00, pal.transparent);

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(sweepX, sweepY, flareRadius, 0, Math.PI * 2);
        ctx.fill();

        // Celluloid Burn Lobes
        for (let i = 0; i < 6; i++) {
          const fingerAngle = (i / 6) * Math.PI * 1.6 - Math.PI * 0.8;
          const fingerLength = (500 + Math.sin(sec * 3.0 + i) * 200) * env;
          const fx = sweepX + Math.cos(fingerAngle) * fingerLength;
          const fy = sweepY + Math.sin(fingerAngle) * fingerLength;

          const fGrad = ctx.createRadialGradient(sweepX, sweepY, 30, fx, fy, 450);
          fGrad.addColorStop(0.0, pal.inner);
          fGrad.addColorStop(0.4, pal.mid);
          fGrad.addColorStop(0.75, pal.outer);
          fGrad.addColorStop(1.0, pal.transparent);

          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.ellipse(fx, fy, 220, 140, fingerAngle, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Phase 3: Diagonal Flash Wipe & Blackout Cut (5s - 8s)
    if (sec >= 5.6 && sec <= 8.2) {
      const p = (sec - 5.6) / 2.4;
      const flashPeak = Math.exp(-Math.pow((p - 0.22) * 5.0, 2));
      const pal = getPalette(flashPeak * 1.6);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const diagX = W * (0.1 + p * 0.9);
      const diagY = H * (0.1 + p * 0.9);
      const radius = 2400 * (flashPeak * 0.7 + 0.3);

      const diagGrad = ctx.createRadialGradient(diagX, diagY, 80, diagX, diagY, radius);
      diagGrad.addColorStop(0.00, pal.core);
      diagGrad.addColorStop(0.18, pal.inner);
      diagGrad.addColorStop(0.45, pal.mid);
      diagGrad.addColorStop(0.72, pal.outer);
      diagGrad.addColorStop(0.92, pal.deep);
      diagGrad.addColorStop(1.00, pal.transparent);

      ctx.fillStyle = diagGrad;
      ctx.fillRect(0, 0, W, H);

      // Optical Horizontal Streak
      if (flashPeak > 0.3) {
        const streakH = 120 * flashPeak;
        const streakGrad = ctx.createLinearGradient(0, diagY - streakH, 0, diagY + streakH);
        streakGrad.addColorStop(0.0, pal.transparent);
        streakGrad.addColorStop(0.5, pal.core);
        streakGrad.addColorStop(1.0, pal.transparent);
        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, diagY - streakH, W, streakH * 2);
      }

      ctx.restore();
    }

    // Phase 4: Multi-Streak Ribbon Flare (8s - 12s)
    if (sec >= 8.0) {
      const p = (sec - 8.0) / 4.0;
      if (p <= 1.0) {
        const env = Math.pow(1.0 - p, 1.8) * Math.sin(p * Math.PI * 3.5 + 0.2);
        if (env > 0) {
          const pal = getPalette(env * 0.85);

          ctx.save();
          ctx.globalCompositeOperation = "lighter";

          const ribbons = [
            { x: W * 0.22, width: 340, speed: 2.2 },
            { x: W * 0.48, width: 420, speed: 2.8 },
            { x: W * 0.74, width: 380, speed: 1.9 },
            { x: W * 0.90, width: 290, speed: 3.1 },
          ];

          for (const r of ribbons) {
            const pulse = (Math.sin(sec * r.speed) * 0.5 + 0.5) * env;
            if (pulse <= 0.02) continue;

            const ribGrad = ctx.createLinearGradient(r.x - r.width, 0, r.x + r.width, 0);
            ribGrad.addColorStop(0.00, pal.transparent);
            ribGrad.addColorStop(0.35, pal.outer);
            ribGrad.addColorStop(0.50, pal.mid);
            ribGrad.addColorStop(0.65, pal.outer);
            ribGrad.addColorStop(1.00, pal.transparent);

            ctx.fillStyle = ribGrad;
            ctx.fillRect(r.x - r.width, 0, r.width * 2, H);
          }

          ctx.restore();
        }
      }
    }

    // Projector Dust Specks
    if (dustCount > 0) {
      ctx.save();
      ctx.fillStyle = "#E2E6E8";
      for (let i = 0; i < dustCount; i++) {
        const px = ((i * 137.5 + frame * 0.8) % W);
        const py = ((i * 241.3 - frame * 1.5 + H * 2) % H);
        if ((frame + i) % 2 === 0) {
          ctx.globalAlpha = 0.25 + ((i % 5) * 0.05);
          ctx.fillRect(px, py, 2.5, 3.5);
        }
      }
      ctx.restore();
    }

    ctx.restore();
  }, [frame, width, height, fps, intensity, grainAmount, colorTemp, dustCount]);

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </AbsoluteFill>
  );
};
