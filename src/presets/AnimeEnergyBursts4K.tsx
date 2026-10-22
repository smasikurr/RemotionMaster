import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * AnimeEnergyBursts4K
 * 2D hand-drawn anime energy splash, lightning bolts, and impact sparks on pure chroma green (#00FF00).
 * 4K UHD (3840x2160) @ 60 FPS, 10s loop (600 frames).
 */
export const AnimeEnergyBursts4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalFrames = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#00FF00";
    ctx.fillRect(0, 0, width, height);

    for (let b = 0; b < 35; b++) {
      const burstStart = (b * 17.1) % totalFrames;
      const burstDuration = 12 + (b % 6);
      const localFrame = (frame - burstStart + totalFrames) % totalFrames;

      if (localFrame < burstDuration) {
        const cx = width * (0.2 + ((b * 0.37) % 0.6));
        const cy = height * (0.2 + ((b * 0.43) % 0.6));

        const progress = localFrame / burstDuration;
        let alpha = 1;
        if (progress < 0.2) {
          alpha = progress / 0.2;
        } else if (progress > 0.35) {
          alpha = 1 - (progress - 0.35) / 0.65;
        }

        const expansion = progress * (280 + (b % 4) * 100);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.lineCap = "round";

        const numBolts = 6 + (b % 3);
        for (let bolt = 0; bolt < numBolts; bolt++) {
          const baseAngle = (bolt / numBolts) * Math.PI * 2 + (b * 0.5);
          const boltLen = expansion * (0.8 + (bolt % 3) * 0.3);

          ctx.beginPath();
          ctx.moveTo(cx, cy);

          let curX = cx;
          let curY = cy;
          const segments = 4;
          for (let s = 1; s <= segments; s++) {
            const segDist = (boltLen / segments) * s;
            const jitterAngle = baseAngle + Math.sin(s * 7 + b + localFrame) * 0.4;
            const nextX = cx + Math.cos(jitterAngle) * segDist;
            const nextY = cy + Math.sin(jitterAngle) * segDist;

            const midX = (curX + nextX) / 2 + Math.cos(s * 3 + b) * 25;
            const midY = (curY + nextY) / 2 + Math.sin(s * 3 + b) * 25;
            ctx.quadraticCurveTo(midX, midY, nextX, nextY);

            curX = nextX;
            curY = nextY;
          }

          ctx.strokeStyle = "#FFE600";
          ctx.lineWidth = Math.max(2, 10 - progress * 8);
          ctx.stroke();

          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = Math.max(1, 5 - progress * 4);
          ctx.stroke();
        }

        if (progress > 0.1 && progress < 0.7) {
          ctx.beginPath();
          ctx.arc(cx, cy, expansion * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = "#FFE600";
          ctx.lineWidth = 4 * (1 - progress);
          ctx.stroke();
        }

        for (let sp = 0; sp < 8; sp++) {
          const spAngle = sp * (Math.PI / 4) + progress * 2;
          const spDist = expansion * (1.1 + (sp % 2) * 0.3);
          const spX = cx + Math.cos(spAngle) * spDist;
          const spY = cy + Math.sin(spAngle) * spDist;

          ctx.fillStyle = sp % 2 === 0 ? "#FFFFFF" : "#FFE600";
          ctx.beginPath();
          ctx.arc(spX, spY, Math.max(1, 4 * (1 - progress)), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }
  }, [frame, width, height]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#00FF00" }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
