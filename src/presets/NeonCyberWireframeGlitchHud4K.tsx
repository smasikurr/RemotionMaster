import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const NeonCyberWireframeGlitchHud4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // Periodic chromatic glitch spikes
  const isGlitch = (frame >= 80 && frame <= 94) || (frame >= 220 && frame <= 236) || (frame >= 360 && frame <= 376);
  const rgbShift = isGlitch ? 16 : 0;
  const shakeX = isGlitch ? Math.sin(frame * 2.5) * 12 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barW = 2200;
  const barH = 70;

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
        fontFamily: "'Courier New', Courier, monospace",
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
          <filter id="neonWireGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(255, 0, 85, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`wh-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`wv-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>
      </svg>

      {/* Main Wireframe HUD Box */}
      <div
        style={{
          width: barW,
          backgroundColor: "rgba(18, 0, 8, 0.85)",
          border: "2px solid #FF0055",
          borderRadius: 16,
          boxShadow: "0 0 50px rgba(255, 0, 85, 0.3)",
          padding: "44px 50px",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${shakeX}px)`,
          position: "relative",
        }}
      >
        {/* Top Header Readout */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 28,
            borderBottom: "1.5px solid rgba(255, 0, 85, 0.3)",
            paddingBottom: 20,
          }}
        >
          <div>
            <div style={{ color: "#FF0055", fontSize: 26, fontWeight: 900, letterSpacing: 4 }}>
              NEON CYBER WIREFRAME GLITCH HUD
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 18, marginTop: 4, letterSpacing: 2 }}>
              UPLOADING FIRMWARE CIPHER // SECURE NODE
            </div>
          </div>
          <div
            style={{
              color: "#00F0FF",
              fontSize: 64,
              fontWeight: 900,
              textShadow: "0 0 24px #00F0FF",
            }}
          >
            {percent}%
          </div>
        </div>

        {/* Outer Wireframe Progress Shell */}
        <div
          style={{
            width: "100%",
            height: barH,
            backgroundColor: "rgba(30, 0, 15, 0.6)",
            border: "2px solid #00F0FF",
            borderRadius: 12,
            padding: 8,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 30px rgba(0, 240, 255, 0.3)",
          }}
        >
          {/* Inner Laser Fill */}
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#FF0055",
              borderRadius: 6,
              boxShadow: "0 0 20px #FF0055",
            }}
          />

          {/* RGB Split Ghost Layer during glitch */}
          {rgbShift > 0 && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8 + rgbShift,
                width: `${progress * 100}%`,
                height: barH - 16,
                backgroundColor: "#00F0FF",
                opacity: 0.7,
                mixBlendMode: "screen",
              }}
            />
          )}
        </div>

        {/* Bottom Status Telemetry */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>TRANSFER: 4.8 GB / 4.8 GB</span>
          <span>SYSTEM READY</span>
          <span>PORT: 8080 (SECURE)</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
