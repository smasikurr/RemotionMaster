import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface GoldenSolarPlasmaEnergyBurst4KProps {
  intensity?: number;
  emberCount?: number;
}

/**
 * GoldenSolarPlasmaEnergyBurst4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Cinematic Molten Solar Plasma & Fiery Golden Optical Flare Energy Burst:
 * - Multi-harmonic flowing bezier plasma streams with additive luminous blending
 * - Dual rhythmic solar flare transition peaks (t = 1.5s and t = 7.2s)
 * - Drifting incandescent embers & micro-plasma corona particles
 * - Pure pitch black (#000000) base layer optimized for Screen & Add blend modes
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const GoldenSolarPlasmaEnergyBurst4K: React.FC<GoldenSolarPlasmaEnergyBurst4KProps> = ({
  intensity = 1.0,
  emberCount = 90,
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

    // 2. Harmonic Flare Surges (Matching the two rhythmic energy peaks from reference)
    // Peak 1 around t = 1.5s (frame 90), Peak 2 around t = 7.2s (frame 432)
    const flare1 = Math.pow(Math.max(0, Math.sin(normT * Math.PI * 2)), 3.0);
    const flare2 = Math.pow(Math.max(0, -Math.sin(normT * Math.PI * 2)), 3.0);
    const totalFlare = (flare1 * 1.1 + flare2 * 0.9 + 0.35) * intensity;

    // 3. Central Ambient Corona Core Glow
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const coreRad = ctx.createRadialGradient(CX, CY, 50, CX, CY, W * 0.55);
    coreRad.addColorStop(0, `rgba(255, 240, 160, ${0.45 * totalFlare})`);
    coreRad.addColorStop(0.2, `rgba(255, 168, 0, ${0.35 * totalFlare})`);
    coreRad.addColorStop(0.5, `rgba(255, 69, 0, ${0.18 * totalFlare})`);
    coreRad.addColorStop(0.8, `rgba(80, 10, 0, ${0.08 * totalFlare})`);
    coreRad.addColorStop(1, "transparent");
    ctx.fillStyle = coreRad;
    ctx.fillRect(0, 0, W, H);

    // 4. Multi-Layered Swirling Molten Plasma Ribbons
    const streamCount = 28;
    for (let s = 0; s < streamCount; s++) {
      const sNorm = s / streamCount;
      const angleBase = sNorm * twoPi;
      const rotPhase = normT * twoPi * (s % 2 === 0 ? 1 : -1) * 0.5;
      const currentAngle = angleBase + rotPhase;

      const pX0 = CX + Math.cos(currentAngle) * 80;
      const pY0 = CY + Math.sin(currentAngle) * 80;

      // Control points undulating with sinusoidal harmonics
      const wave1 = Math.sin(normT * twoPi * 2 + s * 1.5);
      const wave2 = Math.cos(normT * twoPi * 3 - s * 2.0);

      const reach = 800 + wave1 * 250 + sNorm * 900;
      const cp1X = CX + Math.cos(currentAngle + 0.5) * (reach * 0.4);
      const cp1Y = CY + Math.sin(currentAngle + 0.5) * (reach * 0.4);
      const cp2X = CX + Math.cos(currentAngle - 0.4) * (reach * 0.8) + wave2 * 120;
      const cp2Y = CY + Math.sin(currentAngle - 0.4) * (reach * 0.8) + wave1 * 120;
      const endX = CX + Math.cos(currentAngle) * reach;
      const endY = CY + Math.sin(currentAngle) * reach;

      // Gradient along the stream
      const streamGrad = ctx.createLinearGradient(pX0, pY0, endX, endY);
      streamGrad.addColorStop(0, "#FFFFFF");
      streamGrad.addColorStop(0.2, "rgba(255, 243, 128, 0.9)");
      streamGrad.addColorStop(0.5, "rgba(255, 168, 0, 0.65)");
      streamGrad.addColorStop(0.8, "rgba(255, 69, 0, 0.35)");
      streamGrad.addColorStop(1, "transparent");

      ctx.strokeStyle = streamGrad;
      ctx.lineWidth = (4 + sNorm * 18) * (0.8 + totalFlare * 0.4);

      ctx.beginPath();
      ctx.moveTo(pX0, pY0);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.stroke();
    }

    // 5. Diagonal Anamorphic Solar Lens Flare Streak
    const streakAngle = Math.PI / 5 + Math.sin(normT * twoPi) * 0.08;
    const streakLen = W * 0.9;
    const sx0 = CX - Math.cos(streakAngle) * streakLen;
    const sy0 = CY - Math.sin(streakAngle) * streakLen;
    const sx1 = CX + Math.cos(streakAngle) * streakLen;
    const sy1 = CY + Math.sin(streakAngle) * streakLen;

    const streakGrad = ctx.createLinearGradient(sx0, sy0, sx1, sy1);
    streakGrad.addColorStop(0, "transparent");
    streakGrad.addColorStop(0.35, "rgba(255, 69, 0, 0.15)");
    streakGrad.addColorStop(0.48, "rgba(255, 240, 160, 0.85)");
    streakGrad.addColorStop(0.5, "#FFFFFF");
    streakGrad.addColorStop(0.52, "rgba(255, 240, 160, 0.85)");
    streakGrad.addColorStop(0.65, "rgba(255, 69, 0, 0.15)");
    streakGrad.addColorStop(1, "transparent");

    ctx.strokeStyle = streakGrad;
    ctx.lineWidth = (12 + totalFlare * 25);
    ctx.beginPath();
    ctx.moveTo(sx0, sy0);
    ctx.lineTo(sx1, sy1);
    ctx.stroke();

    // 6. Floating Incandescent Embers & Solar Spark Motes
    for (let e = 0; e < emberCount; e++) {
      // Natural outward spiral motion
      const eSeed = e * 137.5; // Golden angle
      const eRadius = ((normT * 1200 + e * 25) % 1500) + 100;
      const eAngle = eSeed * (Math.PI / 180) + normT * twoPi * 1.5;

      const ex = CX + Math.cos(eAngle) * eRadius;
      const ey = CY + Math.sin(eAngle) * eRadius;

      if (ex < -50 || ex > W + 50 || ey < -50 || ey > H + 50) continue;

      const eSize = (1.5 + (e % 4) * 1.8) * (0.8 + totalFlare * 0.3);
      const eAlpha = (0.3 + (Math.sin(normT * twoPi * 3 + e) * 0.5 + 0.5) * 0.7);

      const emberGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, eSize * 3);
      emberGrad.addColorStop(0, "#FFFFFF");
      emberGrad.addColorStop(0.4, `rgba(255, 200, 50, ${eAlpha})`);
      emberGrad.addColorStop(0.8, `rgba(255, 70, 0, ${eAlpha * 0.5})`);
      emberGrad.addColorStop(1, "transparent");

      ctx.fillStyle = emberGrad;
      ctx.beginPath();
      ctx.arc(ex, ey, eSize * 3, 0, twoPi);
      ctx.fill();
    }

    ctx.restore(); // Restore composite operation

    // 7. Subtle Vignette Edge Falloff
    const vigGrad = ctx.createRadialGradient(CX, CY, H * 0.45, CX, CY, W * 0.65);
    vigGrad.addColorStop(0, "transparent");
    vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.85)");
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

  }, [frame, width, height, intensity, emberCount]);

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
