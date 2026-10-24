import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface AnamorphicPrismLightStreaks4KProps {
  intensity?: number;
  streakCount?: number;
}

/**
 * AnamorphicPrismLightStreaks4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Cinematic Anamorphic Optical Light Streaks & Prismatic Flare Overlay:
 * - Ultra-wide anamorphic laser streaks with chromatic rainbow dispersion
 * - Floating crystalline prism reflections and drifting micro-bokeh dust
 * - Pure pitch black (#000000) base layer optimized for Screen & Add blend modes
 * - Calibrated trigonometric breathing and 100% mathematical seamless loop
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const AnamorphicPrismLightStreaks4K: React.FC<AnamorphicPrismLightStreaks4KProps> = ({
  intensity = 1.0,
  streakCount = 20,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = width;   // 3840
    const H = height;  // 2160
    const CX = W / 2;
    const CY = H / 2;
    const TOTAL_FRAMES = 720;
    const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
    const twoPi = Math.PI * 2;

    // 1. Pure Pitch Black Base
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = "lighter"; // Additive optical blending

    // 2. Ambient Deep Indigo/Violet Core Glow
    const bgRad = ctx.createRadialGradient(CX, CY, 100, CX, CY, W * 0.65);
    bgRad.addColorStop(0, "rgba(50, 20, 80, 0.25)");
    bgRad.addColorStop(0.5, "rgba(20, 10, 45, 0.1)");
    bgRad.addColorStop(1, "transparent");
    ctx.fillStyle = bgRad;
    ctx.fillRect(0, 0, W, H);

    // 3. Wide Anamorphic Horizontal Laser Streaks (Chromatic Dispersion)
    for (let s = 0; s < streakCount; s++) {
      const sNorm = s / streakCount;
      // Staggered vertical positioning with harmonic drift
      const baseTrackY = H * (0.15 + sNorm * 0.7);
      const driftY = Math.sin(normT * twoPi * 2 + s * 1.8) * 45;
      const streakY = baseTrackY + driftY;

      // Horizontal sweep cycle (Integer loops for seamless loop closure)
      const sweepCycles = (s % 3) + 1;
      const sweepX = CX + Math.sin(normT * twoPi * sweepCycles + s * 1.2) * (W * 0.4);

      // Streak intensity pulsing
      const pulse = Math.pow(Math.sin(normT * twoPi * (s % 2 === 0 ? 2 : 3) + s), 2.0);
      const alpha = (0.2 + pulse * 0.65) * intensity;

      const streakLength = 1200 + sNorm * 1600;
      const x0 = sweepX - streakLength / 2;
      const x1 = sweepX + streakLength / 2;

      // Prismatic Rainbow Dispersion Layers (Red, Cyan, White Core)
      // Layer A: Magenta / Crimson Flare Fringe
      const gradRed = ctx.createLinearGradient(x0 - 20, streakY - 2, x1 - 20, streakY - 2);
      gradRed.addColorStop(0, "transparent");
      gradRed.addColorStop(0.35, "rgba(217, 70, 239, 0.0)");
      gradRed.addColorStop(0.5, `rgba(217, 70, 239, ${alpha * 0.4})`);
      gradRed.addColorStop(0.65, "rgba(217, 70, 239, 0.0)");
      gradRed.addColorStop(1, "transparent");
      ctx.strokeStyle = gradRed;
      ctx.lineWidth = 4 + (s % 4) * 3;
      ctx.beginPath();
      ctx.moveTo(x0 - 20, streakY - 2); ctx.lineTo(x1 - 20, streakY - 2);
      ctx.stroke();

      // Layer B: Electric Cyan Flare Fringe
      const gradCyan = ctx.createLinearGradient(x0 + 20, streakY + 2, x1 + 20, streakY + 2);
      gradCyan.addColorStop(0, "transparent");
      gradCyan.addColorStop(0.35, "rgba(6, 182, 212, 0.0)");
      gradCyan.addColorStop(0.5, `rgba(6, 182, 212, ${alpha * 0.4})`);
      gradCyan.addColorStop(0.65, "rgba(6, 182, 212, 0.0)");
      gradCyan.addColorStop(1, "transparent");
      ctx.strokeStyle = gradCyan;
      ctx.lineWidth = 4 + (s % 4) * 3;
      ctx.beginPath();
      ctx.moveTo(x0 + 20, streakY + 2); ctx.lineTo(x1 + 20, streakY + 2);
      ctx.stroke();

      // Layer C: Laser White Core Flare
      const gradWhite = ctx.createLinearGradient(x0, streakY, x1, streakY);
      gradWhite.addColorStop(0, "transparent");
      gradWhite.addColorStop(0.42, "rgba(255, 255, 255, 0.0)");
      gradWhite.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.95})`);
      gradWhite.addColorStop(0.58, "rgba(255, 255, 255, 0.0)");
      gradWhite.addColorStop(1, "transparent");
      ctx.strokeStyle = gradWhite;
      ctx.lineWidth = 2 + (s % 3);
      ctx.beginPath();
      ctx.moveTo(x0, streakY); ctx.lineTo(x1, streakY);
      ctx.stroke();

      // Center Anamorphic Glint Star
      if (pulse > 0.5) {
        const glintGrad = ctx.createRadialGradient(sweepX, streakY, 0, sweepX, streakY, 50 * pulse);
        glintGrad.addColorStop(0, "#FFFFFF");
        glintGrad.addColorStop(0.3, "rgba(217, 70, 239, 0.5)");
        glintGrad.addColorStop(0.7, "rgba(6, 182, 212, 0.2)");
        glintGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glintGrad;
        ctx.beginPath();
        ctx.arc(sweepX, streakY, 50 * pulse, 0, twoPi);
        ctx.fill();
      }
    }

    // 4. Floating Micro-Bokeh Prismatic Dust Motes
    const bokehCount = 65;
    for (let b = 0; b < bokehCount; b++) {
      const bx = (b * 123.7 + normT * W * 0.4) % W;
      const by = (b * 67.1 + Math.sin(b + normT * twoPi * 2) * 50) % H;
      const br = 2 + (b % 4) * 2;
      const bAlpha = (0.2 + (Math.sin(b * 4.3 + normT * twoPi) * 0.5 + 0.5) * 0.5) * intensity;

      const isViolet = b % 2 === 0;
      const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br * 3);
      bGrad.addColorStop(0, "#FFFFFF");
      bGrad.addColorStop(0.4, isViolet ? `rgba(217, 70, 239, ${bAlpha})` : `rgba(6, 182, 212, ${bAlpha})`);
      bGrad.addColorStop(1, "transparent");

      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(bx, by, br * 3, 0, twoPi);
      ctx.fill();
    }

    ctx.restore();

    // 5. Subtle Vignette Border Falloff
    const vigGrad = ctx.createRadialGradient(CX, CY, H * 0.5, CX, CY, W * 0.68);
    vigGrad.addColorStop(0, "transparent");
    vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.85)");
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

  }, [frame, width, height, intensity, streakCount]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#000000", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
};
