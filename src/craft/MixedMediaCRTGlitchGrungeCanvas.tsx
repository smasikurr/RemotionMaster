import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface MixedMediaCRTGlitchGrungeCanvasProps {
  seed?: number;
}

export const MixedMediaCRTGlitchGrungeCanvas: React.FC<MixedMediaCRTGlitchGrungeCanvasProps> = ({
  seed = 56,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 8 distinct 1-second dynamic scenes (60 frames each @ 60fps)
    const sceneIndex = Math.min(7, Math.floor(frame / 60));
    const localFrame = frame % 60;

    // Deterministic PRNG per frame
    let s = (seed * 65537 + frame * 1013904223 + sceneIndex * 19301) >>> 0;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return (s >>> 0) / 4294967296;
    };

    ctx.save();

    // =========================================================================
    // SCENE 0 (0-1s, frames 0-59): Analog CRT Vignette Scanline Burn
    // =========================================================================
    if (sceneIndex === 0) {
      // Base dark grey/black
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // CRT Phosphor Edge Glow (curved frame burning around border)
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.32,
        width / 2, height / 2, width * 0.58
      );
      grad.addColorStop(0.0, 'rgba(0, 0, 0, 0.0)');
      grad.addColorStop(0.7, 'rgba(230, 235, 240, 0.85)');
      grad.addColorStop(0.92, 'rgba(255, 255, 255, 0.98)');
      grad.addColorStop(1.0, 'rgba(10, 10, 10, 1.0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Horizontal CRT Scanlines
      for (let y = 0; y < height; y += 4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(0, y, width, 2);
        if (rnd() > 0.4) {
          const sx = rnd() * width;
          const sw = 50 + rnd() * 200;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + rnd() * 0.3})`;
          ctx.fillRect(sx, y, sw, 2);
        }
      }
    }

    // =========================================================================
    // SCENE 1 (1-2s, frames 60-119): Dark CRT Scanline Static & Sync Tear
    // =========================================================================
    else if (sceneIndex === 1) {
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // Dense horizontal scanlines
      for (let y = 0; y < height; y += 4) {
        if (rnd() > 0.3) {
          const lum = 0.04 + rnd() * 0.18;
          ctx.fillStyle = `rgba(255, 255, 255, ${lum})`;
          ctx.fillRect(0, y, width, 2);
        }
      }

      // Horizontal Sync Tear Glitch (white/magenta bar across center)
      const tearY = height * (0.35 + (rnd() - 0.5) * 0.25);
      const tearH = 15 + rnd() * 45;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fillRect(0, tearY, width, tearH);

      // Chromatic aberration fringes
      ctx.fillStyle = 'rgba(255, 0, 220, 0.65)';
      ctx.fillRect(0, tearY - 8, width, 6);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
      ctx.fillRect(0, tearY + tearH, width, 6);
    }

    // =========================================================================
    // SCENE 2 (2-3s, frames 120-179): High-Contrast Xerox Marker Scribble
    // =========================================================================
    else if (sceneIndex === 2) {
      // White paper base
      ctx.fillStyle = '#f6f6f6';
      ctx.fillRect(0, 0, width, height);

      // Paper fiber texture & toner noise
      for (let i = 0; i < 500; i++) {
        const px = rnd() * width;
        const py = rnd() * height;
        ctx.fillStyle = `rgba(20, 20, 20, ${0.1 + rnd() * 0.35})`;
        ctx.fillRect(px, py, 1 + rnd() * 4, 1 + rnd() * 3);
      }

      // Bold continuous zigzag marker scribble
      const strokeStep = Math.floor(localFrame / 3);
      let strokeRnd = (seed * 111 + strokeStep * 997) >>> 0;
      const sr = () => {
        strokeRnd = (strokeRnd * 1664525 + 1013904223) >>> 0;
        return (strokeRnd >>> 0) / 4294967296;
      };

      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 420 + sr() * 90;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(-120, height * 0.82 + (sr() - 0.5) * 80);
      ctx.lineTo(width * 0.20 + (sr() - 0.5) * 60, -110);
      ctx.lineTo(width * 0.45 + (sr() - 0.5) * 60, height + 110);
      ctx.lineTo(width * 0.72 + (sr() - 0.5) * 60, -110);
      ctx.lineTo(width * 1.02 + (sr() - 0.5) * 60, height * 0.85 + (sr() - 0.5) * 80);
      ctx.stroke();

      // Second offset pass for chisel marker thickness
      ctx.lineWidth = 260 + sr() * 60;
      ctx.beginPath();
      ctx.moveTo(-80, height * 0.75);
      ctx.lineTo(width * 0.24, -60);
      ctx.lineTo(width * 0.40, height + 60);
      ctx.lineTo(width * 0.76, -60);
      ctx.lineTo(width * 0.95, height * 0.75);
      ctx.stroke();

      // Heavy Xerox toner edge spatter & raster dither
      for (let y = 0; y < height; y += 4) {
        if (rnd() > 0.35) {
          const sx = rnd() * width;
          const sw = 15 + rnd() * 95;
          ctx.fillStyle = rnd() > 0.5 ? '#ffffff' : '#050505';
          ctx.fillRect(sx, y, sw, 3);
        }
      }
    }

    // =========================================================================
    // SCENE 3 (3-4s, frames 180-239): Cobalt Blue VHS No Signal CRT
    // =========================================================================
    else if (sceneIndex === 3) {
      // Outer bezel dark casing
      ctx.fillStyle = '#080812';
      ctx.fillRect(0, 0, width, height);

      // Inner CRT curved phosphor screen with rounded corners
      const padX = width * 0.055;
      const padY = height * 0.065;
      const crtW = width - padX * 2;
      const crtH = height - padY * 2;
      const radius = 95;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(padX + radius, padY);
      ctx.lineTo(padX + crtW - radius, padY);
      ctx.quadraticCurveTo(padX + crtW, padY, padX + crtW, padY + radius);
      ctx.lineTo(padX + crtW, padY + crtH - radius);
      ctx.quadraticCurveTo(padX + crtW, padY + crtH, padX + crtW - radius, padY + crtH);
      ctx.lineTo(padX + radius, padY + crtH);
      ctx.quadraticCurveTo(padX, padY + crtH, padX, padY + crtH - radius);
      ctx.lineTo(padX, padY + radius);
      ctx.quadraticCurveTo(padX, padY, padX + radius, padY);
      ctx.closePath();
      ctx.clip();

      // Royal Cobalt Blue Screen
      ctx.fillStyle = '#081cd8';
      ctx.fillRect(padX, padY, crtW, crtH);

      // CRT Phosphor Glass Curvature Vignette
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, crtW * 0.25,
        width / 2, height / 2, crtW * 0.56
      );
      grad.addColorStop(0.0, 'rgba(35, 95, 255, 0.45)');
      grad.addColorStop(0.85, 'rgba(0, 15, 130, 0.65)');
      grad.addColorStop(1.0, 'rgba(0, 0, 50, 0.96)');
      ctx.fillStyle = grad;
      ctx.fillRect(padX, padY, crtW, crtH);

      // Scanline Weave
      for (let y = padY; y < padY + crtH; y += 4) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.30)';
        ctx.fillRect(padX, y, crtW, 2);
      }

      // VCR badge in top right corner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(padX + crtW - 280, padY + 70, 180, 180);

      // VHS bottom tracking noise band
      const trackingH = 65;
      for (let y = padY + crtH - trackingH; y < padY + crtH; y += 3) {
        if (rnd() > 0.2) {
          const tx = padX + rnd() * crtW;
          const tw = 40 + rnd() * 250;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + rnd() * 0.5})`;
          ctx.fillRect(tx, y, tw, 2);
        }
      }

      ctx.restore();

      // Chromatic cyan/red fringe around bezel
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.lineWidth = 14;
      ctx.strokeRect(padX - 2, padY - 2, crtW + 4, crtH + 4);
    }

    // =========================================================================
    // SCENE 4 (4-5s, frames 240-299): Vintage CRT Monitor Border Glitch
    // =========================================================================
    else if (sceneIndex === 4) {
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, width, height);

      // CRT curved inner frame
      const frameGrad = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.35,
        width / 2, height / 2, width * 0.55
      );
      frameGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0.0)');
      frameGrad.addColorStop(0.8, 'rgba(80, 80, 80, 0.3)');
      frameGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.7)');
      frameGrad.addColorStop(1.0, 'rgba(0, 0, 0, 1.0)');
      ctx.fillStyle = frameGrad;
      ctx.fillRect(0, 0, width, height);

      // Diagonal retrace lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.8);
      ctx.lineTo(width * 0.45, 0);
      ctx.stroke();

      // Scanline static
      for (let y = 0; y < height; y += 4) {
        if (rnd() > 0.4) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + rnd() * 0.25})`;
          ctx.fillRect(0, y, width, 2);
        }
      }
    }

    // =========================================================================
    // SCENE 5 (5-6s, frames 300-359): Analog Sync Roll & Vertical Hold Tear
    // =========================================================================
    else if (sceneIndex === 5) {
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      // Moving horizontal sync bars rolling up
      const rollY = ((localFrame * 32) % height);
      for (let i = 0; i < 3; i++) {
        const barY = (rollY + i * (height / 3)) % height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.fillRect(0, barY, width, 35 + rnd() * 30);
      }

      // Vertical hold jitter lines
      for (let y = 0; y < height; y += 6) {
        const sx = rnd() * width * 0.5;
        const sw = width * (0.3 + rnd() * 0.7);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + rnd() * 0.6})`;
        ctx.fillRect(sx, y, sw, 3);
      }
    }

    // =========================================================================
    // SCENE 6 (6-7s, frames 360-419): Magenta & Cyan Datamosh Glitch Blocks
    // =========================================================================
    else if (sceneIndex === 6) {
      ctx.fillStyle = '#12001a';
      ctx.fillRect(0, 0, width, height);

      // Datamosh compression artifact blocks
      const blockCount = 18;
      for (let b = 0; b < blockCount; b++) {
        const bx = rnd() * (width - 400);
        const by = rnd() * (height - 300);
        const bw = 180 + rnd() * 650;
        const bh = 50 + rnd() * 220;

        const isMagenta = rnd() > 0.45;
        ctx.fillStyle = isMagenta
          ? `rgba(235, 20, 200, ${0.45 + rnd() * 0.45})`
          : `rgba(0, 230, 255, ${0.45 + rnd() * 0.45})`;
        ctx.fillRect(bx, by, bw, bh);
      }

      // Horizontal RGB shift scan stripes
      for (let y = 0; y < height; y += 8) {
        if (rnd() > 0.4) {
          ctx.fillStyle = rnd() > 0.5 ? 'rgba(255, 0, 240, 0.35)' : 'rgba(0, 255, 240, 0.35)';
          ctx.fillRect(0, y, width, 4);
        }
      }
    }

    // =========================================================================
    // SCENE 7 (7-8s, frames 420-479): High-Contrast Ink Splash & Grunge Wipe
    // =========================================================================
    else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Organic black liquid ink blotches
      ctx.fillStyle = '#050505';
      const inkCenters = [
        [width * 0.25, height * 0.6, 280],
        [width * 0.75, height * 0.5, 360],
        [width * 0.50, height * 0.8, 300],
        [width * 0.85, height * 0.25, 240],
      ];

      for (const [ix, iy, ir] of inkCenters) {
        ctx.beginPath();
        ctx.arc(ix + (rnd() - 0.5) * 40, iy + (rnd() - 0.5) * 40, ir + (rnd() - 0.5) * 50, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vertical magenta digital noise bar (seen in reference frame 8!)
      ctx.fillStyle = 'rgba(225, 15, 185, 0.75)';
      ctx.fillRect(width * 0.92, 0, 45, height);

      // Fine horizontal scanline dither
      for (let y = 0; y < height; y += 4) {
        if (rnd() > 0.5) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.fillRect(0, y, width, 2);
        }
      }
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
