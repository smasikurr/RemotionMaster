import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const SciFiTerminalGlitchBuffer4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const percentage = Math.floor(progress * 100);

  // Glitch spikes
  const isSpike = (frame >= 90 && frame <= 105) || (frame >= 240 && frame <= 255) || (frame >= 390 && frame <= 405);
  const glitchOffset = isSpike ? (Math.sin(frame * 1.8) * 18) : 0;
  const rgbSplit = isSpike ? 14 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Number of segmented cells
  const totalCells = 24;
  const filledCells = Math.floor(progress * totalCells);

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
          <filter id="terminalGreenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient CRT Terminal Grid */}
        <g stroke="rgba(0, 255, 102, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`th-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`tv-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>
      </svg>

      {/* Main Terminal Interface Box */}
      <div
        style={{
          width: 2200,
          backgroundColor: "rgba(0, 15, 8, 0.9)",
          border: "3px solid #00FF66",
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(0, 255, 102, 0.25)",
          padding: "50px 60px",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${glitchOffset}px)`,
          position: "relative",
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid rgba(0, 255, 102, 0.3)",
            paddingBottom: 24,
            marginBottom: 36,
          }}
        >
          <div style={{ color: "#00FF66", fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>
            SYSTEM DATA BUFFER // TERMINAL_HEX_STREAM
          </div>
          <div style={{ color: "#00FF66", fontSize: 24, letterSpacing: 2 }}>
            STATUS: {percentage === 100 ? "BUFFER FULL" : "RECEIVING PACKETS"}
          </div>
        </div>

        {/* Hex Memory Addresses Stream */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(0, 255, 102, 0.6)",
            fontSize: 20,
            marginBottom: 28,
            letterSpacing: 2,
          }}
        >
          <span>MEM: 0x7FFF{(frame * 4).toString(16).toUpperCase()}</span>
          <span>CIPHER: SHA-256 / AES-GCM</span>
          <span>RATE: 1024 KB/S</span>
        </div>

        {/* Progress Percentage & Bar Container */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 16,
            }}
          >
            <span style={{ color: "#FFFFFF", fontSize: 26, fontWeight: 700 }}>
              DATA INGESTION
            </span>
            <span
              style={{
                color: "#00FF66",
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1,
                textShadow: "0 0 24px #00FF66",
              }}
            >
              {percentage}%
            </span>
          </div>

          {/* Segmented Cells Bar */}
          <div
            style={{
              display: "flex",
              gap: 12,
              height: 54,
              backgroundColor: "rgba(0, 40, 20, 0.6)",
              border: "2px solid rgba(0, 255, 102, 0.4)",
              borderRadius: 12,
              padding: 8,
              boxSizing: "border-box",
            }}
          >
            {Array.from({ length: totalCells }).map((_, i) => {
              const isFilled = i < filledCells;
              return (
                <div
                  key={`cell-${i}`}
                  style={{
                    flex: 1,
                    backgroundColor: isFilled ? "#00FF66" : "transparent",
                    borderRadius: 4,
                    boxShadow: isFilled ? "0 0 16px rgba(0, 255, 102, 0.8)" : "none",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Terminal Footer Console Logs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1.5px solid rgba(0, 255, 102, 0.2)",
            paddingTop: 20,
            marginTop: 20,
            color: "rgba(0, 255, 102, 0.7)",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>ROOT@HOST:~$ VERIFY_INTEGRITY --STRICT</span>
          <span>CHECKSUM: OK</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
