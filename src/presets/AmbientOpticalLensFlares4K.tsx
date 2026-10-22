import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * AmbientOpticalLensFlares4K
 * Cinematic horizontal cyan anamorphic light streaks and warm amber circular bokeh reflections.
 * 4K UHD (3840x2160) @ 60 FPS, 10s loop (600 frames).
 */
export const AmbientOpticalLensFlares4K: React.FC = () => {
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

    ctx.globalCompositeOperation = "lighter";

    const flareX = width * (0.5 + Math.sin(t * twoPi) * 0.38);
    const flareY = height * (0.48 + Math.cos(t * twoPi * 2) * 0.16);

    const centerX = width / 2;
    const centerY = height / 2;
    const vecX = flareX - centerX;
    const vecY = flareY - centerY;

    const intensity = Math.sin(t * twoPi * 3) * 0.18 + 0.82;

    const streakGrad = ctx.createLinearGradient(0, flareY, width, flareY);
    streakGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    streakGrad.addColorStop(0.2, "rgba(56, 229, 255, 0.4)");
    streakGrad.addColorStop(0.48, "rgba(255, 255, 255, 0.95)");
    streakGrad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
    streakGrad.addColorStop(0.52, "rgba(255, 255, 255, 0.95)");
    streakGrad.addColorStop(0.8, "rgba(56, 229, 255, 0.4)");
    streakGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = streakGrad;
    ctx.fillRect(0, flareY - 8 * intensity, width, 16 * intensity);

    const coreGrad = ctx.createLinearGradient(0, flareY, width, flareY);
    coreGrad.addColorStop(0.1, "rgba(0,0,0,0)");
    coreGrad.addColorStop(0.45, "rgba(255,255,255,0.9)");
    coreGrad.addColorStop(0.55, "rgba(255,255,255,0.9)");
    coreGrad.addColorStop(0.9, "rgba(0,0,0,0)");
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, flareY - 1.5, width, 3);

    const burstGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 320 * intensity);
    burstGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    burstGrad.addColorStop(0.2, "rgba(56, 229, 255, 0.75)");
    burstGrad.addColorStop(0.5, "rgba(0, 102, 255, 0.35)");
    burstGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = burstGrad;
    ctx.beginPath();
    ctx.arc(flareX, flareY, 320 * intensity, 0, Math.PI * 2);
    ctx.fill();

    const ghosts = [
      { factor: -0.8, size: 160, color: "rgba(255, 158, 59, 0.35)" },
      { factor: -0.4, size: 90, color: "rgba(255, 184, 0, 0.25)" },
      { factor: 0.3, size: 120, color: "rgba(56, 229, 255, 0.3)" },
      { factor: 0.7, size: 210, color: "rgba(255, 158, 59, 0.28)" },
      { factor: 1.1, size: 260, color: "rgba(255, 110, 0, 0.2)" },
    ];

    ghosts.forEach((g) => {
      const gx = centerX - vecX * g.factor;
      const gy = centerY - vecY * g.factor;
      const gGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, g.size * intensity);
      gGrad.addColorStop(0, g.color);
      gGrad.addColorStop(0.7, g.color.replace(/[\d\.]+\)$/, "0.1)"));
      gGrad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = gGrad;
      ctx.beginPath();
      ctx.arc(gx, gy, g.size * intensity, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let d = 0; d < 80; d++) {
      const dx = (d * 91.7 + t * 150) % width;
      const dy = (d * 53.3 + Math.sin(t * twoPi + d) * 60) % height;
      const dSize = 1.5 + (d % 3.5);
      const dAlpha = 0.2 + (d % 4) * 0.15;

      ctx.fillStyle = d % 2 === 0 ? `rgba(56, 229, 255, ${dAlpha})` : `rgba(255, 158, 59, ${dAlpha})`;
      ctx.beginPath();
      ctx.arc(dx, dy, dSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, t, twoPi]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
