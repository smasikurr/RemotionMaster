import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const ComicStyleSpeechBalloonBounce4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Bouncy Spring Pop Entrance (Frames 0 - 45)
  const popSpring = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 180, mass: 0.8 },
  });
  const scale = interpolate(popSpring, [0, 1], [0.1, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Organic Hand-Drawn Wobble Boil
  const wobbleStep = Math.floor(frame / 4);
  const wobble1 = Math.sin(wobbleStep * 1.8) * 5;
  const wobble2 = Math.cos(wobbleStep * 2.3) * 6;

  // Idle floating
  const idleHover = Math.sin(frame * 0.08) * 12;

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
          transform: `translate(0px, ${idleHover}px) scale(${scale})`,
          transformOrigin: `${centerX - 150}px ${centerY + 260}px`,
        }}
      >
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Main Comic Speech Balloon Body */}
          <rect
            x={-500 + wobble1}
            y={-280 + wobble2}
            width="1000"
            height="560"
            rx="120"
            ry="120"
            fill="#FFFFFF"
          />

          {/* Comic Pointer Tail */}
          <polygon
            points={`
              ${-180 + wobble1},${260 + wobble2}
              ${-100 + wobble2},${260 + wobble1}
              ${-280 + wobble1},${440 + wobble2}
            `}
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
