import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { anticipationSpring, harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * Deterministic PRNG for reproducible, flicker-free physics
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 3D Camera Perspective Projection
 */
function project3D(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  focalLength: number,
  cameraDistance: number,
  rotXRad: number,
  rotYRad: number
): { x: number; y: number; depth: number; scale: number } {
  // 1. Rotate around Y axis (azimuth/yaw)
  const cosY = Math.cos(rotYRad);
  const sinY = Math.sin(rotYRad);
  const x1 = x * cosY + z * sinY;
  const y1 = y;
  const z1 = -x * sinY + z * cosY;

  // 2. Rotate around X axis (elevation/pitch)
  const cosX = Math.cos(rotXRad);
  const sinX = Math.sin(rotXRad);
  const x2 = x1;
  const y2 = y1 * cosX - z1 * sinX;
  const z2 = y1 * sinX + z1 * cosX;

  // 3. Perspective Division
  const depth = z2 + cameraDistance;
  const scale = focalLength / Math.max(10, depth);
  const screenX = cx + x2 * scale;
  const screenY = cy + y2 * scale;

  return { x: screenX, y: screenY, depth, scale };
}

/**
 * Generate smooth cubic Bezier path string through an array of 2D points
 */
function buildSmoothSpline(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

export const Cyber3DFinancialMarketDataGraph4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 4K Canvas Geometry
  const cx = width * 0.5; // 1920
  const cy = 1320; // 3D Camera optical center
  const focalLength = 1600;
  const cameraDistance = 1750;
  const rotXRad = (24.0 * Math.PI) / 180;
  const rotYRad = (-1.5 * Math.PI) / 180;

  // 1. Organic Harmonic Idle Convection (Subtle camera floating breathing)
  const idle = harmonicIdleMotion(frame, {
    speed: 0.025,
    amplitudeY: 5,
    tiltDegrees: 0.25,
  });

  // 2. Timeline Master Envelopes (Total 900 frames / 15.0s @ 60 FPS)
  // Grid entrance: frames 0 to 90
  const gridEntrance = interpolate(frame, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Outro fade to pure black: frames 820 to 900
  const masterOpacity = interpolate(frame, [820, 895], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. 3D Floor Grid Definitions
  const gridFloorY = 230; // 3D Y coordinate of the floor
  const gridXRange = useMemo(() => {
    const list: number[] = [];
    for (let gx = -1500; gx <= 1500; gx += 250) {
      list.push(gx);
    }
    return list;
  }, []);

  const gridZRange = useMemo(() => {
    const list: number[] = [];
    for (let gz = -300; gz <= 1380; gz += 160) {
      list.push(gz);
    }
    return list;
  }, []);

  // 4. Bar Columns Data Specification (6 Hero 3D Columns)
  const barConfigs = useMemo(
    () => [
      { id: 0, x: -1080, baseHeight: 480, delay: 50, tag: "+14.2%", val: "2,410" },
      { id: 1, x: -650, baseHeight: 780, delay: 68, tag: "+28.6%", val: "3,890" },
      { id: 2, x: -220, baseHeight: 580, delay: 86, tag: "+19.4%", val: "2,950" },
      { id: 3, x: 220, baseHeight: 1020, delay: 104, tag: "+46.8%", val: "5,120" },
      { id: 4, x: 650, baseHeight: 820, delay: 122, tag: "+35.1%", val: "4,240" },
      { id: 5, x: 1080, baseHeight: 640, delay: 140, tag: "+24.7%", val: "3,360" },
    ],
    []
  );

  const barWidth = 95;
  const barDepth = 75;
  const barZ = 200;

  // 5. Calculate Animated Bar Heights with Disney Anticipation Physics
  const animatedBars = useMemo(() => {
    return barConfigs.map((b) => {
      // Anticipation spring entrance: dips slightly then rockets upward with crisp overshoot
      const entranceSpring = anticipationSpring(frame, fps, {
        delay: b.delay,
        anticipationFrames: 8,
        anticipationDepth: 0.05,
        springConfig: { damping: 12, stiffness: 160, mass: 0.85 },
      });

      // Post-entrance market micro-fluctuations (harmonic volatility)
      const postFrame = Math.max(0, frame - b.delay - 45);
      const volatility =
        Math.sin(postFrame * 0.038 + b.id * 1.35) *
        Math.cos(postFrame * 0.022 + b.id * 0.9) *
        0.055;

      const currentH = Math.max(
        0,
        b.baseHeight * entranceSpring * (1 + volatility)
      );

      // Top summit in 3D: Y goes upward (negative Y in 3D space)
      const top3DY = gridFloorY - currentH;

      // Calculate 3D projected vertices for the column prism
      const halfW = barWidth * 0.5;
      const halfD = barDepth * 0.5;

      // Bottom 4 vertices
      const b_fl = project3D(b.x - halfW, gridFloorY, barZ - halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      const b_fr = project3D(b.x + halfW, gridFloorY, barZ - halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      const b_br = project3D(b.x + halfW, gridFloorY, barZ + halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      const b_bl = project3D(b.x - halfW, gridFloorY, barZ + halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);

      // Top 4 vertices
      const t_fl = project3D(b.x - halfW, top3DY, barZ - halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      const t_fr = project3D(b.x + halfW, top3DY, barZ - halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      const t_br = project3D(b.x + halfW, top3DY, barZ + halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      const t_bl = project3D(b.x - halfW, top3DY, barZ + halfD, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);

      // Top Center Summit
      const summit = project3D(b.x, top3DY, barZ, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      // Floor Center Base
      const floorBase = project3D(b.x, gridFloorY, barZ, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      // Laser Guide Beam Peak
      const laserPeak = project3D(b.x, top3DY - 240, barZ, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);

      return {
        ...b,
        currentH,
        entranceSpring,
        b_fl,
        b_fr,
        b_br,
        b_bl,
        t_fl,
        t_fr,
        t_br,
        t_bl,
        summit,
        floorBase,
        laserPeak,
      };
    });
  }, [barConfigs, frame, fps, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad, gridFloorY, barWidth, barDepth, barZ]);

  // 6. Spline Trend Path Coordinates
  const splinePoints = useMemo(() => {
    return animatedBars.map((b) => ({ x: b.summit.x, y: b.summit.y }));
  }, [animatedBars]);

  const splinePathData = useMemo(() => {
    return buildSmoothSpline(splinePoints);
  }, [splinePoints]);

  // Secondary Counter-Trend Wave (Interweaving financial harmonic curve)
  const secondarySplinePoints = useMemo(() => {
    return animatedBars.map((b, idx) => {
      const offset = Math.sin(frame * 0.04 + idx * 1.5) * 45 + 50;
      return {
        x: b.summit.x,
        y: b.summit.y + offset,
      };
    });
  }, [animatedBars, frame]);

  const secondarySplinePathData = useMemo(() => {
    return buildSmoothSpline(secondarySplinePoints);
  }, [secondarySplinePoints]);

  // Trend line drawing reveal (Frames 120 to 280)
  const splineRevealProgress = interpolate(frame, [120, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // 7. Floating 3D Cyber Bokeh Particles (48 Deterministic Particles)
  const bokehParticles = useMemo(() => {
    const list = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 17 + 5);
      const r2 = seededRandom(i * 23 + 11);
      const r3 = seededRandom(i * 31 + 19);
      const r4 = seededRandom(i * 47 + 29);

      // 3D positioning bounded safely inside active view
      const initX = -1200 + r1 * 2400; // [-1200, 1200]
      const initY = -700 + r2 * 950; // Above floor [-700, 250]
      const initZ = -200 + r3 * 1300; // [-200, 1100]

      const radius = 6 + r4 * 16; // 6 to 22px
      const isHex = i % 2 === 1;
      const speed = 0.015 + r2 * 0.02;
      const phase = r4 * Math.PI * 2;
      const baseOpacity = 0.18 + r3 * 0.32;

      list.push({
        id: i,
        initX,
        initY,
        initZ,
        radius,
        isHex,
        speed,
        phase,
        baseOpacity,
      });
    }
    return list;
  }, []);

  // Calculate dynamic positions of bokeh particles for current frame
  const animatedBokeh = useMemo(() => {
    return bokehParticles.map((p) => {
      const t = frame * p.speed + p.phase;
      const curX = p.initX + Math.sin(t * 0.8) * 45;
      const curY = p.initY + Math.cos(t * 0.6) * 35;
      const curZ = p.initZ + Math.sin(t * 0.4) * 50;

      const proj = project3D(curX, curY, curZ, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
      const twinkle = 0.65 + 0.35 * Math.sin(frame * 0.08 + p.id);

      // Distance from focal plane (barZ = 200) for tilt-shift blur intensity
      const focalDist = Math.abs(curZ - 200);
      const blurAmount = Math.min(12, Math.max(1, focalDist * 0.012));

      return {
        ...p,
        proj,
        twinkle,
        blurAmount,
      };
    });
  }, [bokehParticles, frame, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad]);

  // Corner protection: Strict 15% margin mask bounds
  // Canvas: 3840x2160. Margins: X [0..576] and [3264..3840], Y [0..324] and [1836..2160]

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // 100% Pure Solid Black
        width,
        height,
        overflow: "hidden",
        position: "relative",
        opacity: masterOpacity,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <defs>
          {/* Dual-Pass Multi-Tier Specular Optical Glow */}
          <filter id="cyberGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="tightCore" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="22.0" result="diffuseBloom" />
            <feMerge>
              <feMergeNode in="diffuseBloom" />
              <feMergeNode in="tightCore" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Tilt-Shift Background Depth Blur */}
          <filter id="tiltShiftDepthBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" />
          </filter>

          {/* Subtle Midground Soft Blur */}
          <filter id="subtleSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>

          {/* Bar Column Front Face Gradient (Luminous Electric Cyan to Deep Blue) */}
          <linearGradient id="barFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#0369a1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.1" />
          </linearGradient>

          {/* Bar Column Extruded Side Face Gradient */}
          <linearGradient id="barSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#0369a1" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.15" />
          </linearGradient>

          {/* Specular Highlight Top Cap Gradient */}
          <linearGradient id="barCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="35%" stopColor="#e0f2fe" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.75" />
          </linearGradient>

          {/* Laser Projection Beam Vertical Gradient */}
          <linearGradient id="laserBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#00f0ff" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </linearGradient>

          {/* Floor Grid Horizon Fog Fade Mask */}
          <linearGradient id="gridHorizonFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Spline Trend Line Linear Gradient */}
          <linearGradient id="trendSplineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="30%" stopColor="#00f0ff" />
            <stop offset="70%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Master Camera Group with Harmonic Breathing */}
        <g
          transform={`translate(0, ${idle.idleY}) rotate(${idle.idleRotate}, ${cx}, ${cy})`}
        >
          {/* ================================================================= */}
          {/* LAYER 1: Receding 3D Perspective Floor Grid */}
          {/* ================================================================= */}
          <g opacity={gridEntrance}>
            {/* Transverse Grid Lines (parallel to X axis, receding in Z) */}
            {gridZRange.map((gz, zIdx) => {
              const pLeft = project3D(-1500, gridFloorY, gz, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
              const pRight = project3D(1500, gridFloorY, gz, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);

              // Depth fade: further lines are thinner and softer
              const zFraction = (gz - (-300)) / (1380 - (-300));
              const strokeWidth = interpolate(zFraction, [0, 1], [2.2, 0.75]);
              const lineOpacity = interpolate(zFraction, [0, 0.35, 0.85, 1], [0.15, 0.65, 0.35, 0.05]);
              const isDeepBackground = gz > 750;

              return (
                <line
                  key={`grid-x-${zIdx}`}
                  x1={pLeft.x}
                  y1={pLeft.y}
                  x2={pRight.x}
                  y2={pRight.y}
                  stroke="#00f0ff"
                  strokeWidth={strokeWidth}
                  opacity={lineOpacity}
                  filter={isDeepBackground ? "url(#tiltShiftDepthBlur)" : undefined}
                />
              );
            })}

            {/* Longitudinal Grid Lines (converging towards vanishing point) */}
            {gridXRange.map((gx, xIdx) => {
              const pNear = project3D(gx, gridFloorY, -300, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
              const pFar = project3D(gx, gridFloorY, 1380, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);

              const xDistCenter = Math.abs(gx) / 1500;
              const longOpacity = (1 - xDistCenter * 0.45) * 0.4;

              return (
                <line
                  key={`grid-z-${xIdx}`}
                  x1={pNear.x}
                  y1={pNear.y}
                  x2={pFar.x}
                  y2={pFar.y}
                  stroke="#0284c7"
                  strokeWidth={1.2}
                  opacity={longOpacity}
                />
              );
            })}

            {/* Electric Scanning Pulse Wave Running Across the Floor Grid */}
            {Array.from({ length: 3 }).map((_, pIdx) => {
              const pulseZ = ((-300 + ((frame * 3.5 + pIdx * 560) % 1680)));
              const pulseLeft = project3D(-1400, gridFloorY, pulseZ, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
              const pulseRight = project3D(1400, gridFloorY, pulseZ, cx, cy, focalLength, cameraDistance, rotXRad, rotYRad);
              const pulseOp = interpolate(pulseZ, [-300, 200, 1100, 1380], [0, 0.7, 0.35, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <line
                  key={`pulse-wave-${pIdx}`}
                  x1={pulseLeft.x}
                  y1={pulseLeft.y}
                  x2={pulseRight.x}
                  y2={pulseRight.y}
                  stroke="#38bdf8"
                  strokeWidth={3.0}
                  opacity={pulseOp}
                  filter="url(#cyberGlow)"
                />
              );
            })}
          </g>

          {/* ================================================================= */}
          {/* LAYER 2: Floating Cyber Bokeh Particles (Background Field) */}
          {/* ================================================================= */}
          {animatedBokeh.filter((p) => p.proj.depth > 1950).map((p) => {
            const size = p.radius * p.proj.scale * 1.8;
            return (
              <g
                key={`bokeh-bg-${p.id}`}
                transform={`translate(${p.proj.x}, ${p.proj.y})`}
                opacity={p.baseOpacity * p.twinkle}
                filter="url(#tiltShiftDepthBlur)"
              >
                {p.isHex ? (
                  <polygon
                    points={`
                      0,${-size}
                      ${size * 0.866},${-size * 0.5}
                      ${size * 0.866},${size * 0.5}
                      0,${size}
                      ${-size * 0.866},${size * 0.5}
                      ${-size * 0.866},${-size * 0.5}
                    `}
                    fill="#00f0ff"
                    opacity={0.3}
                    stroke="#38bdf8"
                    strokeWidth={1.5}
                  />
                ) : (
                  <circle cx={0} cy={0} r={size} fill="#0284c7" opacity={0.4} />
                )}
              </g>
            );
          })}

          {/* ================================================================= */}
          {/* LAYER 3: 6 Hero 3D Financial Bar Columns */}
          {/* ================================================================= */}
          {animatedBars.map((bar) => {
            if (bar.currentH <= 2) return null;

            // Front face polygon: b_fl -> b_fr -> t_fr -> t_fl
            const frontPoints = `${bar.b_fl.x.toFixed(1)},${bar.b_fl.y.toFixed(1)} ${bar.b_fr.x.toFixed(1)},${bar.b_fr.y.toFixed(1)} ${bar.t_fr.x.toFixed(1)},${bar.t_fr.y.toFixed(1)} ${bar.t_fl.x.toFixed(1)},${bar.t_fl.y.toFixed(1)}`;

            // Extruded side face polygon: b_fr -> b_br -> t_br -> t_fr
            const sidePoints = `${bar.b_fr.x.toFixed(1)},${bar.b_fr.y.toFixed(1)} ${bar.b_br.x.toFixed(1)},${bar.b_br.y.toFixed(1)} ${bar.t_br.x.toFixed(1)},${bar.t_br.y.toFixed(1)} ${bar.t_fr.x.toFixed(1)},${bar.t_fr.y.toFixed(1)}`;

            // Top specular cap polygon: t_fl -> t_fr -> t_br -> t_bl
            const topCapPoints = `${bar.t_fl.x.toFixed(1)},${bar.t_fl.y.toFixed(1)} ${bar.t_fr.x.toFixed(1)},${bar.t_fr.y.toFixed(1)} ${bar.t_br.x.toFixed(1)},${bar.t_br.y.toFixed(1)} ${bar.t_bl.x.toFixed(1)},${bar.t_bl.y.toFixed(1)}`;

            // Specular flash at peak entrance
            const peakFlash = interpolate(frame - bar.delay - 14, [0, 4, 18], [0, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <g key={`bar-column-${bar.id}`}>
                {/* 1. Floor Reflection / Ground Glow Oval */}
                <ellipse
                  cx={bar.floorBase.x}
                  cy={bar.floorBase.y}
                  rx={barWidth * 0.65}
                  ry={barDepth * 0.28}
                  fill="#00f0ff"
                  opacity={0.35}
                  filter="url(#cyberGlow)"
                />

                {/* 2. Vertical Laser Coordinate Projection Beam */}
                <line
                  x1={bar.summit.x}
                  y1={bar.summit.y}
                  x2={bar.laserPeak.x}
                  y2={bar.laserPeak.y}
                  stroke="url(#laserBeamGrad)"
                  strokeWidth={2.4}
                  opacity={0.8}
                />

                {/* 3. Drop-Line from Bar Summit to Floor Grid */}
                <line
                  x1={bar.summit.x}
                  y1={bar.summit.y}
                  x2={bar.floorBase.x}
                  y2={bar.floorBase.y}
                  stroke="#38bdf8"
                  strokeWidth={1.2}
                  strokeDasharray="4 4"
                  opacity={0.4}
                />

                {/* 4. Extruded 3D Side Face */}
                <polygon
                  points={sidePoints}
                  fill="url(#barSideGrad)"
                  stroke="#0284c7"
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                />

                {/* 5. Luminous Front Face */}
                <polygon
                  points={frontPoints}
                  fill="url(#barFrontGrad)"
                  stroke="#00f0ff"
                  strokeWidth={2.0}
                  strokeLinejoin="round"
                />

                {/* 6. Specular Top Cap Highlight Polygon */}
                <polygon
                  points={topCapPoints}
                  fill="url(#barCapGrad)"
                  stroke="#FFFFFF"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                  filter="url(#cyberGlow)"
                />

                {/* 7. Luminous Top Cap Summit Beacon */}
                <circle
                  cx={bar.summit.x}
                  cy={bar.summit.y}
                  r={5.5}
                  fill="#FFFFFF"
                  filter="url(#cyberGlow)"
                />

                {/* 8. Peak Arrival Specular Star Flare */}
                {peakFlash > 0.05 && (
                  <g filter="url(#cyberGlow)" opacity={peakFlash}>
                    <line
                      x1={bar.summit.x - 30 * peakFlash}
                      y1={bar.summit.y}
                      x2={bar.summit.x + 30 * peakFlash}
                      y2={bar.summit.y}
                      stroke="#FFFFFF"
                      strokeWidth={3}
                    />
                    <line
                      x1={bar.summit.x}
                      y1={bar.summit.y - 30 * peakFlash}
                      x2={bar.summit.x}
                      y2={bar.summit.y + 30 * peakFlash}
                      stroke="#FFFFFF"
                      strokeWidth={3}
                    />
                  </g>
                )}

                {/* 9. Floating Financial Metric Coordinate Badge */}
                {bar.entranceSpring > 0.85 && (
                  <g
                    transform={`translate(${bar.summit.x}, ${bar.summit.y - 28})`}
                    opacity={interpolate(bar.entranceSpring, [0.85, 1], [0, 0.95])}
                  >
                    {/* Badge Background Pill */}
                    <rect
                      x={-42}
                      y={-18}
                      width={84}
                      height={24}
                      rx={6}
                      fill="#082f49"
                      fillOpacity={0.85}
                      stroke="#00f0ff"
                      strokeWidth={1.2}
                    />
                    {/* Ticker Metric Text */}
                    <text
                      x={0}
                      y={-2}
                      fill="#a5f3fc"
                      fontSize={13}
                      fontFamily="Arial, sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                      letterSpacing="0.5px"
                    >
                      {bar.tag}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ================================================================= */}
          {/* LAYER 4: Secondary Interweaving Counter-Trend Curve */}
          {/* ================================================================= */}
          {splineRevealProgress > 0.1 && (
            <path
              d={secondarySplinePathData}
              fill="none"
              stroke="#0284c7"
              strokeWidth={2.0}
              strokeDasharray="6 6"
              opacity={splineRevealProgress * 0.45}
              filter="url(#subtleSoftBlur)"
            />
          )}

          {/* ================================================================= */}
          {/* LAYER 5: Primary Luminous Trend Spline Curve */}
          {/* ================================================================= */}
          {splineRevealProgress > 0.05 && (
            <g opacity={splineRevealProgress}>
              {/* Volumetric Atmospheric Bloom Outer Stroke */}
              <path
                d={splinePathData}
                fill="none"
                stroke="url(#trendSplineGrad)"
                strokeWidth={7.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.5}
                filter="url(#cyberGlow)"
              />

              {/* Razor-Sharp High-Luminance Core Stroke */}
              <path
                d={splinePathData}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={3.0}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.95}
              />

              {/* Traveling Shimmer Spark Along the Spline */}
              {animatedBars.map((b, i) => {
                const pulseT = ((frame * 0.04 + i * 0.25) % 1.0);
                return (
                  <circle
                    key={`spline-spark-${i}`}
                    cx={b.summit.x}
                    cy={b.summit.y}
                    r={7.0 + Math.sin(frame * 0.1 + i) * 1.5}
                    fill="none"
                    stroke="#a5f3fc"
                    strokeWidth={2.0}
                    opacity={0.8}
                    filter="url(#cyberGlow)"
                  />
                );
              })}
            </g>
          )}

          {/* ================================================================= */}
          {/* LAYER 6: Foreground Floating Cyber Bokeh Particles */}
          {/* ================================================================= */}
          {animatedBokeh.filter((p) => p.proj.depth <= 1950).map((p) => {
            const size = p.radius * p.proj.scale * 2.2;
            return (
              <g
                key={`bokeh-fg-${p.id}`}
                transform={`translate(${p.proj.x}, ${p.proj.y})`}
                opacity={p.baseOpacity * p.twinkle * 0.85}
                filter="url(#subtleSoftBlur)"
              >
                {p.isHex ? (
                  <polygon
                    points={`
                      0,${-size}
                      ${size * 0.866},${-size * 0.5}
                      ${size * 0.866},${size * 0.5}
                      0,${size}
                      ${-size * 0.866},${size * 0.5}
                      ${-size * 0.866},${-size * 0.5}
                    `}
                    fill="#00f0ff"
                    opacity={0.25}
                    stroke="#a5f3fc"
                    strokeWidth={1.8}
                  />
                ) : (
                  <circle
                    cx={0}
                    cy={0}
                    r={size}
                    fill="#38bdf8"
                    opacity={0.3}
                    stroke="#00f0ff"
                    strokeWidth={1.0}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
