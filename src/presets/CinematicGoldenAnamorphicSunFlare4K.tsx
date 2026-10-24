import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * Deterministic PRNG for reproducible optical shimmer
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface VolumetricBeam {
  id: number;
  baseAngle: number;
  innerSpreadDeg: number;
  outerSpreadDeg: number;
  lengthMult: number;
  tipPeak: number;
  baseBrightness: number;
  twinkleFreq: number;
  twinklePhase: number;
}

interface DiffractionNeedle {
  id: number;
  angle: number;
  lengthMult: number;
  thickness: number;
  twinkleFreq: number;
  phase: number;
  opacityMult: number;
}

export const CinematicGoldenAnamorphicSunFlare4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cx = width * 0.5; // 1920
  const cy = height * 0.5; // 1080

  // 1. Living Organic Harmonic Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.035,
    amplitudeY: 3.5,
    tiltDegrees: 0.1,
  });

  // Slow, majestic rotation of volumetric God rays (0.025 deg/frame)
  const beamRotation = frame * 0.025;
  // Slow counter-rotation of fine diffraction needles (-0.02 deg/frame)
  const needleRotation = frame * -0.02;

  // Master fade envelopes (600 frames / 10.0s @ 60 FPS)
  const masterOpacity = interpolate(
    frame,
    [0, 25, 570, 600],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Core solar breathing pulsation (+/- 3.5%)
  const corePulse = 1.0 + Math.sin(frame * 0.08) * Math.cos(frame * 0.045) * 0.035;

  // 2. Safe Elliptical Boundary Distance Function (Zero Corner Intrusion)
  // Horizontal reaches up to 1460px (W=2920px = 76.04%),
  // Vertical reaches up to 860px (H=1651px = 76.44%),
  // and diagonal rays stay strictly clear of all 4 corner margin boxes.
  const getSafeRadius = (angleRad: number): number => {
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    const rMax = 1.0 / Math.sqrt(Math.pow(cosA / 1460, 2) + Math.pow(sinA / 860, 2));
    return rMax * 0.96;
  };

  // 3. Generate 16 Wide Volumetric Crepuscular God Rays (Smooth Feathered Cones)
  const volumetricBeams = useMemo<VolumetricBeam[]>(() => {
    const list: VolumetricBeam[] = [];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 17 + 5);
      const r2 = seededRandom(i * 23 + 11);
      const r3 = seededRandom(i * 31 + 19);
      const r4 = seededRandom(i * 47 + 29);

      // Evenly distributed angle around 360 deg with organic jitter
      const baseAngle = (i / count) * Math.PI * 2 + (r1 - 0.5) * 0.06;
      // Expanding cone spread: 3 deg at core, expanding to 13-18 deg at perimeter
      const innerSpreadDeg = (3.0 + r2 * 1.5) * (Math.PI / 180);
      const outerSpreadDeg = (13.0 + r2 * 5.0) * (Math.PI / 180);
      const lengthMult = 0.90 + r3 * 0.08; // 0.90 to 0.98
      const tipPeak = 30 + r1 * 30; // Pointed tip apex extension
      const baseBrightness = 0.75 + r1 * 0.25;
      const twinkleFreq = 0.05 + r4 * 0.07;
      const twinklePhase = r1 * Math.PI * 2;

      list.push({
        id: i,
        baseAngle,
        innerSpreadDeg,
        outerSpreadDeg,
        lengthMult,
        tipPeak,
        baseBrightness,
        twinkleFreq,
        twinklePhase,
      });
    }

    return list;
  }, []);

  // 4. Generate 24 Crisp Specular Diffraction Aperture Needles
  const diffractionNeedles = useMemo<DiffractionNeedle[]>(() => {
    const list: DiffractionNeedle[] = [];
    const count = 24;

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 19 + 7);
      const r2 = seededRandom(i * 29 + 13);
      const r3 = seededRandom(i * 37 + 23);
      const r4 = seededRandom(i * 53 + 31);

      const angle = (i / count) * Math.PI * 2 + (r1 - 0.5) * 0.04;
      // Staggered reach: 12 tight aperture spikes (0.35-0.55), 12 ethereal starlight needles (0.75-0.95)
      const isTight = i % 2 === 0;
      const lengthMult = isTight ? 0.35 + r2 * 0.22 : 0.78 + r2 * 0.18;
      const thickness = isTight ? 2.2 + r3 * 1.8 : 1.4 + r3 * 1.4;
      const twinkleFreq = 0.08 + r4 * 0.14;
      const phase = r1 * Math.PI * 2;
      const opacityMult = isTight ? 0.95 : 0.55 + r1 * 0.35;

      list.push({
        id: i,
        angle,
        lengthMult,
        thickness,
        twinkleFreq,
        phase,
        opacityMult,
      });
    }

    return list;
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // 100% Pure Solid Black (Strict 0.00 RGB for Add/Screen blending)
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
          {/* Dual-Pass Multi-Tier Specular Optical Bloom Filter */}
          <filter id="sunOpticalGlow" x="-30%" y="-30%" width="160%" height="160%">
            {/* Pass 1: Specular tight core (stdDeviation 3.2px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="tightGlow" />
            {/* Pass 2: Atmospheric diffuse golden bloom (stdDeviation 22.0px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="22.0" result="diffuseGlow" />
            <feMerge>
              <feMergeNode in="diffuseGlow" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Volumetric Beam Soft Atmosphere Blur Filter (Feathered God Rays) */}
          <filter id="volumetricBeamBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="34.0" />
          </filter>

          {/* Deep Corona Volumetric Mist Gradient (userSpaceOnUse centered at cx, cy) */}
          <radialGradient
            id="coronaMistGrad"
            cx={cx}
            cy={cy}
            r={680}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="12%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.60" />
            <stop offset="68%" stopColor="#D97706" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Volumetric God Rays Global Radial Gradient (userSpaceOnUse centered at cx, cy) */}
          <radialGradient
            id="sunRayCoronaGrad"
            cx={cx}
            cy={cy}
            r={1460}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1.0" />
            <stop offset="10%" stopColor="#FFFBEB" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.65" />
            <stop offset="75%" stopColor="#D97706" stopOpacity="0.38" />
            <stop offset="90%" stopColor="#B45309" stopOpacity="0.18" />
            <stop offset="98%" stopColor="#78350F" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Incandescent Solar Core Fusion Gradient */}
          <radialGradient
            id="solarFusionCoreGrad"
            cx={cx}
            cy={cy}
            r={210}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FFFBEB" stopOpacity="0.98" />
            <stop offset="55%" stopColor="#FEF08A" stopOpacity="0.90" />
            <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.50" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Horizontal Anamorphic Streak Linear Gradient */}
          <linearGradient id="anamorphicStreakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="2%" stopColor="#D97706" stopOpacity="0.45" />
            <stop offset="6%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="20%" stopColor="#FEF08A" stopOpacity="0.98" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="80%" stopColor="#FEF08A" stopOpacity="0.98" />
            <stop offset="94%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="98%" stopColor="#D97706" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Corner Safety Clip Path: Strictly Excludes All 4 15% Corner Margin Boxes */}
          {/* TL: [0..580, 0..330], TR: [3260..3840, 0..330], BL: [0..580, 1830..2160], BR: [3260..3840, 1830..2160] */}
          <clipPath id="cornerSafeZone">
            <path
              d={`
                M 580 0
                L 3260 0
                L 3260 330
                L 3840 330
                L 3840 1830
                L 3260 1830
                L 3260 2160
                L 580 2160
                L 580 1830
                L 0 1830
                L 0 330
                L 580 330
                Z
              `}
            />
          </clipPath>
        </defs>

        {/* Master Motion Group with Living Harmonic Idle Breathing & Corner Clip Path */}
        <g
          transform={`translate(0, ${idle.idleY})`}
          clipPath="url(#cornerSafeZone)"
        >
          {/* ================================================================= */}
          {/* LAYER 1: Wide Volumetric Corona Mist Atmosphere                   */}
          {/* ================================================================= */}
          <circle
            cx={cx}
            cy={cy}
            r={680 * corePulse}
            fill="url(#coronaMistGrad)"
            opacity={0.82}
          />

          {/* ================================================================= */}
          {/* LAYER 2: 16 Volumetric God Rays (Smooth Feathered Shafts)         */}
          {/* ================================================================= */}
          <g filter="url(#volumetricBeamBlur)">
            {volumetricBeams.map((beam) => {
              const curAngle = beam.baseAngle + (beamRotation * Math.PI) / 180;
              const safeR = getSafeRadius(curAngle) * beam.lengthMult * corePulse;

              const rIn = 45;
              const halfIn = beam.innerSpreadDeg * 0.5;
              const halfOut = beam.outerSpreadDeg * 0.5;

              // Trapezoidal expanding cone vertices with soft apex peak
              const p1x = cx + Math.cos(curAngle - halfIn) * rIn;
              const p1y = cy + Math.sin(curAngle - halfIn) * rIn;
              const p2x = cx + Math.cos(curAngle - halfOut) * safeR;
              const p2y = cy + Math.sin(curAngle - halfOut) * safeR;
              const p3x = cx + Math.cos(curAngle) * (safeR + beam.tipPeak);
              const p3y = cy + Math.sin(curAngle) * (safeR + beam.tipPeak);
              const p4x = cx + Math.cos(curAngle + halfOut) * safeR;
              const p4y = cy + Math.sin(curAngle + halfOut) * safeR;
              const p5x = cx + Math.cos(curAngle + halfIn) * rIn;
              const p5y = cy + Math.sin(curAngle + halfIn) * rIn;

              const shimmer =
                beam.baseBrightness *
                (0.85 + 0.15 * Math.sin(frame * beam.twinkleFreq + beam.twinklePhase));

              return (
                <polygon
                  key={`vol-beam-${beam.id}`}
                  points={`${p1x.toFixed(1)},${p1y.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)} ${p3x.toFixed(1)},${p3y.toFixed(1)} ${p4x.toFixed(1)},${p4y.toFixed(1)} ${p5x.toFixed(1)},${p5y.toFixed(1)}`}
                  fill="url(#sunRayCoronaGrad)"
                  opacity={shimmer * 0.88}
                />
              );
            })}
          </g>

          {/* ================================================================= */}
          {/* LAYER 3: 24 Crisp Specular Diffraction Aperture Needles           */}
          {/* ================================================================= */}
          <g filter="url(#sunOpticalGlow)">
            {diffractionNeedles.map((needle) => {
              const curAngle = needle.angle + (needleRotation * Math.PI) / 180;
              const maxR = getSafeRadius(curAngle);
              const r = maxR * needle.lengthMult * corePulse;

              const px = cx + Math.cos(curAngle) * r;
              const py = cy + Math.sin(curAngle) * r;

              const twinkle =
                0.70 + 0.30 * Math.sin(frame * needle.twinkleFreq + needle.phase);

              return (
                <line
                  key={`diff-needle-${needle.id}`}
                  x1={cx}
                  y1={cy}
                  x2={px}
                  y2={py}
                  stroke="#FEF9C3"
                  strokeWidth={needle.thickness}
                  strokeLinecap="round"
                  opacity={twinkle * needle.opacityMult}
                />
              );
            })}
          </g>

          {/* ================================================================= */}
          {/* LAYER 4: Horizontal Anamorphic Streak Flare                       */}
          {/* ================================================================= */}
          <g filter="url(#sunOpticalGlow)">
            {/* Primary Sharp Anamorphic Filament (Height 5.0px, Width 2920px) */}
            <rect
              x={cx - 1460}
              y={cy - 2.5}
              width={2920}
              height={5.0}
              rx={2.5}
              fill="url(#anamorphicStreakGrad)"
              opacity={0.98}
            />

            {/* Volumetric Soft Anamorphic Glow Halo (Height 18px, Width 2920px) */}
            <rect
              x={cx - 1460}
              y={cy - 9.0}
              width={2920}
              height={18.0}
              rx={9.0}
              fill="url(#anamorphicStreakGrad)"
              opacity={0.65}
            />
          </g>

          {/* ================================================================= */}
          {/* LAYER 5: Solar Fusion Inner Core & Blinding Hotspot Nexus         */}
          {/* ================================================================= */}
          <g filter="url(#sunOpticalGlow)">
            {/* Inner Golden Corona Ring */}
            <circle
              cx={cx}
              cy={cy}
              r={200 * corePulse}
              fill="url(#solarFusionCoreGrad)"
              opacity={0.96}
            />

            {/* Specular Pure White-Hot Nuclear Hotspot */}
            <circle
              cx={cx}
              cy={cy}
              r={48 * corePulse}
              fill="#FFFFFF"
              opacity={1.0}
            />

            {/* Center Specular 8-Point Diamond Flare Starlet */}
            {Array.from({ length: 4 }).map((_, idx) => {
              const starAngle = idx * (Math.PI / 4) + (frame * 0.02);
              const starLen = (idx % 2 === 0 ? 125 : 78) * corePulse;
              const x1 = cx - Math.cos(starAngle) * starLen;
              const y1 = cy - Math.sin(starAngle) * starLen;
              const x2 = cx + Math.cos(starAngle) * starLen;
              const y2 = cy + Math.sin(starAngle) * starLen;

              return (
                <line
                  key={`starlet-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#FFFFFF"
                  strokeWidth={idx % 2 === 0 ? 3.8 : 2.2}
                  strokeLinecap="round"
                  opacity={0.98}
                />
              );
            })}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
