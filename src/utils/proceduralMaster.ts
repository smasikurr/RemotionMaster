/**
 * Procedural Master Motion & Noise Utilities
 * Designed for 4K 60fps Microstock Production with Remotion
 */

import { noise2D, noise3D, noise4D } from '@remotion/noise';
import { evolvePath } from '@remotion/paths';
import { interpolate, Easing } from 'remotion';

/**
 * Standard Hermite interpolation smoothstep function.
 * Smoothly interpolates between edge0 and edge1 when edge0 < x < edge1.
 */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3.0 - 2.0 * t);
};

/**
 * Clamps value between min and max bounds.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between a and b by t.
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

/**
 * Computes a mathematically seamless looping 2D noise value over time.
 * Uses 4D simplex noise sampled along a circular path in the (z, w) planes:
 * z = timeRadius * cos(2 * PI * progress)
 * w = timeRadius * sin(2 * PI * progress)
 *
 * @param seed - Unique noise seed string
 * @param x - Spatial X coordinate
 * @param y - Spatial Y coordinate
 * @param progress - Loop progress from 0.0 to 1.0 (frame / totalFrames)
 * @param timeRadius - Radius of time circle (controls rate of change, default 1.0)
 * @returns Noise value normalized approximately between -1.0 and +1.0
 */
export const loopingNoise2D = (
  seed: string,
  x: number,
  y: number,
  progress: number,
  timeRadius: number = 1.0
): number => {
  const angle = 2.0 * Math.PI * (progress % 1.0);
  const z = timeRadius * Math.cos(angle);
  const w = timeRadius * Math.sin(angle);
  return noise4D(seed, x, y, z, w);
};

/**
 * Computes seamless looping multi-octave fBm (fractional Brownian motion) noise.
 */
export const loopingFBM2D = (
  seed: string,
  x: number,
  y: number,
  progress: number,
  octaves: number = 2,
  lacunarity: number = 2.0,
  gain: number = 0.5,
  timeRadius: number = 1.0
): number => {
  let total = 0.0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxAmp = 0.0;

  for (let i = 0; i < octaves; i++) {
    total += loopingNoise2D(
      `${seed}_oct_${i}`,
      x * frequency,
      y * frequency,
      progress,
      timeRadius * frequency
    ) * amplitude;
    maxAmp += amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }

  return total / maxAmp;
};

export interface GridCell {
  col: number;
  row: number;
  cx: number;
  cy: number;
  normX: number;
  normY: number;
}

export interface HalftoneGridConfig {
  width: number;
  height: number;
  spacing: number;
}

/**
 * Precomputes an orthogonal grid of stationary points centered within the viewport.
 */
export const generateHalftoneGrid = (
  config: HalftoneGridConfig
): {
  cols: number;
  rows: number;
  cells: GridCell[];
} => {
  const { width, height, spacing } = config;
  const cols = Math.floor(width / spacing);
  const rows = Math.floor(height / spacing);

  const startX = (width - (cols - 1) * spacing) / 2;
  const startY = (height - (rows - 1) * spacing) / 2;

  const cells: GridCell[] = [];

  for (let r = 0; r < rows; r++) {
    const cy = startY + r * spacing;
    const normY = rows > 1 ? r / (rows - 1) : 0.5;

    for (let c = 0; c < cols; c++) {
      const cx = startX + c * spacing;
      const normX = cols > 1 ? c / (cols - 1) : 0.5;

      cells.push({
        col: c,
        row: r,
        cx,
        cy,
        normX,
        normY,
      });
    }
  }

  return { cols, rows, cells };
};

export interface TrimPathResult {
  strokeDasharray: string;
  strokeDashoffset: number;
  progress: number;
}

/**
 * Reusable After Effects-style Trim-Path animator for SVG paths.
 * Animates path drawing smoothly from startFrame to endFrame using evolvePath()
 * and industry-standard smooth cubic-bezier easing.
 *
 * @param pathData - SVG path string (e.g., 'M 0 0 L 100 100')
 * @param startFrame - Frame where path drawing begins
 * @param endFrame - Frame where path drawing finishes
 * @param currentFrame - Active frame number from useCurrentFrame()
 * @param reverse - If true, un-draws path from 1 back to 0
 */
export const drawTrimPath = (
  pathData: string,
  startFrame: number,
  endFrame: number,
  currentFrame: number,
  reverse: boolean = false
): TrimPathResult => {
  if (startFrame >= endFrame) {
    const rawProgress = currentFrame >= endFrame ? 1 : 0;
    const p = reverse ? 1 - rawProgress : rawProgress;
    const evolved = evolvePath(p, pathData);
    return {
      strokeDasharray: evolved.strokeDasharray,
      strokeDashoffset: evolved.strokeDashoffset,
      progress: p,
    };
  }

  const rawProgress = interpolate(currentFrame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  });

  const p = reverse ? 1 - rawProgress : rawProgress;
  const evolved = evolvePath(p, pathData);

  return {
    strokeDasharray: evolved.strokeDasharray,
    strokeDashoffset: evolved.strokeDashoffset,
    progress: p,
  };
};

/**
 * Two-way Trim-Path helper: draws in from inStart -> inEnd, holds, then reverses from outStart -> outEnd.
 */
export const drawTrimPathLoop = (
  pathData: string,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
  currentFrame: number
): TrimPathResult => {
  if (currentFrame < outStart) {
    return drawTrimPath(pathData, inStart, inEnd, currentFrame, false);
  }
  return drawTrimPath(pathData, outStart, outEnd, currentFrame, true);
};
