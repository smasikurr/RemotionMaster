import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";

export interface VcrFastForwardGreenScreenCanvasProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const VcrFastForwardGreenScreenCanvas: React.FC<VcrFastForwardGreenScreenCanvasProps> = ({
  width = 3840,
  height = 2160,
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Saturated Chroma Key Green (#23ff2c)
    ctx.fillStyle = "#23ff2c";
    ctx.fillRect(0, 0, width, height);

    // 2. Micro CRT Horizontal Scanlines (alternating 4px raster lines)
    ctx.fillStyle = "rgba(0, 35, 0, 0.025)";
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    // Deterministic PRNG seeded by frame
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 9973.123 + frame * 1337.54) * 43758.5453;
      return x - Math.floor(x);
    };

    // 3. Fast-Forward Helical Tracking Distortion Bands
    const bandSpeeds = [9.0, 14.0, 19.5, 25.0];
    const bandOffsets = [0, 550, 1100, 1650];

    for (let b = 0; b < bandSpeeds.length; b++) {
      const bandCenterY = (frame * bandSpeeds[b] + bandOffsets[b]) % (height + 350) - 175;
      const bandSpread = 60 + seededRandom(b * 13) * 70;

      const numLines = 10 + Math.floor(seededRandom(b * 27) * 12);
      for (let i = 0; i < numLines; i++) {
        const lineY = bandCenterY + (seededRandom(b * 41 + i) - 0.5) * bandSpread;
        if (lineY < -10 || lineY > height + 10) continue;

        const lineH = 3 + Math.floor(seededRandom(b * 53 + i) * 8);
        const lineX0 = seededRandom(b * 67 + i) * (width * 0.45);
        const lineLen = width * 0.35 + seededRandom(b * 79 + i) * (width * 0.65);

        const darkG = Math.floor(165 + seededRandom(b * 89 + i) * 60);
        const alpha = 0.35 + seededRandom(b * 97 + i) * 0.35;

        const grad = ctx.createLinearGradient(lineX0, lineY, lineX0 + lineLen, lineY);
        grad.addColorStop(0, "rgba(20, 220, 25, 0)");
        grad.addColorStop(0.12, `rgba(18, ${darkG}, 22, ${alpha})`);
        grad.addColorStop(0.88, `rgba(18, ${darkG}, 22, ${alpha})`);
        grad.addColorStop(1, "rgba(20, 220, 25, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(lineX0, lineY, lineLen, lineH);
      }
    }

    // 4. Ambient Horizontal Analog Tracking Streaks
    const ambientCount = 40 + Math.floor(seededRandom(101) * 20);
    for (let i = 0; i < ambientCount; i++) {
      const ly = Math.floor(seededRandom(i * 17) * height);
      const lh = 2 + Math.floor(seededRandom(i * 19) * 5);
      const lx = seededRandom(i * 23) * (width * 0.5);
      const lw = width * 0.25 + seededRandom(i * 29) * (width * 0.75);

      const alpha = 0.18 + seededRandom(i * 31) * 0.28;
      const grad = ctx.createLinearGradient(lx, ly, lx + lw, ly);
      grad.addColorStop(0, "rgba(20, 220, 25, 0)");
      grad.addColorStop(0.15, `rgba(15, 175, 20, ${alpha})`);
      grad.addColorStop(0.85, `rgba(15, 175, 20, ${alpha})`);
      grad.addColorStop(1, "rgba(20, 220, 25, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(lx, ly, lw, lh);
    }

    // 5. Top-Left OSD: "FF ▶▶"
    ctx.fillStyle = "#ffffff";
    const osdMarginX = 110;
    const osdMarginY = 210;
    const charH = 165;
    const charW = 105;
    const barThick = 34;
    const gap = 24;

    const drawF = (startX: number, startY: number) => {
      ctx.fillRect(startX, startY, barThick, charH);
      ctx.fillRect(startX, startY, charW, barThick);
      ctx.fillRect(startX, startY + Math.floor(charH * 0.44), Math.floor(charW * 0.85), barThick);
    };

    // F 1
    drawF(osdMarginX, osdMarginY);
    // F 2
    drawF(osdMarginX + charW + gap, osdMarginY);

    // Fast Forward double arrow "▶▶"
    const arrowX1 = osdMarginX + (charW + gap) * 2 + 35;
    const arrowW = 110;
    const arrowH = 155;
    const arrowY = osdMarginY + 5;

    const drawArrow = (ax: number) => {
      ctx.beginPath();
      ctx.moveTo(ax, arrowY);
      ctx.lineTo(ax + arrowW, arrowY + arrowH / 2);
      ctx.lineTo(ax, arrowY + arrowH);
      ctx.closePath();
      ctx.fill();
    };

    drawArrow(arrowX1);
    drawArrow(arrowX1 + arrowW + 18);

    // 6. Bottom-Right OSD Timecode: High-speed counter
    const tapeSecs = Math.floor((frame / 60.0) * 364.0);
    const hh = Math.floor(tapeSecs / 3600);
    const mm = Math.floor((tapeSecs % 3600) / 60);
    const ss = Math.floor(tapeSecs % 60);

    const tcStr = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

    const segMap: { [key: string]: string[] } = {
      "0": ["a", "b", "c", "d", "e", "f"],
      "1": ["b", "c"],
      "2": ["a", "b", "g", "e", "d"],
      "3": ["a", "b", "g", "c", "d"],
      "4": ["f", "g", "b", "c"],
      "5": ["a", "f", "g", "c", "d"],
      "6": ["a", "f", "e", "d", "c", "g"],
      "7": ["a", "b", "c"],
      "8": ["a", "b", "c", "d", "e", "f", "g"],
      "9": ["a", "f", "g", "b", "c", "d"],
    };

    const drawDigit = (char: string, x: number, y: number, w: number, h: number, th: number) => {
      const halfH = Math.floor(h / 2);
      const halfTh = Math.floor(th / 2);

      if (char === ":") {
        const dotSize = th;
        const centerX = x + Math.floor(w / 2) - halfTh;
        ctx.fillRect(centerX, y + Math.floor(h * 0.3) - halfTh, dotSize, dotSize);
        ctx.fillRect(centerX, y + Math.floor(h * 0.7) - halfTh, dotSize, dotSize);
        return;
      }

      const segs = segMap[char] || [];
      if (segs.includes("a")) ctx.fillRect(x, y, w, th);
      if (segs.includes("b")) ctx.fillRect(x + w - th, y, th, halfH + halfTh);
      if (segs.includes("c")) ctx.fillRect(x + w - th, y + halfH - halfTh, th, halfH + halfTh);
      if (segs.includes("d")) ctx.fillRect(x, y + h - th, w, th);
      if (segs.includes("e")) ctx.fillRect(x, y + halfH - halfTh, th, halfH + halfTh);
      if (segs.includes("f")) ctx.fillRect(x, y, th, halfH + halfTh);
      if (segs.includes("g")) ctx.fillRect(x, y + halfH - halfTh, w, th);
    };

    const colonW = 55;
    const spacing = 36;
    const totalTcW = 6 * charW + 2 * colonW + 7 * spacing;
    let curX = width - osdMarginX - totalTcW;
    const curY = height - 170 - charH;

    for (let i = 0; i < tcStr.length; i++) {
      const char = tcStr[i];
      if (char === ":") {
        drawDigit(":", curX, curY, colonW, charH, barThick);
        curX += colonW + spacing;
      } else {
        drawDigit(char, curX, curY, charW, charH, barThick);
        curX += charW + spacing;
      }
    }
  }, [frame, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};
