import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CRTStaticVHSGlitchCanvasProps {
  seed?: number;
}

export const CRTStaticVHSGlitchCanvas: React.FC<CRTStaticVHSGlitchCanvasProps> = ({
  seed = 52,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Pure Pitch Black Void Background (#000000 for Screen/Linear Dodge blending)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Deterministic PRNG per frame
    let s = (seed * 19301 + frame * 65537 + 1013904223) >>> 0;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return (s >>> 0) / 4294967296;
    };

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // 2. Uniform Full-Screen CRT Scanline Static Weave
    // Iterate every scanline to ensure the entire screen has authentic analog noise coverage
    for (let y = 0; y < height; y += 4) {
      // 3 to 7 micro-dashes per scanline
      const dashCount = 2 + Math.floor(rnd() * 5);
      for (let d = 0; d < dashCount; d++) {
        const x = rnd() * width;
        const w = 15 + rnd() * 95;
        const lum = 0.08 + rnd() * 0.32;
        ctx.fillStyle = `rgba(255, 255, 255, ${lum})`;
        ctx.fillRect(x, y, w, 2.0);
      }
    }

    // 3. Horizontal VHS Tracking Tear Bands (Layered scanline noise, NO flat solid boxes)
    const bandCount = 3 + Math.floor(rnd() * 3);
    for (let b = 0; b < bandCount; b++) {
      const bandY = rnd() * (height - 200);
      const bandH = 50 + rnd() * 160;
      const bandW = width * (0.55 + rnd() * 0.45);
      const bandX = rnd() > 0.4 ? 0 : width - bandW;
      const intensity = 0.65 + rnd() * 0.35;

      // Chromatic Aberration Fringe (Red and Cyan shift)
      for (let y = bandY; y < bandY + bandH; y += 4) {
        if (rnd() > 0.3) {
          const rw = 40 + rnd() * (bandW * 0.8);
          ctx.fillStyle = `rgba(255, 25, 35, ${intensity * 0.4})`;
          ctx.fillRect(bandX - 8 + rnd() * 30, y, rw, 2.0);

          ctx.fillStyle = `rgba(0, 230, 255, ${intensity * 0.4})`;
          ctx.fillRect(bandX + 8 + rnd() * 30, y, rw, 2.0);
        }
      }

      // High-Density Granular Scan Jitter Lines
      for (let y = bandY; y < bandY + bandH; y += 2) {
        if (rnd() > 0.15) {
          const segCount = 4 + Math.floor(rnd() * 10);
          for (let seg = 0; seg < segCount; seg++) {
            const segX = bandX + rnd() * (bandW - 80);
            const segW = 30 + rnd() * 260;
            const bright = 0.5 + rnd() * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${bright * intensity})`;
            ctx.fillRect(segX, y, segW, 2.0);
          }
        }
      }
    }

    // 4. Massive Horizontal White Tracking Noise Bar (Row 1 style in reference)
    // Granular textured band across left half
    const cycle = frame % 90;
    if (cycle < 32) {
      const barY = height * 0.15 + Math.sin(frame * 0.25) * 35;
      const barH = 180 + rnd() * 50;
      const barW = width * 0.58;

      for (let y = barY; y < barY + barH; y += 2) {
        const segCount = 6 + Math.floor(rnd() * 12);
        for (let seg = 0; seg < segCount; seg++) {
          const segX = rnd() * (barW - 60);
          const segW = 60 + rnd() * 450;
          const lum = 0.6 + rnd() * 0.4;
          ctx.fillStyle = `rgba(255, 255, 255, ${lum})`;
          ctx.fillRect(segX, y, segW, 2.0);
        }
      }
    }

    // 5. CRT Interlaced Dark Scanline Grid
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2.0);
    }

    ctx.restore();
  }, [frame, width, height, seed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};
