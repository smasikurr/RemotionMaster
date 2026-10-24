import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const GlobalDualLocationPointConnectionRoute4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Duration: 600 frames (10.00 seconds @ 60 FPS)
  // Pin Coordinates
  const p1 = { x: 720, y: 1480 };
  const p2 = { x: 3120, y: 780 };

  // 1. Origin Pin Entrance & Spring Squash-Stretch (Frames 0 - 50)
  const pin1Spring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.8 },
  });

  const pin1YOffset = interpolate(pin1Spring, [0, 1], [-800, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Squash and stretch during bounce
  const pin1Squash = interpolate(
    frame,
    [0, 14, 20, 28, 42],
    [1.0, 1.25, 0.72, 1.12, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pin1SquashX = interpolate(
    frame,
    [0, 14, 20, 28, 42],
    [1.0, 0.82, 1.35, 0.92, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Destination Pin Entrance & Spring Squash-Stretch (Frames 240 - 290)
  const pin2Spring = spring({
    frame: frame - 240,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.8 },
  });

  const pin2YOffset = interpolate(pin2Spring, [0, 1], [-800, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pin2Squash = interpolate(
    frame - 240,
    [0, 14, 20, 28, 42],
    [1.0, 1.25, 0.72, 1.12, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pin2SquashX = interpolate(
    frame - 240,
    [0, 14, 20, 28, 42],
    [1.0, 0.82, 1.35, 0.92, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 3. Living Idle Floating Breathing
  const idleHover1 = Math.sin(frame * 0.08) * 10;
  const idleTilt1 = Math.cos(frame * 0.06) * 3;
  const idleHover2 = Math.sin(frame * 0.08 + 1.5) * 10;
  const idleTilt2 = Math.cos(frame * 0.06 + 1.5) * -3;

  // 4. Spline Path Geometry Definition (Cubic Bézier Multi-Segment)
  // Segment 1: from P1 to Midpoint loop peak
  // Segment 2: Loop-the-loop circle
  // Segment 3: From loop exit to Destination P2
  const pathData = `
    M 720 1480 
    C 1150 1150, 1650 750, 1820 1080 
    C 1980 1420, 1500 1680, 1420 1200 
    C 1340 760, 2250 560, 3120 780
  `;

  // Approximate path length for SVG stroke dash animation ~ 3800px
  const totalLength = 4100;

  // Path drawing progress (Frames 45 to 260)
  const drawProgress = interpolate(frame, [45, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const strokeDashoffset = totalLength * (1 - drawProgress);

  // Cubic bezier evaluation helper for tracer head and data packets
  const bezierPoints = useMemo(() => {
    // Sample points along path for tracer calculation
    const pts: { x: number; y: number }[] = [];
    const samples = 200;

    // Segment 1 (t in [0, 0.35])
    // Segment 2 (t in [0.35, 0.70])
    // Segment 3 (t in [0.70, 1.0])
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      let x = 0;
      let y = 0;
      if (t <= 0.35) {
        const u = t / 0.35;
        const p0 = { x: 720, y: 1480 };
        const p1c = { x: 1150, y: 1150 };
        const p2c = { x: 1650, y: 750 };
        const p3 = { x: 1820, y: 1080 };
        x = (1 - u) ** 3 * p0.x + 3 * (1 - u) ** 2 * u * p1c.x + 3 * (1 - u) * u ** 2 * p2c.x + u ** 3 * p3.x;
        y = (1 - u) ** 3 * p0.y + 3 * (1 - u) ** 2 * u * p1c.y + 3 * (1 - u) * u ** 2 * p2c.y + u ** 3 * p3.y;
      } else if (t <= 0.70) {
        const u = (t - 0.35) / 0.35;
        const p0 = { x: 1820, y: 1080 };
        const p1c = { x: 1980, y: 1420 };
        const p2c = { x: 1500, y: 1680 };
        const p3 = { x: 1420, y: 1200 };
        x = (1 - u) ** 3 * p0.x + 3 * (1 - u) ** 2 * u * p1c.x + 3 * (1 - u) * u ** 2 * p2c.x + u ** 3 * p3.x;
        y = (1 - u) ** 3 * p0.y + 3 * (1 - u) ** 2 * u * p1c.y + 3 * (1 - u) * u ** 2 * p2c.y + u ** 3 * p3.y;
      } else {
        const u = (t - 0.70) / 0.30;
        const p0 = { x: 1420, y: 1200 };
        const p1c = { x: 1340, y: 760 };
        const p2c = { x: 2250, y: 560 };
        const p3 = { x: 3120, y: 780 };
        x = (1 - u) ** 3 * p0.x + 3 * (1 - u) ** 2 * u * p1c.x + 3 * (1 - u) * u ** 2 * p2c.x + u ** 3 * p3.x;
        y = (1 - u) ** 3 * p0.y + 3 * (1 - u) ** 2 * u * p1c.y + 3 * (1 - u) * u ** 2 * p2c.y + u ** 3 * p3.y;
      }
      pts.push({ x, y });
    }
    return pts;
  }, []);

  // Tracer current position
  const tracerIdx = Math.min(
    bezierPoints.length - 1,
    Math.floor(drawProgress * (bezierPoints.length - 1))
  );
  const tracerPos = bezierPoints[tracerIdx] || { x: p1.x, y: p1.y };

  // 5. Data Packet Pulses after connection is established (Frames 270 - 520)
  const packet1T = ((frame - 270) % 90) / 90;
  const packet1Idx = Math.floor(packet1T * (bezierPoints.length - 1));
  const packet1Pos = bezierPoints[packet1Idx] || { x: p1.x, y: p1.y };

  const packet2T = 1 - ((frame - 315) % 110) / 110;
  const packet2Idx = Math.max(0, Math.min(bezierPoints.length - 1, Math.floor(packet2T * (bezierPoints.length - 1))));
  const packet2Pos = bezierPoints[packet2Idx] || { x: p2.x, y: p2.y };

  // 6. Seamless Loop Fade & Retract Transition (Frames 520 - 600)
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        width,
        height,
        overflow: "hidden",
        opacity: masterFade,
      }}
    >
      {/* Background Soft Atmospheric Ambient Grid & Horizon Lines */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          <radialGradient id="bgGlow1" cx="20%" cy="70%" r="45%">
            <stop offset="0%" stopColor="#FF1744" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bgGlow2" cx="80%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#FF3D00" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="18" />
            <feOffset dx="0" dy="24" result="offsetblur" />
            <feFlood floodColor="rgba(255, 23, 68, 0.6)" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Radial Lighting */}
        <rect width={width} height={height} fill="url(#bgGlow1)" />
        <rect width={width} height={height} fill="url(#bgGlow2)" />

        {/* Subtle Tech Coordinates Grid Overlay */}
        <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 150}
              x2={width}
              y2={i * 150}
              strokeDasharray="4 24"
            />
          ))}
          {Array.from({ length: 25 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 160}
              y1="0"
              x2={i * 160}
              y2={height}
              strokeDasharray="4 24"
            />
          ))}
        </g>

        {/* Ground Radar Beacon Waves - Origin Pin (P1) */}
        {frame > 20 &&
          [0, 1, 2].map((ring) => {
            const ringProgress = ((frame - 20 + ring * 35) % 105) / 105;
            const r = ringProgress * 220;
            const op = (1 - ringProgress) * 0.7;
            return (
              <ellipse
                key={`p1-ring-${ring}`}
                cx={p1.x}
                cy={p1.y + 10}
                rx={r}
                ry={r * 0.45}
                fill="none"
                stroke="#FF1744"
                strokeWidth="3.5"
                opacity={op}
              />
            );
          })}

        {/* Ground Radar Beacon Waves - Destination Pin (P2) */}
        {frame > 260 &&
          [0, 1, 2].map((ring) => {
            const ringProgress = ((frame - 260 + ring * 35) % 105) / 105;
            const r = ringProgress * 220;
            const op = (1 - ringProgress) * 0.7;
            return (
              <ellipse
                key={`p2-ring-${ring}`}
                cx={p2.x}
                cy={p2.y + 10}
                rx={r}
                ry={r * 0.45}
                fill="none"
                stroke="#FF3D00"
                strokeWidth="3.5"
                opacity={op}
              />
            );
          })}

        {/* Under-Glow Layer for Dashed Route Line */}
        {drawProgress > 0 && (
          <path
            d={pathData}
            fill="none"
            stroke="#FF1744"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="36 24"
            strokeDashoffset={strokeDashoffset}
            pathLength={totalLength}
            opacity="0.25"
            filter="url(#glowFilter)"
          />
        )}

        {/* Primary Sharp Crisp Dashed Route Line */}
        {drawProgress > 0 && (
          <path
            d={pathData}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="32 20"
            strokeDashoffset={strokeDashoffset}
            pathLength={totalLength}
            opacity="0.95"
            filter="drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))"
          />
        )}

        {/* Dynamic Energy Tracer Head (Moving Spark) during drawing */}
        {drawProgress > 0 && drawProgress < 1 && (
          <g transform={`translate(${tracerPos.x}, ${tracerPos.y})`}>
            <circle r="36" fill="#FF1744" opacity="0.35" filter="url(#glowFilter)" />
            <circle r="18" fill="#FF5252" opacity="0.8" />
            <circle r="8" fill="#FFFFFF" />
            {/* Crosshair accents on tracer head */}
            <line x1="-24" y1="0" x2="24" y2="0" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />
            <line x1="0" y1="-24" x2="0" y2="24" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />
          </g>
        )}

        {/* Data Packet Traversal (Bidirectional high-tech packets) */}
        {frame >= 270 && (
          <>
            <g transform={`translate(${packet1Pos.x}, ${packet1Pos.y})`}>
              <circle r="22" fill="#FF1744" opacity="0.4" filter="url(#glowFilter)" />
              <circle r="10" fill="#FFFFFF" />
            </g>
            <g transform={`translate(${packet2Pos.x}, ${packet2Pos.y})`}>
              <circle r="22" fill="#FF9100" opacity="0.4" filter="url(#glowFilter)" />
              <circle r="10" fill="#FFFFFF" />
            </g>
          </>
        )}

        {/* Ground Touch Anchor Dots */}
        <circle cx={p1.x} cy={p1.y + 8} r="12" fill="#FFFFFF" filter="drop-shadow(0 0 12px #FFFFFF)" />
        {frame > 250 && (
          <circle cx={p2.x} cy={p2.y + 8} r="12" fill="#FFFFFF" filter="drop-shadow(0 0 12px #FFFFFF)" />
        )}
      </svg>

      {/* 7. Origin Location Pin (Vibrant Crimson Red with Jumping Squash-and-Stretch) */}
      <div
        style={{
          position: "absolute",
          left: p1.x,
          top: p1.y,
          transform: `translate(-50%, -100%) translateY(${pin1YOffset + idleHover1}px) rotate(${idleTilt1}deg) scale(${pin1SquashX}, ${pin1Squash})`,
          transformOrigin: "bottom center",
          filter: "drop-shadow(0 20px 30px rgba(255, 23, 68, 0.6))",
          pointerEvents: "none",
        }}
      >
        <svg width="180" height="240" viewBox="0 0 120 160">
          <defs>
            <linearGradient id="pinGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5252" />
              <stop offset="60%" stopColor="#D50000" />
              <stop offset="100%" stopColor="#9B0000" />
            </linearGradient>
            <linearGradient id="pinInnerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Main Pin Teardrop Shape */}
          <path
            d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z"
            fill="url(#pinGrad1)"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          {/* Specular 3D Highlight Arch */}
          <path
            d="M 60 16 C 34 16, 18 34, 18 60 C 18 70, 24 82, 34 94 C 28 80, 26 68, 26 58 C 26 38, 40 22, 60 22 C 72 22, 82 28, 88 36 C 82 24, 72 16, 60 16 Z"
            fill="url(#pinInnerGlow)"
          />
          {/* Center Circular Hole */}
          <circle cx="60" cy="62" r="26" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
          <circle cx="60" cy="62" r="14" fill="#FFFFFF" filter="drop-shadow(0 0 8px #FFFFFF)" />
        </svg>

        {/* Dynamic Telemetry Badge (A-Point) */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(20, 20, 20, 0.85)",
            border: "2px solid #FF1744",
            borderRadius: 8,
            padding: "4px 18px",
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: "0 0 18px rgba(255, 23, 68, 0.4)",
            whiteSpace: "nowrap",
          }}
        >
          POINT A
        </div>
      </div>

      {/* 8. Destination Location Pin (Vibrant Coral Red/Orange with Jumping Squash-and-Stretch) */}
      {frame >= 240 && (
        <div
          style={{
            position: "absolute",
            left: p2.x,
            top: p2.y,
            transform: `translate(-50%, -100%) translateY(${pin2YOffset + idleHover2}px) rotate(${idleTilt2}deg) scale(${pin2SquashX}, ${pin2Squash})`,
            transformOrigin: "bottom center",
            filter: "drop-shadow(0 20px 30px rgba(255, 61, 0, 0.6))",
            pointerEvents: "none",
          }}
        >
          <svg width="180" height="240" viewBox="0 0 120 160">
            <defs>
              <linearGradient id="pinGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6E40" />
                <stop offset="60%" stopColor="#FF3D00" />
                <stop offset="100%" stopColor="#BF2600" />
              </linearGradient>
            </defs>
            {/* Main Pin Teardrop Shape */}
            <path
              d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z"
              fill="url(#pinGrad2)"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
            {/* Specular 3D Highlight Arch */}
            <path
              d="M 60 16 C 34 16, 18 34, 18 60 C 18 70, 24 82, 34 94 C 28 80, 26 68, 26 58 C 26 38, 40 22, 60 22 C 72 22, 82 28, 88 36 C 82 24, 72 16, 60 16 Z"
              fill="url(#pinInnerGlow)"
            />
            {/* Center Circular Hole */}
            <circle cx="60" cy="62" r="26" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="14" fill="#FFFFFF" filter="drop-shadow(0 0 8px #FFFFFF)" />
          </svg>

          {/* Dynamic Telemetry Badge (B-Point) */}
          <div
            style={{
              position: "absolute",
              top: -30,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(20, 20, 20, 0.85)",
              border: "2px solid #FF3D00",
              borderRadius: 8,
              padding: "4px 18px",
              color: "#FFFFFF",
              fontFamily: "sans-serif",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2,
              boxShadow: "0 0 18px rgba(255, 61, 0, 0.4)",
              whiteSpace: "nowrap",
            }}
          >
            POINT B
          </div>
        </div>
      )}

      {/* Floating Micro-Telemetry HUD Details */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 120,
          display: "flex",
          gap: 40,
          fontFamily: "monospace",
          fontSize: 20,
          color: "rgba(255, 255, 255, 0.4)",
          letterSpacing: 3,
        }}
      >
        <div>GPS: 40.7128° N, 74.0060° W</div>
        <div>ROUTE DISTANCE: 3,480 KM</div>
        <div>CONNECTION: ACTIVE</div>
      </div>
    </AbsoluteFill>
  );
};
