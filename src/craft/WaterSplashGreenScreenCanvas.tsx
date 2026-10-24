import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface WaterSplashGreenScreenCanvasProps {
  greenColor?: string;
  dropletCount?: number;
  splashSpeed?: number;
  seed?: number;
}

interface Droplet {
  baseX: number;
  baseY: number;
  baseZ: number; // depth 0.3 to 2.0
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  burstFrame: number;
  phase: number;
}

export const WaterSplashGreenScreenCanvas: React.FC<WaterSplashGreenScreenCanvasProps> = ({
  greenColor = '#007400',
  dropletCount = 380,
  splashSpeed = 1.0,
  seed = 48,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropletsRef = useRef<Droplet[]>([]);

  // Initialize deterministic procedural droplets once
  if (dropletsRef.current.length === 0) {
    const list: Droplet[] = [];
    let s = seed * 12345;
    const rnd = () => {
      s = (s * 16807 + 11) % 2147483647;
      return (s - 1) / 2147483646;
    };

    // Distribute droplets across 3 burst phases:
    // Burst 1: f = 20 (from top-left)
    // Burst 2: f = 260 (central explosive burst)
    // Burst 3: f = 460 (from top-right)
    // Burst 4: f = 730 (from right edge)
    // Plus ambient floating droplets
    for (let i = 0; i < dropletCount; i++) {
      let burstFrame = 0;
      let startX = 0;
      let startY = 0;
      let vx = 0;
      let vy = 0;

      const group = i % 5;
      if (group === 0) {
        // Burst 1: splash from top-left moving diagonally down-right
        burstFrame = 15 + rnd() * 40;
        startX = width * (0.05 + rnd() * 0.25);
        startY = height * (0.05 + rnd() * 0.35);
        const angle = 0.6 + rnd() * 0.8;
        const speed = 12 + rnd() * 26;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else if (group === 1) {
        // Floating slow droplets in middle phase
        burstFrame = 120 + rnd() * 120;
        startX = width * rnd();
        startY = height * (0.1 + rnd() * 0.8);
        vx = (rnd() - 0.5) * 4;
        vy = 2 + rnd() * 6;
      } else if (group === 2) {
        // Burst 2: central radial explosive burst
        burstFrame = 270 + rnd() * 50;
        startX = width * (0.4 + rnd() * 0.2);
        startY = height * (0.35 + rnd() * 0.3);
        const angle = rnd() * Math.PI * 2;
        const speed = 8 + rnd() * 32;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 5; // slight upward pop
      } else if (group === 3) {
        // Burst 3: splash from top-right moving down-left
        burstFrame = 460 + rnd() * 60;
        startX = width * (0.75 + rnd() * 0.25);
        startY = height * (0.05 + rnd() * 0.35);
        const angle = 2.2 + rnd() * 0.8;
        const speed = 14 + rnd() * 28;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        // Burst 4: splash arc from bottom/right edge
        burstFrame = 730 + rnd() * 50;
        startX = width * (0.8 + rnd() * 0.2);
        startY = height * (0.4 + rnd() * 0.4);
        const angle = 2.8 + rnd() * 0.9;
        const speed = 10 + rnd() * 24;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 8;
      }

      const z = 0.4 + rnd() * 1.5; // depth
      const radius = (3 + rnd() * 18) * z; // 4K sized droplet

      list.push({
        baseX: startX,
        baseY: startY,
        baseZ: z,
        vx,
        vy,
        vz: (rnd() - 0.5) * 0.05,
        radius,
        burstFrame,
        phase: rnd() * Math.PI * 2,
      });
    }

    dropletsRef.current = list;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw Clean Chroma Green Screen Background
    ctx.fillStyle = greenColor;
    ctx.fillRect(0, 0, width, height);

    const time = frame / fps;

    // Helper: draw realistic water droplet with refraction & dual specular glints
    const drawDroplet = (x: number, y: number, r: number, z: number, vx: number, vy: number) => {
      if (x < -r * 2 || x > width + r * 2 || y < -r * 2 || y > height + r * 2) return;

      ctx.save();
      ctx.translate(x, y);

      // Slight elongation along velocity for high-speed droplets
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 8) {
        const angle = Math.atan2(vy, vx);
        ctx.rotate(angle);
        ctx.scale(1.0 + Math.min(0.8, speed * 0.02), Math.max(0.65, 1.0 - speed * 0.015));
        ctx.rotate(-angle);
      }

      // Droplet body: translucent refractive radial gradient
      const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.05, 0, 0, r);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)'); // bright internal highlight
      grad.addColorStop(0.35, 'rgba(180, 255, 200, 0.35)'); // transparent green refraction
      grad.addColorStop(0.75, 'rgba(0, 160, 40, 0.45)'); // meniscus green shading
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.90)'); // bright outer rim

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Outer specular rim stroke
      ctx.lineWidth = Math.max(1, r * 0.12);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.stroke();

      // Primary crisp specular glint (top-left)
      const glintR = r * 0.28;
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.35, glintR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.fill();

      // Secondary soft crescent caustic (bottom-right)
      ctx.beginPath();
      ctx.arc(r * 0.25, r * 0.25, r * 0.35, 0.2, Math.PI * 0.7);
      ctx.lineWidth = Math.max(1, r * 0.15);
      ctx.strokeStyle = 'rgba(230, 255, 240, 0.75)';
      ctx.stroke();

      ctx.restore();
    };

    // Helper: draw dynamic crystalline water splash curtain / wave
    const drawSplashWave = (
      originX: number,
      originY: number,
      targetX: number,
      targetY: number,
      amplitude: number,
      thickness: number,
      wavePhase: number,
      alpha: number
    ) => {
      if (alpha <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      const segments = 40;
      const dx = (targetX - originX) / segments;
      const dy = (targetY - originY) / segments;
      const perpX = -(targetY - originY);
      const perpY = targetX - originX;
      const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
      const nx = perpX / perpLen;
      const ny = perpY / perpLen;

      // Crest points
      const crestPoints: [number, number][] = [];
      const basePoints: [number, number][] = [];

      for (let i = 0; i <= segments; i++) {
        const tNorm = i / segments;
        const envelope = Math.sin(tNorm * Math.PI); // 0 at ends, 1 at center
        const undulation = Math.sin(tNorm * 12.0 + wavePhase) * amplitude * envelope;
        const fineRipple = Math.sin(tNorm * 28.0 - wavePhase * 1.5) * (amplitude * 0.25) * envelope;
        const totalDisp = undulation + fineRipple;

        const px = originX + dx * i + nx * totalDisp;
        const py = originY + dy * i + ny * totalDisp;
        crestPoints.push([px, py]);

        // Base points with thickness
        const bx = px - nx * (thickness * envelope + 10);
        const by = py - ny * (thickness * envelope + 10);
        basePoints.push([bx, by]);
      }

      // Draw water body fill
      ctx.beginPath();
      ctx.moveTo(crestPoints[0][0], crestPoints[0][1]);
      for (let i = 1; i <= segments; i++) {
        ctx.lineTo(crestPoints[i][0], crestPoints[i][1]);
      }
      for (let i = segments; i >= 0; i--) {
        ctx.lineTo(basePoints[i][0], basePoints[i][1]);
      }
      ctx.closePath();

      // Gradient for transparent refractive water sheet
      const bodyGrad = ctx.createLinearGradient(originX, originY, targetX, targetY);
      bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      bodyGrad.addColorStop(0.3, 'rgba(160, 255, 190, 0.25)');
      bodyGrad.addColorStop(0.7, 'rgba(0, 180, 50, 0.35)');
      bodyGrad.addColorStop(1, 'rgba(255, 255, 255, 0.55)');
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Bright specular crest rim
      ctx.beginPath();
      ctx.moveTo(crestPoints[0][0], crestPoints[0][1]);
      for (let i = 1; i <= segments; i++) {
        ctx.lineTo(crestPoints[i][0], crestPoints[i][1]);
      }
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.stroke();

      // Thinner secondary specular edge
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(220, 255, 240, 1.0)';
      ctx.stroke();

      ctx.restore();
    };

    // 2. Draw Active Splash Waves for Timeline Phases
    // Splash Wave 1: Frame 0 to 140 (Sweeping diagonally from top-left)
    if (frame >= 0 && frame <= 140) {
      const progress = frame / 140;
      const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1.0;
      const ox = -200 + progress * (width * 0.4);
      const oy = -100 + progress * (height * 0.4);
      const tx = width * 0.3 + progress * (width * 0.4);
      const ty = height * 0.9 + progress * (height * 0.2);
      drawSplashWave(ox, oy, tx, ty, 85, 140, time * 8.0, alpha);
    }

    // Splash Wave 2: Frame 440 to 600 (Sweeping from top-right)
    if (frame >= 440 && frame <= 600) {
      const progress = (frame - 440) / 160;
      const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1.0;
      const ox = width * 1.1 - progress * (width * 0.35);
      const oy = -100 + progress * (height * 0.35);
      const tx = width * 0.45 - progress * (width * 0.35);
      const ty = height * 1.05;
      drawSplashWave(ox, oy, tx, ty, 95, 160, time * 7.5, alpha);
    }

    // Splash Wave 3: Frame 720 to 880 (Curving splash arc from right edge)
    if (frame >= 720 && frame <= 880) {
      const progress = (frame - 720) / 160;
      const alpha = progress < 0.15 ? progress / 0.15 : progress > 0.85 ? (1 - progress) / 0.15 : 1.0;
      const ox = width * 0.95;
      const oy = height * 0.1 + progress * (height * 0.2);
      const tx = width * 0.88;
      const ty = height * 0.95;
      drawSplashWave(ox, oy, tx, ty, 110, 150, time * 8.5, alpha);
    }

    // 3. Draw All 380+ Droplets with Ballistic Kinematics & Gravity
    const gravity = 0.35; // gravity in pixel/frame^2
    const drag = 0.985; // air drag

    for (let i = 0; i < dropletsRef.current.length; i++) {
      const d = dropletsRef.current[i];
      if (frame < d.burstFrame) continue;

      const age = frame - d.burstFrame;
      // Droplet active lifespan
      if (age > 260) continue;

      // Ballistic motion integration
      // vx decays slightly with drag
      const curVx = d.vx * Math.pow(drag, age);
      // vy has drag + gravity
      const curVy = d.vy * Math.pow(drag, age) + gravity * age;

      // Position: analytical integral of drag + gravity
      const decaySum = (1 - Math.pow(drag, age)) / (1 - drag);
      const curX = d.baseX + d.vx * decaySum;
      const curY = d.baseY + d.vy * decaySum + 0.5 * gravity * age * age;

      // Fade out at end of life
      let alpha = 1.0;
      if (age > 220) {
        alpha = (260 - age) / 40;
      }
      if (alpha <= 0.01) continue;

      ctx.save();
      ctx.globalAlpha = alpha;
      drawDroplet(curX, curY, d.radius, d.baseZ, curVx, curVy);
      ctx.restore();
    }
  }, [frame, width, height, fps, greenColor, dropletCount, splashSpeed, seed]);

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
