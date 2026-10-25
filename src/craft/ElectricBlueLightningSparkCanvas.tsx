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
    const strikeFrames = [12, 68, 130, 205, 275];

    for (const sf of strikeFrames) {
      for (let i = 0; i < 60; i++) {
        const ang = -Math.PI * (0.05 + rnd() * 0.9); // upward fountain
        const spd = 8 + rnd() * 28;
        list.push({
          x: width * (0.49 + (rnd() - 0.5) * 0.06),
          y: height * 0.82,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          radius: 1.5 + rnd() * 4.0,
          birthFrame: sf + Math.floor(rnd() * 8),
          lifespan: 14 + Math.floor(rnd() * 18),
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

    // 5 Strike Windows matching Reference Timeline
    const strikeWindows = [
      { start: 12, end: 40 },
      { start: 68, end: 98 },
      { start: 130, end: 168 },
      { start: 205, end: 242 },
      { start: 275, end: 320 },
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

      const pseudoHash = Math.sin(p1[0] * 12.9898 + p2[1] * 78.233 + frame * 41.719) * 43758.5453;
      const offset = ((pseudoHash - Math.floor(pseudoHash)) - 0.5) * disp;

      const newMid: [number, number] = [midX + nx * offset, midY + ny * offset];

      generateFractalLightning(p1, newMid, disp * 0.58, minDisp, pts);
      generateFractalLightning(newMid, p2, disp * 0.58, minDisp, pts);
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

      // Pass 1: Wide Deep Sapphire Blue Outer Glow
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.lineWidth = coreWidth * 14;
      ctx.strokeStyle = 'rgba(0, 85, 255, 0.45)';
      ctx.stroke();

      // Pass 2: Vivid Electric Cyan Inner Halo
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.lineWidth = coreWidth * 5.0;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.90)';
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

      // Realistic high-frequency flicker (visible on 75% of frames)
      const isFlickerOn = strikeAge % 4 !== 3;
      if (isFlickerOn) {
        const alpha = Math.max(0.45, 1.0 - (strikeAge / strikeDuration) * 0.55);

        // Main vertical bolt trunk
        const startPt: [number, number] = [
          width * (0.492 + Math.sin(frame * 1.8) * 0.018),
          height * 0.18,
        ];
        const endPt: [number, number] = [
          width * (0.495 + Math.cos(frame * 2.3) * 0.022),
          height * 0.82,
        ];

        const mainPoints: [number, number][] = [startPt];
        generateFractalLightning(startPt, endPt, 350, 16, mainPoints);
        drawGlowingLightning(mainPoints, 8.5, alpha);

        // Secondary parallel ionized streamer
        const streamerStart: [number, number] = [startPt[0] + 15, startPt[1] + 30];
        const streamerEnd: [number, number] = [endPt[0] - 12, endPt[1] - 40];
        const streamerPoints: [number, number][] = [streamerStart];
        generateFractalLightning(streamerStart, streamerEnd, 180, 14, streamerPoints);
        drawGlowingLightning(streamerPoints, 3.5, alpha * 0.65);

        // Branching capillaries
        const branchCount = 6;
        for (let b = 1; b <= branchCount; b++) {
          const idx = Math.floor((b / (branchCount + 1)) * mainPoints.length);
          if (idx < mainPoints.length) {
            const bStart = mainPoints[idx];
            const side = b % 2 === 0 ? 1 : -1;
            const bEnd: [number, number] = [
              bStart[0] + side * (140 + Math.sin(b * 14 + frame) * 90),
              bStart[1] + (90 + Math.cos(b * 16 + frame) * 70),
            ];
            const bPoints: [number, number][] = [bStart];
            generateFractalLightning(bStart, bEnd, 140, 14, bPoints);
            drawGlowingLightning(bPoints, 4.0, alpha * 0.80);
          }
        }

        // Ground Impact Flash Glow
        const impactGrad = ctx.createRadialGradient(
          endPt[0],
          endPt[1],
          25,
          endPt[0],
          endPt[1],
          320
        );
        impactGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        impactGrad.addColorStop(0.25, 'rgba(0, 230, 255, 0.80)');
        impactGrad.addColorStop(0.65, 'rgba(0, 70, 255, 0.40)');
        impactGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = impactGrad;
        ctx.beginPath();
        ctx.arc(endPt[0], endPt[1], 320, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 3. Render Electrical Sparks
    const gravity = 0.42;
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
      ctx.arc(curX, curY, sp.radius * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 220, 255, 0.60)';
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
