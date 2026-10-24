import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const CartoonIdeaThoughtCloudBurst4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Staggered Spring Pop for Cloud Bursts (Frames 0 - 55)
  const popSpring = spring({
    frame,
    fps,
    config: { damping: 8.5, stiffness: 190, mass: 0.8 },
  });
  const burstScale = interpolate(popSpring, [0, 1], [0.05, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hand-Drawn Wobble Boil
  const wobbleStep = Math.floor(frame / 4);
  const wobble1 = Math.sin(wobbleStep * 2.0) * 6;
  const wobble2 = Math.cos(wobbleStep * 2.7) * 7;

  // Idle hover
  const idleHover = Math.sin(frame * 0.08) * 12;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerX = width / 2;
  const centerY = height / 2 - 50;

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
          transform: `translate(0px, ${idleHover}px) scale(${burstScale})`,
          transformOrigin: `${centerX + 180}px ${centerY + 240}px`,
        }}
      >
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Cloud Outline Puffs */}
          <circle cx={-280 + wobble1} cy={-100} r="180" fill="#FFFFFF" />
          <circle cx={-140} cy={-240 + wobble2} r="190" fill="#FFFFFF" />
          <circle cx={100 + wobble2} cy={-250} r="200" fill="#FFFFFF" />
          <circle cx={300} cy={-120 + wobble1} r="185" fill="#FFFFFF" />
          <circle cx={320 + wobble1} cy={80} r="175" fill="#FFFFFF" />
          <circle cx={180} cy={200 + wobble2} r="190" fill="#FFFFFF" />
          <circle cx={-80 + wobble2} cy={210} r="180" fill="#FFFFFF" />
          <circle cx={-260} cy={100 + wobble1} r="175" fill="#FFFFFF" />

          {/* Central Body Fill */}
          <ellipse cx="0" cy="0" rx="340" ry="220" fill="#FFFFFF" />

          {/* Trailing Pointer Bubbles Leading to Bottom-Right */}
          <circle cx={200 + wobble1} cy="320" r="48" fill="#FFFFFF" />
          <circle cx={260 + wobble2} cy="410" r="32" fill="#FFFFFF" />
          <circle cx={310 + wobble1} cy="480" r="18" fill="#FFFFFF" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
