import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * TheatricalVolumetricSpotlightCanvas
 * 1:1 Authentic Re-creation of Reference istockphoto-1284702817-640_adpp_is.mp4 (14.1s)
 *
 * Calibrated Characteristics:
 * - Canvas: 3840x2160 UHD on 100% pure solid black (#000000).
 * - Focused theatrical stage luminaire beam descending from ceiling (topRadius 200px -> bottomRadius 780px).
 * - Lifted floor stage contact (floorY at 84% height) matching the perspective angle of the reference.
 * - Deep royal blue atmospheric haze and God ray striations.
 * - Glowing specular elliptical reflection hotspot on the stage floor.
 * - 650 illuminated micro-dust motes and floating particles swirling gently in the beam.
 * - Pure black base (#000000) for seamless Screen / Add compositing.
 */
interface Props {
  width: number;
  height: number;
}

interface Particle {
  id: number;
  seedX: number;
  seedY: number;
  size: number;
  speedY: number;
  driftAmp: number;
  driftFreq: number;
  phase: number;
  twinkleFreq: number;
  baseBrightness: number;
}

export const TheatricalVolumetricSpotlightCanvas: React.FC<Props> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Seeded deterministic particles (650 particles for dense atmospheric dust motes)
  const particlesRef = useRef<Particle[]>([]);
  if (particlesRef.current.length === 0) {
    const arr: Particle[] = [];
    const count = 650;
    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const seed2 = Math.sin(i * 93.9898 + 67.345) * 24634.6345;
      const seed3 = Math.sin(i * 45.1234 + 12.678) * 89234.1234;

      const s1 = seed1 - Math.floor(seed1);
      const s2 = seed2 - Math.floor(seed2);
      const s3 = seed3 - Math.floor(seed3);

      arr.push({
        id: i,
        seedX: s1,
        // Concentrate particles inside lower 70% of beam (Y: 0.18 to 0.84)
        seedY: 0.12 + Math.pow(s2, 0.70) * 0.72,
        size: 1.0 + s3 * 3.5,
        speedY: 15 + s1 * 24,
        driftAmp: 20 + s2 * 40,
        driftFreq: 0.5 + s3 * 1.4,
        phase: (i * 0.618) % (Math.PI * 2),
        twinkleFreq: 1.2 + s1 * 3.2,
        baseBrightness: 0.40 + s3 * 0.60,
      });
    }
    particlesRef.current = arr;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 100% Solid Pure Black Base
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const time = frame / fps;

    const centerX = width * 0.5;
    const topY = -15;
    const floorY = height * 0.84; // Lifted floor perspective matching reference

    // Subtle atmospheric breathing & smoke turbulence
    const breathing = 1.0 + Math.sin(time * 1.6) * 0.035;

    // Conical spotlight dimensions matching reference
    const topRadius = 200 * breathing;
    const bottomRadius = 780 * breathing;

    // -------------------------------------------------------------------------
    // 1. BROAD THEATRICAL ROYAL BLUE HAZE
    // -------------------------------------------------------------------------
    ctx.save();
    const broadHaze = ctx.createRadialGradient(
      centerX,
      height * 0.46,
      120,
      centerX,
      height * 0.46,
      width * 0.46
    );
    broadHaze.addColorStop(0.0, "rgba(3, 105, 161, 0.30)");
    broadHaze.addColorStop(0.35, "rgba(2, 132, 199, 0.18)");
    broadHaze.addColorStop(0.65, "rgba(30, 64, 175, 0.06)");
    broadHaze.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = broadHaze;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // -------------------------------------------------------------------------
    // 2. SOFT-FEATHERED MAIN VOLUMETRIC CONE (BLURRED)
    // -------------------------------------------------------------------------
    ctx.save();
    ctx.filter = "blur(44px)";

    ctx.beginPath();
    ctx.moveTo(centerX - topRadius, topY);
    ctx.lineTo(centerX + topRadius, topY);
    ctx.lineTo(centerX + bottomRadius, floorY);
    ctx.lineTo(centerX - bottomRadius, floorY);
    ctx.closePath();

    const mainGrad = ctx.createLinearGradient(0, topY, 0, floorY);
    mainGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.96)");
    mainGrad.addColorStop(0.12, "rgba(224, 242, 254, 0.85)");
    mainGrad.addColorStop(0.35, "rgba(56, 189, 248, 0.48)");
    mainGrad.addColorStop(0.70, "rgba(14, 165, 233, 0.30)");
    mainGrad.addColorStop(1.0, "rgba(2, 132, 199, 0.42)");

    ctx.fillStyle = mainGrad;
    ctx.fill();
    ctx.restore();

    // -------------------------------------------------------------------------
    // 3. INNER INTENSE ICE-CYAN / WHITE CORE (BLURRED)
    // -------------------------------------------------------------------------
    ctx.save();
    ctx.filter = "blur(24px)";

    const innerTopR = topRadius * 0.40;
    const innerBotR = bottomRadius * 0.36;

    ctx.beginPath();
    ctx.moveTo(centerX - innerTopR, topY);
    ctx.lineTo(centerX + innerTopR, topY);
    ctx.lineTo(centerX + innerBotR, floorY);
    ctx.lineTo(centerX - innerBotR, floorY);
    ctx.closePath();

    const coreGrad = ctx.createLinearGradient(0, topY, 0, floorY);
    coreGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.98)");
    coreGrad.addColorStop(0.18, "rgba(240, 249, 255, 0.85)");
    coreGrad.addColorStop(0.52, "rgba(186, 230, 254, 0.52)");
    coreGrad.addColorStop(0.85, "rgba(125, 211, 252, 0.38)");
    coreGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.72)");

    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.restore();

    // -------------------------------------------------------------------------
    // 4. VERTICAL GOD RAY STRIATIONS & VOLUMETRIC BEAM SHAFTS
    // -------------------------------------------------------------------------
    ctx.save();
    ctx.filter = "blur(18px)";
    const rayCount = 18;
    for (let i = 0; i < rayCount; i++) {
      const rayFrac = (i / (rayCount - 1)) * 2 - 1; // -1 to +1
      const rayTopX = centerX + rayFrac * topRadius * 0.75;
      const rayBotX = centerX + rayFrac * bottomRadius * 0.85 + Math.sin(time * 0.85 + i * 1.2) * 20;

      const rayWidth = (32 + (i % 5) * 18) * (1 - Math.abs(rayFrac) * 0.25);
      const rayAlpha = (0.09 + Math.sin(time * 2.0 + i * 1.4) * 0.04) * (1 - Math.abs(rayFrac) * 0.45);

      ctx.beginPath();
      ctx.moveTo(rayTopX - rayWidth * 0.4, topY);
      ctx.lineTo(rayTopX + rayWidth * 0.4, topY);
      ctx.lineTo(rayBotX + rayWidth * 0.85, floorY);
      ctx.lineTo(rayBotX - rayWidth * 0.85, floorY);
      ctx.closePath();

      const rGrad = ctx.createLinearGradient(0, topY, 0, floorY);
      rGrad.addColorStop(0.0, `rgba(255, 255, 255, ${rayAlpha * 1.6})`);
      rGrad.addColorStop(0.35, `rgba(224, 242, 254, ${rayAlpha * 1.2})`);
      rGrad.addColorStop(0.80, `rgba(56, 189, 248, ${rayAlpha})`);
      rGrad.addColorStop(1.0, `rgba(2, 132, 199, ${rayAlpha * 0.5})`);

      ctx.fillStyle = rGrad;
      ctx.fill();
    }
    ctx.restore();

    // -------------------------------------------------------------------------
    // 5. FLOOR SPECULAR REFLECTION OVAL / HOTSPOT
    // -------------------------------------------------------------------------
    ctx.save();
    const floorOvalW = bottomRadius * 0.78;
    const floorOvalH = 62 * breathing;

    // Diffuse Outer Blue Glow
    ctx.filter = "blur(26px)";
    const floorGlow = ctx.createRadialGradient(
      centerX,
      floorY,
      25,
      centerX,
      floorY,
      floorOvalW * 1.35
    );
    floorGlow.addColorStop(0.0, "rgba(56, 189, 248, 0.90)");
    floorGlow.addColorStop(0.30, "rgba(2, 132, 199, 0.65)");
    floorGlow.addColorStop(0.65, "rgba(3, 105, 161, 0.22)");
    floorGlow.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

    ctx.beginPath();
    ctx.ellipse(centerX, floorY, floorOvalW * 1.35, floorOvalH * 1.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = floorGlow;
    ctx.fill();

    // Intense Specular White Center Oval
    ctx.filter = "blur(11px)";
    const coreGlow = ctx.createRadialGradient(
      centerX,
      floorY,
      8,
      centerX,
      floorY,
      floorOvalW * 0.55
    );
    coreGlow.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    coreGlow.addColorStop(0.25, "rgba(240, 249, 255, 0.95)");
    coreGlow.addColorStop(0.55, "rgba(186, 230, 254, 0.65)");
    coreGlow.addColorStop(1.0, "rgba(56, 189, 248, 0.0)");

    ctx.beginPath();
    ctx.ellipse(centerX, floorY, floorOvalW * 0.55, floorOvalH * 0.85, 0, 0, Math.PI * 2);
    ctx.fillStyle = coreGlow;
    ctx.fill();
    ctx.restore();

    // -------------------------------------------------------------------------
    // 6. ATMOSPHERIC DUST MOTES & SWIRLING PARTICLES
    // -------------------------------------------------------------------------
    ctx.save();
    for (const p of particlesRef.current) {
      const currentY = ((p.seedY * height - time * p.speedY) % floorY + floorY) % floorY;

      const normY = currentY / floorY;
      const coneR = topRadius + (bottomRadius - topRadius) * normY;

      const currentX =
        centerX +
        (p.seedX - 0.5) * coneR * 1.8 +
        Math.sin(time * p.driftFreq + p.phase) * p.driftAmp;

      const distFromCenter = Math.abs(currentX - centerX);
      if (distFromCenter > coneR * 1.05 || currentY > floorY + 12) {
        continue;
      }

      const inBeamFactor = Math.max(0, 1 - distFromCenter / coneR);
      const twinkle = 0.7 + 0.3 * Math.sin(time * p.twinkleFreq + p.phase);
      const alpha = inBeamFactor * inBeamFactor * twinkle * p.baseBrightness;

      ctx.shadowColor = "rgba(186, 230, 254, 0.85)";
      ctx.shadowBlur = 5;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size * (0.8 + inBeamFactor * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // -------------------------------------------------------------------------
    // 7. TOP EMITTER SPECULAR APERTURE
    // -------------------------------------------------------------------------
    ctx.save();
    ctx.filter = "blur(8px)";
    const topAperture = ctx.createRadialGradient(
      centerX,
      topY,
      12,
      centerX,
      topY,
      topRadius * 1.15
    );
    topAperture.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    topAperture.addColorStop(0.4, "rgba(224, 242, 254, 0.90)");
    topAperture.addColorStop(1.0, "rgba(56, 189, 248, 0.0)");

    ctx.beginPath();
    ctx.ellipse(centerX, topY + 8, topRadius * 1.15, 48, 0, 0, Math.PI * 2);
    ctx.fillStyle = topAperture;
    ctx.fill();
    ctx.restore();
  }, [frame, fps, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        backgroundColor: "#000000",
      }}
    />
  );
};
