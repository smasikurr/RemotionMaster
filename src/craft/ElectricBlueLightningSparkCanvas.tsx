import React, { useEffect, useMemo, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface ElectricBlueLightningSparkCanvasProps {
  seed?: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  birthFrame: number;
  lifespan: number;
}

export const ElectricBlueLightningSparkCanvas: React.FC<ElectricBlueLightningSparkCanvasProps> = ({
  seed = 51,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Precompute electrical sparks
  const sparks = useMemo(() => {
    let s = seed * 8888;
    const rnd = () => {
      s = (s * 16807 + 11) % 2147483647;
      return (s - 1) / 2147483646;
    };

    const list: Spark[] = [];
    // 5 strike events: f=20, f=85, f=155, f=225, f=285
    const strikeFrames = [20, 85, 155, 225, 285];

    for (const sf of strikeFrames) {
      for (let i = 0; i < 45; i++) {
        const ang = -Math.PI * (0.05 + rnd() * 0.9); // upward fountain
        const spd = 6 + rnd() * 22;
        list.push({
          x: width * (0.48 + (rnd() - 0.5) * 0.08),
          y: height * 0.82,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          radius: 1.5 + rnd() * 3.5,
          birthFrame: sf + Math.floor(rnd() * 4),
          lifespan: 12 + Math.floor(rnd() * 16),
        });
      }
    }
    return list;
  }, [width, height, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Pure Pitch Black Void Background (#000000 for Screen/Add overlay)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 5 Distinct Strike Windows
    // Strike 1: Frames 18 to 32
    // Strike 2: Frames 82 to 96
    // Strike 3: Frames 150 to 166
    // Strike 4: Frames 220 to 238
    // Strike 5: Frames 280 to 298
    const strikeWindows = [
      { start: 18, end: 32 },
      { start: 82, end: 96 },
      { start: 150, end: 166 },
      { start: 220, end: 238 },
      { start: 280, end: 298 },
    ];

    let activeStrike: { start: number; end: number } | null = null;
    for (const sw of strikeWindows) {
      if (frame >= sw.start && frame <= sw.end) {
        activeStrike = sw;
        break;
      }
    }

    // Helper: Fractal Midpoint Displacement Lightning Generator
    const generateFractalLightning = (
      p1: [number, number],
      p2: [number, number],
      disp: number,
      minDisp: number,
      pts: [number, number][]
    ) => {
      if (disp < minDisp) {
        pts.push(p2);
        return;
      }

      const midX = (p1[0] + p2[0]) * 0.5;
      const midY = (p1[1] + p2[1]) * 0.5;
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      // Deterministic PRNG based on coordinates & frame
      const pseudoHash = Math.sin(p1[0] * 12.9898 + p2[1] * 78.233 + frame * 37.719) * 43758.5453;
      const offset = ((pseudoHash - Math.floor(pseudoHash)) - 0.5) * disp;

      const newMid: [number, number] = [midX + nx * offset, midY + ny * offset];

      generateFractalLightning(p1, newMid, disp * 0.52, minDisp, pts);
      generateFractalLightning(newMid, p2, disp * 0.52, minDisp, pts);
    };

    // Helper: Draw Glowing Lightning Path
    const drawGlowingLightning = (
      points: [number, number][],
      coreWidth: number,
      alpha: number
    ) => {
      if (alpha <= 0.05 || points.length < 2) return;

      ctx.save();
      ctx.globalAlpha = Math.min(1.0, alpha);
      ctx.globalCompositeOperation = 'screen';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Pass 1: Wide Deep Blue Outer Glow
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.lineWidth = coreWidth * 12;
      ctx.strokeStyle = 'rgba(0, 70, 255, 0.45)';
      ctx.stroke();

      // Pass 2: Vivid Electric Cyan Inner Halo
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.lineWidth = coreWidth * 4.5;
      ctx.strokeStyle = 'rgba(0, 235, 255, 0.85)';
      ctx.stroke();

      // Pass 3: Searing Pure White Core Bolt
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.lineWidth = coreWidth;
      ctx.strokeStyle = 'rgba(255, 255, 255, 1.0)';
      ctx.stroke();

      ctx.restore();
    };

    // 2. Render Lightning if Active
    if (activeStrike) {
      const strikeAge = frame - activeStrike.start;
      const strikeDuration = activeStrike.end - activeStrike.start;

      // Realistic high-frequency lightning flicker (strike on/off/dim)
      const isFlickerOn = strikeAge % 3 !== 2;
      if (isFlickerOn) {
        const alpha = Math.max(0.4, 1.0 - (strikeAge / strikeDuration) * 0.6);

        // Main vertical bolt trunk
        const startPt: [number, number] = [
          width * (0.49 + Math.sin(frame * 1.5) * 0.02),
          height * 0.22,
        ];
        const endPt: [number, number] = [
          width * (0.495 + Math.cos(frame * 2.1) * 0.025),
          height * 0.82,
        ];

        const mainPoints: [number, number][] = [startPt];
        generateFractalLightning(startPt, endPt, 320, 18, mainPoints);
        drawGlowingLightning(mainPoints, 7.5, alpha);

        // Branching capillaries
        const branchCount = 5;
        for (let b = 1; b <= branchCount; b++) {
          const idx = Math.floor((b / (branchCount + 1)) * mainPoints.length);
          if (idx < mainPoints.length) {
            const bStart = mainPoints[idx];
            const side = b % 2 === 0 ? 1 : -1;
            const bEnd: [number, number] = [
              bStart[0] + side * (120 + Math.sin(b * 12 + frame) * 90),
              bStart[1] + (80 + Math.cos(b * 15 + frame) * 60),
            ];
            const bPoints: [number, number][] = [bStart];
            generateFractalLightning(bStart, bEnd, 120, 14, bPoints);
            drawGlowingLightning(bPoints, 3.5, alpha * 0.75);
          }
        }

        // Ground Impact Flash Glow
        const impactGrad = ctx.createRadialGradient(
          endPt[0],
          endPt[1],
          20,
          endPt[0],
          endPt[1],
          280
        );
        impactGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        impactGrad.addColorStop(0.25, 'rgba(0, 220, 255, 0.75)');
        impactGrad.addColorStop(0.65, 'rgba(0, 60, 255, 0.35)');
        impactGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = impactGrad;
        ctx.beginPath();
        ctx.arc(endPt[0], endPt[1], 280, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 3. Render Electrical Sparks
    const gravity = 0.45;
    for (let i = 0; i < sparks.length; i++) {
      const sp = sparks[i];
      if (frame < sp.birthFrame || frame > sp.birthFrame + sp.lifespan) continue;

      const age = frame - sp.birthFrame;
      const prog = age / sp.lifespan;
      const alpha = 1.0 - prog;

      const curX = sp.x + sp.vx * age;
      const curY = sp.y + sp.vy * age + 0.5 * gravity * age * age;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = 'screen';

      ctx.beginPath();
      ctx.arc(curX, curY, sp.radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 200, 255, 0.55)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(curX, curY, sp.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.restore();
    }
  }, [frame, width, height, fps, sparks]);

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
