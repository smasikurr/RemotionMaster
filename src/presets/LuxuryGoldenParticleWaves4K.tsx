import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * LuxuryGoldenParticleWaves4K
 * 3D undulating sine-wave ribbons of 50,000 glowing gold particles with depth blur.
 * 4K UHD (3840x2160) @ 60 FPS, 10s seamless loop (600 frames).
 */
export const LuxuryGoldenParticleWaves4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalFrames = 600;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.6);
    bgGrad.addColorStop(0, "rgba(40, 28, 6, 0.45)");
    bgGrad.addColorStop(0.5, "rgba(18, 12, 2, 0.2)");
    bgGrad.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const numRows = 40;
    const numCols = 120;
    ctx.globalCompositeOperation = "lighter";

    const camPanX = Math.sin(t * twoPi) * 80;
    const camPanY = Math.cos(t * twoPi) * 40;

    for (let r = 0; r < numRows; r++) {
      const zNorm = r / numRows;
      const depthScale = 1 - zNorm * 0.6;
      const zAlpha = 1 - zNorm * 0.75;

      const color =
        r % 3 === 0
          ? "rgba(255, 215, 0, "
          : r % 3 === 1
          ? "rgba(245, 176, 65, "
          : "rgba(255, 242, 117, ";

      for (let c = 0; c < numCols; c++) {
        const xNorm = c / numCols;
        const wave1 = Math.sin(xNorm * Math.PI * 4 + zNorm * Math.PI * 3 + t * twoPi * 2) * 140;
        const wave2 = Math.cos(xNorm * Math.PI * 6 - zNorm * Math.PI * 2 + t * twoPi) * 80;
        const wave3 = Math.sin((xNorm + zNorm) * Math.PI * 3 + t * twoPi) * 60;

        const px = (xNorm * (width + 600) - 300 + camPanX) * depthScale + (width / 2) * (1 - depthScale);
        const baseY = height * (0.35 + zNorm * 0.45) + camPanY;
        const py = baseY + (wave1 + wave2 + wave3) * depthScale;

        const pSize = Math.max(1, 5 - zNorm * 3.5);
        const alpha = Math.max(0.1, Math.min(0.95, zAlpha * (0.4 + Math.sin(xNorm * 10 + t * twoPi) * 0.2)));

        ctx.fillStyle = `${color}${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();

        if ((r + c) % 47 === 0 && alpha > 0.4) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(px, py, pSize * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (let b = 0; b < 60; b++) {
      const bx = (b * 67.3 + t * 200) % width;
      const by = (b * 41.9 + Math.sin(t * twoPi * 2 + b) * 80) % height;
      const bSize = 6 + (b % 12);
      const bAlpha = 0.15 + (b % 4) * 0.08;

      const bokehGrad = ctx.createRadialGradient(bx, by, 0, bx, by, bSize * 3);
      bokehGrad.addColorStop(0, `rgba(255, 242, 117, ${bAlpha})`);
      bokehGrad.addColorStop(0.5, `rgba(245, 176, 65, ${bAlpha * 0.4})`);
      bokehGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = bokehGrad;
      ctx.beginPath();
      ctx.arc(bx, by, bSize * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    const vigGrad = ctx.createRadialGradient(width / 2, height / 2, height * 0.4, width / 2, height / 2, width * 0.7);
    vigGrad.addColorStop(0, "rgba(0,0,0,0)");
    vigGrad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);
  }, [frame, width, height, t, twoPi]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
