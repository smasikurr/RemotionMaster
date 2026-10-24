import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const AiNeuralMicrochipCircuitCore4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Processor Core Spring Entrance with Squash & Stretch Punch (Frames 0 - 50)
  const chipSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.9 },
  });

  const chipScale = interpolate(chipSpring, [0, 1], [0.3, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chipOpacity = interpolate(chipSpring, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Circuit Bus Tracks Draw Progress (Frames 30 to 220)
  const circuitProg = interpolate(frame, [30, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse & Electron Travel
  const electronOffset = (frame * 6) % 180;
  const idlePulse = Math.sin(frame * 0.1) * 6;

  // Master Fade Loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate 24 PCB Circuit Traces Radiating Outward
  const traces = [
    // Top Pins
    { x1: -180, y1: -220, x2: -180, y2: -360, x3: -280, y3: -460 },
    { x1: -100, y1: -220, x2: -100, y2: -420, x3: -100, y3: -520 },
    { x1: 0, y1: -220, x2: 0, y2: -480, x3: 0, y3: -550 },
    { x1: 100, y1: -220, x2: 100, y2: -420, x3: 100, y3: -520 },
    { x1: 180, y1: -220, x2: 180, y2: -360, x3: 280, y3: -460 },
    // Bottom Pins
    { x1: -180, y1: 220, x2: -180, y2: 360, x3: -280, y3: 460 },
    { x1: -100, y1: 220, x2: -100, y2: 420, x3: -100, y3: 520 },
    { x1: 0, y1: 220, x2: 0, y2: 480, x3: 0, y3: 550 },
    { x1: 100, y1: 220, x2: 100, y2: 420, x3: 100, y3: 520 },
    { x1: 180, y1: 220, x2: 180, y2: 360, x3: 280, y3: 460 },
    // Left Pins
    { x1: -220, y1: -140, x2: -360, y2: -140, x3: -480, y3: -220 },
    { x1: -220, y1: -50, x2: -420, y2: -50, x3: -520, y3: -50 },
    { x1: -220, y1: 50, x2: -420, y2: 50, x3: -520, y3: 50 },
    { x1: -220, y1: 140, x2: -360, y2: 140, x3: -480, y3: 220 },
    // Right Pins
    { x1: 220, y1: -140, x2: 360, y2: -140, x3: 480, y3: -220 },
    { x1: 220, y1: -50, x2: 420, y2: -50, x3: 520, y3: -50 },
    { x1: 220, y1: 50, x2: 420, y2: 50, x3: 520, y3: 50 },
    { x1: 220, y1: 140, x2: 360, y2: 140, x3: 480, y3: 220 },
  ];

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
        fontFamily: "sans-serif",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="circuitGreenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Radiating PCB Circuit Traces */}
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {traces.map((tr, i) => {
            const d = `M ${tr.x1} ${tr.y1} L ${tr.x2} ${tr.y2} L ${tr.x3} ${tr.y3}`;
            const len = 400;
            const dashOffset = len * (1 - circuitProg);

            return (
              <React.Fragment key={`trace-${i}`}>
                {/* Glow Underlay */}
                <path
                  d={d}
                  fill="none"
                  stroke="#00E676"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={dashOffset}
                  opacity="0.3"
                  filter="url(#circuitGreenGlow)"
                />
                {/* Crisp Sharp Circuit Line */}
                <path
                  d={d}
                  fill="none"
                  stroke="#00E676"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={dashOffset}
                  opacity="0.9"
                />
                {/* Terminal Connection Via Circle */}
                {circuitProg > 0.8 && (
                  <circle
                    cx={tr.x3}
                    cy={tr.y3}
                    r="8"
                    fill="#FFFFFF"
                    stroke="#00E676"
                    strokeWidth="3"
                    filter="drop-shadow(0 0 8px #00E676)"
                  />
                )}
              </React.Fragment>
            );
          })}
        </g>
      </svg>

      {/* Center Silicon Microchip Container */}
      <div
        style={{
          position: "relative",
          width: 440,
          height: 440,
          backgroundColor: "#05120B",
          borderRadius: 40,
          border: "6px solid #00E676",
          boxShadow:
            "0 0 60px rgba(0, 230, 118, 0.6), inset 0 0 35px rgba(0, 230, 118, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${chipScale}) translateY(${idlePulse}px)`,
          opacity: chipOpacity,
        }}
      >
        {/* Core "AI" Typography */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 4,
            textShadow: "0 0 30px #00E676, 0 0 60px rgba(0, 230, 118, 0.8)",
          }}
        >
          AI
        </div>
        {/* Micro-label */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 20,
            fontWeight: 800,
            color: "#00E676",
            letterSpacing: 6,
            marginTop: -10,
          }}
        >
          NEURAL CORE
        </div>
      </div>

      {/* Top Banner Callout */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 160,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: 4, color: "#FFFFFF" }}>
          NPU ACCELERATOR ARCHITECTURE
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 20, color: "#00E676", letterSpacing: 6 }}>
          QUANTUM NEURAL PROCESSING DIE // 128 TFLOPS COMPUTE
        </div>
      </div>
    </AbsoluteFill>
  );
};
