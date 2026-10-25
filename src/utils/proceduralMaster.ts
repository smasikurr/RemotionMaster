/**
 * Procedural Master Motion & Noise Utilities
 * Designed for 4K 60fps Microstock Production with Remotion
 */

import { noise2D, noise3D, noise4D } from '@remotion/noise';
import { evolvePath } from '@remotion/paths';
import { interpolate, Easing } from 'remotion';
import Alea from 'alea';

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

// =========================================================================
// REUSABLE FILM DAMAGE ENGINE (16mm / 35mm Vintage Emulsion & Projection)
// =========================================================================

export interface FilmScratchSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  opacity: number;
  color: string;
}

export interface FilmScratch {
  id: string;
  baseX: number;
  segments: FilmScratchSegment[];
}

export interface GateHairFiber {
  id: string;
  points: { x: number; y: number }[];
  width: number;
  opacity: number;
  color: string;
}

export interface DustSpeck {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  rotation: number;
  points: { x: number; y: number }[];
}

export interface EmulsionBlotch {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
  opacity: number;
  color: string;
}

export interface FilmDamageFrame {
  scratches: FilmScratch[];
  hairs: GateHairFiber[];
  specks: DustSpeck[];
  blotches: EmulsionBlotch[];
  shutterFlicker: number; // multiplier around 1.0 (e.g. 0.92 to 1.08)
  gateWeaveX: number;     // horizontal jitter in px (-2 to +2)
  gateWeaveY: number;     // vertical jitter in px (-1.5 to +1.5)
}

/**
 * 1. Generates vertical traveling film scratches with horizontal stepped tracking,
 * micro-wobble, variable thickness (1.5px to 5px in 4K), and intermittent broken gaps.
 */
export const generateVerticalScratch = (
  seed: string,
  frame: number,
  width: number,
  height: number,
  numScratches: number = 2
): FilmScratch[] => {
  const scratches: FilmScratch[] = [];

  for (let s = 0; s < numScratches; s++) {
    // Stepped track tracking: holds track for ~45-90 frames, then jumps
    const trackCycle = Math.floor(frame / (50 + s * 25));
    const prng = Alea(`${seed}_track_${s}_${trackCycle}`);

    // Snaps between left third (~20%-28%), center-left (~38%-48%), and occasional right
    const trackSlot = prng();
    let normBaseX: number;
    if (s === 0) {
      normBaseX = trackSlot < 0.6 ? 0.21 + prng() * 0.05 : 0.44 + prng() * 0.06;
    } else {
      normBaseX = trackSlot < 0.5 ? 0.38 + prng() * 0.08 : 0.76 + prng() * 0.07;
    }

    // Continuous slow drift + fast jitter with seamless 720-frame loop trigonometry
    const loopAngle = (2 * Math.PI * (frame % 720)) / 720;
    const drift = noise2D(`${seed}_drift_${s}`, Math.cos(loopAngle) * 3.0, Math.sin(loopAngle) * 3.0) * 14;
    const fastJitter = (Alea(`${seed}_fj_${s}_${frame % 720}`)() - 0.5) * 3;
    const baseX = normBaseX * width + drift + fastJitter;

    // Discretize into vertical segments
    const segmentHeight = 28;
    const count = Math.ceil(height / segmentHeight);
    const segments: FilmScratchSegment[] = [];

    for (let j = 0; j < count; j++) {
      const y1 = j * segmentHeight;
      const y2 = Math.min(height, (j + 1) * segmentHeight);

      // High-frequency break noise
      const breakVal = noise2D(`${seed}_break_${s}`, j * 0.18, frame * 0.12);
      if (breakVal < -0.32) {
        // Gap/break in scratch line
        continue;
      }

      // Micro-wobble per segment
      const w1 = noise2D(`${seed}_wobble_${s}`, j * 0.35, frame * 0.2) * 3.5;
      const w2 = noise2D(`${seed}_wobble_${s}`, (j + 1) * 0.35, frame * 0.2) * 3.5;

      const x1 = baseX + w1;
      const x2 = baseX + w2;

      const thickNoise = (noise2D(`${seed}_thick_${s}`, j * 0.25, frame * 0.08) + 1) * 0.5;
      const segWidth = 1.6 + thickNoise * 3.0; // 1.6px to 4.6px in 4K

      const lumNoise = (noise2D(`${seed}_lum_${s}`, j * 0.3, frame * 0.15) + 1) * 0.5;
      const opacity = smoothstep(-0.32, 0.5, breakVal) * (0.45 + lumNoise * 0.5);

      const color = lumNoise > 0.65 ? '#EDEDED' : lumNoise > 0.35 ? '#C8C8C8' : '#888888';

      segments.push({
        x1,
        y1,
        x2,
        y2,
        width: segWidth,
        opacity,
        color,
      });
    }

    scratches.push({
      id: `scratch_${s}`,
      baseX,
      segments,
    });
  }

  return scratches;
};

/**
 * 2. Generates curved Bezier gate hair fibers that flash for 2-5 frames near frame borders.
 */
