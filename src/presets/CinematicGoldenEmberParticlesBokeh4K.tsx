import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * Deterministic PRNG for reproducible, flicker-free physics
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface RisingEmber {
  id: number;
  baseX: number;
  wobbleAmp1: number;
  wobbleAmp2: number;
  cycleCount: number; // integer vertical ascents across 600 frames
  initialPhase: number;
  size: number;
  type: "needle" | "diamond" | "orb";
  color: string;
  twinkleFreq: number;
}

interface BokehOrb {
  id: number;
  baseX: number;
  baseY: number;
  radius: number;
  driftAmpX: number;
  driftAmpY: number;
  freqX: number;
  freqY: number;
  phaseX: number;
  phaseY: number;
  colorCore: string;
  colorRim: string;
  baseOpacity: number;
}

export const CinematicGoldenEmberParticlesBokeh4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // 1. Exact 600-Frame Mathematical Loop Angle (0 to 2*PI)
  // Ensures frame 0 is mathematically identical to frame 600
  const loopProgress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = loopProgress * Math.PI * 2;

  // 2. Harmonic Idle Breathing (Synchronized with 4 integer cycles over 600 frames)
  // freq = 4 * 2*PI / 600 ~= 0.0418879 so it closes seamlessly
  const syncSpeed = (4 * Math.PI * 2) / durationInFrames;
  const idle = harmonicIdleMotion(frame, {
    speed: syncSpeed,
    amplitudeY: 14,
    tiltDegrees: 1.6,
  });

  // 3. Generate 200 Physics-Driven Rising Embers
  const embers = useMemo<RisingEmber[]>(() => {
    const list: RisingEmber[] = [];
    const count = 200;
    const colors = [
      "#FFFFFF", // Specular hot core
      "#FFF3B0", // Soft cream gold
      "#FFD700", // Classic brilliant gold
      "#FFAA00", // Vibrant amber
      "#FF7700", // Hot fiery orange
      "#FF4500", // Solar magma ember
    ];

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 13 + 5);
      const r2 = seededRandom(i * 19 + 11);
      const r3 = seededRandom(i * 29 + 17);
      const r4 = seededRandom(i * 37 + 23);

      // Centered horizontal scatter spanning from X=520 to X=3320 (span = 2800px = 72.9% canvas)
      // Denser toward the central radiant thermal core
      const spreadBias = (r1 - 0.5) * 2;
      const xOffset = Math.sign(spreadBias) * Math.pow(Math.abs(spreadBias), 0.75) * 1400;
      const baseX = 1920 + xOffset;

      const wobbleAmp1 = 18 + r2 * 45;
      const wobbleAmp2 = 8 + r3 * 22;
      // Integer cycles over 600 frames (1, 2, or 3 full vertical traversals)
      const cycleCount = 1 + (i % 3);
      const initialPhase = r2;
      const type: RisingEmber["type"] =
        r4 < 0.45 ? "needle" : r4 < 0.78 ? "diamond" : "orb";
      const size = type === "needle" ? 14 + r1 * 24 : type === "diamond" ? 4 + r1 * 8 : 3 + r1 * 6;
      const color = colors[Math.floor(r3 * colors.length)];
      const twinkleFreq = 1 + (i % 5);

      list.push({
        id: i,
        baseX,
        wobbleAmp1,
        wobbleAmp2,
        cycleCount,
        initialPhase,
        size,
        type,
        color,
        twinkleFreq,
      });
    }
    return list;
  }, []);

  // 4. Generate 36 Optical Depth-of-Field Bokeh Orbs
  const bokehOrbs = useMemo<BokehOrb[]>(() => {
    const list: BokehOrb[] = [];
    const count = 36;
    const coreColors = [
      "#FFD700",
      "#FFC300",
      "#FFB703",
      "#FFAA00",
      "#FF9E00",
    ];
    const rimColors = [
      "rgba(255, 69, 0, 0.4)",
      "rgba(232, 93, 4, 0.35)",
      "rgba(244, 140, 6, 0.45)",
      "rgba(208, 0, 0, 0.25)",
    ];

    for (let j = 0; j < count; j++) {
      const r1 = seededRandom(j * 17 + 7);
      const r2 = seededRandom(j * 23 + 13);
      const r3 = seededRandom(j * 31 + 19);

      // Distribute bokeh across central 75% field [X: 600..3240, Y: 450..1710]
      const spreadX = (r1 - 0.5) * 2;
      const baseX = 1920 + spreadX * 1260;
      const spreadY = (r2 - 0.5) * 2;
      const baseY = 1080 + spreadY * 580;

      const radius = 32 + r3 * 65; // Large optical bokeh 32px to 97px
      const driftAmpX = 35 + r1 * 40;
      const driftAmpY = 25 + r2 * 30;
      // Integer frequency harmonics ensures exact seam closure
      const freqX = 1 + (j % 2);
      const freqY = 1 + ((j + 1) % 2);
      const phaseX = r2 * Math.PI * 2;
      const phaseY = r3 * Math.PI * 2;
      const colorCore = coreColors[j % coreColors.length];
      const colorRim = rimColors[j % rimColors.length];
      const baseOpacity = 0.25 + (j % 4) * 0.12;

      list.push({
        id: j,
        baseX,
        baseY,
        radius,
        driftAmpX,
        driftAmpY,
        freqX,
        freqY,
        phaseX,
        phaseY,
        colorCore,
        colorRim,
        baseOpacity,
      });
    }
    return list;
  }, []);

  // 5. Central Thermal Radiant Plasma Core Geometry
  // Two sweeping fiery counter-revolving energy arcs inspired by the reference video
  const arcPointsCount = 60;
  const plasmaArcs = useMemo(() => {
    // Arc 1: Primary Swirling Fire Brush Ribbon
    const arc1Top: [number, number][] = [];
    const arc1Bot: [number, number][] = [];
    const rBase1 = 340;

    for (let i = 0; i <= arcPointsCount; i++) {
      const u = i / arcPointsCount;
      const theta = u * Math.PI * 1.55; // 280-degree sweeping sickle arc
      const thickness = Math.sin(u * Math.PI) * 58;
      const ripple = Math.sin(u * 8 * Math.PI + loopAngle * 3) * 12;

      const rTop = rBase1 + thickness * 0.5 + ripple;
      const rBot = rBase1 - thickness * 0.5 + ripple;

      arc1Top.push([Math.cos(theta) * rTop, Math.sin(theta) * rTop]);
      arc1Bot.push([Math.cos(theta) * rBot, Math.sin(theta) * rBot]);
    }

    let d1 = `M ${arc1Top[0][0].toFixed(1)} ${arc1Top[0][1].toFixed(1)}`;
    for (let i = 1; i < arc1Top.length; i++) {
      d1 += ` L ${arc1Top[i][0].toFixed(1)} ${arc1Top[i][1].toFixed(1)}`;
    }
    for (let i = arc1Bot.length - 1; i >= 0; i--) {
      d1 += ` L ${arc1Bot[i][0].toFixed(1)} ${arc1Bot[i][1].toFixed(1)}`;
    }
    d1 += " Z";

    // Arc 2: Secondary Counter-Rotating Solar Blade Arc
    const arc2Top: [number, number][] = [];
    const arc2Bot: [number, number][] = [];
    const rBase2 = 240;

    for (let i = 0; i <= arcPointsCount; i++) {
      const u = i / arcPointsCount;
      const theta = u * Math.PI * 1.45;
      const thickness = Math.sin(u * Math.PI) * 42;
      const ripple = Math.cos(u * 6 * Math.PI - loopAngle * 2) * 10;

      const rTop = rBase2 + thickness * 0.5 + ripple;
      const rBot = rBase2 - thickness * 0.5 + ripple;

      arc2Top.push([Math.cos(theta) * rTop, Math.sin(theta) * rTop]);
      arc2Bot.push([Math.cos(theta) * rBot, Math.sin(theta) * rBot]);
    }

    let d2 = `M ${arc2Top[0][0].toFixed(1)} ${arc2Top[0][1].toFixed(1)}`;
    for (let i = 1; i < arc2Top.length; i++) {
      d2 += ` L ${arc2Top[i][0].toFixed(1)} ${arc2Top[i][1].toFixed(1)}`;
    }
    for (let i = arc2Bot.length - 1; i >= 0; i--) {
      d2 += ` L ${arc2Bot[i][0].toFixed(1)} ${arc2Bot[i][1].toFixed(1)}`;
    }
    d2 += " Z";

    return { d1, d2 };
  }, [loopAngle, arcPointsCount]);

  // Rotational choreographies (integer revolutions over 600 frames = perfectly seamless)
  const rotArc1 = (loopProgress * 360 * 2) % 360; // 2 full revolutions
  const rotArc2 = (-loopProgress * 360 * 3) % 360; // -3 full revolutions

  // Thermal core breathing pulse
  const coreThermalPulse = 1.0 + 0.12 * Math.sin(loopAngle * 4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // 100% Pure Solid Black Base (Strictly zero gradient)
        width,
        height,
        overflow: "hidden",
        position: "relative",
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
          {/* Dual-Tier Multi-Pass Specular Optical Bloom */}
          <filter id="goldenBloomCore" x="-40%" y="-40%" width="180%" height="180%">
            {/* Pass 1: Specular tight core (stdDeviation 3.5px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="tightCore" />
            {/* Pass 1.5: Mid thermal body (stdDeviation 12px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="midBloom" />
            {/* Pass 2: Atmospheric volumetric falloff (stdDeviation 28px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="atmosphericBloom" />
            <feMerge>
              <feMergeNode in="atmosphericBloom" />
              <feMergeNode in="midBloom" />
              <feMergeNode in="tightCore" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Optical Bokeh Ultra-Soft Gaussian Blur */}
          <filter id="bokehSoftBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
          </filter>

          {/* Linear Gradients for Swirling Fire Arcs */}
          <linearGradient id="fireArcGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0" />
            <stop offset="25%" stopColor="#FF7700" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FFAA00" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="fireArcGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D00000" stopOpacity="0" />
            <stop offset="35%" stopColor="#E85D04" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#FFB703" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Central Solar Radiance Gradient */}
          <radialGradient id="solarRadianceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FFF3B0" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.65" />
            <stop offset="75%" stopColor="#FF7700" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Master Motion Group with Living Harmonic Idle Breathing */}
        <g
          transform={`translate(0, ${idle.idleY}) rotate(${idle.idleRotate}, 1920, 1080)`}
        >
          {/* Layer 1: 36 Large Optical Depth-of-Field Bokeh Orbs */}
          <g filter="url(#bokehSoftBlur)">
            {bokehOrbs.map((orb) => {
              // Seamless trigonometric drift
              const ox =
                orb.baseX +
                Math.sin(loopAngle * orb.freqX + orb.phaseX) * orb.driftAmpX;
              const oy =
                orb.baseY +
                Math.cos(loopAngle * orb.freqY + orb.phaseY) * orb.driftAmpY;

              // Gentle luminance pulse
              const pulse =
                0.8 + 0.2 * Math.sin(loopAngle * (orb.freqX + orb.freqY) + orb.id);
              const op = orb.baseOpacity * pulse;

              return (
                <g key={`bokeh-${orb.id}`}>
                  {/* Outer chromatic rim */}
                  <circle
                    cx={ox}
                    cy={oy}
                    r={orb.radius * 1.08}
                    fill={orb.colorRim}
                    opacity={op * 0.75}
                  />
                  {/* Luminous warm core */}
                  <circle
                    cx={ox}
                    cy={oy}
                    r={orb.radius}
                    fill={orb.colorCore}
                    opacity={op}
                  />
                </g>
              );
            })}
          </g>

          {/* Layer 2: Central Thermal Radiant Energy Core (Dominant Hero Focal Point) */}
          <g transform="translate(1920, 1080)" filter="url(#goldenBloomCore)">
            {/* Ambient Solar Plasma Core Disk */}
            <circle
              cx={0}
              cy={0}
              r={190 * coreThermalPulse}
              fill="url(#solarRadianceGrad)"
              opacity={0.88}
            />

            {/* Concentric Expanding Thermal Shockwave Ripple */}
            {Array.from({ length: 3 }).map((_, rIdx) => {
              const rPhase = ((loopProgress * 2 + rIdx / 3) % 1.0);
              const rRadius = 90 + rPhase * 280;
              const rOpacity = (1 - rPhase) * 0.55;
              return (
                <circle
                  key={`thermal-ring-${rIdx}`}
                  cx={0}
                  cy={0}
                  r={rRadius}
                  stroke="#FFD700"
                  strokeWidth={2}
                  fill="none"
                  opacity={rOpacity}
                />
              );
            })}

            {/* Reference Video Inspired Fiery Brush Arc 1 (Clockwise) */}
            <g transform={`rotate(${rotArc1})`}>
              <path
                d={plasmaArcs.d1}
                fill="url(#fireArcGrad1)"
                opacity={0.92}
              />
            </g>

            {/* Reference Video Inspired Solar Blade Arc 2 (Counter-Clockwise) */}
            <g transform={`rotate(${rotArc2})`}>
              <path
                d={plasmaArcs.d2}
                fill="url(#fireArcGrad2)"
                opacity={0.85}
              />
            </g>

            {/* Blinding White-Hot Epicenter Diamond Star */}
            <polygon
              points="0,-90 12,-14 90,0 12,14 0,90 -12,14 -90,0 -12,-14"
              fill="#FFFFFF"
              opacity={0.98}
            />
            {/* Diagonal Specular Rays */}
            <polygon
              points="0,-52 7,-8 52,0 7,8 0,52 -7,8 -52,0 -7,-8"
              transform="rotate(45)"
              fill="#FFF3B0"
              opacity={0.85}
            />
          </g>

          {/* Layer 3: 200 Physics-Driven Rising Golden Embers & Sparks */}
          <g filter="url(#goldenBloomCore)">
            {embers.map((p) => {
              // Seamless phase progression: ascends Yspan and wraps smoothly
              const rawPhase = (p.initialPhase + p.cycleCount * loopProgress) % 1.0;
              // Smooth window function: 0 at bottom, 1 in middle, 0 at top
              const verticalFade = Math.pow(Math.sin(rawPhase * Math.PI), 0.85);

              // Convective trajectory: ascends from Y=1780 to Y=380 (span = 1400px)
              const py = 1780 - rawPhase * 1400;

              // Convective horizontal turbulence
              const turb1 = Math.sin(loopAngle * p.cycleCount * 2 + p.id * 0.7) * p.wobbleAmp1;
              const turb2 = Math.cos(loopAngle * 3 + p.id * 1.3) * p.wobbleAmp2;
              const px = p.baseX + turb1 + turb2;

              // Harmonic sparkle twinkle
              const twinkle =
                0.4 + 0.6 * Math.sin(loopAngle * p.twinkleFreq * 4 + p.id);
              const emberOpacity = verticalFade * twinkle;

              if (p.type === "needle") {
                // Directional High-Speed Upward Convection Spark
                const len = p.size;
                return (
                  <line
                    key={`ember-needle-${p.id}`}
                    x1={px}
                    y1={py}
                    x2={px + turb1 * 0.15}
                    y2={py + len}
                    stroke={p.color}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    opacity={emberOpacity * 0.95}
                  />
                );
              } else if (p.type === "diamond") {
                // 4-point Diamond Gold Crystal
                const r = p.size * 0.5;
                return (
                  <polygon
                    key={`ember-diamond-${p.id}`}
                    points={`
                      ${px},${py - r}
                      ${px + r * 0.4},${py}
                      ${px},${py + r}
                      ${px - r * 0.4},${py}
                    `}
                    fill={p.color}
                    opacity={emberOpacity}
                  />
                );
              } else {
                // Soft Thermal Ember Orb
                return (
                  <circle
                    key={`ember-orb-${p.id}`}
                    cx={px}
                    cy={py}
                    r={p.size * 0.45}
                    fill={p.color}
                    opacity={emberOpacity * 0.9}
                  />
                );
              }
            })}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
