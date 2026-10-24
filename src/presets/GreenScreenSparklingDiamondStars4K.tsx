import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { anticipationSpring, harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * Deterministic PRNG for reproducible diamond sparkle physics
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Generate 4-point concave diamond glint star path string
 */
function createDiamondStarPath(R: number): string {
  // Deep concave diamond bezier curvature pinching gracefully at center
  const p = R * 0.08; // subtle center pinch offset
  return `
    M 0,${-R.toFixed(1)}
    Q ${p.toFixed(1)},${-p.toFixed(1)} ${R.toFixed(1)},0
    Q ${p.toFixed(1)},${p.toFixed(1)} 0,${R.toFixed(1)}
    Q ${-p.toFixed(1)},${p.toFixed(1)} ${(-R).toFixed(1)},0
    Q ${-p.toFixed(1)},${-p.toFixed(1)} 0,${(-R).toFixed(1)}
    Z
  `.trim();
}

/**
 * Generate slender cross needle flare path
 */
function createNeedleFlarePath(length: number, thickness: number): string {
  const w = thickness * 0.5;
  return `
    M 0,${-length.toFixed(1)}
    L ${w.toFixed(1)},${-w.toFixed(1)}
    L ${length.toFixed(1)},0
    L ${w.toFixed(1)},${w.toFixed(1)}
    L 0,${length.toFixed(1)}
    L ${-w.toFixed(1)},${w.toFixed(1)}
    L ${(-length).toFixed(1)},0
    L ${-w.toFixed(1)},${-w.toFixed(1)}
    Z
  `.trim();
}

interface DiamondStarConfig {
  id: string;
  x: number;
  y: number;
  R: number; // Base diamond radius
  baseRot: number; // Resting angle in degrees
  flareMult: number; // Needle flare length multiplier
  delay: number; // Entrance frame offset
  twinkleFreq: number;
  phase: number;
  glowAuraColor: string;
  isHero: boolean;
}

export const GreenScreenSparklingDiamondStars4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 1. Organic Idle Camera Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.025,
    amplitudeY: 4,
    tiltDegrees: 0.15,
  });

  // Master fade envelopes (480 frames / 8.0s @ 60 FPS)
  const masterOpacity = interpolate(
    frame,
    [0, 15, 440, 475],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Constellation Star Hierarchy (2 Major Heroes, 3 Mid Anchors, 8 Satellites)
  const stars = useMemo<DiamondStarConfig[]>(() => {
    return [
      // 2 Major Hero Stars (Commanding scale, dramatic optical presence)
      {
        id: "hero-1",
        x: 1660,
        y: 1080,
        R: 350,
        baseRot: -16,
        flareMult: 1.55,
        delay: 15,
        twinkleFreq: 0.08,
        phase: 0.0,
        glowAuraColor: "#FEF08A",
        isHero: true,
      },
      {
        id: "hero-2",
        x: 2380,
        y: 800,
        R: 315,
        baseRot: 18,
        flareMult: 1.50,
        delay: 32,
        twinkleFreq: 0.09,
        phase: 1.8,
        glowAuraColor: "#FEF9C3",
        isHero: true,
      },

      // 3 Mid Anchor Stars
      {
        id: "anchor-1",
        x: 1020,
        y: 1180,
        R: 235,
        baseRot: 22,
        flareMult: 1.45,
        delay: 48,
        twinkleFreq: 0.075,
        phase: 3.2,
        glowAuraColor: "#FEF08A",
        isHero: false,
      },
      {
        id: "anchor-2",
        x: 2180,
        y: 1530,
        R: 235,
        baseRot: -12,
        flareMult: 1.48,
        delay: 62,
        twinkleFreq: 0.085,
        phase: 4.5,
        glowAuraColor: "#A7F3D0",
        isHero: false,
      },
      {
        id: "anchor-3",
        x: 2880,
        y: 1200,
        R: 210,
        baseRot: 10,
        flareMult: 1.45,
        delay: 75,
        twinkleFreq: 0.07,
        phase: 5.6,
        glowAuraColor: "#FEF9C3",
        isHero: false,
      },

      // 8 Satellite Diamond Glints
      {
        id: "sat-1",
        x: 640,
        y: 960,
        R: 135,
        baseRot: -25,
        flareMult: 1.40,
        delay: 88,
        twinkleFreq: 0.11,
        phase: 0.7,
        glowAuraColor: "#FEF08A",
        isHero: false,
      },
      {
        id: "sat-2",
        x: 1220,
        y: 680,
        R: 140,
        baseRot: 28,
        flareMult: 1.35,
        delay: 96,
        twinkleFreq: 0.10,
        phase: 2.1,
        glowAuraColor: "#FEF9C3",
        isHero: false,
      },
      {
        id: "sat-3",
        x: 1960,
        y: 490,
        R: 135,
        baseRot: -6,
        flareMult: 1.38,
        delay: 104,
        twinkleFreq: 0.12,
        phase: 3.8,
        glowAuraColor: "#A7F3D0",
        isHero: false,
      },
      {
        id: "sat-4",
        x: 3200,
        y: 980,
        R: 135,
        baseRot: 18,
        flareMult: 1.40,
        delay: 112,
        twinkleFreq: 0.095,
        phase: 5.1,
        glowAuraColor: "#FEF08A",
        isHero: false,
      },
      {
        id: "sat-5",
        x: 1360,
        y: 1540,
        R: 130,
        baseRot: -18,
        flareMult: 1.35,
        delay: 118,
        twinkleFreq: 0.115,
        phase: 1.4,
        glowAuraColor: "#FEF9C3",
        isHero: false,
      },
      {
        id: "sat-6",
        x: 2680,
        y: 1620,
        R: 125,
        baseRot: 14,
        flareMult: 1.35,
        delay: 124,
        twinkleFreq: 0.105,
        phase: 2.9,
        glowAuraColor: "#A7F3D0",
        isHero: false,
      },
      {
        id: "sat-7",
        x: 1820,
        y: 1420,
        R: 115,
        baseRot: 30,
        flareMult: 1.30,
        delay: 130,
        twinkleFreq: 0.12,
        phase: 4.2,
        glowAuraColor: "#FEF08A",
        isHero: false,
      },
      {
        id: "sat-8",
        x: 2740,
        y: 620,
        R: 125,
        baseRot: -28,
        flareMult: 1.35,
        delay: 136,
        twinkleFreq: 0.09,
        phase: 5.8,
        glowAuraColor: "#FEF9C3",
        isHero: false,
      },
    ];
  }, []);

  // 3. Generate 28 Ambient Floating Magic Sparkle Embers
  const embers = useMemo(() => {
    const list = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 19 + 7);
      const r2 = seededRandom(i * 29 + 13);
      const r3 = seededRandom(i * 37 + 23);
      const r4 = seededRandom(i * 53 + 31);

      // Kept safely within active constellation boundaries
      const baseX = 800 + r1 * 2240;
      const baseY = 550 + r2 * 1050;
      const radius = 5 + r3 * 10; // 5 to 15px
      const driftSpeedX = (r1 - 0.5) * 0.45;
      const driftSpeedY = (r2 - 0.5) * 0.35;
      const twinkleSpeed = 0.12 + r3 * 0.15;
      const phase = r4 * Math.PI * 2;
      const delay = 40 + Math.floor(r4 * 80);

      list.push({
        id: i,
        baseX,
        baseY,
        radius,
        driftSpeedX,
        driftSpeedY,
        twinkleSpeed,
        phase,
        delay,
      });
    }
    return list;
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#00f800", // 100% Pure Solid Chroma Green (Strict 1-click keying)
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
          <filter id="starSpecularBloom" x="-50%" y="-50%" width="200%" height="200%">
            {/* Pass 1: Specular tight core (stdDeviation 3.5px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="tightCore" />
            {/* Pass 2: Atmospheric wide starlight aura (stdDeviation 22.0px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="22.0" result="starlightAura" />
            <feMerge>
              <feMergeNode in="starlightAura" />
              <feMergeNode in="tightCore" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Starlight Radial Aura Glow Gradient */}
          <radialGradient id="starlightAuraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FEF9C3" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#FEF08A" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#A7F3D0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00f800" stopOpacity="0" />
          </radialGradient>

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

        {/* Master Breathing Constellation Group */}
        <g
          transform={`translate(0, ${idle.idleY})`}
          clipPath="url(#cornerSafeZone)"
        >
          {/* ================================================================= */}
          {/* LAYER 1: Ambient Floating Magic Sparkle Embers */}
          {/* ================================================================= */}
          {embers.map((emb) => {
            if (frame < emb.delay) return null;
            const t = frame - emb.delay;
            const x = emb.baseX + t * emb.driftSpeedX;
            const y = emb.baseY + t * emb.driftSpeedY;
            const twinkle =
              0.4 + 0.6 * Math.sin(frame * emb.twinkleSpeed + emb.phase);
            const op = Math.max(0, twinkle * Math.min(1, t / 20));

            return (
              <g
                key={`ember-${emb.id}`}
                transform={`translate(${x}, ${y})`}
                opacity={op}
                filter="url(#starSpecularBloom)"
              >
                {/* 4-point micro diamond glint */}
                <path
                  d={createDiamondStarPath(emb.radius)}
                  fill="#FFFFFF"
                />
              </g>
            );
          })}

          {/* ================================================================= */}
          {/* LAYER 2: 13 Diamond Stars (2 Heroes, 3 Anchors, 8 Satellites) */}
          {/* ================================================================= */}
          {stars.map((star) => {
            // Anticipation spring pop entrance
            const entrance = anticipationSpring(frame, fps, {
              delay: star.delay,
              anticipationFrames: 7,
              anticipationDepth: 0.08,
              springConfig: { damping: 12, stiffness: 170, mass: 0.8 },
            });

            if (entrance <= 0.01) return null;

            // Living organic twinkle breathing
            const twinkleTime = frame * star.twinkleFreq + star.phase;
            // Pulsate diamond radius by +/- 8%
            const radiusPulse = 1.0 + Math.sin(twinkleTime) * 0.08;
            // Rotational shimmer by +/- 2.5 degrees
            const currentRot = star.baseRot + Math.sin(twinkleTime * 0.7) * 2.5;

            // Effective animated radius
            const currentR = star.R * entrance * radiusPulse;
            const needleLength = currentR * star.flareMult;
            const diagR = currentR * 0.36;

            // Specular entrance flash burst
            const entranceFlash = interpolate(
              frame - star.delay - 14,
              [0, 5, 20],
              [0, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <g
                key={star.id}
                transform={`translate(${star.x}, ${star.y}) rotate(${currentRot})`}
                opacity={Math.min(1, entrance * 1.2)}
              >
                {/* 1. Volumetric Circular Optical Aura Behind Star Core */}
                <circle
                  cx={0}
                  cy={0}
                  r={currentR * 0.65}
                  fill="url(#starlightAuraGrad)"
                  filter="url(#starSpecularBloom)"
                  opacity={star.isHero ? 0.95 : 0.75}
                />

                {/* 2. Secondary Slender Cross Needle Flares */}
                <g filter="url(#starSpecularBloom)" opacity={0.92}>
                  <path
                    d={createNeedleFlarePath(needleLength, star.isHero ? 7.5 : 5.0)}
                    fill="#FFFFFF"
                  />
                </g>

                {/* 3. 45-Degree Diagonal Micro-Spikes */}
                <g
                  transform="rotate(45)"
                  filter="url(#starSpecularBloom)"
                  opacity={0.85}
                >
                  <path
                    d={createDiamondStarPath(diagR)}
                    fill={star.glowAuraColor}
                  />
                </g>

                {/* 4. Primary Concave 4-Point Diamond Star Body */}
                <g filter="url(#starSpecularBloom)">
                  {/* Outer atmospheric aura fringe */}
                  <path
                    d={createDiamondStarPath(currentR)}
                    fill={star.glowAuraColor}
                    opacity={0.65}
                    transform="scale(1.04)"
                  />

                  {/* Incandescent Pure White-Hot Core Diamond */}
                  <path
                    d={createDiamondStarPath(currentR)}
                    fill="#FFFFFF"
                  />
                </g>

                {/* 5. Center Core Specular Hotspot Pip */}
                <circle
                  cx={0}
                  cy={0}
                  r={Math.max(3.0, currentR * 0.08)}
                  fill="#FFFFFF"
                  filter="url(#starSpecularBloom)"
                />

                {/* 6. Entrance Burst Shockwave Ring */}
                {entranceFlash > 0.05 && (
                  <circle
                    cx={0}
                    cy={0}
                    r={currentR * (1.0 + entranceFlash * 0.8)}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={3}
                    opacity={entranceFlash}
                    filter="url(#starSpecularBloom)"
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