export const generateGateHair = (
  seed: string,
  frame: number,
  width: number,
  height: number
): GateHairFiber[] => {
  const hairs: GateHairFiber[] = [];

  // Hair events trigger every 26 frames with variable duration
  const hairInterval = 28;
  const hairCycle = Math.floor(frame / hairInterval);
  const cycleFrame = frame % hairInterval;
  const prng = Alea(`${seed}_hair_cycle_${hairCycle}`);

  const activeDuration = Math.floor(prng() * 5) + 3; // 3 to 7 frames
  const hasHair = prng() > 0.25; // 75% of cycles have a hair flash

  if (hasHair && cycleFrame < activeDuration) {
    const hairPrng = Alea(`${seed}_hair_props_${hairCycle}`);
    const isTop = hairPrng() < 0.7; // mostly top border matching reference
    const rootX = width * (0.35 + hairPrng() * 0.45);
    const rootY = isTop ? 0 : height;

    // Organic frame-by-frame wiggle
    const wiggleAngle = (noise2D(`${seed}_hw_ang`, frame * 0.9, 0) - 0.5) * 0.25;
    const length = 220 + hairPrng() * 280;

    // Build curved spine points (Cubic Bezier: Root -> P1 -> P2 -> Curl Tip)
    const dirY = isTop ? 1 : -1;
    const curveSign = hairPrng() > 0.5 ? 1 : -1;

    const p0 = { x: rootX, y: rootY };
    const p1 = {
      x: rootX + curveSign * (40 + hairPrng() * 60) + Math.sin(wiggleAngle) * 15,
      y: rootY + dirY * (length * 0.35),
    };
    const p2 = {
      x: rootX + curveSign * (100 + hairPrng() * 120) + Math.cos(wiggleAngle) * 20,
      y: rootY + dirY * (length * 0.75),
    };
    // Curled tip
    const p3 = {
      x: p2.x + curveSign * 35 * Math.cos(wiggleAngle * 2),
      y: p2.y + dirY * 25 * Math.sin(wiggleAngle * 2),
    };

    hairs.push({
      id: `hair_${hairCycle}`,
      points: [p0, p1, p2, p3],
      width: 2.2 + hairPrng() * 1.6,
      opacity: 0.65 + hairPrng() * 0.3,
      color: hairPrng() > 0.4 ? '#DCDCDC' : '#999999',
    });
  }

  return hairs;
};

/**
 * 3. Generates irregular polygon dust specks and soft emulsion smudge blotches
 * at authentic 24fps stepped film cadence.
 */
export const generateDustBlotches = (
  seed: string,
  frame: number,
  speckCount: number = 35,
  width: number,
  height: number
): { specks: DustSpeck[]; blotches: EmulsionBlotch[] } => {
  // Stepped film cadence (holds for 2 frames each at 60fps = 30fps film flicker)
  const filmStep = Math.floor(frame / 2);
  const prng = Alea(`${seed}_dust_step_${filmStep}`);

  const specks: DustSpeck[] = [];
  const blotches: EmulsionBlotch[] = [];

  // Generate irregular dust specks
  for (let i = 0; i < speckCount; i++) {
    const x = prng() * width;
    const y = prng() * height;
    const baseRadius = 1.2 + prng() * 4.2; // 1.2px to 5.4px
    const verticesCount = 4 + Math.floor(prng() * 3); // 4 to 6 vertices
    const rotation = prng() * Math.PI * 2;

    const points: { x: number; y: number }[] = [];
    for (let v = 0; v < verticesCount; v++) {
      const angle = (v / verticesCount) * Math.PI * 2;
      const r = baseRadius * (0.65 + prng() * 0.7);
      points.push({
        x: x + Math.cos(angle + rotation) * r,
        y: y + Math.sin(angle + rotation) * r,
      });
    }

    const lum = prng();
    const color = lum > 0.4 ? '#E4E4E4' : lum > 0.2 ? '#A8A8A8' : '#303030';
    const opacity = 0.35 + prng() * 0.55;

    specks.push({
      x,
      y,
      radius: baseRadius,
      opacity,
      color,
      rotation,
      points,
    });
  }

  // Generate 4 to 8 soft translucent emulsion smudge blotches
  const blotchCount = 4 + Math.floor(prng() * 5);
  for (let b = 0; b < blotchCount; b++) {
    const bx = prng() * width;
    const by = prng() * height;
    const rx = 18 + prng() * 55;
    const ry = 14 + prng() * 45;
    const bRot = prng() * Math.PI;
    const bOpacity = 0.05 + prng() * 0.12;
    const bColor = prng() > 0.3 ? '#CFCFCF' : '#555555';

    blotches.push({
      x: bx,
      y: by,
      rx,
      ry,
      rotation: bRot,
      opacity: bOpacity,
      color: bColor,
    });
  }

  return { specks, blotches };
};

/**
 * Master synthesizer for complete film damage frame state
 */
export const getFilmDamageFrameState = (
  seed: string,
  frame: number,
  width: number,
  height: number,
  dustCount: number = 38
): FilmDamageFrame => {
  const scratches = generateVerticalScratch(seed, frame, width, height, 2);
  const hairs = generateGateHair(seed, frame, width, height);
  const { specks, blotches } = generateDustBlotches(seed, frame, dustCount, width, height);

  // Projector Shutter flicker with circular time loop
  const loopAngle = (2 * Math.PI * (frame % 720)) / 720;
  const shutterNoise = noise2D(`${seed}_shutter`, Math.cos(loopAngle) * 4.0, Math.sin(loopAngle) * 4.0);
  const shutterFlicker = 1.0 + shutterNoise * 0.08;

  // Gate weave (seamless loop mechanical vibration)
  const gateWeaveX = noise2D(`${seed}_weave_x`, Math.cos(loopAngle) * 2.5, Math.sin(loopAngle) * 2.5) * 1.8;
  const gateWeaveY = noise2D(`${seed}_weave_y`, Math.sin(loopAngle) * 2.5, Math.cos(loopAngle) * 2.5) * 1.4;

  return {
    scratches,
    hairs,
    specks,
    blotches,
    shutterFlicker,
    gateWeaveX,
    gateWeaveY,
  };
};
