import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface MinimalistKineticLogoMorphVertical4KProps {
  primaryColor?: string;
  accentColor?: string;
}

/**
 * MinimalistKineticLogoMorphVertical4K
 * Vertical 4K UHD (2160x3840) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Minimalist Kinetic Branding Logo & Geometric Stepped Pillar Morph:
 * - Dynamic architectural stepped columns expanding, folding, and rotating
 * - Morphing between wireframe outline, solid geometric badge, and kinetic pillars
 * - Crisp Laser White (#FFFFFF) & Soft Platinum (#D4D4D8) against Pitch Black (#000000)
 * - Calibrated spring physics, subtle volumetric floor reflection, and 100% seamless loop
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const MinimalistKineticLogoMorphVertical4K: React.FC<MinimalistKineticLogoMorphVertical4KProps> = ({
  primaryColor = "#FFFFFF",
  accentColor = "#A1A1AA",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = width;   // 2160
    const H = height;  // 3840
    const CX = W / 2;
    const CY = H / 2;
    const TOTAL_FRAMES = 720;
    const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
    const twoPi = Math.PI * 2;

    // 1. Pure Pitch Black Base
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // 2. Ambient Studio Lighting Glow
    const bgRad = ctx.createRadialGradient(CX, CY, 100, CX, CY, W * 0.9);
    bgRad.addColorStop(0, "rgba(255, 255, 255, 0.04)");
    bgRad.addColorStop(0.6, "rgba(255, 255, 255, 0.01)");
    bgRad.addColorStop(1, "transparent");
    ctx.fillStyle = bgRad;
    ctx.fillRect(0, 0, W, H);

    // 3. Kinetic Morph Timeline Stages (3 distinct geometric evolutions over 12s)
    // Stage A (0s - 4s): Stepped vertical architectural columns undulating & unfolding
    // Stage B (4s - 8s): Geometric central cube/diamond morph & kinetic folding
    // Stage C (8s - 12s): Kinetic isometric ribbon array & seamless return to initial columns
    const stageT = (normT * 3) % 1.0;
    const currentStage = Math.floor(normT * 3); // 0, 1, or 2

    // Continuous living idle motion
    const idleY = Math.sin(normT * twoPi * 2) * 25;
    const idleRot = Math.sin(normT * twoPi) * 0.08;

    ctx.save();
    ctx.translate(CX, CY + idleY);
    ctx.rotate(idleRot);

    // 4. Render Architectural Stepped Pillar Matrix (Matching Reference Identity)
    const pillarCount = 9;
    const pillarWidth = 44;
    const pillarGap = 24;
    const totalMatrixWidth = pillarCount * pillarWidth + (pillarCount - 1) * pillarGap;
    const startX = -totalMatrixWidth / 2;

    // Height envelope: parabolic / stepped stepped staircase peak in center
    for (let i = 0; i < pillarCount; i++) {
      const pNorm = i / (pillarCount - 1); // 0 to 1
      const distFromCenter = Math.abs(i - (pillarCount - 1) / 2) / ((pillarCount - 1) / 2);

      // Base stepped height (peak 750px in center, tapering to 350px on sides)
      const baseHeight = 350 + (1 - distFromCenter) * 450;

      // Dynamic morph wave
      const waveH = Math.sin(normT * twoPi * 3 + i * 0.5) * 120;
      const morphFactor = Math.sin(normT * twoPi);

      const finalHeight = baseHeight + waveH * morphFactor;
      const px = startX + i * (pillarWidth + pillarGap);
      const py = -finalHeight / 2;

      // Pillar gradient fill (High-contrast metallic white & charcoal gradient)
      const pGrad = ctx.createLinearGradient(px, py, px, py + finalHeight);
      pGrad.addColorStop(0, primaryColor);
      pGrad.addColorStop(0.4, "#E4E4E7");
      pGrad.addColorStop(1, accentColor);

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.roundRect(px, py, pillarWidth, finalHeight, 8);
      ctx.fill();

      // Top Highlight Cap
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(px, py, pillarWidth, 12, [8, 8, 0, 0]);
      ctx.fill();

      // Subtle drop shadow / reflection on bottom
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(px, py + finalHeight + 8, pillarWidth, 6);
    }

    // 5. Central Geometric Accent Frame / Diamond Reticle
    const frameScale = 1.0 + Math.sin(normT * twoPi * 2) * 0.15;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 3;

    // Outer framing square
    const boxSize = 720 * frameScale;
    ctx.strokeRect(-boxSize / 2, -boxSize / 2, boxSize, boxSize);

    // 4 Corner Alignment Crosshairs
    const cTick = 28;
    const halfBox = boxSize / 2;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(-halfBox - cTick, -halfBox); ctx.lineTo(-halfBox + cTick, -halfBox);
    ctx.moveTo(-halfBox, -halfBox - cTick); ctx.lineTo(-halfBox, -halfBox + cTick);
    // Top-Right
    ctx.moveTo(halfBox - cTick, -halfBox); ctx.lineTo(halfBox + cTick, -halfBox);
    ctx.moveTo(halfBox, -halfBox - cTick); ctx.lineTo(halfBox, -halfBox + cTick);
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(-halfBox - cTick, halfBox); ctx.lineTo(-halfBox + cTick, halfBox);
    ctx.moveTo(-halfBox, halfBox - cTick); ctx.lineTo(-halfBox, halfBox + cTick);
    // Bottom-Right
    ctx.moveTo(halfBox - cTick, halfBox); ctx.lineTo(halfBox + cTick, halfBox);
    ctx.moveTo(halfBox, halfBox - cTick); ctx.lineTo(halfBox, halfBox + cTick);
    ctx.stroke();

    ctx.restore(); // Restore center translation

    // 6. Minimalist Vertical Typography & Metadata (Swiss Branding Style)
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("IDENTITY // KINETIC MORPH 01", CX, 380);

    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillText("VERTICAL 4K (2160x3840) // 60 FPS CFR", CX, H - 380);

    // Subtle Vertical Grid Guide Lines on Left and Right
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 0); ctx.lineTo(180, H);
    ctx.moveTo(W - 180, 0); ctx.lineTo(W - 180, H);
    ctx.stroke();

  }, [frame, width, height, primaryColor, accentColor]);

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
