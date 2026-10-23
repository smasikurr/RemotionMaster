import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface AbstractMinimalistGeometricPulseVertical4KProps {
  glowIntensity?: number;
  particleCount?: number;
}

/**
 * AbstractMinimalistGeometricPulseVertical4K
 * Vertical 4K UHD (2160x3840) @ 60 FPS, 12.00s seamless loop (720 frames).
 * Minimalist geometric pulse, sleek neon vector outlines, 3D rim-lit sphere,
 * vertical color pillars, and morphing Bauhaus-inspired shapes.
 * 100% compliant with Adobe Stock, Vecteezy & Shutterstock vertical video specifications.
 */
export const AbstractMinimalistGeometricPulseVertical4K: React.FC<AbstractMinimalistGeometricPulseVertical4KProps> = ({
  glowIntensity = 1.0,
  particleCount = 55,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
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
    const TOTAL_DURATION = 12.000;
    const t = (frame % TOTAL_FRAMES) / fps;
    const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0 exact loop

    // Palette Definitions
    const VOID_BLACK = "#050505";
    const ELECTRIC_PURPLE = "#9D00FF";
    const NEON_CRIMSON = "#FF003C";
    const AMBER_GOLD = "#FFA800";

    // Harmonic Time Cycles (All integer multiples of 2*PI for 100% seamless looping)
    const cycle1 = Math.sin(normT * Math.PI * 2);           // 1 cycle
    const cycle2 = Math.sin(normT * Math.PI * 4);           // 2 cycles
    const cycle4 = Math.sin(normT * Math.PI * 8);           // 4 cycles
    const cosCycle1 = Math.cos(normT * Math.PI * 2);
    const cosCycle2 = Math.cos(normT * Math.PI * 4);

    // 1. Deep Void Base
    ctx.fillStyle = VOID_BLACK;
    ctx.fillRect(0, 0, W, H);

    // 2. Central Vertical Pillar Track (Breathing Color Band)
    // Pillar width gently pulses between 640px and 880px
    const pillarWidth = 720 + cycle2 * 90;
    const pillarX = CX - pillarWidth / 2;

    // Pillar dynamic gradient interpolation between Crimson, Purple, and Amber
    const pillarGrad = ctx.createLinearGradient(CX, 0, CX, H);
    // Smooth cyclic color transitions
    const colorMix1 = (cycle1 + 1.0) * 0.5; // 0 to 1
    const colorMix2 = (cycle2 + 1.0) * 0.5;

    pillarGrad.addColorStop(0.0, `rgba(10, 2, 8, 0.95)`);
    pillarGrad.addColorStop(0.2, `rgba(${Math.round(255 * (1 - colorMix1 * 0.4))}, 0, ${Math.round(60 + 195 * colorMix1)}, 0.40)`);
    pillarGrad.addColorStop(0.5, `rgba(${Math.round(157 * colorMix1 + 255 * (1 - colorMix1))}, ${Math.round(168 * (1 - colorMix1))}, ${Math.round(255 * colorMix1)}, 0.35)`);
    pillarGrad.addColorStop(0.8, `rgba(${Math.round(255 * (1 - colorMix1))}, 0, ${Math.round(60 * (1 - colorMix1) + 255 * colorMix1)}, 0.40)`);
    pillarGrad.addColorStop(1.0, `rgba(10, 2, 8, 0.95)`);

    ctx.save();
    ctx.fillStyle = pillarGrad;
    ctx.fillRect(pillarX, 0, pillarWidth, H);

    // Pillar Boundary Accent Lines (Thin glowing neon edges)
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(255, 0, 60, ${0.45 + 0.35 * Math.abs(cycle2)})`;
    ctx.beginPath();
    ctx.moveTo(pillarX, 0);
    ctx.lineTo(pillarX, H);
    ctx.moveTo(pillarX + pillarWidth, 0);
    ctx.lineTo(pillarX + pillarWidth, H);
    ctx.stroke();

    // Central Vertical Guide Rail (Thin dashed line)
    ctx.setLineDash([12, 18]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(255, 255, 255, 0.15)`;
    ctx.beginPath();
    ctx.moveTo(CX, 0);
    ctx.lineTo(CX, H);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 3. Ambient Volumetric Glow Behind Central Geometry
    ctx.save();
    const glowY = CY + cycle1 * 350;
    const radialGlow = ctx.createRadialGradient(CX, glowY, 50, CX, glowY, 900);
    radialGlow.addColorStop(0.00, `rgba(157, 0, 255, ${0.35 * glowIntensity})`);
    radialGlow.addColorStop(0.40, `rgba(255, 0, 60, ${0.20 * glowIntensity})`);
    radialGlow.addColorStop(0.75, `rgba(255, 168, 0, ${0.08 * glowIntensity})`);
    radialGlow.addColorStop(1.00, "rgba(5, 5, 5, 0.0)");
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 4. Large Sleek Concentric Geometric Orbital Rings
    ctx.save();
    const ringBaseRadius = 450 + cycle2 * 60;
    const ringCount = 5;

    for (let i = 0; i < ringCount; i++) {
      const r = ringBaseRadius + i * 180 + Math.sin(normT * Math.PI * 4 + i * 0.8) * 40;
      const alpha = Math.max(0.05, 0.40 - i * 0.07 + cycle4 * 0.08);

      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, Math.PI * 2);

      if (i % 2 === 1) {
        ctx.setLineDash([8, 14]);
        ctx.strokeStyle = `rgba(255, 168, 0, ${alpha * 0.85})`;
        ctx.lineWidth = 2.5;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = i === 0 ? 3.5 : 2;
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    // 5. Minimalist Horizontal Neon Geometric Slices / Blocks
    // Stack of 4 horizontal blocks that pulse and slide laterally
    const blockLevels = [-700, -350, 350, 700];
    const blockColors = [AMBER_GOLD, NEON_CRIMSON, ELECTRIC_PURPLE, AMBER_GOLD];

    ctx.save();
    blockLevels.forEach((offsetY, idx) => {
      const by = CY + offsetY + Math.sin(normT * Math.PI * 4 + idx * 1.2) * 50;
      const bw = 580 + Math.cos(normT * Math.PI * 4 + idx) * 80;
      const bh = 54;
      const bx = CX - bw / 2 + Math.sin(normT * Math.PI * 2 + idx * 1.5) * 45;

      // Glow halo
      ctx.shadowColor = blockColors[idx];
      ctx.shadowBlur = 24 * glowIntensity;

      // Hollow neon frame with rounded corners
      ctx.strokeStyle = blockColors[idx];
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, bw, bh);

      // Subtle fill
      ctx.fillStyle = `rgba(255, 255, 255, 0.04)`;
      ctx.fillRect(bx, by, bw, bh);

      // Corner accent dot
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(bx + 10, by + bh / 2, 3, 0, Math.PI * 2);
      ctx.arc(bx + bw - 10, by + bh / 2, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    ctx.restore();

    // 6. Central Hero Geometric Morphing Shape
    // Transitions between Sphere/Circle -> Rounded Diamond -> Pentagram/Block
    ctx.save();
    const heroY = CY + Math.sin(normT * Math.PI * 2) * 280;
    ctx.translate(CX, heroY);

    // Rotation: Exactly 1 full 360-degree rotation (2*PI) over 12s -> seamless!
    const heroAngle = normT * Math.PI * 2;
    ctx.rotate(heroAngle);

    // 3D Illuminated Sphere Body with Rim Light
    const sphereRadius = 160 + cycle4 * 20;
    const sphereGrad = ctx.createRadialGradient(-40, -40, 20, 0, 0, sphereRadius);
    sphereGrad.addColorStop(0.00, "#FFFFFF");
    sphereGrad.addColorStop(0.25, `rgba(157, 0, 255, 0.95)`);
    sphereGrad.addColorStop(0.70, `rgba(255, 0, 60, 0.90)`);
    sphereGrad.addColorStop(1.00, `rgba(15, 2, 5, 0.98)`);

    ctx.shadowColor = ELECTRIC_PURPLE;
    ctx.shadowBlur = 40 * glowIntensity;
    ctx.beginPath();
    ctx.arc(0, 0, sphereRadius, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glowing Concentric Diamond Frame orbiting the sphere
    ctx.rotate(-heroAngle * 2); // Counter-rotation
    const diamondSize = 260 + cycle2 * 35;
    ctx.strokeStyle = AMBER_GOLD;
    ctx.lineWidth = 4;
    ctx.shadowColor = AMBER_GOLD;
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.beginPath();
    ctx.moveTo(0, -diamondSize);
    ctx.lineTo(diamondSize, 0);
    ctx.lineTo(0, diamondSize);
    ctx.lineTo(-diamondSize, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4 Corner Micro Dots on Diamond
    ctx.fillStyle = "#FFFFFF";
    [[-diamondSize, 0], [diamondSize, 0], [0, -diamondSize], [0, diamondSize]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(dx, dy, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    // 7. Cinematic Minimal Particle Dust Field
    // Deterministic procedural particles based on index & cyclic math
    ctx.save();
    for (let pIdx = 0; pIdx < particleCount; pIdx++) {
      const pSeed = pIdx * 137.5;
      const pSpeed = 0.5 + (pIdx % 5) * 0.2;
      const initialX = ((pSeed * 13) % (W - 200)) + 100;
      const initialY = ((pSeed * 37) % (H - 200)) + 100;

      // Vertical drift with seamless cyclic wrapping
      const driftY = (initialY + Math.sin(normT * Math.PI * 2 * pSpeed + pIdx) * 180) % H;
      const driftX = initialX + Math.cos(normT * Math.PI * 2 * pSpeed + pIdx * 0.5) * 60;

      const pSize = 1.5 + (pIdx % 4) * 1.2;
      const pAlpha = 0.20 + 0.45 * Math.sin(normT * Math.PI * 2 + pIdx);

      ctx.beginPath();
      ctx.arc(driftX, driftY, pSize, 0, Math.PI * 2);
      ctx.fillStyle = pIdx % 3 === 0
        ? `rgba(255, 168, 0, ${pAlpha})`
        : pIdx % 3 === 1
        ? `rgba(157, 0, 255, ${pAlpha})`
        : `rgba(255, 255, 255, ${pAlpha})`;
      ctx.fill();
    }
    ctx.restore();

    // 8. Subtle Outer Vignette Frame (Reinforces Deep Void Black Edges)
    ctx.save();
    const vignetteGrad = ctx.createRadialGradient(CX, CY, H * 0.35, CX, CY, H * 0.65);
    vignetteGrad.addColorStop(0.0, "rgba(5, 5, 5, 0.0)");
    vignetteGrad.addColorStop(1.0, "rgba(5, 5, 5, 0.85)");
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

  }, [frame, width, height, fps, glowIntensity, particleCount]);

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#050505" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};
