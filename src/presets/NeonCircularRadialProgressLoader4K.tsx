import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const NeonCircularRadialProgressLoader4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 45 to Frame 450
  const progress = interpolate(frame, [45, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const percentage = Math.floor(progress * 100);

  // Circle Dimensions
  const radius = 380;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Leading tracer angle
  const tracerAngle = progress * 360 - 90; // Start at top
  const tracerX = width / 2 + radius * Math.cos((tracerAngle * Math.PI) / 180);
  const tracerY = height / 2 + radius * Math.sin((tracerAngle * Math.PI) / 180);

  // Outer Reticle Continuous Rotation
  const reticleRot = (frame * 1.2) % 360;
  const innerReticleRot = (-frame * 0.8) % 360;

  // Completion Pulse Burst
  const isComplete = percentage === 100;
  const completeBurst = spring({
    frame: frame - 450,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.8 },
  });
  const completeScale = interpolate(completeBurst, [0, 1], [1.0, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Idle Pulse Breathing
  const idleBreathing = Math.sin(frame * 0.08) * 8;

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: masterFade,
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
          transform: `scale(${completeScale})`,
        }}
      >
        <defs>
          <filter id="neonLoaderGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Rotating Concentric HUD Ring */}
        <g
          transform={`translate(${width / 2}, ${height / 2}) rotate(${reticleRot})`}
          stroke="rgba(0, 229, 255, 0.25)"
          strokeWidth="3"
          fill="none"
        >
          <circle r={radius + 80} strokeDasharray="16 32" />
          <circle r={radius + 120} strokeWidth="1.5" strokeDasharray="4 16" />
        </g>

        {/* Inner Counter-Rotating Reticle */}
        <g
          transform={`translate(${width / 2}, ${height / 2}) rotate(${innerReticleRot})`}
          stroke="rgba(0, 229, 255, 0.2)"
          strokeWidth="2"
          fill="none"
        >
          <circle r={radius - 80} strokeDasharray="8 24" />
        </g>

        {/* Inactive Track Background Ring */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 229, 255, 0.15)"
          strokeWidth="28"
        />

        {/* Active Progress Glowing Arc Underlayer */}
        {progress > 0 && (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="38"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${width / 2} ${height / 2})`}
            opacity="0.4"
            filter="url(#neonLoaderGlow)"
          />
        )}

        {/* Sharp Crisp Active Progress Arc */}
        {progress > 0 && (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${width / 2} ${height / 2})`}
            filter="drop-shadow(0 0 12px rgba(0, 229, 255, 0.8))"
          />
        )}

        {/* Leading Tip Tracer Sparkle Dot */}
        {progress > 0 && progress < 1 && (
          <g transform={`translate(${tracerX}, ${tracerY})`}>
            <circle r="32" fill="#00E5FF" opacity="0.4" filter="url(#neonLoaderGlow)" />
            <circle r="16" fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* Center Numeric Counter & Status Typography */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${idleBreathing}px) scale(${completeScale})`,
        }}
      >
        {/* Large Percentage Readout */}
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: 160,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: -4,
            textShadow: "0 0 30px rgba(0, 229, 255, 0.8), 0 10px 25px rgba(0, 0, 0, 0.9)",
          }}
        >
          {percentage}%
        </div>

        {/* Sub-label */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 8,
            color: isComplete ? "#00E5FF" : "rgba(255, 255, 255, 0.6)",
            textTransform: "uppercase",
            textShadow: isComplete ? "0 0 15px #00E5FF" : "none",
            marginTop: -10,
          }}
        >
          {isComplete ? "INITIALIZATION COMPLETE" : "LOADING SYSTEM..."}
        </div>
      </div>
    </AbsoluteFill>
  );
};
