import React, { useEffect, useMemo, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface AnimeActionSpeedLinesCanvasProps {
  greenColor?: string;
  seed?: number;
}

interface CurvedSlash {
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
  maxWidth: number;
  birthFrame: number;
  lifespan: number;
}

interface RadialSlash {
  angle: number;
  length: number;
  width: number;
  distance: number;
  birthFrame: number;
  lifespan: number;
}

export const AnimeActionSpeedLinesCanvas: React.FC<AnimeActionSpeedLinesCanvasProps> = ({
  greenColor = '#00FF00',
  seed = 50,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Authentic 2-frame stepped anime animation cadence (12-24 fps Sakuga timing)
  const animeFrame = Math.floor(frame / 2) * 2;

  // Precompute deterministic random action speed slashes and crescent arcs
  const { curvedSlashes, radialSlashes } = useMemo(() => {
    let s = seed * 4321;
    const rnd = () => {
      s = (s * 16807 + 11) % 2147483647;
      return (s - 1) / 2147483646;
    };

    // 1. Muscular Curved Crescent Slashes (Katana energy cutting arcs)
    const cList: CurvedSlash[] = [];
    // Wave 1: frames 0 - 75 (Top-left to center-right sweeping cuts)
    for (let i = 0; i < 22; i++) {
      const birthFrame = Math.floor(rnd() * 60);
      const startX = width * (0.02 + rnd() * 0.95);
      const startY = height * (0.05 + rnd() * 0.90);
      const endX = startX + (rnd() - 0.5) * (width * 0.85);
      const endY = startY + (rnd() - 0.5) * (height * 0.85);
      const cpX = (startX + endX) * 0.5 + (rnd() - 0.5) * 650;
      const cpY = (startY + endY) * 0.5 + (rnd() - 0.5) * 650;

      cList.push({
        p0: [startX, startY],
        p1: [cpX, cpY],
        p2: [endX, endY],
        maxWidth: 70 + rnd() * 110, // Muscular wide slashes (70px - 180px)
        birthFrame,
        lifespan: 6 + Math.floor(rnd() * 14),
      });
    }

    // Wave 3 & 4: frames 140 - 300 (Horizontal & diagonal slashing storm)
    for (let i = 0; i < 35; i++) {
      const birthFrame = 140 + Math.floor(rnd() * 145);
      const startX = width * (0.02 + rnd() * 0.96);
      const startY = height * (0.05 + rnd() * 0.92);
      const endX = startX + (rnd() - 0.5) * (width * 0.9);
      const endY = startY + (rnd() - 0.5) * (height * 0.9);
      const cpX = (startX + endX) * 0.5 + (rnd() - 0.5) * 750;
      const cpY = (startY + endY) * 0.5 + (rnd() - 0.5) * 750;

      cList.push({
        p0: [startX, startY],
        p1: [cpX, cpY],
        p2: [endX, endY],
        maxWidth: 75 + rnd() * 125, // Muscular wide slashes
        birthFrame,
        lifespan: 6 + Math.floor(rnd() * 14),
      });
    }

    // 2. High-Density Radial Speed Slashes
    const rList: RadialSlash[] = [];
    for (let b = 0; b < 4; b++) {
      const baseFrame = b * 75;
      for (let i = 0; i < 65; i++) {
        rList.push({
          angle: rnd() * Math.PI * 2,
          length: 450 + rnd() * 1200,
          width: 25 + rnd() * 55, // Wide action wedges
          distance: 40 + rnd() * 350,
          birthFrame: baseFrame + Math.floor(rnd() * 45),
          lifespan: 6 + Math.floor(rnd() * 14),
        });
      }
    }

    return { curvedSlashes: cList, radialSlashes: rList };
  }, [width, height, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Pure Solid Chroma Key Green Background (#00FF00)
    ctx.fillStyle = greenColor;
    ctx.fillRect(0, 0, width, height);

    const shadowOffset = 26;
    const shadowColor = '#7E7E7E';
    const mainColor = '#FFFFFF';

    // Helper: Draw Crescent Curved Sword Slash with Tapering Ends
    const drawCrescentArc = (
      p0: [number, number],
      p1: [number, number],
      p2: [number, number],
      maxW: number,
      alpha: number
    ) => {
      if (alpha <= 0.05) return;

      const steps = 36;
      const ptsLeft: [number, number][] = [];
      const ptsRight: [number, number][] = [];

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const mt = 1 - t;
        const x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0];
        const y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1];

        // Tangent
        const dx = 2 * mt * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
        const dy = 2 * mt * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        // Parabolic tapering profile
        const w = Math.sin(t * Math.PI) * maxW;

        ptsLeft.push([x + nx * (w * 0.5), y + ny * (w * 0.5)]);
        ptsRight.push([x - nx * (w * 0.5), y - ny * (w * 0.5)]);
      }

      ctx.save();
      ctx.globalAlpha = alpha;

      // Draw Gray Drop Shadow Bevel
      ctx.beginPath();
      ctx.moveTo(ptsLeft[0][0] + shadowOffset, ptsLeft[0][1] + shadowOffset);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(ptsLeft[i][0] + shadowOffset, ptsLeft[i][1] + shadowOffset);
      }
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(ptsRight[i][0] + shadowOffset, ptsRight[i][1] + shadowOffset);
      }
      ctx.closePath();
      ctx.fillStyle = shadowColor;
      ctx.fill();

      // Draw Pure White Hero Arc
      ctx.beginPath();
      ctx.moveTo(ptsLeft[0][0], ptsLeft[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(ptsLeft[i][0], ptsLeft[i][1]);
      }
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(ptsRight[i][0], ptsRight[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = mainColor;
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw Massive Multi-Lobed Anime Smoke Blast Shockwave (fills 800-1400px screen area)
    const drawMultiLobedBlast = (
      cx: number,
      cy: number,
      scale: number,
      alpha: number
    ) => {
      if (alpha <= 0.05 || scale <= 0.05) return;

      const lobes = 4;
      const ptsInner: [number, number][] = [];
      const ptsOuter: [number, number][] = [];
      const steps = 72;

      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        // Puffy cloud lobe contour
        const modulation =
          1.0 +
          0.42 * Math.cos(lobes * theta) +
          0.20 * Math.sin(2 * theta + 0.6) +
          0.09 * Math.cos(8 * theta);

        const rOuter = (750 * scale) * modulation;
        const rInner = Math.max(20, rOuter - (120 * scale));

        ptsOuter.push([cx + Math.cos(theta) * rOuter, cy + Math.sin(theta) * rOuter]);
        ptsInner.push([cx + Math.cos(theta) * rInner, cy + Math.sin(theta) * rInner]);
      }

      ctx.save();
      ctx.globalAlpha = alpha;

      // Shadow Puff
      ctx.beginPath();
      ctx.moveTo(ptsOuter[0][0] + shadowOffset, ptsOuter[0][1] + shadowOffset);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(ptsOuter[i][0] + shadowOffset, ptsOuter[i][1] + shadowOffset);
      }
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(ptsInner[i][0] + shadowOffset, ptsInner[i][1] + shadowOffset);
      }
      ctx.closePath();
      ctx.fillStyle = shadowColor;
      ctx.fill();

      // White Hero Puff
      ctx.beginPath();
      ctx.moveTo(ptsOuter[0][0], ptsOuter[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(ptsOuter[i][0], ptsOuter[i][1]);
      }
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(ptsInner[i][0], ptsInner[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = mainColor;
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw Radial Action Speed Wedges
    const drawRadialWedge = (
      cx: number,
      cy: number,
      angle: number,
      dist: number,
      len: number,
      thick: number,
      alpha: number
    ) => {
      if (alpha <= 0.05) return;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const normX = -sinA;
      const normY = cosA;

      const p0X = cx + cosA * dist;
      const p0Y = cy + sinA * dist;
      const p1X = cx + cosA * (dist + len * 0.40) - normX * (thick * 0.5);
      const p1Y = cy + sinA * (dist + len * 0.40) - normY * (thick * 0.5);
      const p2X = cx + cosA * (dist + len);
      const p2Y = cy + sinA * (dist + len);
      const p3X = cx + cosA * (dist + len * 0.40) + normX * (thick * 0.5);
      const p3Y = cy + sinA * (dist + len * 0.40) + normY * (thick * 0.5);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Shadow
      ctx.beginPath();
      ctx.moveTo(p0X + shadowOffset, p0Y + shadowOffset);
      ctx.lineTo(p1X + shadowOffset, p1Y + shadowOffset);
      ctx.lineTo(p2X + shadowOffset, p2Y + shadowOffset);
      ctx.lineTo(p3X + shadowOffset, p3Y + shadowOffset);
      ctx.closePath();
      ctx.fillStyle = shadowColor;
      ctx.fill();

      // White
      ctx.beginPath();
      ctx.moveTo(p0X, p0Y);
      ctx.lineTo(p1X, p1Y);
      ctx.lineTo(p2X, p2Y);
      ctx.lineTo(p3X, p3Y);
      ctx.closePath();
      ctx.fillStyle = mainColor;
      ctx.fill();

      ctx.restore();
    };

    // ==========================================
    // RENDER TIMELINE (300 frames @ 60fps = 5.0s)
    // ==========================================

    // 1. Massive Multi-Lobed Blast in Wave 1 and Wave 3 (frames 0-70 and 150-230)
    if (animeFrame >= 0 && animeFrame <= 65) {
      const prog = animeFrame / 65;
      const scale = 0.35 + prog * 1.6;
      const alpha = prog < 0.2 ? prog / 0.2 : (1.0 - prog) / 0.8;
      drawMultiLobedBlast(width * 0.38, height * 0.45, scale, alpha);
    }

    if (animeFrame >= 145 && animeFrame <= 225) {
      const prog = (animeFrame - 145) / 80;
      const scale = 0.4 + prog * 1.7;
      const alpha = prog < 0.2 ? prog / 0.2 : (1.0 - prog) / 0.8;
      drawMultiLobedBlast(width * 0.42, height * 0.50, scale, alpha);
    }

    // 2. Muscular Crescent Curved Slashes across timeline
    for (let i = 0; i < curvedSlashes.length; i++) {
      const s = curvedSlashes[i];
      if (animeFrame < s.birthFrame || animeFrame > s.birthFrame + s.lifespan) continue;

      const age = animeFrame - s.birthFrame;
      const prog = age / s.lifespan;
      const alpha = prog < 0.25 ? 1.0 : (1.0 - prog) / 0.75;

      drawCrescentArc(s.p0, s.p1, s.p2, s.maxWidth, alpha);
    }

    // Hero Arc 1: Top-left sweeping sword cut in Wave 1 (frames 8 to 38)
    if (animeFrame >= 8 && animeFrame <= 38) {
      const prog = (animeFrame - 8) / 30;
      const alpha = prog < 0.2 ? prog / 0.2 : (1.0 - prog) / 0.8;
      drawCrescentArc(
        [-80, height * 0.12],
        [width * 0.22, height * 0.38],
        [width * 0.45, -60],
        130,
        alpha
      );
      drawCrescentArc(
        [width * 0.05, height * 0.35],
        [width * 0.25, height * 0.50],
        [width * 0.40, height * 0.15],
        85,
        alpha * 0.85
      );
    }

    // Hero Arc 2 & 3: Sweeping sword cut trails in Wave 4 (frames 240 to 285)
    if (animeFrame >= 240 && animeFrame <= 285) {
      const prog = (animeFrame - 240) / 45;
      const alpha = prog < 0.2 ? prog / 0.2 : (1.0 - prog) / 0.8;
      drawCrescentArc(
        [-100, height * 0.82],
        [width * 0.30, height * 0.70],
        [width * 0.65, height * 0.78],
        140,
        alpha
      );
      drawCrescentArc(
        [-60, height * 0.94],
        [width * 0.26, height * 0.86],
        [width * 0.58, height * 0.90],
        95,
        alpha * 0.90
      );
    }

    // 3. Radial Speed Lines across timeline
    const burstIdx = Math.floor(animeFrame / 75);
    const focalCenters: [number, number][] = [
      [width * 0.45, height * 0.48],
      [width * 0.52, height * 0.50],
      [width * 0.48, height * 0.52],
      [width * 0.50, height * 0.46],
    ];
    const [focX, focY] = focalCenters[burstIdx % 4];

    for (let i = 0; i < radialSlashes.length; i++) {
      const r = radialSlashes[i];
      if (animeFrame < r.birthFrame || animeFrame > r.birthFrame + r.lifespan) continue;

      const age = animeFrame - r.birthFrame;
      const prog = age / r.lifespan;
      const alpha = prog < 0.2 ? 1.0 : (1.0 - prog) / 0.8;
      const expandDist = r.distance + prog * 480;

      drawRadialWedge(focX, focY, r.angle, expandDist, r.length, r.width, alpha);
    }
  }, [animeFrame, width, height, greenColor, curvedSlashes, radialSlashes]);

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
