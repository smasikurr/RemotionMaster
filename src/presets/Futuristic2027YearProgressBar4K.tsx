import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const Futuristic2027YearProgressBar4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Duration: 600 frames (10.00 seconds @ 60 FPS)
  // Progress Bar Fills from Frame 60 to Frame 420 (6 seconds)
  const fillProgress = interpolate(frame, [60, 420], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const percentage = Math.floor(fillProgress * 100);

  // Year 2026 Opacity (1.0 down to 0.4)
  const year2026Op = interpolate(fillProgress, [0, 0.8], [1.0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Year 2027 Ignition (Spring Burst at 95%-100%)
  const year2027Burst = spring({
    frame: frame - 400,
    fps,
    config: { damping: 9, stiffness: 180, mass: 0.9 },
  });

  const year2027Scale = interpolate(year2027Burst, [0, 1], [0.95, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const year2027Glow = interpolate(year2027Burst, [0, 1], [0.3, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Idle Breathing & Micro-Pulse
  const pulseWave = Math.sin(frame * 0.1) * 6;
  const energySweep = (frame * 12) % 2400;

  // Master Loop Fade
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const totalSegments = 45;
  const activeSegments = Math.floor(fillProgress * totalSegments);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: masterFade,
      }}
    >
      {/* Background Volumetric Glow & Tech Ray Matrix */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Horizontal Grid Guides (Pure Solid Black Background) */}
        <g stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 22 }).map((_, i) => (
            <line
              key={`h-grid-${i}`}
              x1="0"
              y1={i * 100}
              x2={width}
              y2={i * 100}
              strokeDasharray="4 20"
            />
          ))}
        </g>
      </svg>

      {/* Main Center Console */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 70,
          transform: `translateY(${pulseWave}px)`,
        }}
      >
        {/* Top Header Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "10px 32px",
            backgroundColor: "rgba(10, 25, 45, 0.8)",
            border: "1.5px solid rgba(0, 229, 255, 0.5)",
            borderRadius: 8,
            boxShadow: "0 0 25px rgba(0, 229, 255, 0.25)",
            color: "#FFFFFF",
            fontFamily: "monospace",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 6,
          }}
        >
          <span>CHRONO TIMELINE STATUS // UPGRADING GLOBAL CYCLE</span>
        </div>

        {/* Year Transition Bar Row: [2026] =====[PROGESS]=====> [2027] */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
          }}
        >
          {/* Outgoing Year 2026 */}
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 140,
              fontWeight: 900,
              color: "#FFFFFF",
              opacity: year2026Op,
              letterSpacing: 4,
              textShadow: "0 10px 25px rgba(0, 0, 0, 0.9)",
            }}
          >
            2026
          </div>

          {/* Glowing Futuristic Progress Bar Housing */}
          <div
            style={{
              position: "relative",
              width: 1900,
              height: 100,
              backgroundColor: "rgba(10, 20, 30, 0.9)",
              borderRadius: 20,
              border: "3px solid #00E5FF",
              boxShadow: "0 0 40px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.2)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Segmented Glowing Blocks */}
            <div
              style={{
                display: "flex",
                gap: 12,
                width: "100%",
                height: "100%",
              }}
            >
              {Array.from({ length: totalSegments }).map((_, i) => {
                const isActive = i < activeSegments;
                const isLeading = i === activeSegments - 1;

                return (
                  <div
                    key={`seg-${i}`}
                    style={{
                      flex: 1,
                      height: "100%",
                      borderRadius: 6,
                      backgroundColor: isActive
                        ? isLeading
                          ? "#FFFFFF"
                          : "#00E5FF"
                        : "rgba(255, 255, 255, 0.04)",
                      boxShadow: isActive
                        ? isLeading
                          ? "0 0 25px #FFFFFF, 0 0 45px #00E5FF"
                          : "0 0 15px rgba(0, 229, 255, 0.8)"
                        : "none",
                      transition: "background-color 0.1s ease",
                    }}
                  />
                );
              })}
            </div>

            {/* Scanning Light Glint across Bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: energySweep - 400,
                width: 350,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
                transform: "skewX(-30deg)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Incoming Target Year 2027 (Explosive Neon Glow on Lock) */}
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 140,
              fontWeight: 900,
              color: year2027Glow > 0.8 ? "#00E5FF" : "#FFFFFF",
              letterSpacing: 4,
              transform: `scale(${year2027Scale})`,
              textShadow:
                year2027Glow > 0.8
                  ? "0 0 45px #00E5FF, 0 0 90px rgba(0, 229, 255, 0.6)"
                  : "0 10px 25px rgba(0, 0, 0, 0.9)",
              transition: "transform 0.1s ease-out, color 0.2s ease",
            }}
          >
            2027
          </div>
        </div>

        {/* Readout Sub-Display */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 50,
            fontFamily: "monospace",
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: 6,
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <div>
            LOADING NEXT YEAR:{" "}
            <span style={{ color: "#00E5FF", textShadow: "0 0 12px #00E5FF" }}>
              {percentage}%
            </span>
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.3)" }}>|</div>
          <div>STATUS: SYNCHRONIZING TIME VECTOR</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
