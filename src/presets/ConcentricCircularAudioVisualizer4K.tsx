import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * ConcentricCircularAudioVisualizer4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Radial Circular Audio Visualizer & Concentric Acoustic Pulse Loop:
 * - Pure Pitch Black backdrop (#000000) with deep space optical bloom
 * - 120 radial frequency rays pulsing around a glowing central sonic core
 * - Vibrant Neon Cyan (#00E5FF), Electric Mint (#00FFA3), and Pure White (#FFFFFF)
 * - Concentric expanding shockwave rings and orbiting harmonic particle cloud
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const ConcentricCircularAudioVisualizer4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  const CX = width / 2;
  const CY = height / 2;
  const BASE_RADIUS = 260;
  const NUM_RAYS = 120;

  // Harmonic Core Breathing & Rotation
  const corePulse = 1 + Math.sin(normT * twoPi * 4) * 0.08;
  const rotAngle = normT * twoPi * 2; // 2 full spins over 12s

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Deep Space Radial Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.16) 0%, rgba(0, 255, 163, 0.05) 35%, #000000 75%)",
        }}
      />

      {/* Layer 2: Concentric Shockwave Pulse Rings */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {[0, 1, 2, 3].map((ringIdx) => {
          const progress = ((normT * 4 + ringIdx * 0.25) % 1.0);
          const r = BASE_RADIUS + progress * 550;
          const opacity = (1 - progress) * 0.5;
          return (
            <circle
              key={`shockwave-${ringIdx}`}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#00E5FF"
              strokeWidth={3}
              opacity={opacity}
              style={{ filter: "drop-shadow(0 0 8px #00E5FF)" }}
            />
          );
        })}
      </svg>

      {/* Layer 3: 120 Radial Frequency Rays */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="rayGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#00FFA3" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
        </defs>

        <g transform={`translate(${CX}, ${CY}) rotate(${rotAngle * (180 / Math.PI)})`}>
          {Array.from({ length: NUM_RAYS }).map((_, i) => {
            const angle = (i / NUM_RAYS) * twoPi;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            // Multi-frequency harmonic audio pulse
            const h1 = Math.sin(normT * twoPi * 3 + i * 0.3) * 120;
            const h2 = Math.cos(normT * twoPi * 5 + i * 0.6) * 60;
            const rayLen = Math.max(20, 140 + h1 + h2);

            const r1 = BASE_RADIUS;
            const r2 = BASE_RADIUS + rayLen;

            return (
              <line
                key={`ray-${i}`}
                x1={cosA * r1}
                y1={sinA * r1}
                x2={cosA * r2}
                y2={sinA * r2}
                stroke="url(#rayGrad)"
                strokeWidth={5}
                strokeLinecap="round"
                style={{
                  filter: (i % 6 === 0) ? "drop-shadow(0 0 10px #00FFA3)" : "none",
                }}
              />
            );
          })}

          {/* Central Glowing Acoustic Core Orb */}
          <circle
            cx={0}
            cy={0}
            r={BASE_RADIUS * 0.88 * corePulse}
            fill="#050B14"
            stroke="#00FFA3"
            strokeWidth={6}
            style={{ filter: "drop-shadow(0 0 35px #00FFA3)" }}
          />

          <circle
            cx={0}
            cy={0}
            r={BASE_RADIUS * 0.55 * corePulse}
            fill="#00E5FF"
            opacity={0.3}
            style={{ filter: "drop-shadow(0 0 25px #00E5FF)" }}
          />

          <circle
            cx={0}
            cy={0}
            r={18}
            fill="#FFFFFF"
            style={{ filter: "drop-shadow(0 0 15px #FFFFFF)" }}
          />
        </g>
      </svg>

      {/* Layer 4: Orbiting Sonic Dust Particles */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {Array.from({ length: 64 }).map((_, pi) => {
          const orbitAngle = normT * twoPi * (pi % 2 === 0 ? 1 : -1) + (pi / 64) * twoPi;
          const orbitDist = BASE_RADIUS + 220 + (pi % 8) * 45;
          const px = CX + Math.cos(orbitAngle) * orbitDist;
          const py = CY + Math.sin(orbitAngle) * (orbitDist * 0.7);
          return (
            <circle
              key={`orb-part-${pi}`}
              cx={px}
              cy={py}
              r={2.5 + (pi % 3) * 1.5}
              fill="#00FFA3"
              opacity={0.5 + (pi % 4) * 0.12}
              style={{ filter: "drop-shadow(0 0 5px #00FFA3)" }}
            />
          );
        })}
      </svg>

      {/* Layer 5: Technical Visualizer Header */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 140,
          right: 140,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#00E5FF", boxShadow: "0 0 12px #00E5FF" }} />
          <div style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>
            CIRCULAR AUDIO VISUALIZER
          </div>
        </div>
        <div style={{ color: "#00FFA3", fontSize: 16, fontWeight: 800, fontFamily: "monospace", letterSpacing: 1 }}>
          POLAR FFT · 360° ACOUSTIC ORB
        </div>
      </div>
    </AbsoluteFill>
  );
};
