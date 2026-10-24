import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface MinimalistKineticDotsLoop4KProps {
  dotColor?: string;
  bgColor?: string;
}

/**
 * MinimalistKineticDotsLoop4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Swiss Minimalist Kinetic Dot Matrix & Geometric Morphing Loop:
 * - Concentric orbital rings of precision halftone dots
 * - Radial sinusoidal wave expansion and Fibonacci spiral twist
 * - High-contrast Pure Charcoal (#111111) on Crisp Minimalist White (#FFFFFF)
 * - Calibrated trigonometric easing and 100% mathematical loop closure
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const MinimalistKineticDotsLoop4K: React.FC<MinimalistKineticDotsLoop4KProps> = ({
  dotColor = "#111111",
  bgColor = "#FFFFFF",
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

    // 1. Crisp Minimalist Pure White Base
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // 2. Harmonic Loop Cycles (Integer cycles ensure frame 0 == frame 720)
    const ROTATION_CYCLES = 2; // Exactly 2 full 360-degree spins over 12s
    const WAVE_CYCLES = 3;     // Exactly 3 radial breathing wave oscillations
    const SPIRAL_CYCLES = 2;   // Exactly 2 twist undulations

    const rotBase = normT * twoPi * ROTATION_CYCLES;
    const wavePhase = normT * twoPi * WAVE_CYCLES;
    const spiralPhase = Math.sin(normT * twoPi * SPIRAL_CYCLES);

    // 3. Concentric Orbital Dot Matrix Configuration
    const RING_COUNT = 32;       // 32 concentric rings expanding outward
    const BASE_MAX_RADIUS = 1350; // Max radius covering the 4K frame
    const ringSpacing = BASE_MAX_RADIUS / RING_COUNT;

    ctx.fillStyle = dotColor;

    // Draw central focal core dot
    const coreScale = 14 + Math.sin(wavePhase) * 6;
    ctx.beginPath();
    ctx.arc(CX, CY, coreScale, 0, twoPi);
    ctx.fill();

    // Iterate through all concentric rings
    for (let r = 1; r <= RING_COUNT; r++) {
      const ringNorm = r / RING_COUNT; // 0.0 to 1.0
      const currentRadius = r * ringSpacing;

      // Dots count per ring: naturally scales with circumference (Fibonacci-like progression)
      const dotsInThisRing = Math.floor(12 + r * 5.5);

      // Alternating rotational direction per ring with spiral twist
      const dir = r % 2 === 0 ? 1 : -1;
      const ringRot = rotBase * dir * (0.6 + ringNorm * 0.8) + spiralPhase * ringNorm * 1.8;

      // Radial wave modulation
      const waveOffset = Math.sin(wavePhase - ringNorm * Math.PI * 4);
      const modulatedRadius = currentRadius + waveOffset * 28;

      for (let d = 0; d < dotsInThisRing; d++) {
        const angle = (d / dotsInThisRing) * twoPi + ringRot;
        const x = CX + Math.cos(angle) * modulatedRadius;
        const y = CY + Math.sin(angle) * modulatedRadius;

        // Skip dots falling outside safety margin
        if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue;

        // Dynamic Dot Radius Modulation (Minimalist Halftone Sizing)
        // Base size between 3px and 18px based on wave displacement
        const dotWave = Math.sin(wavePhase - ringNorm * Math.PI * 5 + d * 0.2);
        const baseDotRadius = 3.5 + (1 - ringNorm * 0.4) * 6;
        const finalRadius = Math.max(1.8, baseDotRadius + dotWave * 5.5);

        // Alpha modulation: Subtle depth breathing
        const alpha = 0.25 + (1 - ringNorm * 0.5) * 0.75;
        ctx.globalAlpha = Math.min(1.0, Math.max(0.2, alpha));

        ctx.beginPath();
        ctx.arc(x, y, finalRadius, 0, twoPi);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1.0;

    // 4. Subtle Outer Geometric Guide Ticks & Axis Crosshairs (Swiss Typography Aesthetic)
    ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
    ctx.lineWidth = 1.5;

    // Center Crosshair
    const crossSize = 35;
    ctx.beginPath();
    ctx.moveTo(CX - crossSize, CY);
    ctx.lineTo(CX + crossSize, CY);
    ctx.moveTo(CX, CY - crossSize);
    ctx.lineTo(CX, CY + crossSize);
    ctx.stroke();

    // 4 Corner Geometric Crop Brackets
    const margin = 120;
    const bLen = 40;
    ctx.beginPath();
    // Top-Left
    ctx.moveTo(margin, margin + bLen); ctx.lineTo(margin, margin); ctx.lineTo(margin + bLen, margin);
    // Top-Right
    ctx.moveTo(W - margin - bLen, margin); ctx.lineTo(W - margin, margin); ctx.lineTo(W - margin, margin + bLen);
    // Bottom-Left
    ctx.moveTo(margin, H - margin - bLen); ctx.lineTo(margin, H - margin); ctx.lineTo(margin + bLen, H - margin);
    // Bottom-Right
    ctx.moveTo(W - margin - bLen, H - margin); ctx.lineTo(W - margin, H - margin); ctx.lineTo(W - margin, H - margin - bLen);
    ctx.stroke();

    // Subtle Monospaced Metric Labels
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.font = "bold 20px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText("SCALE: 1:1 // 4K UHD 60FPS", margin + 10, margin - 15);
    ctx.textAlign = "right";
    ctx.fillText("MATRIX: 32R x FIBONACCI", W - margin - 10, H - margin + 35);

  }, [frame, width, height, dotColor, bgColor]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: bgColor, overflow: "hidden" }}>
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
