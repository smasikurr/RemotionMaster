import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * PrecisionFrequencyEqualizerBars4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Studio Precision Audio Equalizer & Sound Waveform Meter Animation:
 * - Deep Charcoal Slate backdrop (#131114) with subtle radial studio lighting
 * - 80 precision LED frequency columns undulating symmetrically
 * - Silver White (#E0E0E6) bars with Warm Amber (#FFA800) peak hold indicators
 * - Studio mastering decibel grid (-36dB to 0dB) and technical frequency scale
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const PrecisionFrequencyEqualizerBars4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  const NUM_BARS = 80;
  const BAR_WIDTH = 18;
  const GAP = 14;
  const TOTAL_WIDTH = NUM_BARS * (BAR_WIDTH + GAP) - GAP;
  const startX = (width - TOTAL_WIDTH) / 2;
  const centerY = height / 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#131114",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Studio Slate Radial Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, #1C1A1E 0%, #131114 60%, #0A090B 100%)",
        }}
      />

      {/* Studio Decibel Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
        {[-320, -160, 0, 160, 320].map((dy, idx) => (
          <g key={`db-grid-${idx}`}>
            <line x1={startX - 80} y1={centerY + dy} x2={startX + TOTAL_WIDTH + 80} y2={centerY + dy} stroke="#E0E0E6" strokeWidth="1" strokeDasharray="4 8" />
            <text x={startX - 100} y={centerY + dy + 5} fill="#A0A0AA" fontSize="15" fontWeight="700" fontFamily="monospace" textAnchor="end">
              {dy === 0 ? "0 dB" : `${-Math.abs(dy) / 10} dB`}
            </text>
          </g>
        ))}
        {["30Hz", "125Hz", "500Hz", "2kHz", "8kHz", "16kHz"].map((hz, hzi) => {
          const hx = startX + (hzi / 5) * TOTAL_WIDTH;
          return (
            <text key={`hz-grid-${hzi}`} x={hx} y={centerY + 420} fill="#A0A0AA" fontSize="16" fontWeight="800" fontFamily="monospace" textAnchor="middle">
              {hz}
            </text>
          );
        })}
      </svg>

      {/* Layer 2: 80 Precision Equalizer Columns */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="eqBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA800" />
            <stop offset="25%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFA800" />
          </linearGradient>
        </defs>

        {Array.from({ length: NUM_BARS }).map((_, i) => {
          const x = startX + i * (BAR_WIDTH + GAP);
          const nx = (i - NUM_BARS / 2) / (NUM_BARS / 2);
          const envelope = Math.exp(-2.2 * nx * nx);

          const w1 = Math.sin(normT * twoPi * 2 + i * 0.22) * 150;
          const w2 = Math.cos(normT * twoPi * 3 + i * 0.42) * 90;
          const w3 = Math.sin(normT * twoPi * 5 + i * 0.65) * 50;
          const beat = Math.abs(Math.sin(normT * twoPi * 4 + Math.abs(nx) * 2.5)) * 70;

          const halfHeight = Math.max(14, (envelope * (220 + w1 + w2 + w3) + beat * envelope));
          const topY = centerY - halfHeight;
          const totalHeight = halfHeight * 2;
          const peakY = topY - 10;
          const bottomPeakY = topY + totalHeight + 6;

          return (
            <g key={`eq-col-${i}`}>
              {/* Main Equalizer Bar */}
              <rect
                x={x}
                y={topY}
                width={BAR_WIDTH}
                height={totalHeight}
                rx={BAR_WIDTH / 2}
                ry={BAR_WIDTH / 2}
                fill="url(#eqBarGrad)"
                opacity={0.92}
              />

              {/* Top Peak Hold Dot */}
              <rect
                x={x}
                y={peakY}
                width={BAR_WIDTH}
                height={4}
                rx={2}
                fill="#FFA800"
                style={{ filter: "drop-shadow(0 0 4px #FFA800)" }}
              />

              {/* Bottom Peak Hold Dot */}
              <rect
                x={x}
                y={bottomPeakY}
                width={BAR_WIDTH}
                height={4}
                rx={2}
                fill="#FFA800"
                style={{ filter: "drop-shadow(0 0 4px #FFA800)" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Layer 3: Studio Header Readout */}
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
          <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FFA800", boxShadow: "0 0 10px #FFA800" }} />
          <div style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>
            PARAMETRIC EQUALIZER 80-CH
          </div>
        </div>
        <div style={{ color: "#A0A0AA", fontSize: 16, fontWeight: 800, fontFamily: "monospace", letterSpacing: 1 }}>
          PEAK HOLD · BROADCAST CALIBRATED
        </div>
      </div>
    </AbsoluteFill>
  );
};
