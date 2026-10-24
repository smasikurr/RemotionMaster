import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const HighTechBiometricGlitchLoader4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // Scanning laser beam vertical position
  const scanY = height / 2 - 250 + ((frame * 7) % 500);

  // Periodic chromatic glitch spikes
  const isGlitch = (frame >= 85 && frame <= 98) || (frame >= 230 && frame <= 245) || (frame >= 370 && frame <= 385);
  const glitchShift = isGlitch ? Math.sin(frame * 2.8) * 16 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerX = width / 2;
  const centerY = height / 2 - 40;

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
          <filter id="bioGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(0, 229, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`bh-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`bv-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>

        {/* Rotating Concentric Biometric Rings */}
        <g
          transform={`translate(${centerX + glitchShift}, ${centerY})`}
          filter="url(#bioGlow)"
        >
          <circle
            r="380"
            stroke="rgba(0, 229, 255, 0.3)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="20 40"
            transform={`rotate(${frame * 0.8})`}
          />
          <circle
            r="460"
            stroke="rgba(255, 0, 85, 0.25)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="40 80"
            transform={`rotate(${-frame * 0.5})`}
          />
          <circle
            r="540"
            stroke="rgba(0, 229, 255, 0.15)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="8 24"
          />

          {/* Central Fingerprint / Retinal Oval Ribbons */}
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse
              key={`bio-ring-${i}`}
              rx={60 + i * 36}
              ry={80 + i * 44}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeDasharray="16 12"
              opacity={0.3 + i * 0.1}
            />
          ))}
        </g>

        {/* Sweeping Laser Scanner Line */}
        <line
          x1={centerX - 500}
          y1={scanY}
          x2={centerX + 500}
          y2={scanY}
          stroke="#FF0055"
          strokeWidth="4"
          filter="url(#bioGlow)"
        />
      </svg>

      {/* Bottom Progress Bar & Telemetry HUD */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          width: 2200,
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${glitchShift}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ color: "#00E5FF", fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>
              BIOMETRIC IDENTITY RECOGNITION
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 18, marginTop: 4, letterSpacing: 2 }}>
              CLEARANCE LEVEL: TOP SECRET // ENCRYPTED
            </div>
          </div>
          <div style={{ color: "#00E5FF", fontSize: 54, fontWeight: 900, textShadow: "0 0 20px #00E5FF" }}>
            {percent}%
          </div>
        </div>

        {/* Progress Bar Container */}
        <div
          style={{
            width: "100%",
            height: 24,
            backgroundColor: "rgba(0, 30, 40, 0.6)",
            border: "2px solid rgba(0, 229, 255, 0.5)",
            borderRadius: 12,
            padding: 4,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#00E5FF",
              borderRadius: 8,
              boxShadow: "0 0 16px #00E5FF",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
