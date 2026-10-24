import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";

export interface CartoonFireworksConfettiBurstsCanvasProps {
  width?: number;
  height?: number;
}

interface BurstConfig {
  startFrame: number;
  duration: number;
  type: "burst1" | "burst2" | "burst3" | "burst4" | "burst5";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const CartoonFireworksConfettiBurstsCanvas: React.FC<CartoonFireworksConfettiBurstsCanvasProps> = ({
  width = 3840,
  height = 2160,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pitch black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    const bursts: BurstConfig[] = [
      { startFrame: 0, duration: 52, type: "burst1" },
      { startFrame: 72, duration: 54, type: "burst2" },
      { startFrame: 150, duration: 48, type: "burst3" },
      { startFrame: 222, duration: 54, type: "burst4" },
      { startFrame: 295, duration: 56, type: "burst5" },
    ];

    for (const b of bursts) {
      if (frame >= b.startFrame && frame < b.startFrame + b.duration) {
        const localFrame = frame - b.startFrame;
        const progress = localFrame / b.duration;

        ctx.save();
        ctx.translate(cx, cy);

        if (b.type === "burst1") renderBurst1(ctx, progress);
        else if (b.type === "burst2") renderBurst2(ctx, progress);
        else if (b.type === "burst3") renderBurst3(ctx, progress);
        else if (b.type === "burst4") renderBurst4(ctx, progress);
        else if (b.type === "burst5") renderBurst5(ctx, progress);

        ctx.restore();
      }
    }
  }, [frame, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        backgroundColor: "#000000",
      }}
    />
  );
};

