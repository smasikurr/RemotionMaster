import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface RoyalSapphireSilkFluidWavesCanvasProps {
  seed?: number;
}

export const RoyalSapphireSilkFluidWavesCanvas: React.FC<RoyalSapphireSilkFluidWavesCanvasProps> = ({
  seed = 53,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mathematical 10.0s seamless loop (600 frames)
    const loopPeriod = 600;
    const loopPhase = (frame % loopPeriod) / loopPeriod;
    const loopAngle = loopPhase * Math.PI * 2;

    // Base background gradient: Deep Obsidian Midnight Navy
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#02071E');
    bgGrad.addColorStop(0.5, '#05113B');
    bgGrad.addColorStop(1, '#02061A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Helper: 2D Simplex/Harmonic Surface Height Equation
    const evaluateSurfaceHeight = (u: number, v: number) => {
      // Diagonal wave flow along u + v
      const diag = u * 2.8 + v * 1.6;

      // Closed loop harmonic components
      const w1 = Math.sin(diag * 3.5 + Math.cos(loopAngle) * 1.8 + Math.sin(loopAngle) * 1.2);
      const w2 = Math.cos(diag * 6.2 - Math.sin(loopAngle) * 2.2 + u * 1.5) * 0.55;
      const w3 = Math.sin((u - v) * 4.0 + Math.cos(loopAngle * 2) * 0.8) * 0.35;
      const w4 = Math.sin(u * 9.0 + v * 8.0 + Math.sin(loopAngle) * 1.5) * 0.15;

      return (w1 + w2 + w3 + w4) * 0.5; // -1.0 to 1.0
    };

    // Render 3D Silk Drapery Folds using Multi-Layered Spline Ribbons
    const ribbonCount = 28;
    const steps = 80;

    for (let r = 0; r < ribbonCount; r++) {
      const vBase = r / ribbonCount;
      const pts: [number, number, number][] = []; // x, y, elevation

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const hVal = evaluateSurfaceHeight(u, vBase);

        // Project onto canvas: Diagonal sweeping cloth ribbon
        const screenX = (u * 1.3 - 0.15) * width;
        const screenY = (vBase * 1.25 - 0.12) * height + hVal * (height * 0.18);

        pts.push([screenX, screenY, hVal]);
      }

      // Draw Ribbon Fold Surface
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.lineTo(pts[steps][0], height + 100);
      ctx.lineTo(pts[0][0], height + 100);
      ctx.closePath();

      // Royal Sapphire Silk Gradient with Azure Sheen
      const rGrad = ctx.createLinearGradient(0, pts[0][1] - 80, width, pts[steps][1] + 80);
      rGrad.addColorStop(0, '#040F3C');
      rGrad.addColorStop(0.25, '#0C2B82');
      rGrad.addColorStop(0.50, '#1E63D6');
      rGrad.addColorStop(0.70, '#42A5F5');
      rGrad.addColorStop(0.85, '#85D4FF');
      rGrad.addColorStop(1, '#081D58');

      ctx.fillStyle = rGrad;
      ctx.fill();

      // Silky Specular Highlight Edge (Crest Normal Glint)
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = 'rgba(165, 230, 255, 0.45)';
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.stroke();

      ctx.restore();
    }

    // Micro-Sheen Satin Texture Overlay
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.15;
    const vigGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      width * 0.15,
      width * 0.5,
      height * 0.5,
      width * 0.85
    );
    vigGrad.addColorStop(0, '#FFFFFF');
    vigGrad.addColorStop(0.6, '#38B6FF');
    vigGrad.addColorStop(1, '#000000');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }, [frame, width, height, seed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};
