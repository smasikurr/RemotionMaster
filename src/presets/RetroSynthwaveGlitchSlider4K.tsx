import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const RetroSynthwaveGlitchSlider4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // Periodic chromatic glitch spikes
  const isGlitch = (frame >= 75 && frame <= 90) || (frame >= 210 && frame <= 228) || (frame >= 380 && frame <= 396);
  const rgbShift = isGlitch ? 18 : 0;
  const shakeX = isGlitch ? Math.sin(frame * 2.5) * 14 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barW = 2200;
  const barH = 76;

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
          <filter id="synthGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Subtle Wireframe Horizon */}
        <g stroke="rgba(255, 0, 127, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`sh-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`sv-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>
      </svg>

      {/* Main Retro Synthwave Container */}
      <div
        style={{
          width: barW,
          backgroundColor: "rgba(15, 0, 20, 0.85)",
          border: "2px solid #FF007F",
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(255, 0, 127, 0.35)",
          padding: "50px 60px",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${shakeX}px)`,
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 32,
            borderBottom: "2px solid rgba(255, 0, 127, 0.3)",
            paddingBottom: 24,
          }}
        >
          <div>
            <div style={{ color: "#FF007F", fontSize: 28, fontWeight: 900, letterSpacing: 5 }}>
              SYNTHWAVE CYBERNETIC SLIDER
            </div>
            <div style={{ color: "#00F0FF", fontSize: 18, marginTop: 6, letterSpacing: 3 }}>
              RETRO 80S HIGH-OCTANE BUFFER STREAM
            </div>
          </div>
          <div
            style={{
              color: "#00F0FF",
              fontSize: 70,
              fontWeight: 900,
              textShadow: "0 0 26px #00F0FF",
            }}
          >
            {percent}%
          </div>
        </div>

        {/* Outer Slider Track */}
        <div
          style={{
            width: "100%",
            height: barH,
            backgroundColor: "rgba(30, 0, 35, 0.7)",
            border: "2px solid #00F0FF",
            borderRadius: 14,
            padding: 8,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 35px rgba(0, 240, 255, 0.3)",
          }}
        >
          {/* Neon Magenta Laser Fill */}
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#FF007F",
              borderRadius: 8,
              boxShadow: "0 0 24px #FF007F",
            }}
          />

          {/* Glitch Ghost Layer during spikes */}
          {rgbShift > 0 && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8 + rgbShift,
                width: `${progress * 100}%`,
                height: barH - 16,
                backgroundColor: "#00F0FF",
                opacity: 0.75,
                mixBlendMode: "screen",
              }}
            />
          )}
        </div>

        {/* Footer Telemetry */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 26,
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>PROTOCOL: OUTRUN_V2</span>
          <span>CFR 60.000 FPS</span>
          <span>STATUS: COMPLETE</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
