import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const PlayfulHandDrawnThoughtBubble4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Bouncy Spring Pop Entrance (Frames 0 - 45)
  const popSpring = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 180, mass: 0.8 },
  });
  const bubbleScale = interpolate(popSpring, [0, 1], [0.1, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Organic Hand-Drawn 2-Frame Wobble Boiler (simulating classic hand-drawn 12fps animation)
  const wobbleStep = Math.floor(frame / 4);
  const wobble1 = Math.sin(wobbleStep * 1.5) * 6;
  const wobble2 = Math.cos(wobbleStep * 2.1) * 8;

  // Idle organic breathing
  const idleHover = Math.sin(frame * 0.08) * 12;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerX = width / 2;
  const centerY = height / 2 - 60;

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
          transform: `translate(0px, ${idleHover}px) scale(${bubbleScale})`,
          transformOrigin: `${centerX}px ${centerY + 250}px`,
        }}
      >
        {/* Main Organic Cloud Thought Bubble Body */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Cloud Puffs */}
          <circle cx={-240 + wobble1} cy={-60} r="160" fill="#FFFFFF" />
          <circle cx={-120} cy={-180 + wobble2} r="180" fill="#FFFFFF" />
          <circle cx={140 + wobble2} cy={-170} r="175" fill="#FFFFFF" />
          <circle cx={260} cy={-40 + wobble1} r="165" fill="#FFFFFF" />
          <circle cx={180 + wobble1} cy={100} r="160" fill="#FFFFFF" />
          <circle cx={-60} cy={140 + wobble2} r="170" fill="#FFFFFF" />
          <circle cx={-200 + wobble2} cy={80} r="150" fill="#FFFFFF" />
          {/* Center Fill Core */}
          <ellipse cx="0" cy="0" rx="260" ry="170" fill="#FFFFFF" />
        </g>

        {/* Trailing Small Thought Dots Leading Downward */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          <circle
            cx={-180 + wobble1}
            cy="280"
            r="44"
            fill="#FFFFFF"
          />
          <circle
            cx={-230 + wobble2}
            cy="360"
            r="28"
            fill="#FFFFFF"
          />
          <circle
            cx={-270 + wobble1}
            cy="420"
            r="16"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
