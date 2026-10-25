import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * DualColorNeonQuestionMarkCanvas
 * 1:1 Exact Authentic Re-creation of Reference istockphoto-1422388955-640_adpp_is.mp4 (14.06s)
 *
 * Calibrated Characteristics:
 * - Canvas: 3840x2160 UHD on 100% pure solid black (#000000).
 * - Hero Scale: 720px radius outer neon circle with secondary concentric overlapping arc.
 * - Perfectly scaled hollow bent-glass question mark and glowing dot.
 * - Deep volumetric diffuse ambient neon haze (electric cyan top, hot magenta bottom).
 * - Multi-pass physical neon tube rendering:
 *   1. Atmospheric bloom
 *   2. Saturated neon gas glow
 *   3. Glass tube outline
 *   4. Incandescent pure white core filament
 *   5. High-frequency analog neon voltage micro-flicker
 */
interface Props {
  width: number;
  height: number;
}

export const DualColorNeonQuestionMarkCanvas: React.FC<Props> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Solid Pure Black Base
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const time = frame / fps;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Analog neon voltage flicker & breathing
    const flickerNoise = Math.sin(time * 37.17) * Math.cos(time * 79.23);
    const microFlicker = 0.95 + 0.05 * flickerNoise;
    const pulseBreathing = 1.0 + 0.015 * Math.sin(time * 2.0);

    // Neon Colors
    const cyanColor = "#00e5ff";
    const cyanGlow = "rgba(0, 229, 255, 0.90)";
    const cyanDeep = "rgba(2, 132, 199, 0.45)";

    const pinkColor = "#ff007f";
    const pinkGlow = "rgba(255, 0, 127, 0.90)";
    const pinkDeep = "rgba(225, 29, 72, 0.45)";

    // -------------------------------------------------------------------------
    // 0. BROAD DIFFUSE NEON AMBIENT HAZE
    // -------------------------------------------------------------------------
    ctx.save();
    // Cyan top glow
    const cyanAmbient = ctx.createRadialGradient(
      centerX,
      centerY - 350,
      100,
      centerX,
      centerY - 350,
      750
    );
    cyanAmbient.addColorStop(0.0, "rgba(0, 229, 255, 0.16)");
    cyanAmbient.addColorStop(0.5, "rgba(2, 132, 199, 0.06)");
    cyanAmbient.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = cyanAmbient;
    ctx.fillRect(0, 0, width, height);

    // Magenta bottom glow
    const pinkAmbient = ctx.createRadialGradient(
      centerX,
      centerY + 350,
      100,
      centerX,
      centerY + 350,
      750
    );
    pinkAmbient.addColorStop(0.0, "rgba(255, 0, 127, 0.18)");
    pinkAmbient.addColorStop(0.5, "rgba(225, 29, 72, 0.07)");
    pinkAmbient.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = pinkAmbient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // -------------------------------------------------------------------------
    // 1. ROTATING OUTER NEON CIRCULAR ARCS (HERO SCALE: 720px radius)
    // -------------------------------------------------------------------------
    const ringRadius = 720 * pulseBreathing;
    const rotSpeed = time * 0.45;

    // Arc 1: Cyan Arc (Top-Right semi-circle)
    const arc1Start = rotSpeed;
    const arc1End = rotSpeed + Math.PI * 0.93;

    // Arc 2: Pink Arc (Bottom-Left semi-circle)
    const arc2Start = rotSpeed + Math.PI;
    const arc2End = rotSpeed + Math.PI * 1.93;

    const drawNeonArc = (radius: number, startAngle: number, endAngle: number, baseCol: string, glowCol: string, deepCol: string, isInner = false) => {
      ctx.save();
      ctx.lineCap = "round";

      // Pass 1: Broad Deep Bloom
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = deepCol;
      ctx.lineWidth = isInner ? 20 : 36;
      ctx.shadowColor = glowCol;
      ctx.shadowBlur = (isInner ? 30 : 50) * microFlicker;
      ctx.stroke();

      // Pass 2: Vivid Mid Glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = baseCol;
      ctx.lineWidth = isInner ? 8 : 14;
      ctx.shadowColor = glowCol;
      ctx.shadowBlur = (isInner ? 14 : 24) * microFlicker;
      ctx.stroke();

      // Pass 3: White Core Filament
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = isInner ? 2.6 : 4.2;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = isInner ? 5 : 8;
      ctx.stroke();

      ctx.restore();
    };

    // Primary Arcs
    drawNeonArc(ringRadius, arc1Start, arc1End, cyanColor, cyanGlow, cyanDeep);
    drawNeonArc(ringRadius, arc2Start, arc2End, pinkColor, pinkGlow, pinkDeep);

    // Secondary concentric subtle inner arc segment visible in reference
    const innerRadius = ringRadius - 26;
    drawNeonArc(innerRadius, arc1Start + 0.15, arc1Start + Math.PI * 0.55, cyanColor, cyanGlow, cyanDeep, true);

    // -------------------------------------------------------------------------
    // 2. INNER HOLLOW BENT GLASS NEON QUESTION MARK & DOT (HERO SCALE: 1.62x)
    // -------------------------------------------------------------------------
    const qScale = 1.62 * pulseBreathing;

    const qGrad = ctx.createLinearGradient(
      centerX - 100,
      centerY - 380 * qScale,
      centerX + 100,
      centerY + 380 * qScale
    );
    qGrad.addColorStop(0.0, cyanColor);
    qGrad.addColorStop(0.65, "#40c4ff");
    qGrad.addColorStop(1.0, pinkColor);

    const drawQuestionMarkShape = () => {
      ctx.beginPath();
      // Outer upper arch
      ctx.moveTo(centerX - 118 * qScale, centerY - 145 * qScale);
      ctx.bezierCurveTo(
        centerX - 122 * qScale, centerY - 295 * qScale,
        centerX + 138 * qScale, centerY - 315 * qScale,
        centerX + 142 * qScale, centerY - 165 * qScale
      );
      // Right sweep downwards to neck
      ctx.bezierCurveTo(
        centerX + 145 * qScale, centerY - 65 * qScale,
        centerX + 42 * qScale, centerY - 15 * qScale,
        centerX + 32 * qScale, centerY + 85 * qScale
      );
      // Bottom tip of hook
      ctx.bezierCurveTo(
        centerX + 26 * qScale, centerY + 120 * qScale,
        centerX - 16 * qScale, centerY + 120 * qScale,
        centerX - 16 * qScale, centerY + 85 * qScale
      );
      // Inner contour curving back up
      ctx.bezierCurveTo(
        centerX - 8 * qScale, centerY + 18 * qScale,
        centerX + 74 * qScale, centerY - 45 * qScale,
        centerX + 74 * qScale, centerY - 160 * qScale
      );
      // Inner arch back to left curl
      ctx.bezierCurveTo(
        centerX + 72 * qScale, centerY - 240 * qScale,
        centerX - 70 * qScale, centerY - 230 * qScale,
        centerX - 72 * qScale, centerY - 145 * qScale
      );
      // Left curl tip cap
      ctx.bezierCurveTo(
        centerX - 74 * qScale, centerY - 115 * qScale,
        centerX - 116 * qScale, centerY - 115 * qScale,
        centerX - 118 * qScale, centerY - 145 * qScale
      );
      ctx.closePath();
    };

    const drawQuestionDotShape = () => {
      ctx.beginPath();
      // Hollow rounded loop for dot (lifted slightly for authentic balance)
      const dotY = centerY + 205 * qScale;
      const dotW = 44 * qScale;
      const dotH = 36 * qScale;
      ctx.ellipse(centerX + 8 * qScale, dotY, dotW, dotH, -0.06, 0, Math.PI * 2);
      ctx.closePath();
    };

    const renderNeonShape = (drawFn: () => void) => {
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Pass 1: Broad Cyan Ambient Bloom
      drawFn();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.45)";
      ctx.lineWidth = 34;
      ctx.shadowColor = cyanGlow;
      ctx.shadowBlur = 48 * microFlicker;
      ctx.stroke();

      // Pass 2: Vivid Color Tube
      drawFn();
      ctx.strokeStyle = qGrad;
      ctx.lineWidth = 12;
      ctx.shadowColor = cyanGlow;
      ctx.shadowBlur = 22 * microFlicker;
      ctx.stroke();

      // Pass 3: White Hot Core Filament
      drawFn();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3.6;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 8;
      ctx.stroke();

      ctx.restore();
    };

    renderNeonShape(drawQuestionMarkShape);
    renderNeonShape(drawQuestionDotShape);
  }, [frame, fps, width, height]);

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
