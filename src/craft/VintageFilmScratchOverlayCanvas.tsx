import React, { useEffect, useRef } from 'react';
import { useCurrentFrame } from 'remotion';
import { getFilmDamageFrameState } from '../utils/proceduralMaster';

export interface VintageFilmScratchOverlayCanvasProps {
  width?: number;
  height?: number;
  seed?: string;
  dustCount?: number;
}

export const VintageFilmScratchOverlayCanvas: React.FC<VintageFilmScratchOverlayCanvasProps> = ({
  width = 3840,
  height = 2160,
  seed = 'vintage_master_16mm',
  dustCount = 38,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retrieve deterministic procedural damage state for this frame
    const state = getFilmDamageFrameState(seed, frame, width, height, dustCount);
    const { scratches, hairs, specks, blotches, shutterFlicker, gateWeaveX, gateWeaveY } = state;

    // 1. Base Shutter Brightness & Background
    const baseBrightness = Math.round(14 * shutterFlicker);
    const bgHex = `#${baseBrightness.toString(16).padStart(2, '0')}${baseBrightness.toString(16).padStart(2, '0')}${baseBrightness.toString(16).padStart(2, '0')}`;
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Projector Gate Vignette (Soft center illumination, darker borders)
    const vignette = ctx.createRadialGradient(
      width / 2 + gateWeaveX,
      height / 2 + gateWeaveY,
      width * 0.15,
      width / 2 + gateWeaveX,
      height / 2 + gateWeaveY,
      width * 0.65
    );
    vignette.addColorStop(0, 'rgba(255, 255, 255, 0.025)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 3. Render Soft Translucent Emulsion Smudge Blotches
    ctx.save();
    for (const blotch of blotches) {
      ctx.beginPath();
      ctx.ellipse(
        blotch.x + gateWeaveX,
        blotch.y + gateWeaveY,
        blotch.rx,
        blotch.ry,
        blotch.rotation,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = blotch.color;
      ctx.globalAlpha = blotch.opacity;
      ctx.fill();
    }
    ctx.restore();

    // 4. Render Primary Vertical Traveling & Jumping Scratches
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const scratch of scratches) {
      for (const seg of scratch.segments) {
        ctx.beginPath();
        ctx.moveTo(seg.x1 + gateWeaveX, seg.y1 + gateWeaveY);
        ctx.lineTo(seg.x2 + gateWeaveX, seg.y2 + gateWeaveY);
        ctx.strokeStyle = seg.color;
        ctx.lineWidth = seg.width;
        ctx.globalAlpha = seg.opacity;
        ctx.stroke();
      }
    }
    ctx.restore();

    // 5. Render Organic Curved Gate Hair & Fiber Flashes
    ctx.save();
    ctx.lineCap = 'round';
    for (const hair of hairs) {
      if (hair.points.length >= 4) {
        const [p0, p1, p2, p3] = hair.points;
        ctx.beginPath();
        ctx.moveTo(p0.x + gateWeaveX, p0.y + gateWeaveY);
        ctx.bezierCurveTo(
          p1.x + gateWeaveX,
          p1.y + gateWeaveY,
          p2.x + gateWeaveX,
          p2.y + gateWeaveY,
          p3.x + gateWeaveX,
          p3.y + gateWeaveY
        );
        ctx.strokeStyle = hair.color;
        ctx.lineWidth = hair.width;
        ctx.globalAlpha = hair.opacity;
        ctx.stroke();
      }
    }
    ctx.restore();

    // 6. Render Flickering Dust Specks (Irregular polygons)
    ctx.save();
    for (const speck of specks) {
      if (speck.points.length > 2) {
        ctx.beginPath();
        ctx.moveTo(speck.points[0].x + gateWeaveX, speck.points[0].y + gateWeaveY);
        for (let i = 1; i < speck.points.length; i++) {
          ctx.lineTo(speck.points[i].x + gateWeaveX, speck.points[i].y + gateWeaveY);
        }
        ctx.closePath();
        ctx.fillStyle = speck.color;
        ctx.globalAlpha = speck.opacity;
        ctx.fill();
      }
    }
    ctx.restore();

    // 7. Subtle 16mm/35mm Projector Gate Aperture Mask (Soft rounded matte frame)
    ctx.save();
    const gateMarginX = 36;
    const gateMarginY = 24;
    const gateRadius = 60;
    const gx0 = gateMarginX + gateWeaveX * 0.5;
    const gy0 = gateMarginY + gateWeaveY * 0.5;
    const gx1 = width - gateMarginX + gateWeaveX * 0.5;
    const gy1 = height - gateMarginY + gateWeaveY * 0.5;

    // Draw dark border around the gate
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    // Cutout aperture
    ctx.moveTo(gx0 + gateRadius, gy0);
    ctx.lineTo(gx1 - gateRadius, gy0);
    ctx.arcTo(gx1, gy0, gx1, gy0 + gateRadius, gateRadius);
    ctx.lineTo(gx1, gy1 - gateRadius);
    ctx.arcTo(gx1, gy1, gx1 - gateRadius, gy1, gateRadius);
    ctx.lineTo(gx0 + gateRadius, gy1);
    ctx.arcTo(gx0, gy1, gx0, gy1 - gateRadius, gateRadius);
    ctx.lineTo(gx0, gy0 + gateRadius);
    ctx.arcTo(gx0, gy0, gx0 + gateRadius, gy0, gateRadius);
    ctx.closePath();
    ctx.fillStyle = '#050505';
    ctx.fill('evenodd');

    // Soft border stroke along aperture edge
    ctx.beginPath();
    ctx.moveTo(gx0 + gateRadius, gy0);
    ctx.lineTo(gx1 - gateRadius, gy0);
    ctx.arcTo(gx1, gy0, gx1, gy0 + gateRadius, gateRadius);
    ctx.lineTo(gx1, gy1 - gateRadius);
    ctx.arcTo(gx1, gy1, gx1 - gateRadius, gy1, gateRadius);
    ctx.lineTo(gx0 + gateRadius, gy1);
    ctx.arcTo(gx0, gy1, gx0, gy1 - gateRadius, gateRadius);
    ctx.lineTo(gx0, gy0 + gateRadius);
    ctx.arcTo(gx0, gy0, gx0 + gateRadius, gy0, gateRadius);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }, [frame, width, height, seed, dustCount]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: '#0E0E0E',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
