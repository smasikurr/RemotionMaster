import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const FuturisticTimeTravelCalendarClockTunnel4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 600;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 580, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerX = width / 2;
  const centerY = height / 2;

  // 16 Warp Speed Light Streaks radiating from vanishing point
  const warpStreaks = useMemo(() => {
    const list = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 1.2 + (i % 3) * 0.4;
      list.push({ angle, speed, id: i });
    }
    return list;
  }, []);

  // Flying Temporal Calendar Years & Dates rushing from z=0 (center) to z=1 (past camera)
  const temporalDates = useMemo(() => {
    const sampleDates = [
      "2027.01.01", "12:00:00", "2027.02.14", "06:30:15",
      "2027.03.21", "18:45:00", "2027.04.10", "09:12:44",
      "2027.05.01", "21:00:00", "2027.06.24", "03:15:20",
      "2027.07.04", "15:30:00", "2027.08.15", "11:22:33",
      "2027.09.21", "23:59:59", "2027.10.31", "08:08:08",
      "2027.11.11", "17:17:17", "2027.12.31", "00:00:00",
    ];
    return sampleDates.map((text, idx) => {
      const angle = (idx * 37) % 360;
      return { text, angle, offset: idx / sampleDates.length };
    });
  }, []);

  // Temporal Vortex Concentric Rings (Rushing forward)
  const tunnelRings = [0, 1, 2, 3, 4, 5, 6, 7].map((ringIdx) => {
    const ringProgress = ((frame * 0.05 + ringIdx * 0.125) % 1);
    // Exponential scale expansion for 3D depth illusion
    const scale = Math.pow(ringProgress, 2.8) * 1600 + 40;
    const opacity = interpolate(ringProgress, [0, 0.2, 0.7, 1], [0, 0.9, 0.6, 0]);
    const twist = (frame * 0.8 + ringIdx * 25) % 360;
    return { scale, opacity, twist };
  });

  // Rapidly cycling Year in Core HUD
  const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];
  const currentYear = years[Math.floor((frame / 85) % years.length)];

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
        fontFamily: "Inter, 'Courier New', monospace, sans-serif",
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
        }}
      >
        <defs>
          <filter id="tunnelGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 3D WARP SPEED LIGHT STREAKS */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {warpStreaks.map((s) => {
            const streakLen = 400 + Math.sin(frame * 0.1 + s.id) * 200;
            const rStart = 120;
            const rEnd = rStart + streakLen;
            const cos = Math.cos(s.angle);
            const sin = Math.sin(s.angle);
            return (
              <line
                key={`streak-${s.id}`}
                x1={cos * rStart}
                y1={sin * rStart}
                x2={cos * rEnd}
                y2={sin * rEnd}
                stroke={s.id % 2 === 0 ? "#00E5FF" : "#FF007A"}
                strokeWidth={2 + (s.id % 3)}
                opacity="0.65"
                filter="url(#tunnelGlow)"
              />
            );
          })}

          {/* CONCENTRIC TEMPORAL VORTEX RINGS */}
          {tunnelRings.map((ring, rIdx) => (
            <g key={`ring-${rIdx}`} transform={`rotate(${ring.twist})`}>
              <ellipse
                cx="0"
                cy="0"
                rx={ring.scale}
                ry={ring.scale * 0.65}
                fill="none"
                stroke={rIdx % 2 === 0 ? "#00E5FF" : "#7C4DFF"}
                strokeWidth={3}
                opacity={ring.opacity}
                filter="url(#tunnelGlow)"
              />
            </g>
          ))}

          {/* FLYING TEMPORAL CALENDAR DATES & TIME VALUES */}
          {temporalDates.map((item, dIdx) => {
            const progress = ((frame * 0.04 + item.offset) % 1);
            const dist = Math.pow(progress, 2.5) * 1500;
            const rad = (item.angle * Math.PI) / 180;
            const x = Math.cos(rad) * dist;
            const y = Math.sin(rad) * (dist * 0.65);
            const scale = interpolate(progress, [0, 1], [0.3, 2.8]);
            const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.9, 0.8, 0]);

            return (
              <text
                key={`tdate-${dIdx}`}
                x={x}
                y={y}
                fill={dIdx % 2 === 0 ? "#00E5FF" : "#FFFFFF"}
                fontSize={24 * scale}
                fontWeight="800"
                letterSpacing="4"
                textAnchor="middle"
                opacity={opacity}
                filter="url(#tunnelGlow)"
              >
                {item.text}
              </text>
            );
          })}

          {/* CENTER VANISHING POINT CHRONO CORE */}
          <circle cx="0" cy="0" r="110" fill="rgba(0, 20, 40, 0.85)" stroke="#00E5FF" strokeWidth="4" filter="url(#tunnelGlow)" />
          <text
            x="0"
            y="-10"
            fill="#00E5FF"
            fontSize="18"
            fontWeight="700"
            letterSpacing="3"
            textAnchor="middle"
          >
            CHRONO WARP
          </text>
          <text
            x="0"
            y="30"
            fill="#FFFFFF"
            fontSize="38"
            fontWeight="900"
            letterSpacing="3"
            textAnchor="middle"
            filter="url(#tunnelGlow)"
          >
            {currentYear}
          </text>
        </g>

        {/* HUD TELEMETRY OVERLAYS */}
        {/* Top-Left Temporal Warp Status */}
        <g transform="translate(180, 180)">
          <rect
            x="0"
            y="0"
            width="460"
            height="140"
            rx="12"
            fill="rgba(0, 20, 35, 0.7)"
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="2"
          />
          <text x="24" y="38" fill="#00E5FF" fontSize="20" fontWeight="700" letterSpacing="3">
            TEMPORAL TUNNEL VELOCITY
          </text>
          <text x="24" y="74" fill="#FFFFFF" fontSize="26" fontWeight="800" letterSpacing="2">
            WARP FACTOR: 9.87 C
          </text>
          <text x="24" y="104" fill="#00E676" fontSize="18" fontWeight="600" letterSpacing="2">
            TIME FLUX: CONTINUOUS CFR 60
          </text>
          <text x="24" y="126" fill="rgba(255, 255, 255, 0.6)" fontSize="14" letterSpacing="1.5">
            DILATION: SEAMLESS LOOP
          </text>
        </g>

        {/* Top-Right Chrono Vector Telemetry */}
        <g transform="translate(3200, 180)">
          <rect
            x="0"
            y="0"
            width="460"
            height="140"
            rx="12"
            fill="rgba(25, 0, 35, 0.7)"
            stroke="rgba(124, 77, 255, 0.4)"
            strokeWidth="2"
          />
          <text x="24" y="38" fill="#7C4DFF" fontSize="20" fontWeight="700" letterSpacing="3">
            CHRONOMETER DISPLACEMENT
          </text>
          <text x="24" y="78" fill="#FFFFFF" fontSize="26" fontWeight="800" letterSpacing="2">
            T-VECTOR LOCKED
          </text>
          <text x="24" y="112" fill="rgba(255, 255, 255, 0.7)" fontSize="16" fontWeight="600" letterSpacing="2">
            CONVERGENCE: 2027 ANCHOR
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
