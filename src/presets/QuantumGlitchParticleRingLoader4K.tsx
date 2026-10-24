import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const QuantumGlitchParticleRingLoader4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // Periodic chromatic glitch spikes
  const isGlitch = (frame >= 80 && frame <= 95) || (frame >= 220 && frame <= 235) || (frame >= 370 && frame <= 385);
  const rgbShift = isGlitch ? 16 : 0;
  const shakeX = isGlitch ? Math.sin(frame * 2.5) * 12 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const radius = 380;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Pure solid black base, zero gradient
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: masterFade,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          transform: `translateX(${shakeX}px)`,
        }}
      >
        <defs>
          <filter id="quantumGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`qh-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`qv-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>

        {/* Outer Counter-Rotating Ticks Ring */}
        <g
          transform={`translate(${centerX}, ${centerY}) rotate(${-frame * 0.6})`}
          stroke="rgba(124, 77, 255, 0.35)"
          strokeWidth="2"
          fill="none"
        >
          <circle r={radius + 80} strokeDasharray="6 24" />
          <circle r={radius + 130} strokeWidth="1.5" strokeDasharray="40 60" />
        </g>

        {/* Progress Arc Base Track */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="14"
          fill="none"
        />

        {/* Active Laser Quantum Progress Arc */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="#00F0FF"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${centerX} ${centerY})`}
          filter="url(#quantumGlow)"
        />

        {/* Secondary Glitch Ghost Arc during spikes */}
        {rgbShift > 0 && (
          <circle
            cx={centerX + rgbShift}
            cy={centerY}
            r={radius}
            stroke="#7C4DFF"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${centerX + rgbShift} ${centerY})`}
            opacity="0.8"
          />
        )}
      </svg>

      {/* Central Percentage Typography */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateX(${shakeX}px)`,
        }}
      >
        <div
          style={{
            color: "#00F0FF",
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -4,
            textShadow: "0 0 40px #00F0FF",
          }}
        >
          {percent}%
        </div>
        <div
          style={{
            color: "#7C4DFF",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 8,
            marginTop: 14,
          }}
        >
          QUANTUM SYNC
        </div>
      </div>
    </AbsoluteFill>
  );
};
