import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const AiAgentWorkflowRoutingNetwork4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Workflow Node Positions
  const n1 = { x: 700, y: 1250, label: "INPUT AGENT", step: "01" };
  const n2 = { x: 1550, y: 850, label: "DECISION ROUTER", step: "02" };
  const n3 = { x: 2350, y: 1350, label: "TOOL EXECUTION", step: "03" };
  const n4 = { x: 3150, y: 950, label: "AGENT PAYOFF", step: "04" };

  // Spline Path Definition
  const pathData = `
    M 700 1250 
    C 1100 850, 1250 850, 1550 850 
    C 1900 850, 2050 1350, 2350 1350 
    C 2650 1350, 2850 950, 3150 950
  `;
  const totalLength = 2900;

  // Path Draw Progress (Frames 30 to 240)
  const drawProg = interpolate(frame, [30, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeDashoffset = totalLength * (1 - drawProg);

  // Traveling Data Pulse (Continuous Loop)
  const pulseLoop = ((frame - 60) % 150) / 150;

  // Staggered Spring Drop for 4 Node Cards
  const nodeSprings = [
    spring({ frame: frame - 20, fps, config: { damping: 11, stiffness: 150, mass: 0.8 } }),
    spring({ frame: frame - 80, fps, config: { damping: 11, stiffness: 150, mass: 0.8 } }),
    spring({ frame: frame - 140, fps, config: { damping: 11, stiffness: 150, mass: 0.8 } }),
    spring({ frame: frame - 200, fps, config: { damping: 11, stiffness: 150, mass: 0.8 } }),
  ];

  // Idle Living Hover
  const idleHover = Math.sin(frame * 0.08) * 8;

  // Master Fade Loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Pure solid black base, zero gradient
        width,
        height,
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
          <filter id="aiBlueGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Subtle Tech Grid */}
        <g stroke="rgba(41, 121, 255, 0.08)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`ag-h-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={`ag-v-${i}`} x1={i * 130} y1="0" x2={i * 130} y2={height} strokeDasharray="4 20" />
          ))}
        </g>

        {/* Glowing Workflow Route Path Underlay */}
        {drawProg > 0 && (
          <path
            d={pathData}
            fill="none"
            stroke="#2979FF"
            strokeWidth="16"
            strokeDasharray="24 16"
            strokeDashoffset={strokeDashoffset}
            pathLength={totalLength}
            opacity="0.3"
            filter="url(#aiBlueGlow)"
          />
        )}

        {/* Crisp White Primary Routing Spline */}
        {drawProg > 0 && (
          <path
            d={pathData}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeDasharray="20 14"
            strokeDashoffset={strokeDashoffset}
            pathLength={totalLength}
            opacity="0.95"
            filter="drop-shadow(0 0 10px #2979FF)"
          />
        )}
      </svg>

      {/* 4 Interactive Node Cards */}
      {[n1, n2, n3, n4].map((node, idx) => {
        const sVal = nodeSprings[idx];
        const scale = interpolate(sVal, [0, 1], [0.4, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = interpolate(sVal, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const yOffset = interpolate(sVal, [0, 1], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div
            key={`node-${idx}`}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              transform: `translate(-50%, -50%) translateY(${yOffset + idleHover}px) scale(${scale})`,
              opacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              pointerEvents: "none",
            }}
          >
            {/* Outer Circular Node Reticle */}
            <div
              style={{
                position: "relative",
                width: 130,
                height: 130,
                borderRadius: "50%",
                backgroundColor: "#0A101D",
                border: "4px solid #2979FF",
                boxShadow: "0 0 30px rgba(41, 121, 255, 0.6), inset 0 0 15px rgba(41, 121, 255, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Inner Glowing Core */}
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 0 20px #FFFFFF, 0 0 35px #2979FF",
                }}
              />
              {/* Step Badge */}
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  right: -16,
                  backgroundColor: "#2979FF",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 900,
                  boxShadow: "0 0 12px #2979FF",
                }}
              >
                {node.step}
              </div>
            </div>

            {/* Label Card */}
            <div
              style={{
                backgroundColor: "rgba(10, 20, 35, 0.9)",
                border: "1.5px solid rgba(41, 121, 255, 0.6)",
                borderRadius: 8,
                padding: "6px 20px",
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 2,
                boxShadow: "0 0 16px rgba(41, 121, 255, 0.3)",
                whiteSpace: "nowrap",
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}

      {/* Top Banner Tag */}
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
        <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: 4, color: "#FFFFFF" }}>
          AI AGENT WORKFLOW ROUTING
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 20, color: "#2979FF", letterSpacing: 6 }}>
          CAUSE ➔ REACTION ➔ PAYOFF ➔ RETURN // AUTONOMOUS AGENTIC PIPELINE
        </div>
      </div>
    </AbsoluteFill>
  );
};
