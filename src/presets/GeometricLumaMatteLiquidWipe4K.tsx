import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { HeroStaging } from "../craft/HeroStaging";
import { harmonicIdleMotion } from "../physics/craftPhysics";

export const GeometricLumaMatteLiquidWipe4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  // Pinned hero dimensions to strictly keep all graphic energy in central 60% viewport
  const heroW = 2400;
  const heroH = 1000;
  const centerX = heroW * 0.5;
  const centerY = heroH * 0.5;

  // Seamless cycle progress [0, 1)
  const loopProgress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = loopProgress * Math.PI * 2;

  const idle = harmonicIdleMotion(frame, { speed: 1.0 });

  // Transition Expansion Curves (Spring physics)
  // Clean harmonic cycle expanding and contracting with liquid tension
  const expansionProgress = interpolate(
    frame,
    [0, 150, 300, 450, 600],
    [0.15, 0.95, 0.40, 0.95, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Concentric liquid ripple rings
  const ringCount = 7;
  const rings = useMemo(() => {
    const list = [];
    for (let i = 0; i < ringCount; i++) {
      const delay = i * 12;
      const ringFrame = Math.max(0, frame - delay);
      const ringSpring = spring({
        frame: ringFrame,
        fps,
        config: { damping: 14, stiffness: 85, mass: 1.1 },
      });

      // Max radius strictly bounded within container (max 440px)
      const maxR = 220 + i * 32;
      const r = ringSpring * maxR * expansionProgress;

      // Harmonic liquid deformation around the perimeter
      const nodeCount = 20;
      let pathD = "";
      for (let j = 0; j <= nodeCount; j++) {
        const theta = (j / nodeCount) * Math.PI * 2;
        const waveOffset =
          Math.sin(theta * 5 + loopAngle * 2 + i * 0.6) * (18 * expansionProgress);
        const currR = Math.max(0, r + waveOffset);
        const px = centerX + Math.cos(theta) * currR;
        const py = centerY + Math.sin(theta) * currR;
        if (j === 0) {
          pathD += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
        } else {
          pathD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
        }
      }
      pathD += " Z";

      const strokeW = interpolate(expansionProgress, [0, 1], [3, 10]);
      const op = interpolate(expansionProgress, [0, 0.4, 1], [0.35, 0.85, 0.95]);

      list.push({ id: `ring-${i}`, pathD, strokeW, op });
    }
    return list;
  }, [ringCount, frame, fps, expansionProgress, loopAngle, centerX, centerY]);

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
            {/* Luma Matte High-Contrast Sharpening Glow */}
            <filter id="lumaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="core" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="bloom" />
              <feMerge>
                <feMergeNode in="bloom" />
                <feMergeNode in="core" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial Luma Gradient (Pure #ffffff to #000000) */}
            <radialGradient id="matteCoreOrb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#cccccc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Luma Core Burst */}
          <circle
            cx={centerX}
            cy={centerY}
            r={Math.max(10, 180 * expansionProgress)}
            fill="url(#matteCoreOrb)"
            filter="url(#lumaGlow)"
            opacity={0.92}
          />

          {/* Concentric Organic Liquid Ripple Rings */}
          <g filter="url(#lumaGlow)">
            {rings.map((r) => (
              <path
                key={r.id}
                d={r.pathD}
                stroke="#ffffff"
                strokeWidth={r.strokeW}
                fill="none"
                opacity={r.op}
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Central Specular Anchor Node */}
          <circle
            cx={centerX}
            cy={centerY}
            r={14}
            fill="#ffffff"
            filter="url(#lumaGlow)"
            opacity={0.98}
          />
        </svg>
      </div>
    </HeroStaging>
  );
};
