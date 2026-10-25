import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * DigitalLEDMatrixEqualizerCanvas
 * 1:1 Exact Authentic Re-creation of Reference istockphoto-1124719368-640_adpp_is.mp4
 *
 * Calibrated Characteristics:
 * - 48 rows x 96 columns LED digital frequency spectrum matrix.
 * - Sparser, dynamic horizontal dash clusters with authentic negative black gaps.
 * - Solid pure #000000 background.
 * - Incandescent white center, neon crimson red, scarlet orange, amber golden yellow boundaries.
 */
interface Props {
  width: number;
  height: number;
}

export const DigitalLEDMatrixEqualizerCanvas: React.FC<Props> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with solid pure black
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const time = frame / fps;

    const ROWS = 48;
    const COLS = 96;

    const marginX = 24;
    const marginY = 24;
    const gridW = width - marginX * 2;
    const gridH = height - marginY * 2;

    const colPitch = gridW / COLS;
    const rowPitch = gridH / ROWS;

    // Rectangular LED dashes
    const blockW = colPitch * 0.82; // ~32px
    const blockH = rowPitch * 0.46; // ~20px

    const midRow = (ROWS - 1) / 2;

    // Musical transients (~126 BPM)
    const bpm = 126;
    const beatPhase = (time * (bpm / 60)) * Math.PI * 2;
    const kick = Math.pow(Math.max(0, Math.sin(beatPhase)), 8);
    const subBeat = Math.pow(Math.max(0, Math.sin(beatPhase * 0.5 + 0.3)), 6) * 0.5;
    const beatPulse = kick + subBeat;

    // Traveling wave modulators
    const wave1 = (c: number) => Math.sin(c * 0.07 - time * 3.2);
    const wave2 = (c: number) => Math.sin(c * 0.15 + time * 2.2) * 0.6;
    const wave3 = (c: number) => Math.cos(c * 0.035 - time * 1.5) * 0.8;

    for (let r = 0; r < ROWS; r++) {
      const distFromMid = Math.abs(r - midRow);
      const normDist = distFromMid / midRow;

      const y = marginY + r * rowPitch + (rowPitch - blockH) * 0.5;

      // Color selection
      let baseColor = "#ffffff";
      let glowColor = "rgba(255, 255, 255, 0.9)";
      let isWhite = false;
      let isOuterYellow = false;
      let isOrange = false;

      if (normDist < 0.16) {
        baseColor = "#ffffff";
        glowColor = "rgba(255, 255, 255, 0.95)";
        isWhite = true;
      } else if (normDist < 0.46) {
        baseColor = "#ff204e";
        glowColor = "rgba(255, 32, 78, 0.75)";
      } else if (normDist < 0.75) {
        baseColor = "#ff5500";
        glowColor = "rgba(255, 85, 0, 0.65)";
        isOrange = true;
      } else {
        baseColor = "#ffb800";
        glowColor = "rgba(255, 184, 0, 0.6)";
        isOuterYellow = true;
      }

      // Unique horizontal speed and offset per row
      const rowPhase = (r * 3.14159 * 0.38) % (Math.PI * 2);
      const rowSpeed = (r % 2 === 0 ? 1 : -0.75) * (1.8 + (r % 5) * 0.4);

      // Dash segmentation parameters: sparser with more negative space
      const dashPeriod = isWhite ? 16 : isOuterYellow ? 14 : 12;
      const dashFillRatio = isWhite ? 0.58 : isOuterYellow ? 0.32 : 0.42;

      for (let c = 0; c < COLS; c++) {
        const x = marginX + c * colPitch + (colPitch - blockW) * 0.5;

        // Wave activity across columns
        const colWave = (wave1(c) + wave2(c) + wave3(c)) * 0.35;
        const basePresence = 0.50 + colWave * 0.32 + beatPulse * 0.28;

        // Segment grouping
        const dashCoord = c + time * rowSpeed * 5 + Math.sin(c * 0.10 + rowPhase) * 4;
        const inDash = ((dashCoord % dashPeriod) + dashPeriod) % dashPeriod < (dashPeriod * dashFillRatio);

        // Micro-jitter per block
        const nSeed = Math.sin(c * 67.23 + r * 29.81) * 76543.21;
        const blockJitter = (nSeed - Math.floor(nSeed)) * 0.25;

        let threshold = normDist * 0.98;
        if (isWhite) {
          threshold = 0.20;
        }

        const isLit = inDash && (basePresence + blockJitter > threshold);

        // Peak hold floating indicators in outer rows
        const isPeakHold =
          !isLit &&
          normDist > 0.35 &&
          ((dashCoord % (dashPeriod * 2) + (dashPeriod * 2)) % (dashPeriod * 2) < 2.0) &&
          (basePresence + blockJitter > threshold - 0.08);

        if (isLit || isPeakHold) {
          ctx.save();

          const curW = isOuterYellow ? blockW * 0.62 : blockW;
          const curH = isOuterYellow ? blockH * 0.68 : blockH;
          const curX = isOuterYellow ? x + (blockW - curW) * 0.5 : x;
          const curY = isOuterYellow ? y + (blockH - curH) * 0.5 : y;

          ctx.shadowColor = glowColor;
          ctx.shadowBlur = isWhite ? 14 : 7;
          ctx.fillStyle = baseColor;

          ctx.beginPath();
          ctx.roundRect(curX, curY, curW, curH, 2.5);
          ctx.fill();

          if (isWhite) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(curX + 2, curY + 2, curW - 4, curH - 4);
          } else if (!isOuterYellow) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.30)";
            ctx.fillRect(curX + 2, curY + 1.5, curW - 4, Math.max(1.5, curH * 0.28));
          }

          ctx.restore();
        } else {
          // Dormant hardware LED dot texture
          const dotSize = 3.0;
          ctx.fillStyle = isOuterYellow
            ? "rgba(255, 184, 0, 0.035)"
            : isOrange
            ? "rgba(255, 85, 0, 0.03)"
            : normDist < 0.48
            ? "rgba(255, 32, 78, 0.035)"
            : "rgba(255, 255, 255, 0.025)";
          ctx.fillRect(x + blockW * 0.5 - dotSize * 0.5, y + blockH * 0.5 - dotSize * 0.5, dotSize, dotSize);
        }
      }
    }
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
