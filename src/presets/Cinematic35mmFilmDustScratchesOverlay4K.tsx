import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Cinematic35mmFilmDustScratchesOverlay4K
 *
 * Commercial-Grade 4K 60FPS Authentic 35mm Analog Celluloid Film Dust, Scratches & Gate Noise Overlay
 * Based on iStock Reference: istockphoto-2202549253-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (720 frames / 12.0s seamless loop)
 * - 100% Solid Pure Black #000000 base (ready for Screen / Linear Dodge blending)
 * - Commanding hero presence: Spans ~2688px width (70.0%) and ~1540px height (71.3%)
 * - All 4 corner zones (15% margin = 576x324) strictly guaranteed 100% pure black (lum = 0.00)
 * - Authentic 30fps/24fps projector gate flicker cadence with zero AI artifacts
 */
export const Cinematic35mmFilmDustScratchesOverlay4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 720;
  const loopT = (frame % totalFrames) / totalFrames;

  // Master fade envelopes for seamless loop
  const masterOpacity = interpolate(
    frame,
    [0, 15, 705, 720],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Safe hero boundary (protecting 15% corners: mx=576, my=324)
  const minX = 578;
  const maxX = 3262;
  const minY = 328;
  const maxY = 1832;
  const spanX = maxX - minX;
  const spanY = maxY - minY;

  // Scratch vertical span (strictly centered in X, allowing full cinematic vertical length)
  const scratchMinY = 140;
  const scratchMaxY = 2020;
  const scratchSpanY = scratchMaxY - scratchMinY;

  // 1. Vertical Projector Gate Scratches (3 continuous scratch channels)
  const scratches = useMemo(() => {
    const list = [];
    const basePositions = [0.22, 0.50, 0.78]; // X positions relative to hero span

    for (let sIdx = 0; sIdx < basePositions.length; sIdx++) {
      const baseX = minX + spanX * basePositions[sIdx];
      // Fast horizontal jitter
      const jitterSeed = Math.floor(frame / 2) * 17.3 + sIdx * 93.1;
      const jitterX = Math.sin(jitterSeed) * 3.5;
      const xPos = baseX + jitterX;

      // Opacity flicker
      const opSeed = Math.floor(frame / 3) * 11.7 + sIdx * 43.2;
      const rawOp = 0.25 + 0.45 * Math.abs(Math.sin(opSeed));
      // Intermittent disappearance (some scratches drop out for a few frames)
      const isVisible = Math.sin(jitterSeed * 0.4) > -0.75;
      const opacity = isVisible ? rawOp : 0;

      // Vertical wavy path with micro-breaks
      let pathD = `M ${xPos.toFixed(1)} ${scratchMinY}`;
      const numSegments = 20;
      for (let seg = 1; seg <= numSegments; seg++) {
        const segY = scratchMinY + (scratchSpanY / numSegments) * seg;
        const segWiggle = Math.sin(seg * 2.8 + jitterSeed) * 1.5;
        pathD += ` L ${(xPos + segWiggle).toFixed(1)} ${segY.toFixed(1)}`;
      }

      list.push({ pathD, opacity, width: 1.6 + (sIdx % 2) * 0.6 });
    }
    return list;
  }, [frame, minX, maxX, scratchMinY, scratchMaxY, spanX, scratchSpanY]);

  // 2. Microscopic Celluloid Dust Flecks & Specks (75 specks)
  const dustSpecks = useMemo(() => {
    // 2-frame persistence to emulate true 24/30fps film flicker
    const flickerStep = Math.floor(frame / 2);
    const list = [];

    for (let dIdx = 0; dIdx < 75; dIdx++) {
      const seed = (flickerStep * 75 + dIdx) * 137.5;
      // Deterministic pseudo-random coordinates strictly within [minX, maxX] and [minY, maxY]
      const rx = (Math.sin(seed * 1.1) * 0.5 + 0.5);
      const ry = (Math.cos(seed * 1.7) * 0.5 + 0.5);

      const px = minX + rx * spanX;
      const py = minY + ry * spanY;

      // Random particle dimensions
      const radX = 1.5 + (Math.sin(seed * 2.3) * 0.5 + 0.5) * 4.0;
      const radY = 1.2 + (Math.cos(seed * 3.1) * 0.5 + 0.5) * 3.0;
      const rot = (seed * 53.7) % 180;

      // Dust brightness / opacity
      const op = 0.35 + 0.55 * (Math.sin(seed * 4.9) * 0.5 + 0.5);
      const color = dIdx % 5 === 0 ? "rgba(255, 250, 240, 0.9)" : "rgba(220, 215, 205, 0.8)";

      list.push({ px, py, radX, radY, rot, op, color });
    }
    return list;
  }, [frame, minX, maxX, minY, maxY, spanX, spanY]);

  // 3. Celluloid Hair / Thread Splice (Appears periodically for 3 frames)
  const hairSplice = useMemo(() => {
    const hairCycle = Math.floor(frame / 48);
    const hairFrameOffset = frame % 48;
    // Visible only during frames 0, 1, 2 of each 48-frame cycle
    if (hairFrameOffset > 2) return null;

    const seed = hairCycle * 83.1;
    const hx = minX + 0.2 * spanX + (Math.sin(seed) * 0.5 + 0.5) * (spanX * 0.6);
    const hy = minY + 0.2 * spanY + (Math.cos(seed * 1.3) * 0.5 + 0.5) * (spanY * 0.6);

    // Curled hair bezier control points
    const p0 = { x: hx, y: hy };
    const p1 = { x: hx + 45 * Math.sin(seed * 2.1), y: hy - 55 };
    const p2 = { x: hx - 30 * Math.cos(seed * 1.7), y: hy - 110 };
    const p3 = { x: hx + 25 * Math.sin(seed * 3.4), y: hy - 165 };

    const pathD = `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}, ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`;
    return { pathD, opacity: 0.78 };
  }, [frame, minX, spanX, minY, spanY]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        width,
        height,
        overflow: "hidden",
        opacity: masterOpacity,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          {/* Subtle Projector Glow Filter */}
          <filter id="v35FilmGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Projector Gate Vertical Scratches */}
        <g id="gateScratches">
          {scratches.map((s, idx) => (
            <path
              key={`scratch-${idx}`}
              d={s.pathD}
              fill="none"
              stroke="rgba(240, 235, 225, 0.85)"
              strokeWidth={s.width}
              strokeLinecap="round"
              opacity={s.opacity}
              filter="url(#v35FilmGlow)"
            />
          ))}
        </g>

        {/* 2. Micro Celluloid Dust Specks */}
        <g id="dustSpecks">
          {dustSpecks.map((d, idx) => (
            <ellipse
              key={`dust-${idx}`}
              cx={d.px}
              cy={d.py}
              rx={d.radX}
              ry={d.radY}
              transform={`rotate(${d.rot} ${d.px} ${d.py})`}
              fill={d.color}
              opacity={d.op}
            />
          ))}
        </g>

        {/* 3. Celluloid Hair Thread */}
        {hairSplice && (
          <g id="hairThread">
            <path
              d={hairSplice.pathD}
              fill="none"
              stroke="rgba(245, 240, 230, 0.90)"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={hairSplice.opacity}
              filter="url(#v35FilmGlow)"
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
