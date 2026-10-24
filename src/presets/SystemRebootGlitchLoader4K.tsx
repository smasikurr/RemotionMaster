import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const SystemRebootGlitchLoader4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // Periodic chromatic glitch spikes
  const isGlitch = (frame >= 70 && frame <= 88) || (frame >= 200 && frame <= 218) || (frame >= 350 && frame <= 368);
  const rgbShift = isGlitch ? 18 : 0;
  const shakeX = isGlitch ? Math.sin(frame * 2.8) * 16 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barW = 2200;
  const barH = 74;

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
          <filter id="errorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(255, 0, 60, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`eh-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`ev-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>
      </svg>

      {/* Main Error Box Container */}
      <div
        style={{
          width: barW,
          backgroundColor: "rgba(25, 0, 6, 0.9)",
          border: "2px solid #FF003C",
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(255, 0, 60, 0.35)",
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
            marginBottom: 30,
            borderBottom: "2px solid rgba(255, 0, 60, 0.3)",
            paddingBottom: 22,
          }}
        >
          <div>
            <div style={{ color: "#FF003C", fontSize: 28, fontWeight: 900, letterSpacing: 5 }}>
              CRITICAL SYSTEM ERROR // REBOOT INITIALIZED
            </div>
            <div style={{ color: "#FFA800", fontSize: 18, marginTop: 6, letterSpacing: 3 }}>
              KERNEL EXCEPTION 0x0000007B // AUTOMATED RESTORE
            </div>
          </div>
          <div
            style={{
              color: "#FF003C",
              fontSize: 70,
              fontWeight: 900,
              textShadow: "0 0 24px #FF003C",
            }}
          >
            {percent}%
          </div>
        </div>

        {/* Progress Track */}
        <div
          style={{
            width: "100%",
            height: barH,
            backgroundColor: "rgba(45, 0, 10, 0.7)",
            border: "2px solid #FFA800",
            borderRadius: 14,
            padding: 8,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 35px rgba(255, 168, 0, 0.3)",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#FF003C",
              borderRadius: 8,
              boxShadow: "0 0 24px #FF003C",
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
                backgroundColor: "#FFA800",
                opacity: 0.75,
                mixBlendMode: "screen",
              }}
            />
          )}
        </div>

        {/* Footer */}
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
          <span>RESTORING CORRUPT SYSTEM PARTITION</span>
          <span>INTEGRITY CHECK: PASS</span>
          <span>STATUS: REBOOTING</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
