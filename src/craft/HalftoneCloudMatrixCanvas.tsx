import React, { useEffect, useMemo, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { noise4D } from '@remotion/noise';
import { generateHalftoneGrid, smoothstep } from '../utils/proceduralMaster';

export interface HalftoneCloudMatrixCanvasProps {
  spacing?: number;
  dotColor?: string;
  backgroundColor?: string;
  maxRadius?: number;
  minRadius?: number;
  clearingThreshold?: number;
  loopDurationSeconds?: number;
}

export const HalftoneCloudMatrixCanvas: React.FC<HalftoneCloudMatrixCanvasProps> = ({
  spacing = 36,
  dotColor = '#2C2E33',
  backgroundColor = '#FFFFFF',
  maxRadius = 17.5,
  minRadius = 1.8,
  clearingThreshold = 0.22,
  loopDurationSeconds = 12.0,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Precompute static orthogonal grid: 106 cols x 60 rows for 3840x2160
  const grid = useMemo(() => {
    return generateHalftoneGrid({
      width,
      height,
      spacing,
    });
  }, [width, height, spacing]);

  // Compute radii and render via high-performance 2D Canvas batch path
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Solid Pure White Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Circular time parameter for 100% seamless 12.0s loop
    const totalFrames = loopDurationSeconds * fps;
    const progress = (frame % totalFrames) / totalFrames;
    const theta = 2.0 * Math.PI * progress;

    const timeCos = Math.cos(theta);
    const timeSin = Math.sin(theta);

    // Circular time coordinates for primary and secondary octaves
    const tZ1 = timeCos * 0.85;
    const tW1 = timeSin * 0.85;
    const tZ2 = timeCos * 1.35;
    const tW2 = timeSin * 1.35;

    // Begin single batched path for all 6,360 dots
    ctx.fillStyle = dotColor;
    ctx.beginPath();

    const cells = grid.cells;
    const len = cells.length;

    for (let i = 0; i < len; i++) {
      const cell = cells[i];
      const col = cell.col;
      const row = cell.row;

      // Diagonally elongated coordinate frame for sweeping cloud bands
      const rotX = (col * 0.82 + row * 0.58) * 0.020;
      const rotY = (-col * 0.58 + row * 0.82) * 0.020;

      // Layered 2-octave 3D/4D Simplex Noise
      // Octave 1: Primary Low-Frequency Sweeping Cloud Wave
      const n1 = noise4D(
        'cloud1_seed',
        rotX,
        rotY,
        tZ1,
        tW1
      );

      // Octave 2: Secondary Harmonic Detail Wave
      const n2 = noise4D(
        'cloud2_seed',
        rotX * 2.2,
        rotY * 2.2,
        tZ2,
        tW2
      ) * 0.32;

      // Combine and normalize to [0, 1]
      const rawNoise = (n1 + n2) / 1.32;
      const normNoise = (rawNoise + 1.0) * 0.5;

      // Smoothstep thresholding:
      // Organic white clearings where radius = 0
      if (normNoise < clearingThreshold) {
        continue;
      }

      // Smooth transition from minRadius (1.8px) up to maxRadius (17.5px)
      const t = smoothstep(clearingThreshold, 0.90, normNoise);
      const radius = minRadius + t * (maxRadius - minRadius);

      // Add circle to batch path
      ctx.moveTo(cell.cx + radius, cell.cy);
      ctx.arc(cell.cx, cell.cy, radius, 0, Math.PI * 2);
    }

    // Single GPU draw call for all dots
    ctx.fill();
  }, [
    frame,
    width,
    height,
    fps,
    grid,
    dotColor,
    backgroundColor,
    maxRadius,
    minRadius,
    clearingThreshold,
    loopDurationSeconds,
  ]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor,
        overflow: 'hidden',
      }}
    >
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
    </div>
  );
};
