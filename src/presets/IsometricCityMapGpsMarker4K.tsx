import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const IsometricCityMapGpsMarker4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 580, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120, mass: 1 },
  });
  const mapScale = interpolate(enterSpring, [0, 1], [0.7, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating Pin idle hover
  const pinHover = Math.sin(frame * 0.08) * 16;
  const compassSpin = (frame * 0.8) % 360;

  // City Grid Blocks (Isometric transformed coordinate system)
  const blocks = useMemo(() => {
    const list = [];
    for (let x = -4; x <= 4; x++) {
      for (let y = -4; y <= 4; y++) {
        const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const rand = seed - Math.floor(seed);
        const bHeight = 40 + rand * 120; // 3D block extrusion
        const isTarget = x === 0 && y === 0;
        list.push({ x, y, bHeight, isTarget, rand });
      }
    }
    return list;
  }, []);

  // GPS Route Waypoint Animation (Moving traffic pulse along path)
  const routePulse = (frame * 0.03) % 1;

  const centerX = width / 2;
  const centerY = height / 2 + 80;

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
          <filter id="isoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ISOMETRIC CITY MAP PROJECTION */}
        <g
          transform={`translate(${centerX}, ${centerY}) scale(${mapScale})`}
          style={{ transformOrigin: "0 0" }}
        >
          {/* Main Isometric Container (Rotated 45 deg, scaled Y 0.55 for 2.5D Isometric slant) */}
          <g transform="rotate(45) scale(1, 0.58)">
            {/* Ground Grid Lines */}
            <g stroke="rgba(0, 229, 255, 0.12)" strokeWidth="2">
              {Array.from({ length: 19 }).map((_, i) => {
                const pos = (i - 9) * 160;
                return (
                  <React.Fragment key={`grid-${i}`}>
                    <line x1={pos} y1="-1440" x2={pos} y2="1440" />
                    <line x1="-1440" y1={pos} x2="1440" y2={pos} />
                  </React.Fragment>
                );
              })}
            </g>

            {/* City Blocks (Extruded vector buildings) */}
            {blocks.map((b, idx) => {
              if (b.isTarget) return null; // keep center clear for pin
              const bx = b.x * 160;
              const by = b.y * 160;
              const w = 110;
              const isAccent = b.rand > 0.7;
              return (
                <rect
                  key={`b-${idx}`}
                  x={bx - w / 2}
                  y={by - w / 2}
                  width={w}
                  height={w}
                  rx="6"
                  fill={isAccent ? "rgba(124, 77, 255, 0.25)" : "rgba(0, 229, 255, 0.08)"}
                  stroke={isAccent ? "#7C4DFF" : "rgba(0, 229, 255, 0.35)"}
                  strokeWidth="2"
                />
              );
            })}

            {/* Glowing GPS Navigation Route */}
            <path
              d="M-480,-480 L-160,-480 L-160,-160 L0,-160 L0,0 L320,0 L320,320"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="8"
              strokeDasharray="24 12"
              strokeDashoffset={-frame * 3}
              filter="url(#isoGlow)"
            />

            {/* Active GPS Waypoint Pulses along route */}
            <circle cx="-480" cy="-480" r="16" fill="#FFA800" filter="url(#isoGlow)" />
            <circle cx="-160" cy="-160" r="16" fill="#00E5FF" filter="url(#isoGlow)" />
            <circle cx="320" cy="320" r="16" fill="#00E676" filter="url(#isoGlow)" />
          </g>

          {/* TARGET ISOMETRIC PIN & COMPASS BASE (In unrotated space above map center) */}
          <g transform="translate(0, -30)">
            {/* Ground Radar Pulse Ring */}
            <ellipse
              cx="0"
              cy="30"
              rx="180"
              ry="75"
              fill="rgba(0, 229, 255, 0.15)"
              stroke="#00E5FF"
              strokeWidth="3"
              filter="url(#isoGlow)"
            />
            {/* Rotating Compass Tick Marks */}
            <g transform={`rotate(${compassSpin})`}>
              <ellipse
                cx="0"
                cy="0"
                rx="140"
                ry="60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                strokeDasharray="12 10"
              />
            </g>

            {/* Floating 3D GPS Marker Pin */}
            <g transform={`translate(0, ${-120 + pinHover})`}>
              {/* Pin Shadow */}
              <ellipse
                cx="0"
                cy="140"
                rx={60 - pinHover * 0.8}
                ry={22 - pinHover * 0.3}
                fill="rgba(0, 0, 0, 0.7)"
              />
              {/* Pin Vector Body */}
              <path
                d="M0,70 C-35,10 -80,-50 -80,-110 C-80,-165 -45,-205 0,-205 C45,-205 80,-165 80,-110 C80,-50 35,10 0,70 Z"
                fill="#FF0055"
                stroke="#FFFFFF"
                strokeWidth="5"
                filter="url(#isoGlow)"
              />
              {/* Pin Head Inner Core */}
              <circle
                cx="0"
                cy="-110"
                r="36"
                fill="#FFFFFF"
                stroke="#050505"
                strokeWidth="5"
              />
              {/* Center Nav Dot */}
              <circle
                cx="0"
                cy="-110"
                r="14"
                fill="#00E5FF"
                filter="url(#isoGlow)"
              />
            </g>
          </g>
        </g>

        {/* TELEMETRY HUD PANELS */}
        {/* Top-Left GPS Navigation Route Details */}
        <g transform="translate(180, 180)">
          <rect
            x="0"
            y="0"
            width="480"
            height="150"
            rx="12"
            fill="rgba(0, 20, 35, 0.7)"
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="2"
          />
          <text x="24" y="38" fill="#00E5FF" fontSize="20" fontWeight="700" letterSpacing="3">
            ISOMETRIC GPS NAVIGATION
          </text>
          <text x="24" y="74" fill="#FFFFFF" fontSize="22" fontWeight="700" letterSpacing="1.5">
            CITY ROUTE: SECTOR 7G
          </text>
          <text x="24" y="104" fill="#FFFFFF" fontSize="22" fontWeight="700" letterSpacing="1.5">
            DESTINATION: METROPOLIS TOWER
          </text>
          <text x="24" y="132" fill="#00E676" fontSize="16" fontWeight="600" letterSpacing="2">
            DISTANCE: 1.42 KM | ETA: 02:45 MIN
          </text>
        </g>

        {/* Top-Right Waypoint Satellite Telemetry */}
        <g transform="translate(3180, 180)">
          <rect
            x="0"
            y="0"
            width="480"
            height="150"
            rx="12"
            fill="rgba(20, 0, 35, 0.7)"
            stroke="rgba(124, 77, 255, 0.4)"
            strokeWidth="2"
          />
          <text x="24" y="38" fill="#7C4DFF" fontSize="20" fontWeight="700" letterSpacing="3">
            WAYPOINT RADAR LINK
          </text>
          <text x="24" y="78" fill="#FFFFFF" fontSize="26" fontWeight="800" letterSpacing="2">
            CONNECTED (12 SATS)
          </text>
          <text x="24" y="112" fill="rgba(255, 255, 255, 0.7)" fontSize="16" fontWeight="600" letterSpacing="2">
            ELEVATION: +48.5m MSL
          </text>
          <text x="24" y="134" fill="#FFA800" fontSize="16" fontWeight="600" letterSpacing="2">
            HDOP: 0.8 (EXCELLENT)
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
