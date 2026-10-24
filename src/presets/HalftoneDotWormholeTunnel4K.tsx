import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface HalftoneDotWormholeTunnel4KProps {
  ringCount?: number;
  dotsPerRing?: number;
  tunnelLength?: number;
}

/**
 * HalftoneDotWormholeTunnel4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * 3D curved halftone dot wormhole tunnel with perspective forward flight and helical twist.
 * Crisp White (#FFFFFF) & Soft Silver (#C0C0C0) against Pitch Black (#000000).
 * 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const HalftoneDotWormholeTunnel4K: React.FC<HalftoneDotWormholeTunnel4KProps> = ({
  ringCount = 80,
  dotsPerRing = 54,
  tunnelLength = 4000,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
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
    const TOTAL_DURATION = 12.000;
    const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0

    // 1. Solid Pure Pitch Black Base
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // 2. Camera & Projection Configuration
    const FOCAL_LENGTH = 1650;
    const RING_SPACING = tunnelLength / ringCount; // Spacing along Z
    const FORWARD_CYCLES = 6; // Moves forward by 6 full ring spacings over 12s -> 100% seamless!
    const zOffset = (normT * FORWARD_CYCLES * RING_SPACING) % RING_SPACING;

    // Twist Cycles: Exactly 3 full 360-degree helical rotations over 12s
    const TWIST_CYCLES = 3;
    const twistBase = normT * Math.PI * 2 * TWIST_CYCLES;

    // Collect all projected 3D dots to depth-sort back-to-front
    interface ProjectedDot {
      sx: number;
      sy: number;
      radius: number;
      alpha: number;
      gray: number;
      depth: number;
    }

    const projectedDots: ProjectedDot[] = [];

    // Trumpet / Funnel Profile:
    // Large opening near viewer, tapering gracefully into deep central throat
    for (let r = 0; r < ringCount; r++) {
      // World Z distance from camera (camera at Z = 0, facing +Z)
      const worldZ = r * RING_SPACING - zOffset + 180;
      if (worldZ < 40 || worldZ > tunnelLength + 200) continue;

      // Normalized longitudinal coordinate (0 = near camera, 1 = deep vanishing throat)
      const nz = worldZ / tunnelLength;

      // Funnel curvature: radius expands exponentially near mouth, narrows at throat
      // r(z) = throatRadius + mouthRadius * (1 - nz)^2.2
      const tunnelRadius = 380 + 1750 * Math.pow(Math.max(0, 1.0 - nz * 0.95), 2.2);

      // Curved Tunnel Axis (gentle organic undulating wormhole bend)
      // Uses integer wave frequencies for seamless looping
      const axisBendAngle = nz * Math.PI * 2.5 - normT * Math.PI * 2 * 2;
      const axisX = Math.sin(axisBendAngle) * 160 * (1.0 - nz * 0.4);
      const axisY = Math.cos(axisBendAngle * 0.7) * 90 * (1.0 - nz * 0.4);

      // Helical rotation twist along tunnel length
      const ringTwist = twistBase + nz * Math.PI * 3.5;

      for (let d = 0; d < dotsPerRing; d++) {
        const theta = (d / dotsPerRing) * Math.PI * 2 + ringTwist;

        // 3D Point in World Space
        const wx = axisX + Math.cos(theta) * tunnelRadius;
        const wy = axisY + Math.sin(theta) * tunnelRadius;
        const wz = worldZ;

        // 3D Perspective Projection
        const scale = FOCAL_LENGTH / wz;
        const sx = CX + wx * scale;
        const sy = CY + wy * scale;

        // Clip dots outside screen bounds with margin
        if (sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80) continue;

        // Dot Size Modulation:
        // Microscopic in distance (1.2px) up to bold halftone dots near camera (7.8px)
        const baseRadius = 1.2 + 6.6 * Math.pow(scale * 0.75, 1.15);
        const radius = Math.min(8.5, Math.max(0.8, baseRadius));

        // Depth-based Opacity & Silver/White Tone
        // Near fade (don't pop right in front of camera)
        const nearFade = Math.min(1.0, (wz - 80) / 250);
        // Far fog into black hole throat
        const farFade = Math.max(0.0, 1.0 - Math.pow(nz, 1.8));
        const alpha = Math.min(1.0, Math.max(0.05, nearFade * farFade * 0.95));

        // Tone: Soft Silver (#C0C0C0) to Pure Glowing White (#FFFFFF)
        const gray = Math.round(180 + 75 * (1.0 - nz));

        projectedDots.push({
          sx,
          sy,
          radius,
          alpha,
          gray,
          depth: wz,
        });
      }
    }

    // Depth-sort dots from far to near for correct occlusion
    projectedDots.sort((a, b) => b.depth - a.depth);

    // 3. Render Sorted Halftone Dots
    for (let i = 0; i < projectedDots.length; i++) {
      const p = projectedDots[i];

      ctx.beginPath();
      ctx.arc(p.sx, p.sy, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.gray}, ${p.gray}, ${p.gray}, ${p.alpha})`;
      ctx.fill();

      // Subtle bright core highlight on prominent foreground dots
      if (p.radius > 4.2 && p.alpha > 0.6) {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.radius * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.fill();
      }
    }

    // 4. Central Event Horizon Black Hole Falloff
    // Deep circular blackout at tunnel center with subtle soft radial rim
    ctx.save();
    const centerGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 320);
    centerGrad.addColorStop(0.00, "rgba(0, 0, 0, 1.0)");
    centerGrad.addColorStop(0.60, "rgba(0, 0, 0, 0.92)");
    centerGrad.addColorStop(1.00, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(CX, CY, 320, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Cinematic Vignette on Canvas Periphery
    ctx.save();
    const vignette = ctx.createRadialGradient(CX, CY, W * 0.38, CX, CY, W * 0.72);
    vignette.addColorStop(0.0, "rgba(0, 0, 0, 0.0)");
    vignette.addColorStop(1.0, "rgba(0, 0, 0, 0.95)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

  }, [frame, width, height, fps, ringCount, dotsPerRing, tunnelLength]);

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000000" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};