// ==========================================
// BURST 1: Calibrated Radial Dash Blast
// ==========================================
function renderBurst1(ctx: CanvasRenderingContext2D, p: number) {
  const opacity = p < 0.7 ? 1.0 : 1.0 - (p - 0.7) / 0.3;
  ctx.globalAlpha = opacity;

  const maxR = 640;
  const tipP = easeOutQuart(Math.min(1.0, p * 2.2));
  const rOuter = tipP * maxR;

  // Delayed tail travel so lines stay anchored to center longer
  const tailP = Math.max(0.0, (p - 0.38) / 0.62);
  const rInner = easeOutCubic(tailP) * (maxR * 0.95);

  const numRays = 24;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * 2 * Math.PI) / numRays;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    let color = "#38bdf8";
    let lenScale = 1.0;
    let width = 20;

    if (i % 3 === 0) {
      color = "#38bdf8"; // Light Sky Cyan
      lenScale = 1.0;
      width = 20;
    } else if (i % 3 === 1) {
      color = "#34d399"; // Mint green
      lenScale = 0.88;
      width = 17;
    } else {
      color = "#fbbf24"; // Golden amber outer floating dash
      lenScale = 0.98;
      width = 16;
    }

    let curOuter = rOuter * lenScale;
    let curInner = rInner * lenScale;

    // For the yellow marks, make them disconnected floating outer dashes!
    if (i % 3 === 2) {
      const dashLen = 50 * tipP;
      curInner = Math.max(curInner, curOuter - dashLen);
    }

    if (curOuter > curInner + 4) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(curInner * cosA, curInner * sinA);
      ctx.lineTo(curOuter * cosA, curOuter * sinA);
      ctx.stroke();
    }
  }

  // Glowing center light core
  if (p < 0.48) {
    const coreP = 1.0 - p / 0.48;
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.arc(0, 0, 32 * coreP, 0, Math.PI * 2);
    ctx.fill();

    // Small bright white center point
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 14 * coreP, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ==========================================
// BURST 2: Calibrated Confetti Popper
// ==========================================
function renderBurst2(ctx: CanvasRenderingContext2D, p: number) {
  const opacity = p < 0.7 ? 1.0 : 1.0 - (p - 0.7) / 0.3;
  ctx.globalAlpha = opacity;

  const maxR = 660;
  const tipP = easeOutQuart(Math.min(1.0, p * 2.1));
  const rOuter = tipP * maxR;

  const tailP = Math.max(0.0, (p - 0.36) / 0.64);
  const rInner = easeOutCubic(tailP) * (maxR * 0.95);

  // 18 Radial rays
  const numRays = 18;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * 2 * Math.PI) / numRays;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    let color = "#fbbf24";
    if (i % 3 === 0) color = "#fbbf24"; // Amber
    else if (i % 3 === 1) color = "#34d399"; // Mint
    else color = "#38bdf8"; // Cyan

    const curOuter = rOuter * 0.96;
    const curInner = rInner * 0.96;

    if (curOuter > curInner + 4) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 19;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(curInner * cosA, curInner * sinA);
      ctx.lineTo(curOuter * cosA, curOuter * sinA);
      ctx.stroke();
    }
  }

  // Confetti circles (prominent, colorful, wide scatter matching reference)
  const rng = seededRandom(4402);
  const numDots = 54;
  const dotColors = ["#f43f5e", "#fb7185", "#f43f5e", "#34d399", "#38bdf8", "#fbbf24", "#ffffff"];

  for (let d = 0; d < numDots; d++) {
    const dotAngle = rng() * Math.PI * 2;
    const speedCoeff = 0.15 + rng() * 0.72;
    const dotMaxDist = maxR * speedCoeff;
    const dotDist = easeOutCubic(p) * dotMaxDist;
    const dotRadius = (10 + rng() * 14) * (1.0 - p * 0.28);
    const dotColor = dotColors[Math.floor(rng() * dotColors.length)];

    const dx = dotDist * Math.cos(dotAngle);
    const dy = dotDist * Math.sin(dotAngle);

    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(dx, dy, Math.max(2, dotRadius), 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright core
  if (p < 0.45) {
    const cp = 1.0 - p / 0.45;
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(0, 0, 28 * cp, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 12 * cp, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ==========================================
// BURST 3: Calibrated Starburst / Spark
// ==========================================
function renderBurst3(ctx: CanvasRenderingContext2D, p: number) {
  const opacity = p < 0.65 ? 1.0 : 1.0 - (p - 0.65) / 0.35;
  ctx.globalAlpha = opacity;

  const maxR = 640;
  const tipP = easeOutQuart(Math.min(1.0, p * 2.4));
  const rOuter = tipP * maxR;

  const tailP = Math.max(0.0, (p - 0.38) / 0.62);
  const rInner = easeOutCubic(tailP) * (maxR * 0.95);

  const numRays = 32;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * 2 * Math.PI) / numRays;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const isCyan = i % 2 === 0;
    const color = isCyan ? "#38bdf8" : "#9333ea";
    const scale = isCyan ? 1.0 : 0.72;
    const width = isCyan ? 18 : 14;

    const curOuter = rOuter * scale;
    const curInner = rInner * scale;

    if (curOuter > curInner + 4) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(curInner * cosA, curInner * sinA);
      ctx.lineTo(curOuter * cosA, curOuter * sinA);
      ctx.stroke();
    }
  }

  // Center luminous star core
  if (p < 0.5) {
    const starP = 1.0 - p / 0.5;
    const starSize = 75 * starP;
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    for (let s = 0; s < 8; s++) {
      const a = (s * Math.PI) / 4;
      const r = s % 2 === 0 ? starSize : starSize * 0.36;
      const sx = r * Math.cos(a);
      const sy = r * Math.sin(a);
      if (s === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 16 * starP, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ==========================================
// BURST 4: Calibrated Festive Celebration Popper
// ==========================================
function renderBurst4(ctx: CanvasRenderingContext2D, p: number) {
  const opacity = p < 0.7 ? 1.0 : 1.0 - (p - 0.7) / 0.3;
  ctx.globalAlpha = opacity;

  const maxR = 660;
  const tipP = easeOutQuart(Math.min(1.0, p * 2.1));
  const rOuter = tipP * maxR;

  const tailP = Math.max(0.0, (p - 0.36) / 0.64);
  const rInner = easeOutCubic(tailP) * (maxR * 0.95);

  // 20 Rays
  const numRays = 20;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * 2 * Math.PI) / numRays;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    let color = "#2563eb";
    if (i % 3 === 0) color = "#06b6d4";
    else if (i % 3 === 1) color = "#10b981";
    else color = "#3b82f6";

    const curOuter = rOuter * 0.95;
    const curInner = rInner * 0.95;

    if (curOuter > curInner + 4) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 19;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(curInner * cosA, curInner * sinA);
      ctx.lineTo(curOuter * cosA, curOuter * sinA);
      ctx.stroke();
    }
  }

  // 56 Confetti dots
  const rng = seededRandom(4404);
  const numDots = 56;
  const dotColors = ["#a855f7", "#c084fc", "#e879f9", "#38bdf8", "#06b6d4", "#2563eb", "#34d399"];

  for (let d = 0; d < numDots; d++) {
    const dotAngle = rng() * Math.PI * 2;
    const speedCoeff = 0.15 + rng() * 0.72;
    const dotMaxDist = maxR * speedCoeff;
    const dotDist = easeOutCubic(p) * dotMaxDist;
    const dotRadius = (10 + rng() * 14) * (1.0 - p * 0.28);
    const dotColor = dotColors[Math.floor(rng() * dotColors.length)];

    const dx = dotDist * Math.cos(dotAngle);
    const dy = dotDist * Math.sin(dotAngle);

    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(dx, dy, Math.max(2, dotRadius), 0, Math.PI * 2);
    ctx.fill();
  }

  // Center core
  if (p < 0.45) {
    const cp = 1.0 - p / 0.45;
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(0, 0, 30 * cp, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 14 * cp, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ==========================================
// BURST 5: Calibrated Grand Finale Starburst & Sparkler Ring
// ==========================================
function renderBurst5(ctx: CanvasRenderingContext2D, p: number) {
  const opacity = p < 0.72 ? 1.0 : 1.0 - (p - 0.72) / 0.28;
  ctx.globalAlpha = opacity;

  const maxR = 650;
  const tipP = easeOutQuart(Math.min(1.0, p * 2.2));
  const rOuter = tipP * maxR;

  const tailP = Math.max(0.0, (p - 0.38) / 0.62);
  const rInner = easeOutCubic(tailP) * (maxR * 0.95);

  const numRays = 24;
  for (let i = 0; i < numRays; i++) {
    const angle = (i * 2 * Math.PI) / numRays;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const isCyan = i % 2 === 0;
    const color = isCyan ? "#38bdf8" : "#d946ef";
    const scale = isCyan ? 1.0 : 0.76;
    const width = isCyan ? 19 : 15;

    const curOuter = rOuter * scale;
    const curInner = rInner * scale;

    if (curOuter > curInner + 4) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(curInner * cosA, curInner * sinA);
      ctx.lineTo(curOuter * cosA, curOuter * sinA);
      ctx.stroke();
    }
  }

  // Outer expanding spark ring
  if (p > 0.25) {
    const ringP = (p - 0.25) / 0.75;
    const ringR = (0.72 + easeOutCubic(ringP) * 0.42) * maxR;
    const ringAlpha = (1.0 - ringP) * opacity;
    ctx.save();
    ctx.globalAlpha = Math.max(0, ringAlpha);

    const ringDots = 24;
    for (let r = 0; r < ringDots; r++) {
      const a = (r * 2 * Math.PI) / ringDots;
      const rx = ringR * Math.cos(a);
      const ry = ringR * Math.sin(a);
      ctx.fillStyle = r % 2 === 0 ? "#38bdf8" : "#e879f9";
      ctx.beginPath();
      ctx.arc(rx, ry, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Center starflare
  if (p < 0.48) {
    const starP = 1.0 - p / 0.48;
    const starSize = 70 * starP;
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    for (let s = 0; s < 8; s++) {
      const a = (s * Math.PI) / 4;
      const r = s % 2 === 0 ? starSize : starSize * 0.36;
      const sx = r * Math.cos(a);
      const sy = r * Math.sin(a);
      if (s === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 16 * starP, 0, Math.PI * 2);
    ctx.fill();
  }
}
