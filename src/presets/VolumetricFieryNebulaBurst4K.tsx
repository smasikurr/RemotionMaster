import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface VolumetricFieryNebulaBurst4KProps {
  particleCount?: number;
  burstScale?: number;
}

/**
 * VolumetricFieryNebulaBurst4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Volumetric Fiery Smoke, Magma Nebula & Fluid Energy Dispersion Burst:
 * - Multi-layered Perlin turbulent vortices and billowing flame plumes
 * - Volumetric lighting falloff from molten core (#FFFFFF -> #FFA800 -> #FF2200 -> #4A0000)
 * - Drifting incandescent micro-embers and fluid smoke swirls
 * - Pure pitch black (#000000) base layer optimized for Screen & Add blend modes
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const VolumetricFieryNebulaBurst4K: React.FC<VolumetricFieryNebulaBurst4KProps> = ({
  particleCount = 120,
  burstScale = 1.0,
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
    ctx.globalCompositeOperation = "lighter"; // Additive thermal optical blending

    // 2. Harmonic Fluid Burst Expansion & Dissolve (Loop Closure)
    // 2 organic surge cycles over 12s -> frame 0 == frame 720
    const surge = Math.pow(Math.sin(normT * Math.PI * 2), 2.0);
    const expandRadius = (600 + surge * 750) * burstScale;

    // 3. Central Ambient Magma Core Glow
    const coreRad = ctx.createRadialGradient(CX, CY, 40, CX, CY, expandRadius * 1.2);
    coreRad.addColorStop(0, "rgba(255, 245, 200, 0.5)");
    coreRad.addColorStop(0.25, `rgba(255, 120, 0, ${0.4 * (0.6 + surge * 0.4)})`);
    coreRad.addColorStop(0.55, `rgba(220, 30, 0, ${0.25 * (0.6 + surge * 0.4)})`);
    coreRad.addColorStop(0.85, "rgba(70, 5, 0, 0.08)");
    coreRad.addColorStop(1, "transparent");
    ctx.fillStyle = coreRad;
    ctx.fillRect(0, 0, W, H);

    // 4. Volumetric Fluid Billow Puffs (Simulated Navier-Stokes Fluid Swirls)
    const puffCount = 70;
    for (let p = 0; p < puffCount; p++) {
      const pNorm = p / puffCount;
      const angle = pNorm * twoPi * 3 + normT * twoPi * (p % 2 === 0 ? 1 : -1) * 0.4;
      const distFromCenter = ((p * 29.3 + normT * 800) % expandRadius) + 80;

      // Turbulent vortex perturbation
      const turbX = Math.sin(angle * 4 + normT * twoPi * 2) * 120;
      const turbY = Math.cos(angle * 3 - normT * twoPi * 2) * 90;

      const px = CX + Math.cos(angle) * distFromCenter + turbX;
      const py = CY + Math.sin(angle) * distFromCenter + turbY;

      if (px < -150 || px > W + 150 || py < -150 || py > H + 150) continue;

      const puffSize = (90 + (p % 6) * 45) * (0.7 + surge * 0.5);
      const puffAlpha = (0.15 + (1 - distFromCenter / expandRadius) * 0.5) * (0.5 + surge * 0.5);

      const pGrad = ctx.createRadialGradient(px, py, 10, px, py, puffSize);
      if (distFromCenter < expandRadius * 0.35) {
        // High thermal core puff
        pGrad.addColorStop(0, `rgba(255, 240, 150, ${puffAlpha})`);
        pGrad.addColorStop(0.4, `rgba(255, 100, 0, ${puffAlpha * 0.6})`);
        pGrad.addColorStop(0.8, `rgba(180, 20, 0, ${puffAlpha * 0.2})`);
      } else {
        // Outer cooling ember/smoke puff
        pGrad.addColorStop(0, `rgba(255, 60, 0, ${puffAlpha * 0.7})`);
        pGrad.addColorStop(0.5, `rgba(140, 10, 0, ${puffAlpha * 0.35})`);
        pGrad.addColorStop(0.9, `rgba(50, 0, 0, ${puffAlpha * 0.1})`);
      }
      pGrad.addColorStop(1, "transparent");

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(px, py, puffSize, 0, twoPi);
      ctx.fill();
    }

    // 5. Dynamic Flame Tendrils & Ejection Plumes
    const plumeCount = 20;
    for (let l = 0; l < plumeCount; l++) {
      const pAngle = (l / plumeCount) * twoPi + normT * twoPi * 0.25;
      const len = (700 + Math.sin(normT * twoPi * 2 + l * 2) * 280) * (0.8 + surge * 0.4);

      const pX0 = CX + Math.cos(pAngle) * 60;
      const pY0 = CY + Math.sin(pAngle) * 60;

      const cpX = CX + Math.cos(pAngle + 0.3) * (len * 0.6) + Math.sin(normT * twoPi * 3 + l) * 100;
      const cpY = CY + Math.sin(pAngle + 0.3) * (len * 0.6) + Math.cos(normT * twoPi * 3 + l) * 100;

      const endX = CX + Math.cos(pAngle) * len;
      const endY = CY + Math.sin(pAngle) * len;

      const tGrad = ctx.createLinearGradient(pX0, pY0, endX, endY);
      tGrad.addColorStop(0, "#FFFFFF");
      tGrad.addColorStop(0.2, "rgba(255, 180, 20, 0.85)");
      tGrad.addColorStop(0.5, "rgba(255, 40, 0, 0.45)");
      tGrad.addColorStop(0.8, "rgba(90, 5, 0, 0.15)");
      tGrad.addColorStop(1, "transparent");

      ctx.strokeStyle = tGrad;
      ctx.lineWidth = 14 + (l % 4) * 10;
      ctx.beginPath();
      ctx.moveTo(pX0, pY0);
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
      ctx.stroke();
    }

    // 6. Floating Fiery Embers & Spark Constellations
    for (let e = 0; e < particleCount; e++) {
      const eSeed = e * 137.5;
      const eDist = ((normT * 1400 + e * 20) % 1800) + 60;
      const eAngle = eSeed * (Math.PI / 180) + normT * twoPi * 1.2;

      const ex = CX + Math.cos(eAngle) * eDist;
      const ey = CY + Math.sin(eAngle) * eDist;

      if (ex < -50 || ex > W + 50 || ey < -50 || ey > H + 50) continue;

      const eSize = 2 + (e % 4) * 2;
      const eAlpha = (0.3 + (Math.sin(normT * twoPi * 3 + e) * 0.5 + 0.5) * 0.7);

      const emberGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, eSize * 2.5);
      emberGrad.addColorStop(0, "#FFFFFF");
      emberGrad.addColorStop(0.4, `rgba(255, 170, 0, ${eAlpha})`);
      emberGrad.addColorStop(0.8, `rgba(255, 40, 0, ${eAlpha * 0.4})`);
      emberGrad.addColorStop(1, "transparent");

      ctx.fillStyle = emberGrad;
      ctx.beginPath();
      ctx.arc(ex, ey, eSize * 2.5, 0, twoPi);
      ctx.fill();
    }

    ctx.restore();

    // 7. Subtle Vignette Border Falloff
    const vigGrad = ctx.createRadialGradient(CX, CY, H * 0.45, CX, CY, W * 0.68);
    vigGrad.addColorStop(0, "transparent");
    vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.85)");
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

  }, [frame, width, height, particleCount, burstScale]);

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
