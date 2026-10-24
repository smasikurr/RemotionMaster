import React, { useEffect, useMemo, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaterSplashGreenScreenCanvasProps {
  greenColor?: string;
  dropletCount?: number;
  seed?: number;
}

interface Particle {
  x0: number;
  y0: number;
  z: number; // 0.2 to 2.5 depth
  vx: number;
  vy: number;
  radius: number;
  type: 0 | 1 | 2; // 0: micro-bead, 1: bokeh disc, 2: glassy droplet
  birthFrame: number;
  lifespan: number;
}

interface Bubble {
  u: number; // 0 to 1 along spine
  offset: number; // -1 to 1 across width
  radius: number;
  alpha: number;
}

export const WaterSplashGreenScreenCanvas: React.FC<WaterSplashGreenScreenCanvasProps> = ({
  greenColor = '#007800',
  dropletCount = 1650,
  seed = 48,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Deterministic PRNG
  const pseudoRandom = (s: number) => {
    let state = (s * 16807 + 11) % 2147483647;
    return () => {
      state = (state * 16807 + 11) % 2147483647;
      return (state - 1) / 2147483646;
    };
  };

  // Precompute droplets
  const particles = useMemo(() => {
    const rnd = pseudoRandom(seed * 777);
    const list: Particle[] = [];

    for (let i = 0; i < dropletCount; i++) {
      let birthFrame = 0;
      let x0 = 0;
      let y0 = 0;
      let vx = 0;
      let vy = 0;

      const category = i % 5;
      if (category === 0) {
        // Wave 1 spray (Frames 0 to 180) - top left to bottom right
        birthFrame = rnd() * 140;
        x0 = width * (rnd() * 0.35);
        y0 = height * (rnd() * 0.45);
        const ang = 0.4 + rnd() * 0.8;
        const spd = 8 + rnd() * 26;
        vx = Math.cos(ang) * spd;
        vy = Math.sin(ang) * spd;
      } else if (category === 1) {
        // Continuous ambient floating & falling droplets across whole scene
        birthFrame = rnd() * 900;
        x0 = width * (0.05 + rnd() * 0.9);
        y0 = height * (rnd() * 0.8);
        vx = (rnd() - 0.5) * 4.0;
        vy = 2.0 + rnd() * 7.0;
      } else if (category === 2) {
        // Wave 2 & 3 splash burst (Frames 200 to 520) - center & upper right
        birthFrame = 220 + rnd() * 240;
        x0 = width * (0.2 + rnd() * 0.6);
        y0 = height * (0.1 + rnd() * 0.5);
        const ang = rnd() * Math.PI * 2;
        const spd = 6 + rnd() * 24;
        vx = Math.cos(ang) * spd;
        vy = Math.sin(ang) * spd - 3.0;
      } else if (category === 3) {
        // Wave 3 diagonal splash (Frames 420 to 650) - top-right downward sweep
        birthFrame = 420 + rnd() * 160;
        x0 = width * (0.65 + rnd() * 0.3);
        y0 = height * (rnd() * 0.35);
        const ang = 2.2 + rnd() * 0.8;
        const spd = 10 + rnd() * 28;
        vx = Math.cos(ang) * spd;
        vy = Math.sin(ang) * spd;
      } else {
        // Wave 4 & 5 (Frames 680 to 880) - left edge vertical surge
        birthFrame = 680 + rnd() * 160;
        x0 = width * (0.02 + rnd() * 0.25);
        y0 = height * (0.3 + rnd() * 0.6);
        const ang = -0.6 + rnd() * 1.2;
        const spd = 8 + rnd() * 26;
        vx = Math.cos(ang) * spd;
        vy = Math.sin(ang) * spd - 6.0;
      }

      const z = 0.25 + rnd() * 2.2;
      const typeRand = rnd();
      let type: 0 | 1 | 2 = 0;
      let radius = 2.0;

      if (typeRand < 0.55) {
        // 55% Micro-beads / spray mist
        type = 0;
        radius = (1.5 + rnd() * 2.5) * Math.min(1.2, z);
      } else if (typeRand < 0.80) {
        // 25% Bokeh defocused discs (soft foreground/background orbs)
        type = 1;
        radius = (12.0 + rnd() * 32.0) * z;
      } else {
        // 20% Crystalline glass water droplets with refraction
        type = 2;
        radius = (4.0 + rnd() * 14.0) * z;
      }

      list.push({
        x0,
        y0,
        z,
        vx,
        vy,
        radius,
        type,
        birthFrame,
        lifespan: 140 + rnd() * 130,
      });
    }

    return list;
  }, [width, height, dropletCount, seed]);

  // Precompute internal bubbles for fluid sheets
  const bubbles = useMemo(() => {
    const rnd = pseudoRandom(seed * 999);
    const list: Bubble[] = [];
    for (let i = 0; i < 160; i++) {
      list.push({
        u: rnd(),
        offset: (rnd() - 0.5) * 1.8,
        radius: 2 + rnd() * 7,
        alpha: 0.3 + rnd() * 0.5,
      });
    }
    return list;
  }, [seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Studio Chroma Key Green Background with subtle studio radial light
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.4,
      width * 0.1,
      width * 0.5,
      height * 0.5,
      width * 0.75
    );
    bgGrad.addColorStop(0, '#008b08');
    bgGrad.addColorStop(0.65, greenColor);
    bgGrad.addColorStop(1, '#006200');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const time = frame / fps;

    // 2. High-Realism Volumetric Water Sheet Renderer
    const drawVolumetricWaterSheet = (
      controlPoints: [number, number][],
      widthProfile: (u: number) => number,
      alpha: number,
      phase: number,
      fingering: boolean = true
    ) => {
      if (alpha <= 0.01) return;

      const steps = 60;
      const spine: [number, number][] = [];
      const normals: [number, number][] = [];

      // Evaluate Catmull-Rom or Bezier spline along control points
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        // Cubic spline through 4 control points: P0, P1, P2, P3
        const p0 = controlPoints[0];
        const p1 = controlPoints[1];
        const p2 = controlPoints[2];
        const p3 = controlPoints[3];

        const t = u;
        const mt = 1 - t;
        const x =
          mt * mt * mt * p0[0] +
          3 * mt * mt * t * p1[0] +
          3 * mt * t * t * p2[0] +
          t * t * t * p3[0];
        const y =
          mt * mt * mt * p0[1] +
          3 * mt * mt * t * p1[1] +
          3 * mt * t * t * p2[1] +
          t * t * t * p3[1];

        // Derivative for normal
        const dx =
          3 * mt * mt * (p1[0] - p0[0]) +
          6 * mt * t * (p2[0] - p1[0]) +
          3 * t * t * (p3[0] - p2[0]);
        const dy =
          3 * mt * mt * (p1[1] - p0[1]) +
          6 * mt * t * (p2[1] - p1[1]) +
          3 * t * t * (p3[1] - p2[1]);
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        spine.push([x, y]);
        normals.push([nx, ny]);
      }

      // Build outer and inner perimeter with organic fluid surface noise
      const outerPts: [number, number][] = [];
      const innerPts: [number, number][] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const [x, y] = spine[i];
        const [nx, ny] = normals[i];
        const baseW = widthProfile(u);

        // Multi-frequency harmonic surface ripple noise
        const ripple1 = Math.sin(u * 28.0 + time * 14.0 + phase) * 22;
        const ripple2 = Math.cos(u * 55.0 - time * 20.0) * 12;
        const ripple3 = Math.sin(u * 80.0 + phase * 2.0) * 8;
        const totalRipple = ripple1 + ripple2 + ripple3;

        const wOuter = (baseW * 0.5) + totalRipple;
        const wInner = (baseW * 0.5) - (totalRipple * 0.85);

        outerPts.push([x + nx * wOuter, y + ny * wOuter]);
        innerPts.push([x - nx * wInner, y - ny * wInner]);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // LAYER A: Refractive Water Body Fill (brightens and distorts the green backdrop)
      ctx.beginPath();
      ctx.moveTo(outerPts[0][0], outerPts[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(outerPts[i][0], outerPts[i][1]);
      }
      for (let i = steps; i >= 0; i--) {
        ctx.lineTo(innerPts[i][0], innerPts[i][1]);
      }
      ctx.closePath();

      // Fluid water gradient fill with rich refractive luminosity
      const grad = ctx.createLinearGradient(
        spine[0][0],
        spine[0][1],
        spine[steps][0],
        spine[steps][1]
      );
      grad.addColorStop(0, 'rgba(235, 255, 245, 0.55)');
      grad.addColorStop(0.3, 'rgba(180, 255, 215, 0.38)');
      grad.addColorStop(0.7, 'rgba(150, 250, 195, 0.42)');
      grad.addColorStop(1, 'rgba(230, 255, 240, 0.58)');
      ctx.fillStyle = grad;
      ctx.fill();

      // LAYER A2: High-Glint Volumetric Caustic Center Spine
      ctx.beginPath();
      ctx.moveTo(spine[0][0], spine[0][1]);
      for (let i = 1; i <= steps; i++) {
        const u = i / steps;
        const w = widthProfile(u);
        const [nx, ny] = normals[i];
        const offset = Math.sin(u * 18.0 + time * 12.0) * (w * 0.18);
        ctx.lineTo(spine[i][0] + nx * offset, spine[i][1] + ny * offset);
      }
      ctx.lineWidth = 18;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
      ctx.stroke();

      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.stroke();

      // LAYER B: Internal Caustic Ribbons & Air Bubbles
      for (let b = 0; b < bubbles.length; b++) {
        const bub = bubbles[b];
        const idx = Math.min(steps - 1, Math.floor(bub.u * steps));
        const [bx, by] = spine[idx];
        const [bnx, bny] = normals[idx];
        const w = widthProfile(bub.u) * 0.45;
        const posX = bx + bnx * (bub.offset * w);
        const posY = by + bny * (bub.offset * w);

        // Micro-bubble inside fluid
        ctx.beginPath();
        ctx.arc(posX, posY, bub.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${bub.alpha * 0.45})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(posX - bub.radius * 0.3, posY - bub.radius * 0.3, bub.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${bub.alpha * 0.85})`;
        ctx.fill();
      }

      // LAYER C: Crisp Outer Specular Rim (High-brightness water surface tension meniscus)
      ctx.beginPath();
      ctx.moveTo(outerPts[0][0], outerPts[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(outerPts[i][0], outerPts[i][1]);
      }
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.30)';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(outerPts[0][0], outerPts[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(outerPts[i][0], outerPts[i][1]);
      }
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.stroke();

      // LAYER D: Crisp Inner Specular Rim
      ctx.beginPath();
      ctx.moveTo(innerPts[0][0], innerPts[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(innerPts[i][0], innerPts[i][1]);
      }
      ctx.lineWidth = 9;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(innerPts[0][0], innerPts[0][1]);
      for (let i = 1; i <= steps; i++) {
        ctx.lineTo(innerPts[i][0], innerPts[i][1]);
      }
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
      ctx.stroke();

      // LAYER E: Splashing Edge Tendrils / Pinch-Off Ligaments
      if (fingering) {
        for (let i = 5; i < steps; i += 7) {
          const u = i / steps;
          const [x, y] = outerPts[i];
          const [nx, ny] = normals[i];
          const fingerLen = 40 + Math.sin(u * 15 + time * 10) * 35;
          const endX = x + nx * fingerLen;
          const endY = y + ny * fingerLen + 15;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.quadraticCurveTo(
            x + nx * (fingerLen * 0.5) + Math.cos(time * 12) * 15,
            y + ny * (fingerLen * 0.5) + Math.sin(time * 12) * 15,
            endX,
            endY
          );
          ctx.lineWidth = 4.0;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.stroke();

          // Droplet at finger tip
          ctx.beginPath();
          ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fill();
        }
      }

      ctx.restore();
    };

    // 3. Render Sequential Water Wave Sheets across Timeline
    // WAVE 1 (Frames 0 to 180): Huge diagonal torrent pouring from top-left into center
    if (frame >= 0 && frame <= 180) {
      const prog = frame / 180;
      const alpha = prog < 0.15 ? prog / 0.15 : prog > 0.8 ? (1 - prog) / 0.2 : 1.0;
      const shiftX = prog * 280;
      const shiftY = prog * 320;

      const cp: [number, number][] = [
        [-150 + shiftX * 0.5, -200 + shiftY * 0.4],
        [width * 0.12 + shiftX, height * 0.18 + shiftY * 0.6],
        [width * 0.28 + shiftX * 0.9, height * 0.58 + shiftY * 0.8],
        [width * 0.48 + shiftX, height * 1.15],
      ];

      drawVolumetricWaterSheet(
        cp,
        (u) => 240 + Math.sin(u * Math.PI) * 260, // 240px to 500px wide!
        alpha,
        0.0,
        true
      );

      // Secondary parallel fluid filament
      const cp2: [number, number][] = [
        [-100, height * 0.1],
        [width * 0.18 + shiftX * 0.7, height * 0.45 + shiftY * 0.7],
        [width * 0.24 + shiftX * 0.8, height * 0.78],
        [width * 0.32 + shiftX, height * 1.1],
      ];
      drawVolumetricWaterSheet(
        cp2,
        (u) => 90 + Math.sin(u * Math.PI) * 110,
        alpha * 0.75,
        1.2,
        false
      );
    }

    // WAVE 3 (Frames 360 to 560): High-speed diagonal splash sheet crashing from top-right down across center
    if (frame >= 360 && frame <= 560) {
      const prog = (frame - 360) / 200;
      const alpha = prog < 0.15 ? prog / 0.15 : prog > 0.8 ? (1 - prog) / 0.2 : 1.0;
      const shiftX = prog * 260;
      const shiftY = prog * 280;

      const cp: [number, number][] = [
        [width + 150 - shiftX * 0.4, -180 + shiftY * 0.5],
        [width * 0.85 - shiftX * 0.7, height * 0.22 + shiftY * 0.6],
        [width * 0.55 - shiftX * 0.9, height * 0.58 + shiftY * 0.8],
        [width * 0.30 - shiftX, height * 1.12],
      ];

      drawVolumetricWaterSheet(
        cp,
        (u) => 260 + Math.sin(u * Math.PI) * 280, // Massive fluid sheet
        alpha,
        2.5,
        true
      );
    }

    // WAVE 5 (Frames 680 to 890): Thick curved fluid wall surging along left edge
    if (frame >= 680 && frame <= 890) {
      const prog = (frame - 680) / 210;
      const alpha = prog < 0.15 ? prog / 0.15 : prog > 0.85 ? (1 - prog) / 0.15 : 1.0;
      const waveRise = Math.sin(prog * Math.PI) * 120;

      const cp: [number, number][] = [
        [-50, -80],
        [width * 0.14 + waveRise * 0.8, height * 0.28],
        [width * 0.12 + waveRise, height * 0.65],
        [width * 0.05, height * 1.1],
      ];

      drawVolumetricWaterSheet(
        cp,
        (u) => 280 + Math.sin(u * Math.PI) * 320, // 280px to 600px thick water wall!
        alpha,
        4.2,
        true
      );
    }

    // 4. Render 1,250+ Droplets & Spray Particles
    const gravity = 0.40;
    const drag = 0.988;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (frame < p.birthFrame) continue;

      const age = frame - p.birthFrame;
      if (age > p.lifespan) continue;

      // Ballistic integration
      const decaySum = (1 - Math.pow(drag, age)) / (1 - drag);
      const curX = p.x0 + p.vx * decaySum;
      const curY = p.y0 + p.vy * decaySum + 0.5 * gravity * age * age;

      if (curX < -80 || curX > width + 80 || curY < -80 || curY > height + 80) continue;

      // Envelope fade
      let alpha = 1.0;
      if (age < 8) alpha = age / 8;
      else if (age > p.lifespan - 25) alpha = (p.lifespan - age) / 25;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      if (p.type === 0) {
        // Type 0: Sharp sparkling micro-bead
        ctx.beginPath();
        ctx.arc(curX, curY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      } else if (p.type === 1) {
        // Type 1: Soft bokeh defocused disc
        const r = p.radius;
        const bGrad = ctx.createRadialGradient(curX, curY, r * 0.12, curX, curY, r);
        bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        bGrad.addColorStop(0.45, 'rgba(195, 255, 220, 0.28)');
        bGrad.addColorStop(1, 'rgba(0, 150, 40, 0.0)');

        ctx.beginPath();
        ctx.arc(curX, curY, r, 0, Math.PI * 2);
        ctx.fillStyle = bGrad;
        ctx.fill();
      } else {
        // Type 2: Crystalline glass water drop with realistic spherical refraction
        const r = p.radius;

        // Dark refraction shadow ring
        ctx.beginPath();
        ctx.arc(curX, curY, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 80, 20, 0.35)';
        ctx.fill();

        // Inner glowing meniscus
        ctx.beginPath();
        ctx.arc(curX, curY, r * 0.88, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 255, 215, 0.42)';
        ctx.fill();

        // White specular rim
        ctx.lineWidth = Math.max(1.2, r * 0.18);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.stroke();

        // Top-left primary light glint
        ctx.beginPath();
        ctx.arc(curX - r * 0.35, curY - r * 0.35, r * 0.26, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Bottom-right secondary caustics reflection
        ctx.beginPath();
        ctx.arc(curX + r * 0.3, curY + r * 0.3, r * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
      }

      ctx.restore();
    }
  }, [frame, width, height, fps, greenColor, particles, bubbles]);

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
