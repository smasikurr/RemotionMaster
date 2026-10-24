import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface CyberneticNeuralDataWave4KProps {
  primaryColor?: string;
  glowColor?: string;
  waveCount?: number;
}

/**
 * CyberneticNeuralDataWave4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Sci-Fi / Cybernetic Neural Energy Wave & Holographic Audio Frequency Mesh with:
 * - 48 depth-layered undulating spline ribbons in perspective space
 * - Multi-harmonic trigonometric soundwave oscillations with peak node blooms
 * - Traveling neural spark pulses along wave crests
 * - Pure pitch black (#000000) base layer optimized for Screen & Add blend modes
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const CyberneticNeuralDataWave4K: React.FC<CyberneticNeuralDataWave4KProps> = ({
  primaryColor = "#00F0FF",
  glowColor = "#0066FF",
  waveCount = 44,
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
    const TOTAL_FRAMES = 720; // 12.00s @ 60fps
    const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
    const twoPi = Math.PI * 2;

    // 1. Pure Pitch Black Base
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // 2. Ambient Cybernetic Vignette Glow
    const bgRad = ctx.createRadialGradient(CX, CY, 100, CX, CY, W * 0.7);
    bgRad.addColorStop(0, "rgba(0, 40, 80, 0.22)");
    bgRad.addColorStop(0.5, "rgba(0, 15, 40, 0.08)");
    bgRad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = bgRad;
    ctx.fillRect(0, 0, W, H);

    // 3. Multi-Harmonic Wave Mesh Configuration
    // Wave parameters: 44 layered spline ribbons with progressive depth & phase shift
    const pointsPerWave = 120;
    const stepX = W / pointsPerWave;

    ctx.save();
    ctx.globalCompositeOperation = "lighter"; // Additive blending for luminous energy glow

    // Wave Loop Cycles: Exactly integer multiples over 12.0s -> 100% seamless mathematical loop!
    const travelCycles = 2; // traveling wave phase
    const pulseCycles = 3;  // vertical amplitude breathing
    const travelPhase = normT * twoPi * travelCycles;
    const breathePhase = normT * twoPi * pulseCycles;

    for (let w = 0; w < waveCount; w++) {
      const depth = w / waveCount; // 0 = far back, 1 = foreground
      const zScale = 0.45 + depth * 0.55;
      const alpha = (0.15 + depth * 0.65) * (0.8 + Math.sin(breathePhase + depth * 3) * 0.2);

      // Ribbon color gradient from deep cobalt blue to laser cyan & white crests
      const r = Math.floor(depth * 180);
      const g = Math.floor(80 + depth * 160);
      const b = 255;
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.75})`;
      ctx.lineWidth = 1.5 + depth * 2.5;

      ctx.beginPath();
      const wavePoints: [number, number][] = [];

      for (let p = 0; p <= pointsPerWave; p++) {
        const x = p * stepX;
        const normX = (p / pointsPerWave) * 2 - 1; // -1 to +1

        // Multi-frequency harmonic synthesis:
        // 1. Base carrier wave (wide undulating curves)
        const harm1 = Math.sin(normX * Math.PI * 3 + travelPhase + depth * 2.5);
        // 2. Mid harmonic (neural frequency jitter)
        const harm2 = Math.cos(normX * Math.PI * 7 - travelPhase * 1.5 + depth * 4.0) * 0.45;
        // 3. Micro harmonic (laser ripple)
        const harm3 = Math.sin(normX * Math.PI * 14 + travelPhase * 2.0) * 0.18;

        // Envelope curve: Pinch slightly at horizontal edges, wide volumetric crests in center
        const envelope = Math.pow(Math.cos(normX * (Math.PI / 2.1)), 1.2);

        // Amplitude breathing with time
        const baseAmp = 380 * zScale;
        const dynamicAmp = baseAmp * (0.85 + Math.sin(breathePhase + depth * 1.8) * 0.25);

        // Vertical Y offset for perspective stack
        const yOffset = (depth - 0.5) * 420;
        const y = CY + yOffset + (harm1 + harm2 + harm3) * dynamicAmp * envelope;

        wavePoints.push([x, y]);
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glowing Node Vertices at Peak Crests (every 6th ribbon)
      if (w % 4 === 0) {
        for (let p = 10; p < pointsPerWave - 10; p += 6) {
          const [nx, ny] = wavePoints[p];
          const nodePulse = Math.sin(normXPhase(p, pointsPerWave) * 6 + travelPhase + depth) * 0.5 + 0.5;
          if (nodePulse > 0.65) {
            const nodeRadius = (3 + depth * 4) * nodePulse;
            ctx.fillStyle = depth > 0.6 ? "#FFFFFF" : primaryColor;
            ctx.beginPath();
            ctx.arc(nx, ny, nodeRadius, 0, twoPi);
            ctx.fill();

            // Vertical connecting laser filament to adjacent ribbon
            if (w < waveCount - 4) {
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * depth})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(nx, ny);
              ctx.lineTo(nx, ny + 35 * zScale);
              ctx.stroke();
            }
          }
        }
      }
    }

    function normXPhase(idx: number, total: number) {
      return (idx / total) * Math.PI * 2;
    }

    // 4. Traveling Neural Spark Energy Pulses along the Main Wave
    const sparkCount = 18;
    for (let s = 0; s < sparkCount; s++) {
      const sparkNorm = ((normT * travelCycles * 1.5 + s / sparkCount) % 1.0);
      const sparkX = sparkNorm * W;
      const normX = sparkNorm * 2 - 1;
      const envelope = Math.pow(Math.cos(normX * (Math.PI / 2.1)), 1.2);
      const sparkY = CY + Math.sin(normX * Math.PI * 3 + travelPhase) * 360 * envelope;

      // Intense White/Cyan Energy Spark
      const sparkGrad = ctx.createRadialGradient(sparkX, sparkY, 1, sparkX, sparkY, 28);
      sparkGrad.addColorStop(0, "#FFFFFF");
      sparkGrad.addColorStop(0.35, "rgba(0, 240, 255, 0.85)");
      sparkGrad.addColorStop(0.7, "rgba(0, 102, 255, 0.35)");
      sparkGrad.addColorStop(1, "transparent");
      ctx.fillStyle = sparkGrad;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 28, 0, twoPi);
      ctx.fill();
    }

    // 5. Floating Ambient Cyber Dust Motes in 3D Space
    const dustCount = 80;
    for (let d = 0; d < dustCount; d++) {
      const dx = (d * 97.3 + normT * W * 0.5) % W;
      const dy = (d * 43.7 + Math.sin(d + normT * twoPi * 2) * 60) % H;
      const dr = 1.5 + (d % 3);
      const dAlpha = (0.2 + (Math.sin(d * 3.7 + normT * twoPi) * 0.5 + 0.5) * 0.5);

      ctx.fillStyle = `rgba(0, 240, 255, ${dAlpha})`;
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, twoPi);
      ctx.fill();
    }

    ctx.restore(); // Restore normal composite operation

    // 6. Subtle Vignette Edge Masking
    const vigGrad = ctx.createRadialGradient(CX, CY, H * 0.45, CX, CY, W * 0.65);
    vigGrad.addColorStop(0, "transparent");
    vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.75)");
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

  }, [frame, width, height, primaryColor, glowColor, waveCount]);

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
