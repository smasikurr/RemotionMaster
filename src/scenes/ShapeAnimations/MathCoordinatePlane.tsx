import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface MathCoordinatePlaneProps {
  functionTitle?: string;
  gridColor?: string;
  axisColor?: string;
  curveColor?: string;
  backgroundColor?: string;
}

export const MathCoordinatePlane: React.FC<MathCoordinatePlaneProps> = ({
  functionTitle = "f(x) = 2.4 · sin(2π · t + φ) · e^(-0.15t)",
  gridColor = "rgba(255, 255, 255, 0.08)",
  axisColor = "rgba(255, 255, 255, 0.65)",
  curveColor = "#00F0FF",
  backgroundColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Grid fade in with spring
  const gridIntro = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Curve drawing progress (0 to 1 across first 90 frames)
  const drawProgress = interpolate(frame, [15, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const originX = width / 2;
  const originY = height / 2;
  const gridStep = 80; // pixels per unit

  // Generate grid lines
  const vLines: number[] = [];
  for (let x = originX % gridStep; x < width; x += gridStep) {
    vLines.push(x);
  }

  const hLines: number[] = [];
  for (let y = originY % gridStep; y < height; y += gridStep) {
    hLines.push(y);
  }

  // Generate math curve points
  const points: { x: number; y: number }[] = [];
  const maxSamples = 240;
  const activeSamples = Math.floor(maxSamples * drawProgress);

  for (let i = 0; i <= activeSamples; i++) {
    const t = (i / maxSamples) * 12 - 6; // from -6 to +6 units
    // Damped harmonic oscillation function (Manim style)
    const wave = Math.sin(t * 1.6 - frame * 0.04) * 2.2 * Math.exp(-Math.abs(t) * 0.12);
    const px = originX + t * gridStep * 1.4;
    const py = originY - wave * gridStep * 1.4;
    points.push({ x: px, y: py });
  }

  const pathD =
    points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
      : "";

  // Head dot and tangent vector on latest point
  const head = points[points.length - 1];

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: gridIntro,
        }}
      >
        {/* Subdivided Grid Lines */}
        {vLines.map((vx, i) => (
          <line
            key={`v-${i}`}
            x1={vx}
            y1={0}
            x2={vx}
            y2={height}
            stroke={gridColor}
            strokeWidth={vx === originX ? 0 : 1.5}
          />
        ))}
        {hLines.map((hy, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={hy}
            x2={width}
            y2={hy}
            stroke={gridColor}
            strokeWidth={hy === originY ? 0 : 1.5}
          />
        ))}

        {/* X and Y Main Coordinate Axes */}
        <line
          x1={80}
          y1={originY}
          x2={width - 80}
          y2={originY}
          stroke={axisColor}
          strokeWidth={3}
        />
        <line
          x1={originX}
          y1={80}
          x2={originX}
          y2={height - 80}
          stroke={axisColor}
          strokeWidth={3}
        />

        {/* Axis Arrows */}
        <polygon
          points={`${width - 70},${originY} ${width - 86},${originY - 8} ${width - 86},${originY + 8}`}
          fill={axisColor}
        />
        <polygon
          points={`${originX},${70} ${originX - 8},${86} ${originX + 8},${86}`}
          fill={axisColor}
        />

        {/* Math Function Plot (Glow + Line) */}
        {pathD && (
          <>
            <path
              d={pathD}
              fill="none"
              stroke={curveColor}
              strokeWidth={14}
              strokeOpacity={0.25}
              strokeLinecap="round"
            />
            <path
              d={pathD}
              fill="none"
              stroke={curveColor}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Dynamic Leading Tracer Dot */}
        {head && (
          <g>
            <circle cx={head.x} cy={head.y} r={12} fill={curveColor} opacity={0.3} />
            <circle cx={head.x} cy={head.y} r={6} fill="#FFFFFF" />
          </g>
        )}
      </svg>

      {/* Math Formula Card Overlay */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 120,
          padding: "18px 28px",
          borderRadius: 16,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: curveColor, letterSpacing: "0.08em" }}>
          PARAMETRIC OSCILLATOR
        </span>
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#F8FAFC",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {functionTitle}
        </span>
      </div>
    </AbsoluteFill>
  );
};
