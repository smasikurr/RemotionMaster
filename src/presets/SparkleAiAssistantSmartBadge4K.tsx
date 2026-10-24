import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const SparkleAiAssistantSmartBadge4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Badge Box Spring Pop Entrance (Frames 0 - 45)
  const boxSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.8 },
  });

  const boxScale = interpolate(boxSpring, [0, 1], [0.4, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boxOpacity = interpolate(boxSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. "AI" Typography Jumping Spring Entrance with Squash & Stretch (Frames 20 - 65)
  const aiSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.9 },
  });
  const aiY = interpolate(aiSpring, [0, 1], [-200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aiSquash = interpolate(
    frame - 20,
    [0, 14, 20, 28, 42],
    [1.0, 1.25, 0.72, 1.12, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const aiSquashX = interpolate(
    frame - 20,
    [0, 14, 20, 28, 42],
    [1.0, 0.82, 1.35, 0.92, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 3. Staggered Diamond Sparkle Stars Burst (Frames 40 - 90)
  const star1Spring = spring({ frame: frame - 35, fps, config: { damping: 9, stiffness: 200 } });
  const star2Spring = spring({ frame: frame - 50, fps, config: { damping: 9, stiffness: 200 } });
  const star3Spring = spring({ frame: frame - 65, fps, config: { damping: 9, stiffness: 200 } });

  // 4. Idle Living Hover & Shimmer
  const idleHover = Math.sin(frame * 0.08) * 12;
  const idleRot = Math.cos(frame * 0.05) * 2;
  const starSpin = (frame * 1.5) % 360;

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
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${idleHover}px) rotate(${idleRot}deg)`,
        }}
      >
        {/* Outer Minimalist Tech Box Frame */}
        <div
          style={{
            position: "relative",
            width: 500,
            height: 500,
            borderRadius: 80,
            border: "18px solid #FFFFFF",
            boxShadow:
              "0 0 50px rgba(255, 255, 255, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${boxScale})`,
            opacity: boxOpacity,
          }}
        >
          {/* Bold Centered "AI" Typography with Squash & Stretch */}
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 240,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 2,
              transform: `translateY(${aiY}px) scale(${aiSquashX}, ${aiSquash})`,
              transformOrigin: "bottom center",
              textShadow: "0 0 40px rgba(255, 255, 255, 0.8)",
            }}
          >
            AI
          </div>
        </div>

        {/* 4-Point Diamond Sparkle Star #1 (Top-Right Hero Sparkle) */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            transform: `scale(${interpolate(star1Spring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) rotate(${starSpin}deg)`,
            pointerEvents: "none",
          }}
        >
          <svg width="200" height="200" viewBox="-100 -100 200 200">
            <path
              d="M 0 -80 Q 0 0 80 0 Q 0 0 0 80 Q 0 0 -80 0 Q 0 0 0 -80 Z"
              fill="#FFFFFF"
              filter="drop-shadow(0 0 25px rgba(255, 255, 255, 0.9))"
            />
          </svg>
        </div>

        {/* Small Sparkle Star #2 (Top-Right Secondary) */}
        <div
          style={{
            position: "absolute",
            top: -110,
            right: 120,
            transform: `scale(${interpolate(star2Spring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) rotate(${-starSpin * 1.2}deg)`,
            pointerEvents: "none",
          }}
        >
          <svg width="100" height="100" viewBox="-50 -50 100 100">
            <path
              d="M 0 -40 Q 0 0 40 0 Q 0 0 0 40 Q 0 0 -40 0 Q 0 0 0 -40 Z"
              fill="#FFFFFF"
              filter="drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))"
            />
          </svg>
        </div>

        {/* Small Sparkle Star #3 (Bottom-Left Accent) */}
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: -50,
            transform: `scale(${interpolate(star3Spring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) rotate(${starSpin * 0.8}deg)`,
            pointerEvents: "none",
          }}
        >
          <svg width="120" height="120" viewBox="-60 -60 120 120">
            <path
              d="M 0 -50 Q 0 0 50 0 Q 0 0 0 50 Q 0 0 -50 0 Q 0 0 0 -50 Z"
              fill="#FFFFFF"
              filter="drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
