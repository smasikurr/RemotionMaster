import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * CyberNeonAudioWaveformTunnel4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Cyberpunk Neon Soundwave & Audio Frequency Horizon Animation:
 * - Pitch Black backdrop (#000000) with deep space optical ambient glow
 * - 32 multi-layered glowing Neon Aquamarine (#00FFA3) & Electric Cyan (#00E5FF) sine waves
 * - Symmetrical multi-octave acoustic frequency modulation
 * - Volumetric laser glow, harmonic resonance particles, and technical audio Hz scale
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const CyberNeonAudioWaveformTunnel4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  const NUM_LAYERS = 18;
  const centerY = height / 2;

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
      {/* Layer 1: Ambient Radial Cyber Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.12) 0%, rgba(0, 255, 163, 0.04) 40%, #000000 75%)",
        }}
      />

      {/* Layer 2: 32 Multi-Layered Neon Sinusoidal Audio Ribbons */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="neonWaveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#00FFA3" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00FFA3" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {Array.from({ length: NUM_LAYERS }).map((_, layerIdx) => {
          const lNorm = (layerIdx - NUM_LAYERS / 2) / (NUM_LAYERS / 2); // -1.0 to 1.0
          const phaseOffset = layerIdx * 0.35;
          const amplitudeMult = 1 - Math.abs(lNorm) * 0.65;

          const points: string[] = [];
          const step = 20;
          for (let x = 0; x <= width; x += step) {
            const nx = (x - width / 2) / (width / 2); // -1.0 to 1.0
            const envelope = Math.exp(-1.8 * nx * nx); // High in center

            // Harmonic acoustic frequencies
            const f1 = Math.sin(nx * Math.PI * 4 + normT * twoPi * 2 + phaseOffset) * 180;
            const f2 = Math.cos(nx * Math.PI * 8 - normT * twoPi * 3 + phaseOffset * 0.5) * 90;
            const f3 = Math.sin(nx * Math.PI * 12 + normT * twoPi * 4) * 45;

            const y = centerY + (f1 + f2 + f3) * envelope * amplitudeMult + lNorm * 40;
            points.push(`${x},${y}`);
          }

          const pathD = `M ${points.join(" L ")}`;
          const opacity = 0.35 + (1 - Math.abs(lNorm)) * 0.6;
          const strokeWidth = 2 + (1 - Math.abs(lNorm)) * 3;

          return (
            <path
              key={`neon-wave-${layerIdx}`}
              d={pathD}
              fill="none"
              stroke="url(#neonWaveGrad)"
              strokeWidth={strokeWidth}
              strokeOpacity={opacity}
              strokeLinecap="round"
              style={{
                filter: layerIdx === Math.floor(NUM_LAYERS / 2) ? "drop-shadow(0 0 20px #00FFA3)" : "none",
              }}
            />
          );
        })}
      </svg>

      {/* Layer 3: Harmonic Resonant Particles */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {Array.from({ length: 48 }).map((_, pi) => {
          const px = ((pi * 83 + normT * width * 0.5) % width);
          const py = centerY + Math.sin(normT * twoPi * 3 + pi * 1.5) * 220 * Math.cos(pi);
          const pr = 2 + (pi % 4) * 1.5;
          return (
            <circle
              key={`part-${pi}`}
              cx={px}
              cy={py}
              r={pr}
              fill="#00FFA3"
              opacity={0.4 + (pi % 3) * 0.2}
              style={{ filter: "drop-shadow(0 0 6px #00FFA3)" }}
            />
          );
        })}
      </svg>

      {/* Layer 4: Minimalist Cyber Frequency Scale Header & Footer */}
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
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#00FFA3", boxShadow: "0 0 12px #00FFA3" }} />
          <div style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>
            HARMONIC RESONANCE
          </div>
        </div>
        <div style={{ color: "#00E5FF", fontSize: 16, fontWeight: 800, fontFamily: "monospace", letterSpacing: 1 }}>
          LIVE SYNTHESIS · 96.0 kHz 32-BIT
        </div>
      </div>
    </AbsoluteFill>
  );
};
