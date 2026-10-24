import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const DigitalNoiseGlitchProgressBar4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to Frame 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // High frequency deterministic noise bands
  const noiseSlices = useMemo(() => {
    const list = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const seed = Math.sin(i * 37.123 + (frame % 20) * 12.345) * 43758.5453;
      const r = seed - Math.floor(seed);
      if (r > 0.45) {
        list.push({
          y: (i / count) * 120,
          h: 4 + r * 14,
          shiftX: (r - 0.5) * 60,
          opacity: 0.3 + r * 0.5,
          color: r > 0.75 ? "#FF0055" : "#00F0FF",
        });
      }
    }
    return list;
  }, [frame]);

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = 2400;
  const barHeight = 84;

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
        }}
      >
        <defs>
          <filter id="noiseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Subtle Grid */}
        <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`nh-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`nv-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>
      </svg>

      {/* Main HUD Noise Bar Layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: barWidth,
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ color: "#00F0FF", fontSize: 26, fontWeight: 800, letterSpacing: 4 }}>
              DIGITAL NOISE DISTORTION BUFFER
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 18, marginTop: 4, letterSpacing: 2 }}>
              SIGNAL INTEGRITY: {(98.2 - Math.sin(frame * 0.2) * 1.5).toFixed(1)} dB
            </div>
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: 2,
              textShadow: "0 0 20px rgba(0, 240, 255, 0.8)",
            }}
          >
            {percent}%
          </div>
        </div>

        {/* Main Bar Outer Shell */}
        <div
          style={{
            width: barWidth,
            height: barHeight,
            backgroundColor: "rgba(10, 15, 25, 0.8)",
            border: "2px solid rgba(0, 240, 255, 0.4)",
            borderRadius: 16,
            padding: 8,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(0, 240, 255, 0.2)",
          }}
        >
          {/* Filled Progress Bar */}
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#00F0FF",
              borderRadius: 8,
              boxShadow: "0 0 24px #00F0FF",
              position: "relative",
            }}
          />

          {/* Glitch Noise Tearing Slices Overlay */}
          {noiseSlices.map((s, idx) => (
            <div
              key={`slice-${idx}`}
              style={{
                position: "absolute",
                top: s.y,
                left: 0,
                width: barWidth,
                height: s.h,
                backgroundColor: s.color,
                opacity: s.opacity,
                transform: `translateX(${s.shiftX}px)`,
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />
          ))}
        </div>

        {/* Bottom Metadata Markers */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>CH-01: QUANTUM ENTROPY STREAM</span>
          <span>RECONSTRUCTION: ACTIVE</span>
          <span>CFR 60.000 FPS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
