import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HeroStaging } from "../craft/HeroStaging";

/**
 * CinematicOrganicDustVignette4K - Stock Motion Graphics Video 07/81
 * Reference: istockphoto-1321913659-640_adpp_is.mp4 (10.01s)
 *
 * Strict Stock Quality Directives:
 * 1. Pinned Hero Container (2600x1000) strictly centered on canvas (Cx: 0.50, Cy: 0.50)
 * 2. Guaranteed Clean Borders & Corners (0% clutter in canvas margins)
 * 3. 100% Solid Pure Black (#000000) base for seamless Screen/Add/Luma Keying
 * 4. Organic floating particulate embers with fluid Brownian turbulence
 * 5. Structured keyframed dynamics ("Aga Gora Matha")
 */
export const CinematicOrganicDustVignette4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  // Bounded hero dimensions strictly within central safe viewport
  const heroW = 2600;
  const heroH = 1000;
  const centerX = heroW * 0.5;
  const centerY = heroH * 0.5;

  const time = frame / fps;

  // Keyframed particulate flow & dispersion
  const flowProgress = interpolate(
    frame,
    [0, 90, 200, 320, 440, 540, 600],
    [0.25, 0.65, 1.30, 0.70, 1.20, 0.45, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Number of organic particles (84 particles)
  const particleCount = 84;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const normDist = (i - (particleCount - 1) / 2) / ((particleCount - 1) / 2);
      const absDist = Math.abs(normDist);
      const envelope = Math.exp(-Math.pow(absDist * 1.85, 2));

      // Fixed seed per particle to prevent left-to-right traveling wave
      const seed = Math.sin(i * 733.1) * 98765.43;
      const baseRadiusX = 220 + (i % 8) * 110;
      const baseRadiusY = 80 + (i % 6) * 55;
      const size = 2.5 + (i % 5) * 2.0;
      const speed = 0.8 + (i % 4) * 0.35;
      const thetaOffset = (i / particleCount) * Math.PI * 2;

      return { id: i, normDist, absDist, envelope, seed, baseRadiusX, baseRadiusY, size, speed, thetaOffset };
    });
  }, [particleCount]);

  const animatedParticles = useMemo(() => {
    return particles.map((p) => {
      const t = time * p.speed;
      const theta = p.thetaOffset + Math.sin(t * 1.4 + p.seed) * 0.4;
      const driftX = Math.sin(t * 2.0 + p.seed * 0.8) * 45 * flowProgress;
      const driftY = Math.cos(t * 2.5 + p.seed * 0.6) * 35 * flowProgress;

      const px = centerX + Math.cos(theta) * (p.baseRadiusX * flowProgress) + driftX;
      const py = centerY + Math.sin(theta) * (p.baseRadiusY * flowProgress) + driftY;

      const flicker = Math.sin(t * 6.0 + p.seed) * 0.2 + 0.8;
      const opacity = Math.min(0.98, Math.max(0.2, p.envelope * flicker * flowProgress));

      return { ...p, px, py, opacity };
    });
  }, [particles, time, flowProgress, centerX, centerY]);

  return (
    <HeroStaging width={width} height={height} ambientGrid={false}>
      <div
        style={{
          width: heroW,
          height: heroH,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg
          width={heroW}
          height={heroH}
          viewBox={`0 0 ${heroW} ${heroH}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            {/* Specular Glow Filter */}
            <filter id="dustCoreGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="sharpCore" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="15.0" result="softBloom" />
              <feMerge>
                <feMergeNode in="softBloom" />
                <feMergeNode in="sharpCore" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer 1: Floating Specular Embers & Organic Particulates */}
          <g filter="url(#dustCoreGlow)">
            {animatedParticles.map((p) => (
              <circle
                key={`p-${p.id}`}
                cx={p.px}
                cy={p.py}
                r={p.size}
                fill="#ffffff"
                opacity={p.opacity}
              />
            ))}
          </g>

          {/* Layer 2: Subtle Connecting Fine Organic Wisps */}
          <g filter="url(#dustCoreGlow)" opacity={0.45 * flowProgress}>
            {animatedParticles.slice(0, 20).map((p, idx) => {
              if (idx % 2 !== 0) return null;
              const next = animatedParticles[(idx + 1) % animatedParticles.length];
              return (
                <line
                  key={`line-${p.id}`}
                  x1={p.px}
                  y1={p.py}
                  x2={next.px}
                  y2={next.py}
                  stroke="#ffffff"
                  strokeWidth={1.0}
                  strokeDasharray="2 6"
                  opacity={p.opacity * 0.6}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </HeroStaging>
  );
};
