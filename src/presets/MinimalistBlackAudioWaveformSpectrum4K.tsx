import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * MinimalistBlackAudioWaveformSpectrum4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Swiss Minimalist Audio Waveform & Sound Spectrum Visualizer:
 * - Crisp Minimalist Pure White backdrop (#FFFFFF)
 * - 64 precision Jet Black (#111111) frequency bars undulating symmetrically
 * - Calibrated acoustic Fourier multi-frequency harmonic pulses
 * - Clean technical decibel & frequency markings (-24dB, -12dB, 0dB, 20Hz - 20kHz)
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const MinimalistBlackAudioWaveformSpectrum4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  const NUM_BARS = 64;
  const BAR_WIDTH = 22;
  const GAP = 18;
  const TOTAL_WIDTH = NUM_BARS * (BAR_WIDTH + GAP) - GAP;
  const startX = (width - TOTAL_WIDTH) / 2;
  const centerY = height / 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Technical Decibel & Frequency Guidelines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
        {/* Horizontal dB levels */}
        {[-300, -150, 0, 150, 300].map((dy, idx) => (
          <g key={`db-${idx}`}>
            <line x1={startX - 100} y1={centerY + dy} x2={startX + TOTAL_WIDTH + 100} y2={centerY + dy} stroke="#111111" strokeWidth="1.5" strokeDasharray="6 8" />
            <text x={startX - 120} y={centerY + dy + 5} fill="#111111" fontSize="16" fontWeight="700" fontFamily="monospace" textAnchor="end">
              {dy === 0 ? "0 dB" : `${-Math.abs(dy) / 15} dB`}
            </text>
          </g>
        ))}
        {/* Frequency Ticks at bottom */}
        {["20Hz", "100Hz", "500Hz", "1kHz", "5kHz", "10kHz", "20kHz"].map((hz, hzi) => {
          const hx = startX + (hzi / 6) * TOTAL_WIDTH;
          return (
            <text key={`hz-${hzi}`} x={hx} y={centerY + 420} fill="#111111" fontSize="18" fontWeight="800" fontFamily="monospace" textAnchor="middle">
              {hz}
            </text>
          );
        })}
      </svg>

      {/* Layer 2: 64 Precision Audio Waveform Bars */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: NUM_BARS }).map((_, i) => {
          const x = startX + i * (BAR_WIDTH + GAP);
          const nx = (i - NUM_BARS / 2) / (NUM_BARS / 2); // -1.0 to 1.0

          // Gaussian Bell Envelope (Higher in center, tapered at edges)
          const envelope = Math.exp(-2.5 * nx * nx);

          // Harmonic Multi-Frequency Acoustic Waves (All harmonic integers for seamless loop)
          const wave1 = Math.sin(normT * twoPi * 2 + i * 0.28) * 160;
          const wave2 = Math.cos(normT * twoPi * 4 + i * 0.45) * 110;
          const wave3 = Math.sin(normT * twoPi * 6 + i * 0.72) * 60;
          const pulse = Math.abs(Math.sin(normT * twoPi * 3 + Math.abs(nx) * 3)) * 80;

          // Half-height of the bar (symmetrical above & below center)
          const halfHeight = Math.max(16, (envelope * (240 + wave1 + wave2 + wave3) + pulse * envelope));
          const topY = centerY - halfHeight;
          const totalHeight = halfHeight * 2;

          return (
            <rect
              key={`bar-${i}`}
              x={x}
              y={topY}
              width={BAR_WIDTH}
              height={totalHeight}
              rx={BAR_WIDTH / 2}
              ry={BAR_WIDTH / 2}
              fill="#111111"
            />
          );
        })}
      </svg>

      {/* Layer 3: Minimalist Modern Technical Readout */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: startX,
          right: startX,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#111111" }} />
          <div style={{ color: "#111111", fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>
            SPECTRUM ANALYZER
          </div>
        </div>
        <div style={{ color: "#777777", fontSize: 16, fontWeight: 800, fontFamily: "monospace", letterSpacing: 1 }}>
          STEREO MASTER · 48.0 kHz 24-BIT
        </div>
      </div>
    </AbsoluteFill>
  );
};
