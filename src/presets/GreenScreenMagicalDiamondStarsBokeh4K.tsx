import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

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
  const p = R * 0.08;
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

/**
 * GreenScreenMagicalDiamondStarsBokeh4K
 *
 * Commercial-Grade 4K 60FPS Green Screen Diamond Stars & Fairy Bokeh Dust Overlay
 * Based on iStock reference: istockphoto-2191570680-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (780 frames / 13.0s seamless loop)
 * - 100% Pure Chroma Key Green #00F800 (RGB [0, 248, 0])
 * - Upward floating bokeh dust and twinkling diamond cross stars
 * - Commanding hero presence across canvas (Width ~2950px, Height ~1650px)
 * - All 4 corner zones (15% margin) guaranteed pure green
 */
export const GreenScreenMagicalDiamondStarsBokeh4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 780;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  // 1. Organic Idle Camera Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.025,
    amplitudeY: 3.5,
    tiltDegrees: 0.05,
  });

  // Master fade envelopes for seamless loop
  const masterOpacity = interpolate(
    frame,
    [0, 25, 755, 780],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Swarm of 75 Floating Fairy Bokeh Orbs (Drifting upward)
  const bokehOrbs = useMemo(() => {
    return Array.from({ length: 75 }).map((_, idx) => {
      const seed = idx * 19.371;
      const baseX = 582 + ((seed * 71) % 2676);
      const baseY = ((seed * 43) % height);
      const speedY = 1.0 + ((seed * 7) % 2.2); // 1.0 to 3.2 px/frame upward
      const swayFreq = 0.02 + ((seed * 3) % 0.03);
      const swayAmp = 15 + ((seed * 11) % 25);
      const size = 3.5 + ((seed * 5) % 9.0);
      const maxAlpha = 0.45 + ((seed * 13) % 0.45);
      return { id: idx, baseX, baseY, speedY, swayFreq, swayAmp, size, maxAlpha };
    });
  }, [height]);

  // 3. 32 Ambient Twinkling Diamond Stars
  const diamondStars = useMemo(() => {
    return Array.from({ length: 32 }).map((_, idx) => {
      const seed = idx * 29.813;
      const baseX = 650 + ((seed * 83) % 2540);
      const baseY = ((seed * 59) % height);
      const speedY = 0.8 + ((seed * 5) % 1.5);
      const R = 35 + ((seed * 17) % 65); // 35px to 100px radius
      const twinkleFreq = 0.05 + ((seed * 7) % 0.08);
      const phase = (seed * 13) % twoPi;
      const flareMult = 1.3 + ((seed * 3) % 0.4);
      return { id: idx, baseX, baseY, speedY, R, twinkleFreq, phase, flareMult };
    });
  }, [height, twoPi]);

  // 4. 4 Major Foreground Hero Supernova Stars
  const heroStars = useMemo(() => {
    return [
      {
        id: "hero-1",
        x: 1580,
        y: 620,
        R: 160,
        flareLen: 380,
        twinkleFreq: 0.04,
        phase: 0.2,
      },
      {
        id: "hero-2",
        x: 2320,
        y: 1140,
        R: 145,
        flareLen: 340,
        twinkleFreq: 0.05,
        phase: 2.1,
      },
      {
        id: "hero-3",
        x: 1040,
        y: 1380,
        R: 130,
        flareLen: 310,
        twinkleFreq: 0.035,
        phase: 4.3,
      },
      {
        id: "hero-4",
        x: 2750,
        y: 840,
        R: 125,
        flareLen: 290,
        twinkleFreq: 0.045,
        phase: 1.5,
      },
    ];
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#00F800", // 100% Pure Chroma Key Green
        width,
        height,
        overflow: "hidden",
      }}
    >
      <svg
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
          {/* Specular White Glow Filter */}
          <filter id="starBloomFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="tightGlow" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16.0" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" opacity="0.6" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strict 15% Corner Margin Safe Zone Clip Path */}
          <clipPath id="starsCornerSafeZone">
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

        {/* Master Motion Group with Living Camera Idle & Master Opacity */}
        <g
          transform={`translate(0, ${idle.idleY})`}
          clipPath="url(#starsCornerSafeZone)"
          opacity={masterOpacity}
        >
          {/* Layer 1: Floating Fairy Bokeh Dust Orbs */}
          {bokehOrbs.map((orb) => {
            const curY = ((orb.baseY - frame * orb.speedY) % height + height) % height;
            const curX = orb.baseX + Math.sin(frame * orb.swayFreq + orb.id) * orb.swayAmp;
            const pulse = 0.6 + 0.4 * Math.sin(frame * 0.06 + orb.id);
            return (
              <circle
                key={`orb-${orb.id}`}
                cx={curX}
                cy={curY}
                r={orb.size}
                fill="#FFFFFF"
                opacity={orb.maxAlpha * pulse}
              />
            );
          })}

          {/* Layer 2: 32 Ambient Twinkling Diamond Stars */}
          {diamondStars.map((star) => {
            const curY = ((star.baseY - frame * star.speedY) % height + height) % height;
            const curX = star.baseX + Math.sin(frame * 0.03 + star.id) * 12;
            const twinkle = Math.max(0.1, Math.sin(frame * star.twinkleFreq + star.phase));
            const curR = star.R * (0.7 + 0.4 * twinkle);
            const rot = (frame * 0.08 + star.id * 15) % 360;

            return (
              <g
                key={`dstar-${star.id}`}
                transform={`translate(${curX}, ${curY}) rotate(${rot})`}
                opacity={0.3 + 0.7 * twinkle}
                filter="url(#starBloomFilter)"
              >
                {/* 4-point concave diamond star */}
                <path d={createDiamondStarPath(curR)} fill="#FFFFFF" />
                {/* Cross flare needles */}
                <path
                  d={createNeedleFlarePath(curR * star.flareMult, curR * 0.12)}
                  fill="#FFFFFF"
                  opacity={0.85}
                />
              </g>
            );
          })}

          {/* Layer 3: 4 Major Hero Supernova Diamond Stars */}
          {heroStars.map((hero) => {
            const twinkle = 0.75 + 0.35 * Math.sin(frame * hero.twinkleFreq + hero.phase);
            const rot = (frame * 0.04) % 360;

            return (
              <g
                key={`hero-${hero.id}`}
                transform={`translate(${hero.x}, ${hero.y})`}
                filter="url(#starBloomFilter)"
              >
                {/* Long diffraction spikes */}
                <path
                  d={createNeedleFlarePath(hero.flareLen * twinkle, 4.5)}
                  fill="#FFFFFF"
                  opacity={0.95}
                />
                <path
                  d={createNeedleFlarePath(hero.flareLen * twinkle * 0.7, 3.0)}
                  transform="rotate(45)"
                  fill="#FFFFFF"
                  opacity={0.65}
                />

                {/* Central Concave Diamond Starlet */}
                <path
                  d={createDiamondStarPath(hero.R * twinkle)}
                  transform={`rotate(${rot})`}
                  fill="#FFFFFF"
                />

                {/* Central Specular Core Orb */}
                <circle cx={0} cy={0} r={14 * twinkle} fill="#FFFFFF" />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
