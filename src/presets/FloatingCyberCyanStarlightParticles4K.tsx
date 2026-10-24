import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * Deterministic PRNG for reproducible starlight particle physics
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Generate 4-point concave diamond glint star path string
 */
function createDiamondGlintPath(R: number): string {
  const p = R * 0.12; // center pinch offset
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

interface StarlightParticle {
  id: number;
  tier: 1 | 2 | 3; // 1 = background micro-dust, 2 = midground sparkle, 3 = foreground hero
  baseX: number;
  baseY: number;
  radius: number;
  speedY: number; // Upward drift speed
  driftFreqX: number; // Lateral harmonic oscillation frequency
  driftAmpX: number; // Lateral harmonic amplitude
  twinkleFreq: number; // Twinkle pulsation speed
  phase: number;
  rotation: number;
  coreColor: string;
  haloColor: string;
  hasFlares: boolean;
  flareLength: number;
}

export const FloatingCyberCyanStarlightParticles4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 1. Organic Idle Camera Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.025,
    amplitudeY: 4,
    tiltDegrees: 0.15,
  });

  // Master fade envelopes (600 frames / 10.0s @ 60 FPS)
  const masterOpacity = interpolate(
    frame,
    [0, 25, 570, 600],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Generate 136 Starlight Particles Across 3 Depth Tiers
  const particles = useMemo<StarlightParticle[]>(() => {
    const list: StarlightParticle[] = [];
    const count = 136;

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 17 + 5);
      const r2 = seededRandom(i * 23 + 11);
      const r3 = seededRandom(i * 31 + 19);
      const r4 = seededRandom(i * 47 + 29);
      const r5 = seededRandom(i * 59 + 37);

      // Depth tier allocation:
      // - 45% Tier 1: Background micro-dust / soft stars
      // - 40% Tier 2: Midground sparkling diamond stars
      // - 15% Tier 3: Foreground hero starlight glints with needle flares
      let tier: 1 | 2 | 3;
      let radius: number;
      let speedY: number;
      let hasFlares = false;
      let flareLength = 0;

      if (r1 < 0.45) {
        tier = 1;
        radius = 3.5 + r2 * 5.5; // 3.5 to 9px
        speedY = 0.5 + r3 * 0.45; // Slow ambient drift
      } else if (r1 < 0.85) {
        tier = 2;
        radius = 11 + r2 * 14; // 11 to 25px
        speedY = 0.95 + r3 * 0.75;
      } else {
        tier = 3;
        radius = 30 + r2 * 28; // 30 to 58px (Hero scale)
        speedY = 1.6 + r3 * 0.85; // Faster foreground drift
        hasFlares = true;
        flareLength = radius * (1.8 + r4 * 0.6); // 1.8x to 2.4x radius
      }

      // Spatial distribution: X in [480, 3360], Y in [240, 1920]
      const baseX = 480 + r3 * (3360 - 480);
      const baseY = 240 + r4 * (1920 - 240);

      const driftFreqX = 0.015 + r5 * 0.025;
      const driftAmpX = 14 + r2 * 28; // 14 to 42px lateral swing
      const twinkleFreq = 0.06 + r3 * 0.12;
      const phase = r4 * Math.PI * 2;
      const rotation = (r5 - 0.5) * 45; // Resting rotation

      // Cyber Cyan & Electric Teal Color Palette
      const coreColor = tier === 3 ? "#FFFFFF" : r2 > 0.5 ? "#FFFFFF" : "#A5F3FC";
      const haloColor = r3 > 0.6 ? "#22D3EE" : r3 > 0.3 ? "#06B6D4" : "#67E8F9";

      list.push({
        id: i,
        tier,
        baseX,
        baseY,
        radius,
        speedY,
        driftFreqX,
        driftAmpX,
        twinkleFreq,
        phase,
        rotation,
        coreColor,
        haloColor,
        hasFlares,
        flareLength,
      });
    }

    return list;
  }, []);

  // Vertical wrap span (from top margin to bottom margin with wrap-around)
  const wrapTop = 220;
  const wrapBottom = 1940;
  const wrapHeight = wrapBottom - wrapTop;

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
          <filter id="cyanStarlightBloom" x="-40%" y="-40%" width="180%" height="180%">
            {/* Pass 1: Specular tight core (stdDeviation 3.2px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="tightGlow" />
            {/* Pass 2: Atmospheric diffuse starlight bloom (stdDeviation 18.0px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="18.0" result="diffuseGlow" />
            <feMerge>
              <feMergeNode in="diffuseGlow" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft Blur Filter for Tier 1 Background Micro-Dust */}
          <filter id="subtleDustBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" />
          </filter>

          {/* Radial Starlight Core Glow Gradient */}
          <radialGradient id="cyanStarlightRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#A5F3FC" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
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

        {/* Master Motion Group with Gentle Harmonic Camera Breathing */}
        <g
          transform={`translate(0, ${idle.idleY})`}
          clipPath="url(#cornerSafeZone)"
        >
          {particles.map((p) => {
            // Upward drift with wrap-around
            const upwardOffset = frame * p.speedY;
            const currentY =
              wrapBottom -
              (((wrapBottom - p.baseY + upwardOffset) % wrapHeight + wrapHeight) %
                wrapHeight);

            // Lateral harmonic oscillation
            const currentX =
              p.baseX +
              Math.sin(frame * p.driftFreqX + p.phase) * p.driftAmpX;

            // Twinkle brightness modulation
            const twinkle =
              0.45 + 0.55 * Math.sin(frame * p.twinkleFreq + p.phase);

            // Corner proximity attenuation: if particle drifts near corner boxes, fade out softly
            let cornerFade = 1.0;
            const nearLeft = currentX <= 640;
            const nearRight = currentX >= 3200;
            const nearTop = currentY <= 380;
            const nearBottom = currentY >= 1780;

            if ((nearLeft || nearRight) && (nearTop || nearBottom)) {
              const xDist = nearLeft ? (currentX - 580) / 60 : (3260 - currentX) / 60;
              const yDist = nearTop ? (currentY - 330) / 50 : (1830 - currentY) / 50;
              cornerFade = Math.max(0, Math.min(1, Math.min(xDist, yDist)));
            }
            if (cornerFade <= 0.01) return null;

            // Tier-specific rendering
            if (p.tier === 1) {
              // ===============================================================
              // TIER 1: Background Micro-Stars & Soft Bokeh Dust
              // ===============================================================
              return (
                <circle
                  key={`star-${p.id}`}
                  cx={currentX}
                  cy={currentY}
                  r={p.radius}
                  fill={p.haloColor}
                  opacity={0.38 * twinkle * cornerFade}
                  filter="url(#subtleDustBlur)"
                />
              );
            }

            if (p.tier === 2) {
              // ===============================================================
              // TIER 2: Midground Active Diamond Sparkle Stars
              // ===============================================================
              const rot = p.rotation + Math.sin(frame * 0.04 + p.phase) * 3;
              return (
                <g
                  key={`star-${p.id}`}
                  transform={`translate(${currentX}, ${currentY}) rotate(${rot})`}
                  opacity={0.85 * twinkle * cornerFade}
                  filter="url(#cyanStarlightBloom)"
                >
                  {/* Outer atmospheric teal halo */}
                  <path
                    d={createDiamondGlintPath(p.radius * 1.15)}
                    fill={p.haloColor}
                    opacity={0.5}
                  />

                  {/* Incandescent white/cyan diamond core */}
                  <path
                    d={createDiamondGlintPath(p.radius)}
                    fill={p.coreColor}
                  />
                </g>
              );
            }

            // =================================================================
            // TIER 3: Foreground Hero Sparkling Starlight Glints with Flares
            // =================================================================
            const rot = p.rotation + Math.sin(frame * 0.035 + p.phase) * 2;
            return (
              <g
                key={`star-${p.id}`}
                transform={`translate(${currentX}, ${currentY}) rotate(${rot})`}
                opacity={0.98 * twinkle * cornerFade}
              >
                {/* 1. Volumetric Circular Starlight Halo */}
                <circle
                  cx={0}
                  cy={0}
                  r={p.radius * 0.75}
                  fill="url(#cyanStarlightRadial)"
                  filter="url(#cyanStarlightBloom)"
                  opacity={0.85}
                />

                {/* 2. Secondary Slender Cross Needle Flares */}
                <g filter="url(#cyanStarlightBloom)" opacity={0.9}>
                  <path
                    d={createNeedleFlarePath(p.flareLength, 3.8)}
                    fill="#FFFFFF"
                  />
                </g>

                {/* 3. 45-Degree Diagonal Accent Spikes */}
                <g
                  transform="rotate(45)"
                  filter="url(#cyanStarlightBloom)"
                  opacity={0.7}
                >
                  <path
                    d={createDiamondGlintPath(p.radius * 0.45)}
                    fill={p.haloColor}
                  />
                </g>

                {/* 4. Primary Concave 4-Point Diamond Star Body */}
                <g filter="url(#cyanStarlightBloom)">
                  {/* Outer vibrant cyan aura */}
                  <path
                    d={createDiamondGlintPath(p.radius * 1.08)}
                    fill={p.haloColor}
                    opacity={0.65}
                  />

                  {/* Incandescent Pure White-Hot Core Diamond */}
                  <path
                    d={createDiamondGlintPath(p.radius)}
                    fill="#FFFFFF"
                  />
                </g>

                {/* 5. Center Core Hotspot Pip */}
                <circle
                  cx={0}
                  cy={0}
                  r={Math.max(2.5, p.radius * 0.1)}
                  fill="#FFFFFF"
                  filter="url(#cyanStarlightBloom)"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
