import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const WorldwideSatelliteLogisticsRoutes4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 580, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // World Port Nodes (Coordinates mapped across 3840x2160 viewport)
  const ports = useMemo(
    () => [
      { name: "SHANGHAI", x: 2680, y: 920, color: "#00E5FF" },
      { name: "SINGAPORE", x: 2520, y: 1220, color: "#00E676" },
      { name: "ROTTERDAM", x: 1840, y: 720, color: "#FFA800" },
      { name: "LOS ANGELES", x: 880, y: 880, color: "#FF007A" },
      { name: "DUBAI", x: 2180, y: 980, color: "#7C4DFF" },
      { name: "PANAMA CANAL", x: 1240, y: 1180, color: "#00E5FF" },
      { name: "SYDNEY", x: 2950, y: 1540, color: "#FFA800" },
      { name: "SANTOS", x: 1420, y: 1520, color: "#00E676" },
    ],
    []
  );

  // Curved Maritime Shipping Arcs connecting ports
  const shippingRoutes = useMemo(
    () => [
      // Shanghai -> Los Angeles (Transpacific Arc)
      {
        path: "M2680,920 Q1780,520 880,880",
        color: "#00E5FF",
        speed: 1.8,
      },
      // Los Angeles -> Panama -> Rotterdam (Panama / Transatlantic)
      {
        path: "M880,880 Q1060,1030 1240,1180 Q1540,950 1840,720",
        color: "#FFA800",
        speed: 1.5,
      },
      // Rotterdam -> Dubai -> Singapore (Suez Route)
      {
        path: "M1840,720 Q2010,850 2180,980 Q2350,1100 2520,1220",
        color: "#00E676",
        speed: 2.1,
      },
      // Singapore -> Shanghai (Asia Coastal Highway)
      {
        path: "M2520,1220 Q2600,1070 2680,920",
        color: "#7C4DFF",
        speed: 2.5,
      },
      // Singapore -> Sydney
      {
        path: "M2520,1220 Q2730,1380 2950,1540",
        color: "#00E5FF",
        speed: 1.6,
      },
      // Panama -> Santos
      {
        path: "M1240,1180 Q1330,1350 1420,1520",
        color: "#FF007A",
        speed: 1.7,
      },
    ],
    []
  );

  // Rotating Satellite Orbit Ring
  const satAngle = (frame * 0.7) % 360;

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
        fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
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
          <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global Lat/Long Grid Network Lines */}
        <g stroke="rgba(0, 229, 255, 0.06)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={`grid-lat-${i}`}
              x1="0"
              y1={i * 120}
              x2={width}
              y2={i * 120}
              strokeDasharray="4 24"
            />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line
              key={`grid-lon-${i}`}
              x1={i * 120}
              y1="0"
              x2={i * 120}
              y2={height}
              strokeDasharray="4 24"
            />
          ))}
        </g>

        {/* MARITIME SHIPPING ROUTES (CURVED ARCS) */}
        {shippingRoutes.map((route, idx) => (
          <g key={`route-${idx}`}>
            {/* Base Route Track */}
            <path
              d={route.path}
              fill="none"
              stroke={route.color}
              strokeWidth="2.5"
              strokeDasharray="8 8"
              opacity="0.35"
            />
            {/* Animated High-Velocity Pulse Train */}
            <path
              d={route.path}
              fill="none"
              stroke={route.color}
              strokeWidth="5"
              strokeDasharray="30 180"
              strokeDashoffset={-frame * route.speed * 4}
              filter="url(#routeGlow)"
            />
          </g>
        ))}

        {/* MAJOR SEAPORT HUBS & RADAR PULSES */}
        {ports.map((port, pIdx) => {
          const pulseR = ((frame + pIdx * 25) % 60) * 1.8 + 8;
          const pulseOp = interpolate(
            (frame + pIdx * 25) % 60,
            [0, 20, 60],
            [0.85, 0.4, 0]
          );

          return (
            <g key={`port-${pIdx}`} transform={`translate(${port.x}, ${port.y})`}>
              {/* Expanding Radar Pulse Ring */}
              <circle
                cx="0"
                cy="0"
                r={pulseR}
                fill="none"
                stroke={port.color}
                strokeWidth="2"
                opacity={pulseOp}
              />
              {/* Port Center Node */}
              <circle
                cx="0"
                cy="0"
                r="7"
                fill="#FFFFFF"
                stroke={port.color}
                strokeWidth="3"
                filter="url(#routeGlow)"
              />
              {/* Port Label */}
              <text
                x="14"
                y="5"
                fill="#FFFFFF"
                fontSize="16"
                fontWeight="700"
                letterSpacing="2"
                opacity="0.85"
              >
                {port.name}
              </text>
            </g>
          );
        })}

        {/* ORBITAL SATELLITE COMMUNICATIONS LINK */}
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {/* Orbit Ring */}
          <ellipse
            cx="0"
            cy="0"
            rx="1600"
            ry="750"
            fill="none"
            stroke="rgba(0, 229, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="16 16"
            transform="rotate(-15)"
          />
        </g>

        {/* HUD TELEMETRY PANELS */}
        {/* Top-Left Maritime Telemetry */}
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
            GLOBAL MARITIME LOGISTICS
          </text>
          <text x="24" y="74" fill="#FFFFFF" fontSize="22" fontWeight="700" letterSpacing="1.5">
            ACTIVE VESSELS: 1,842 IN TRANSIT
          </text>
          <text x="24" y="104" fill="#00E676" fontSize="18" fontWeight="600" letterSpacing="2">
            GLOBAL THROUGHPUT: 42.8M TEU
          </text>
          <text x="24" y="126" fill="rgba(255, 255, 255, 0.6)" fontSize="14" letterSpacing="1.5">
            LATENCY: REAL-TIME SAT TRACK
          </text>
        </g>

        {/* Top-Right Satellite Orbital Telemetry */}
        <g transform="translate(3200, 180)">
          <rect
            x="0"
            y="0"
            width="460"
            height="140"
            rx="12"
            fill="rgba(30, 20, 0, 0.7)"
            stroke="rgba(255, 168, 0, 0.4)"
            strokeWidth="2"
          />
          <text x="24" y="38" fill="#FFA800" fontSize="20" fontWeight="700" letterSpacing="3">
            SATELLITE CONSTELLATION
          </text>
          <text x="24" y="78" fill="#FFFFFF" fontSize="26" fontWeight="800" letterSpacing="2">
            LINK: SAT-9 (GEO)
          </text>
          <text x="24" y="112" fill="rgba(255, 255, 255, 0.7)" fontSize="16" fontWeight="600" letterSpacing="2">
            SIGNAL: CARRIER LOCKED
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
