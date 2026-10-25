import React, { useEffect, useRef } from "react";

interface ConcentricNeonRadarArcsCanvasProps {
  width: number;
  height: number;
  frame: number;
  fps: number;
}

export const ConcentricNeonRadarArcsCanvas: React.FC<
  ConcentricNeonRadarArcsCanvasProps
> = ({ width, height, frame, fps }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas to 100% solid pure black #000000
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.5;
    const t = frame / fps; // elapsed seconds

    // Intro / Outro envelope
    let introScale = 1.0;
    if (frame < 90) {
      const p = frame / 90;
      introScale = 0.2 + 0.8 * (1 - Math.pow(1 - p, 3));
    }

    let outroAlpha = 1.0;
    let outroScale = 1.0;
    if (frame > 510) {
      const p = (frame - 510) / 90;
      outroScale = Math.max(0.05, 1 - Math.pow(p, 2));
      outroAlpha = Math.max(0, 1 - p);
    }

    if (outroAlpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = outroAlpha;

    // Subtle organic breathing
    const breathe = 1.0 + 0.015 * Math.sin(t * Math.PI * 1.5);

    // Warm Golden Amber Palette
    const goldPalette = {
      core: "#ffffff",
      tube: "#ffbe00",
      glowMid: "#ff8c00",
      glowWide: "rgba(255, 135, 0, 0.55)",
    };

    // Electric Royal Indigo / Sky Violet Palette
    const bluePalette = {
      core: "#ffffff",
      tube: "#6875ff",
      glowMid: "#4836ff",
      glowWide: "rgba(65, 40, 255, 0.55)",
    };

    // Tracks configuration
    // Calibrated to match reference istockphoto-2201244782-640_adpp_is.mp4 1:1
    const tracks = [
      {
        rad: 185 * breathe,
        baseSpan: 154 * (Math.PI / 180),
        speed: 0.28, // rev per sec, clockwise
        offsetAngle: 5.81, // radians (calibrated to reference f_04)
        strokeW: 16,
      },
      {
        rad: 485 * breathe,
        baseSpan: 156 * (Math.PI / 180),
        speed: -0.22, // rev per sec, counter-clockwise
        offsetAngle: 4.32, // radians (calibrated to reference f_04)
        strokeW: 18,
      },
      {
        rad: 795 * breathe,
        baseSpan: 152 * (Math.PI / 180),
        speed: 0.25, // rev per sec, clockwise
        offsetAngle: 0.96, // radians (calibrated to reference f_04)
        strokeW: 20,
      },
    ];

    // Helper: draw single neon arc with tail-to-head luminance taper and rich bloom
    const drawNeonArc = (
      radius: number,
      headAngle: number,
      span: number,
      isClockwise: boolean,
      palette: typeof goldPalette,
      baseStrokeW: number
    ) => {
      const steps = 36;
      const angleDir = isClockwise ? 1 : -1;
      const tailAngle = headAngle - span * angleDir;

      // Pass 1: Wide Deep Atmospheric Diffuse Bloom
      ctx.save();
      ctx.lineCap = "round";
      ctx.shadowColor = palette.glowMid;
      ctx.shadowBlur = 100;
      ctx.strokeStyle = palette.glowWide;
      ctx.lineWidth = baseStrokeW * 3.2;
      ctx.beginPath();
      if (angleDir > 0) {
        ctx.arc(cx, cy, radius, tailAngle, headAngle, false);
      } else {
        ctx.arc(cx, cy, radius, headAngle, tailAngle, false);
      }
      ctx.stroke();
      ctx.restore();

      // Pass 2: Mid Saturated Neon Aura
      ctx.save();
      ctx.lineCap = "round";
      ctx.shadowColor = palette.glowMid;
      ctx.shadowBlur = 45;
      ctx.strokeStyle = palette.tube;
      ctx.globalAlpha = outroAlpha * 0.70;
      ctx.lineWidth = baseStrokeW * 1.8;
      ctx.beginPath();
      if (angleDir > 0) {
        ctx.arc(cx, cy, radius, tailAngle, headAngle, false);
      } else {
        ctx.arc(cx, cy, radius, headAngle, tailAngle, false);
      }
      ctx.stroke();
      ctx.restore();

      // Pass 3: Saturated Neon Tube with Head-to-Tail Luminance Gradient
      ctx.save();
      ctx.lineCap = "round";
      for (let i = 0; i < steps; i++) {
        const u0 = i / steps;
        const u1 = (i + 1) / steps;
        const a0 = tailAngle + u0 * span * angleDir;
        const a1 = tailAngle + u1 * span * angleDir;

        const intensity = 0.38 + 0.62 * Math.pow(u1, 0.65);

        ctx.strokeStyle = palette.tube;
        ctx.globalAlpha = outroAlpha * intensity;
        ctx.lineWidth = baseStrokeW * 1.1;
        ctx.shadowColor = palette.glowMid;
        ctx.shadowBlur = 22 * intensity;

        ctx.beginPath();
        if (angleDir > 0) {
          ctx.arc(cx, cy, radius, a0, a1, false);
        } else {
          ctx.arc(cx, cy, radius, a1, a0, false);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Pass 4: Specular White-Hot Core
      ctx.save();
      ctx.lineCap = "round";
      for (let i = 0; i < steps; i++) {
        const u0 = i / steps;
        const u1 = (i + 1) / steps;
        const a0 = tailAngle + u0 * span * angleDir;
        const a1 = tailAngle + u1 * span * angleDir;

        const coreAlpha = 0.35 + 0.65 * Math.pow(u1, 1.1);

        ctx.strokeStyle = palette.core;
        ctx.globalAlpha = outroAlpha * coreAlpha;
        ctx.lineWidth = baseStrokeW * 0.36;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        if (angleDir > 0) {
          ctx.arc(cx, cy, radius, a0, a1, false);
        } else {
          ctx.arc(cx, cy, radius, a1, a0, false);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Leading Head Brilliant Bulb
      const headX = cx + radius * Math.cos(headAngle);
      const headY = cy + radius * Math.sin(headAngle);
      ctx.save();
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(headX, headY, baseStrokeW * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Draw all 3 concentric tracks
    tracks.forEach((tr) => {
      const activeSpan = tr.baseSpan * introScale * outroScale;
      const angle = tr.offsetAngle + t * tr.speed * Math.PI * 2;
      const isCW = tr.speed >= 0;

      // Arc A: Gold
      const goldHead = angle;
      drawNeonArc(tr.rad, goldHead, activeSpan, isCW, goldPalette, tr.strokeW);

      // Arc B: Blue (180 degrees opposite)
      const blueHead = angle + Math.PI;
      drawNeonArc(tr.rad, blueHead, activeSpan, isCW, bluePalette, tr.strokeW);
    });

    // Central Bullseye Dot (pulsating glowing core)
    const centerPulse = 0.75 + 0.25 * Math.sin(t * Math.PI * 2.5);
    ctx.save();
    ctx.shadowColor = "#ffa200";
    ctx.shadowBlur = 26;
    ctx.fillStyle = `rgba(255, 205, 120, ${centerPulse})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    // Hot specular center pin
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }, [width, height, frame, fps]);

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
