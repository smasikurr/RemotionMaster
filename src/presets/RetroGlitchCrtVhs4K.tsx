import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * RetroGlitchCrtVhs4K
 * Analog VHS tracking noise, CRT cathode scanlines, and RGB chromatic distortion overlay.
 * 4K UHD (3840x2160) @ 60 FPS, 10s loop (600 frames).
 */
export const RetroGlitchCrtVhs4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    for (let i = 0; i < 1500; i++) {
      const rx = (Math.sin(frame * 93.7 + i * 13.1) * 0.5 + 0.5) * width;
      const ry = (Math.cos(frame * 47.3 + i * 29.7) * 0.5 + 0.5) * height;
      const rw = 2 + (i % 6);
      ctx.fillRect(rx, ry, rw, 1.5);
    }

    const trackingRoll = (frame * 3) % 240;
    const trackingY = height - 260 + trackingRoll;
    if (trackingY > height - 350) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      for (let bar = 0; bar < 12; bar++) {
        const by = trackingY + bar * 8;
        const bHeight = 4 + (bar % 3) * 2;
        const bOffset = Math.sin(frame * 0.8 + bar) * 40;
        ctx.fillRect(0, by, width + bOffset, bHeight);
      }
    }

    const isGlitchSpike = frame % 45 < 4 || frame % 120 < 6;
    if (isGlitchSpike) {
      const glitchY = ((frame * 87) % (height - 300)) + 150;
      const glitchHeight = 35 + (frame % 30);

      ctx.fillStyle = "rgba(255, 0, 50, 0.6)";
      ctx.fillRect(-25, glitchY, width, glitchHeight);

      ctx.fillStyle = "rgba(0, 240, 255, 0.6)";
      ctx.fillRect(25, glitchY + 4, width, glitchHeight);

      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.fillRect(0, glitchY + 8, width, 6);
    }
  }, [frame, width, height]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.45) 4px, rgba(0, 0, 0, 0.45) 6px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 140px rgba(0, 0, 0, 0.9)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
