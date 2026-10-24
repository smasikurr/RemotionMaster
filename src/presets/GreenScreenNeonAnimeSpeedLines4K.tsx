import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * Deterministic PRNG for reproducible anime speed line physics
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface SpeedLine {
  id: number;
  y: number; // Vertical position [240 to 1920]
  baseSpeed: number; // Pixels per frame (45 to 95 px/f)
  length: number; // Line streak length (450 to 2200 px)
  height: number; // Vertical ribbon thickness (3 to 24 px)
  phase: number;
  gradId: string;
  isHeavyBolt: boolean;
  isCornerBand: boolean;
}

export const GreenScreenNeonAnimeSpeedLines4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 1. Kinetic Anime Velocity Surges & Impact Camera Shudder
  // Periodic high-speed velocity swarms with supersonic acceleration bursts
  const surgeCycle = (frame * 0.045) % (Math.PI * 2);
  const surgeIntensity = Math.pow(Math.max(0, Math.sin(surgeCycle)), 2.2);
  const speedMultiplier = 1.0 + surgeIntensity * 1.15;

  // Kinetic camera impact shudder on acceleration bursts
  const cameraShakeX = Math.sin(frame * 0.85) * surgeIntensity * 7.0;
  const cameraShakeY = Math.cos(frame * 1.1) * surgeIntensity * 4.5;

  // Subtle harmonic idle breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.03,
    amplitudeY: 2.5,
    tiltDegrees: 0,
  });

  // Master fade envelopes (780 frames / 13.0s @ 60 FPS)
  const masterOpacity = interpolate(
    frame,
    [0, 20, 750, 780],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Generate 110 Multi-Tiered Anime Speed Lines (Pill Ribbons)
  const speedLines = useMemo<SpeedLine[]>(() => {
    const list: SpeedLine[] = [];
    const count = 110;

    const gradients = ["url(#streakGradGold)", "url(#streakGradLime)", "url(#streakGradWarm)"];

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 17 + 5);
      const r2 = seededRandom(i * 23 + 11);
      const r3 = seededRandom(i * 31 + 19);
      const r4 = seededRandom(i * 47 + 29);

      // Y distribution spanning [240 to 1920] (Height span = 1680px = 77.78% of canvas)
      const y = 240 + (i / count) * 1680 + (r1 - 0.5) * 16;

      // Identify if streak lies in top or bottom vertical margin zones
      // Top corner margin: Y <= 340. Bottom corner margin: Y >= 1820.
      const isCornerBand = y <= 340 || y >= 1820;

      // Speed: 45 to 95 px/frame (blazing anime velocity)
      const baseSpeed = 45 + r2 * 50;

      // Length: 450 to 2200 px
      const length = 450 + r3 * 1750;

      // Tiered ribbon thickness:
      // - 18% Heavy Power Bolts (14 to 24px)
      // - 42% Medium Action Ribbons (7 to 13px)
      // - 40% Fine Laser Filaments (3 to 6px)
      let ribbonH: number;
      let isHeavy = false;
      if (r4 > 0.82) {
        ribbonH = 14 + r1 * 10; // 14 to 24px
        isHeavy = true;
      } else if (r4 > 0.40) {
        ribbonH = 7 + r1 * 6; // 7 to 13px
      } else {
        ribbonH = 3 + r1 * 3; // 3 to 6px
      }

      const gradId = gradients[i % gradients.length];
      const phase = r4 * 8000;

      list.push({
        id: i,
        y,
        baseSpeed,
        length,
        height: ribbonH,
        phase,
        gradId,
        isHeavyBolt: isHeavy,
        isCornerBand,
      });
    }

    return list;
  }, []);

  // Total horizontal track wrap span (from off-screen left to off-screen right)
  const trackWidth = width + 3000; // 3840 + 3000 = 6840 px

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
          {/* Dual-Pass Multi-Tier Specular Anime Optical Glow */}
          <filter id="animeLaserGlow" x="-20%" y="-100%" width="140%" height="300%">
            {/* Pass 1: Tight specular core (stdDeviation 3.0px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="tightGlow" />
            {/* Pass 2: Atmospheric energetic bloom (stdDeviation 16.0px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="16.0" result="diffuseGlow" />
            <feMerge>
              <feMergeNode in="diffuseGlow" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Master Streak Linear Gradients: Head (Right) to Tail (Left) */}
          {/* 1. Neon Golden-Yellow Streak Gradient */}
          <linearGradient id="streakGradGold" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="12%" stopColor="#FFFBEB" stopOpacity="0.98" />
            <stop offset="28%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FACC15" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#A3E635" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00f800" stopOpacity="0" />
          </linearGradient>

          {/* 2. Neon Lime-Yellow Energy Streak Gradient */}
          <linearGradient id="streakGradLime" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="15%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#BEF264" stopOpacity="0.88" />
            <stop offset="70%" stopColor="#84CC16" stopOpacity="0.5" />
            <stop offset="92%" stopColor="#4ADE80" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f800" stopOpacity="0" />
          </linearGradient>

          {/* 3. Incandescent Amber-Gold Streak Gradient */}
          <linearGradient id="streakGradWarm" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="14%" stopColor="#FEF08A" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#FDE047" stopOpacity="0.92" />
            <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="88%" stopColor="#D97706" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00f800" stopOpacity="0" />
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

        {/* Master Motion Group with Kinetic Camera Shudder & Breathing */}
        <g
          transform={`translate(${cameraShakeX}, ${cameraShakeY + idle.idleY})`}
          clipPath="url(#cornerSafeZone)"
        >
          {speedLines.map((line) => {
            const currentSpeed = line.baseSpeed * speedMultiplier;
            const distance = (frame * currentSpeed + line.phase) % trackWidth;
            // Line head coordinate (moving left to right across the canvas)
            const headX = -1200 + distance;
            const tailX = headX - line.length;

            // In corner vertical bands (Y <= 340 or Y >= 1820), constrain to central 72% width [620, 3220]
            let bandOpacity = 1.0;
            if (line.isCornerBand) {
              if (headX < 650) {
                bandOpacity = Math.max(0, (headX - 580) / 70);
              } else if (tailX > 3190) {
                bandOpacity = Math.max(0, 1.0 - (tailX - 3190) / 70);
              }
            }
            if (bandOpacity <= 0.01) return null;

            const rx = line.height * 0.5;
            const topY = line.y - rx;

            return (
              <g
                key={`speedline-${line.id}`}
                opacity={bandOpacity}
              >
                {/* 1. Volumetric Glowing Energy Halo Ribbon */}
                <rect
                  x={tailX}
                  y={topY - (line.isHeavyBolt ? 4 : 2)}
                  width={line.length}
                  height={line.height + (line.isHeavyBolt ? 8 : 4)}
                  rx={rx + 2}
                  fill={line.gradId}
                  filter="url(#animeLaserGlow)"
                  opacity={line.isHeavyBolt ? 0.95 : 0.85}
                />

                {/* 2. Vibrant Laser Body Ribbon */}
                <rect
                  x={tailX + line.length * 0.15}
                  y={topY}
                  width={line.length * 0.85}
                  height={line.height}
                  rx={rx}
                  fill={line.gradId}
                  opacity={0.98}
                />

                {/* 3. Incandescent White-Hot Razor Sharp Core Filament */}
                <rect
                  x={headX - line.length * 0.45}
                  y={line.y - Math.max(1.2, line.height * 0.18)}
                  width={line.length * 0.45}
                  height={Math.max(2.4, line.height * 0.36)}
                  rx={Math.max(1.2, line.height * 0.18)}
                  fill="#FFFFFF"
                  opacity={0.98}
                />

                {/* 4. Leading Head Specular Spark Pellet */}
                <circle
                  cx={headX - rx * 0.5}
                  cy={line.y}
                  r={Math.max(2.0, rx * 0.85)}
                  fill="#FFFFFF"
                  filter="url(#animeLaserGlow)"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
