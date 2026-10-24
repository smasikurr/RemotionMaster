import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CinematicFilmBurnTransitionsCanvasProps {
  seed?: number;
}

export const CinematicFilmBurnTransitionsCanvas: React.FC<CinematicFilmBurnTransitionsCanvasProps> = ({
  seed = 49,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Pure Pitch Black Void Background (#000000 for perfect Screen / Linear Dodge blending)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const time = frame / fps; // 0.0 to 6.0s (360 frames total)

    // Helper: Harmonic organic noise for natural flame flicker
    const flicker = (t: number, speed: number = 1.0) => {
      return (
        0.5 +
        0.25 * Math.sin(t * 18.0 * speed) +
        0.15 * Math.cos(t * 37.0 * speed) +
        0.10 * Math.sin(t * 71.0 * speed)
      );
    };

    // Helper: Draw organic glowing film burn cloud with 100% smooth gradient falloff (NO hard box edges)
    const drawBurnCloud = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      rotation: number,
      intensity: number,
      stops: [number, string][]
    ) => {
      if (intensity <= 0.005) return;

      ctx.save();
      ctx.globalAlpha = Math.min(1.0, intensity);
      ctx.globalCompositeOperation = 'screen';

      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.scale(1.0, ry / rx);

      const grad = ctx.createRadialGradient(0, 0, rx * 0.04, 0, 0, rx);
      for (const [stop, col] of stops) {
        grad.addColorStop(stop, col);
      }
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Helper: Anamorphic horizontal optical flare streak with soft X and Y fade
    const drawAnamorphicStreak = (
      cx: number,
      cy: number,
      length: number,
      thickness: number,
      alpha: number,
      tint: string
    ) => {
      if (alpha <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = Math.min(1.0, alpha);
      ctx.globalCompositeOperation = 'screen';

      ctx.translate(cx, cy);
      ctx.scale(1.0, thickness / length);

      const grad = ctx.createRadialGradient(0, 0, length * 0.05, 0, 0, length * 0.5);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.98)');
      grad.addColorStop(0.25, tint);
      grad.addColorStop(0.65, tint.replace(/[\d\.]+\)$/, '0.35)'));
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, length * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ==========================================
    // 4 PRECISE CINEMATIC FILM BURN FLASHES (Matching Reference Timeline 1:1)
    // ==========================================

    // BURST 1 (Frames 0 to 65: 0.0s - 1.08s)
    // Massive warm golden-yellow flash burning across the upper half, with rich violet/magenta lower band
    if (frame >= 0 && frame <= 65) {
      const prog = frame / 65;
      const env = prog < 0.2 ? prog / 0.2 : (1.0 - prog) / 0.8;
      const flk = 0.88 + flicker(time, 2.2) * 0.25;
      const alpha = Math.min(1.0, env * flk * 1.15);

      // Deep violet/magenta chromatic wash across the entire lower screen
      drawBurnCloud(
        width * 0.35,
        height * 0.65,
        width * 0.85,
        height * 0.65,
        -0.08,
        alpha * 0.85,
        [
          [0.0, 'rgba(210, 25, 140, 0.85)'],
          [0.4, 'rgba(120, 15, 100, 0.60)'],
          [0.75, 'rgba(30, 8, 65, 0.35)'],
        ]
      );

      // Massive blazing golden-yellow sheet across top-left & center
      drawBurnCloud(
        width * 0.30,
        height * 0.15,
        width * 0.75,
        height * 0.55,
        -0.05,
        alpha,
        [
          [0.0, 'rgba(255, 255, 220, 1.0)'],
          [0.35, 'rgba(255, 225, 110, 0.95)'],
          [0.65, 'rgba(255, 55, 95, 0.82)'],
          [0.85, 'rgba(160, 15, 75, 0.45)'],
        ]
      );

      // Super-hot white core gate crest
      drawBurnCloud(
        width * 0.28,
        height * 0.10,
        width * 0.45,
        height * 0.32,
        0.0,
        alpha * 0.98,
        [
          [0.0, 'rgba(255, 255, 255, 1.0)'],
          [0.4, 'rgba(255, 245, 180, 0.88)'],
          [0.7, 'rgba(255, 140, 50, 0.45)'],
        ]
      );
    }

    // VOID PAUSE 1 (Frames 66 to 110): Dark void

    // BURST 2 (Frames 110 to 195: 1.83s - 3.25s)
    // Sweeping hot pink/magenta optical gate burn across the entire top edge
    if (frame >= 110 && frame <= 195) {
      const prog = (frame - 110) / 85;
      const env = prog < 0.25 ? prog / 0.25 : (1.0 - prog) / 0.75;
      const flk = 0.90 + flicker(time, 1.8) * 0.2;
      const alpha = Math.min(1.0, env * flk);

      // Top gate magenta flash
      drawBurnCloud(
        width * 0.50,
        height * 0.12,
        width * 0.85,
        height * 0.45,
        0.02,
        alpha * 0.95,
        [
          [0.0, 'rgba(255, 255, 240, 0.95)'],
          [0.35, 'rgba(255, 45, 130, 0.92)'],
          [0.70, 'rgba(180, 15, 85, 0.65)'],
          [0.88, 'rgba(50, 8, 45, 0.30)'],
        ]
      );

      // Subtle cyan edge chromatic aberration fringe on right
      drawBurnCloud(
        width * 0.88,
        height * 0.10,
        width * 0.35,
        height * 0.30,
        0.1,
        alpha * 0.55,
        [
          [0.0, 'rgba(190, 235, 255, 0.65)'],
          [0.5, 'rgba(60, 130, 230, 0.40)'],
          [0.8, 'rgba(10, 20, 80, 0.15)'],
        ]
      );
    }

    // VOID PAUSE 2 (Frames 196 to 230): Dark void

    // BURST 3 (Frames 230 to 305: 3.83s - 5.08s)
    // Intense warm amber/yellow flash rising from the bottom with horizontal optical streak
    if (frame >= 230 && frame <= 305) {
      const prog = (frame - 230) / 75;
      const env = prog < 0.25 ? prog / 0.25 : (1.0 - prog) / 0.75;
      const flk = 0.88 + flicker(time, 2.5) * 0.25;
      const alpha = Math.min(1.0, env * flk);

      // Warm amber glow from bottom-center
      drawBurnCloud(
        width * 0.52,
        height * 0.75,
        width * 0.75,
        height * 0.55,
        -0.08,
        alpha * 0.98,
        [
          [0.0, 'rgba(255, 255, 220, 1.0)'],
          [0.35, 'rgba(255, 215, 65, 0.92)'],
          [0.70, 'rgba(255, 40, 80, 0.75)'],
          [0.88, 'rgba(120, 10, 40, 0.35)'],
        ]
      );

      // White optical flash center
      drawBurnCloud(
        width * 0.50,
        height * 0.78,
        width * 0.42,
        height * 0.35,
        0.0,
        alpha,
        [
          [0.0, 'rgba(255, 255, 255, 1.0)'],
          [0.45, 'rgba(255, 240, 160, 0.88)'],
          [0.75, 'rgba(255, 90, 40, 0.50)'],
        ]
      );

      // Anamorphic horizontal optical streak
      drawAnamorphicStreak(
        width * 0.5,
        height * 0.40,
        width * 0.9,
        32,
        alpha * 0.85,
        'rgba(255, 160, 80, 0.75)'
      );
    }

    // BURST 4 (Frames 295 to 360: 4.91s - 6.0s)
    // Fiery red/crimson optical bloom filling the right half
    if (frame >= 295 && frame <= 360) {
      const prog = (frame - 295) / 65;
      const env = prog < 0.25 ? prog / 0.25 : (1.0 - prog) / 0.75;
      const flk = 0.85 + flicker(time, 2.8) * 0.3;
      const alpha = Math.min(1.0, env * flk * 1.05);

      // Fiery crimson/ruby cloud on right
      drawBurnCloud(
        width * 0.75,
        height * 0.50,
        width * 0.65,
        height * 0.65,
        0.12,
        alpha,
        [
          [0.0, 'rgba(255, 255, 220, 0.98)'],
          [0.35, 'rgba(255, 55, 10, 0.92)'],
          [0.70, 'rgba(190, 15, 15, 0.75)'],
          [0.88, 'rgba(60, 5, 10, 0.35)'],
        ]
      );

      // Secondary warm edge flare
      drawBurnCloud(
        width * 0.85,
        height * 0.35,
        width * 0.48,
        height * 0.45,
        -0.1,
        alpha * 0.88,
        [
          [0.0, 'rgba(255, 210, 70, 0.85)'],
          [0.45, 'rgba(230, 25, 25, 0.70)'],
          [0.80, 'rgba(80, 5, 20, 0.40)'],
        ]
      );
    }

    // ==========================================
    // 5. Analog 35mm Silver Halide Film Grain Micro-Texture
    // ==========================================
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.14;

    const grainCount = 380;
    let s = (seed + frame * 31) * 2654435761;
    const rnd = () => {
      s = (s ^ (s >> 13)) * 1274126177;
      return ((s >>> 0) % 10000) / 10000;
    };

    ctx.fillStyle = '#FFFFFF';
    for (let g = 0; g < grainCount; g++) {
      const gx = rnd() * width;
      const gy = rnd() * height;
      const gr = 0.8 + rnd() * 2.2;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }, [frame, width, height, fps, seed]);

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
