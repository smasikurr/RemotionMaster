import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const KineticSegmentedBatteryGlitchLoader4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // 10 Segmented Battery Cells
  const totalCells = 10;
  const activeCells = Math.floor(progress * totalCells);

  // Voltage glitch spike
  const isGlitch = (frame >= 85 && frame <= 98) || (frame >= 230 && frame <= 245) || (frame >= 370 && frame <= 385);
  const shakeX = isGlitch ? Math.sin(frame * 2.8) * 14 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barW = 2000;

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
          <filter id="batGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(255, 170, 0, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`bh-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`bv-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>
      </svg>

      {/* Main Battery Gauge Frame */}
      <div
        style={{
          width: barW,
          backgroundColor: "rgba(20, 15, 0, 0.85)",
          border: "2px solid #FFAA00",
          borderRadius: 20,
          boxShadow: "0 0 50px rgba(255, 170, 0, 0.3)",
          padding: "50px 60px",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 32,
            borderBottom: "2px solid rgba(255, 170, 0, 0.3)",
            paddingBottom: 22,
          }}
        >
          <div>
            <div style={{ color: "#FFAA00", fontSize: 28, fontWeight: 900, letterSpacing: 4 }}>
              KINETIC BATTERY CHARGE GAUGE
            </div>
            <div style={{ color: "#00F0FF", fontSize: 18, marginTop: 6, letterSpacing: 3 }}>
              HIGH-VOLTAGE ENERGY ACCUMULATOR
            </div>
          </div>
          <div
            style={{
              color: "#FFAA00",
              fontSize: 68,
              fontWeight: 900,
              textShadow: "0 0 24px #FFAA00",
            }}
          >
            {percent}%
          </div>
        </div>

        {/* 10 Battery Segmented Cells */}
        <div
          style={{
            display: "flex",
            gap: 16,
            height: 90,
            backgroundColor: "rgba(40, 25, 0, 0.7)",
            border: "2px solid #FFAA00",
            borderRadius: 16,
            padding: 10,
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {Array.from({ length: totalCells }).map((_, i) => {
            const isFilled = i < activeCells;
            const isLatest = i === activeCells - 1;
            const cellColor = i < 3 ? "#FF0055" : i < 7 ? "#FFAA00" : "#00FF66";

            return (
              <div
                key={`b-cell-${i}`}
                style={{
                  flex: 1,
                  backgroundColor: isFilled ? cellColor : "transparent",
                  borderRadius: 6,
                  boxShadow: isFilled ? `0 0 20px ${cellColor}` : "none",
                  border: isFilled ? "none" : "1px solid rgba(255, 170, 0, 0.2)",
                  opacity: isLatest ? 0.75 + Math.sin(frame * 0.4) * 0.25 : 1,
                }}
              />
            );
          })}
        </div>

        {/* Bottom Telemetry */}
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
          <span>VOLTAGE: {(380 + progress * 20).toFixed(1)} V</span>
          <span>CELL HEALTH: 100%</span>
          <span>THERMAL: 34.2 °C (OPTIMAL)</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
