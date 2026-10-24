import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const CinematicGoldenSunsetLightLeak4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 1. Light Leak Master Exposure Curve (Peak transition around frame 160-240)
  const exposure = interpolate(
    frame,
    [0, 60, 140, 200, 280, 385],
    [0.45, 0.75, 1.25, 1.45, 0.85, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Organic Breathing / Gate Shutter Jitter
  const shutterJitter = Math.sin(frame * 0.35) * 0.04 + Math.cos(frame * 0.17) * 0.03;
  const currentExposure = Math.max(0.2, exposure + shutterJitter);

  // 2. Primary Leak Coordinates Drift (Top-Right Sweeping Left)
  const leak1X = interpolate(frame, [0, 385], [width * 0.88, width * 0.55]);
  const leak1Y = interpolate(frame, [0, 385], [height * 0.15, height * 0.35]);
  const leak1Scale = interpolate(frame, [0, 180, 385], [1.0, 1.35, 0.95]);

  // Secondary Leak Coordinates Drift (Bottom-Left)
  const leak2X = interpolate(frame, [0, 385], [width * 0.12, width * 0.38]);
  const leak2Y = interpolate(frame, [0, 385], [height * 0.82, height * 0.65]);

  // 3. Anamorphic Horizontal Streak Flare
  const streakOpacity = interpolate(
    frame,
    [40, 140, 210, 320],
    [0.1, 0.85, 0.95, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const streakY = height * 0.42 + Math.sin(frame * 0.05) * 80;
  const streakWidth = interpolate(frame, [80, 200], [2800, 3840], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Optical Bokeh Discs (32 floating anamorphic discs)
  const bokehDiscs = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const baseX = ((i * 137.5) % 1) * width;
      const baseY = ((i * 93.7) % 1) * height;
      const radius = 60 + (i % 7) * 45;
      const speedX = ((i % 5) - 2) * 0.6;
      const speedY = -0.4 - (i % 4) * 0.5;
      const hue = i % 3 === 0 ? "rgba(255, 170, 50, " : i % 3 === 1 ? "rgba(255, 90, 20, " : "rgba(255, 230, 140, ";
      return { baseX, baseY, radius, speedX, speedY, hue, seed: i };
    });
  }, [width, height]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#0d0907",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Base Warm Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 65% 35%, #2a150c 0%, #080504 85%)",
          opacity: 0.9,
        }}
      />

      {/* SVG Optical Light Leak System */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          mixBlendMode: "screen",
        }}
      >
        <defs>
          {/* Primary Golden Sunset Radial Glow */}
          <radialGradient id="primaryLeak" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8e7" stopOpacity={0.95 * currentExposure} />
            <stop offset="25%" stopColor="#ffb300" stopOpacity={0.85 * currentExposure} />
            <stop offset="55%" stopColor="#ff5722" stopOpacity={0.65 * currentExposure} />
            <stop offset="85%" stopColor="#b71c1c" stopOpacity={0.3 * currentExposure} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </radialGradient>

          {/* Secondary Soft Amber Bloom */}
          <radialGradient id="secondaryLeak" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe082" stopOpacity={0.8 * currentExposure} />
            <stop offset="40%" stopColor="#ff9100" stopOpacity={0.55 * currentExposure} />
            <stop offset="75%" stopColor="#dd2c00" stopOpacity={0.25 * currentExposure} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </radialGradient>

          {/* Anamorphic Horizontal Streak Gradient */}
          <linearGradient id="anamorphicStreak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6d00" stopOpacity={0} />
            <stop offset="25%" stopColor="#ffa000" stopOpacity={0.4 * streakOpacity} />
            <stop offset="48%" stopColor="#ffffff" stopOpacity={0.95 * streakOpacity} />
            <stop offset="52%" stopColor="#ffffff" stopOpacity={0.95 * streakOpacity} />
            <stop offset="75%" stopColor="#ffa000" stopOpacity={0.4 * streakOpacity} />
            <stop offset="100%" stopColor="#ff6d00" stopOpacity={0} />
          </linearGradient>

          {/* Bokeh Disc Radial Gradient */}
          <radialGradient id="bokehGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.7} />
            <stop offset="70%" stopColor="#ffffff" stopOpacity={0.3} />
            <stop offset="90%" stopColor="#ffffff" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Primary Sunset Sun Leak (Top Right) */}
        <ellipse
          cx={leak1X}
          cy={leak1Y}
          rx={1600 * leak1Scale}
          ry={1350 * leak1Scale}
          fill="url(#primaryLeak)"
          transform={`rotate(-15 ${leak1X} ${leak1Y})`}
        />

        {/* Secondary Warm Underleak (Bottom Left) */}
        <ellipse
          cx={leak2X}
          cy={leak2Y}
          rx={1400}
          ry={1100}
          fill="url(#secondaryLeak)"
          transform={`rotate(25 ${leak2X} ${leak2Y})`}
        />

        {/* Optical Bokeh Discs floating in beam */}
        {bokehDiscs.map((b, idx) => {
          const curX = (b.baseX + frame * b.speedX * 1.5 + width) % width;
          const curY = (b.baseY + frame * b.speedY * 1.8 + height) % height;
          const discOpacity = interpolate(
            frame,
            [0, 50, 320, 385],
            [0.1, 0.45, 0.45, 0.1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <circle
              key={idx}
              cx={curX}
              cy={curY}
              r={b.radius}
              fill={`${b.hue}${discOpacity * currentExposure})`}
              stroke={`${b.hue}${discOpacity * 1.4})`}
              strokeWidth={2.5}
              style={{ filter: "blur(4px)" }}
            />
          );
        })}

        {/* Anamorphic Horizontal Lens Streak */}
        <rect
          x={(width - streakWidth) / 2}
          y={streakY - 45}
          width={streakWidth}
          height={90}
          fill="url(#anamorphicStreak)"
          style={{ filter: "blur(6px)" }}
        />
        <rect
          x={(width - streakWidth) / 2}
          y={streakY - 8}
          width={streakWidth}
          height={16}
          fill="url(#anamorphicStreak)"
        />
      </svg>

      {/* Global Warm Light Flash Overdrive */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ff9800",
          opacity: Math.max(0, (currentExposure - 1.0) * 0.28),
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
