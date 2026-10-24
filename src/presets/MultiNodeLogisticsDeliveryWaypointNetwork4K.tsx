import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const MultiNodeLogisticsDeliveryWaypointNetwork4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Central Logistics Hub (Origin)
  const hub = { x: 1200, y: 1100 };

  // 3 Multi-Node Destination Waypoints
  const destA = { x: 2900, y: 550 };  // Express North-East
  const destB = { x: 3150, y: 1350 }; // Metro Central
  const destC = { x: 2750, y: 1850 }; // South District

  // 1. Central Hub Pin Drop & Bounce (Frames 0 - 45)
  const hubSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.8 },
  });
  const hubYOffset = interpolate(hubSpring, [0, 1], [-750, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hubSquash = interpolate(
    frame,
    [0, 14, 20, 28, 42],
    [1.0, 1.25, 0.72, 1.12, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const hubSquashX = interpolate(
    frame,
    [0, 14, 20, 28, 42],
    [1.0, 0.82, 1.35, 0.92, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Staggered Destination Pins (A: 200-245, B: 230-275, C: 260-305)
  const destASpring = spring({
    frame: frame - 200,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.8 },
  });
  const destAYOffset = interpolate(destASpring, [0, 1], [-650, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const destASquash = interpolate(frame - 200, [0, 14, 20, 28, 42], [1.0, 1.25, 0.72, 1.12, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const destASquashX = interpolate(frame - 200, [0, 14, 20, 28, 42], [1.0, 0.82, 1.35, 0.92, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const destBSpring = spring({
    frame: frame - 230,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.8 },
  });
  const destBYOffset = interpolate(destBSpring, [0, 1], [-650, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const destBSquash = interpolate(frame - 230, [0, 14, 20, 28, 42], [1.0, 1.25, 0.72, 1.12, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const destBSquashX = interpolate(frame - 230, [0, 14, 20, 28, 42], [1.0, 0.82, 1.35, 0.92, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const destCSpring = spring({
    frame: frame - 260,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.8 },
  });
  const destCYOffset = interpolate(destCSpring, [0, 1], [-650, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const destCSquash = interpolate(frame - 260, [0, 14, 20, 28, 42], [1.0, 1.25, 0.72, 1.12, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const destCSquashX = interpolate(frame - 260, [0, 14, 20, 28, 42], [1.0, 0.82, 1.35, 0.92, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 3. Curved Bézier Delivery Paths
  const pathA = `M ${hub.x} ${hub.y} C 1600 650, 2200 450, ${destA.x} ${destA.y}`;
  const pathB = `M ${hub.x} ${hub.y} C 1800 1000, 2400 1200, ${destB.x} ${destB.y}`;
  const pathC = `M ${hub.x} ${hub.y} C 1600 1550, 2100 1950, ${destC.x} ${destC.y}`;

  const lenA = 2400;
  const lenB = 2200;
  const lenC = 2300;

  // Staggered Path Progress
  const drawProgA = interpolate(frame, [40, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawProgB = interpolate(frame, [60, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawProgC = interpolate(frame, [80, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Master Loop Fade
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
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="amberGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global Hexagonal Grid Background (Pure Solid Black Base, No Gradient) */}
        <g stroke="rgba(255, 214, 0, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`gh-${i}`} x1="0" y1={i * 130} x2={width} y2={i * 130} strokeDasharray="6 24" />
          ))}
          {Array.from({ length: 28 }).map((_, i) => (
            <line key={`gv-${i}`} x1={i * 140} y1="0" x2={i * 140} y2={height} strokeDasharray="6 24" />
          ))}
        </g>

        {/* Central Hub Ripple Radiation Waves */}
        {frame > 20 &&
          [0, 1, 2].map((ring) => {
            const prog = ((frame - 20 + ring * 35) % 105) / 105;
            const r = prog * 280;
            const op = (1 - prog) * 0.7;
            return (
              <ellipse
                key={`hub-ring-${ring}`}
                cx={hub.x}
                cy={hub.y + 10}
                rx={r}
                ry={r * 0.45}
                fill="none"
                stroke="#FFD600"
                strokeWidth="3.5"
                opacity={op}
              />
            );
          })}

        {/* 3 Branching Delivery Dashed Lines (Underglow) */}
        {drawProgA > 0 && (
          <path d={pathA} fill="none" stroke="#FFD600" strokeWidth="14" strokeDasharray="32 20" strokeDashoffset={lenA * (1 - drawProgA)} pathLength={lenA} opacity="0.3" filter="url(#amberGlowFilter)" />
        )}
        {drawProgB > 0 && (
          <path d={pathB} fill="none" stroke="#FF9100" strokeWidth="14" strokeDasharray="32 20" strokeDashoffset={lenB * (1 - drawProgB)} pathLength={lenB} opacity="0.3" filter="url(#amberGlowFilter)" />
        )}
        {drawProgC > 0 && (
          <path d={pathC} fill="none" stroke="#FF3D00" strokeWidth="14" strokeDasharray="32 20" strokeDashoffset={lenC * (1 - drawProgC)} pathLength={lenC} opacity="0.3" filter="url(#amberGlowFilter)" />
        )}

        {/* 3 Sharp Crisp White Dashed Delivery Lines */}
        {drawProgA > 0 && (
          <path d={pathA} fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="28 16" strokeDashoffset={lenA * (1 - drawProgA)} pathLength={lenA} opacity="0.95" filter="drop-shadow(0 0 10px #FFD600)" />
        )}
        {drawProgB > 0 && (
          <path d={pathB} fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="28 16" strokeDashoffset={lenB * (1 - drawProgB)} pathLength={lenB} opacity="0.95" filter="drop-shadow(0 0 10px #FF9100)" />
        )}
        {drawProgC > 0 && (
          <path d={pathC} fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="28 16" strokeDashoffset={lenC * (1 - drawProgC)} pathLength={lenC} opacity="0.95" filter="drop-shadow(0 0 10px #FF3D00)" />
        )}

        {/* Ground Touch Dots */}
        <circle cx={hub.x} cy={hub.y + 8} r="14" fill="#FFD600" filter="drop-shadow(0 0 12px #FFD600)" />
        {frame > 200 && <circle cx={destA.x} cy={destA.y + 8} r="12" fill="#FFFFFF" filter="drop-shadow(0 0 10px #FFFFFF)" />}
        {frame > 230 && <circle cx={destB.x} cy={destB.y + 8} r="12" fill="#FFFFFF" filter="drop-shadow(0 0 10px #FFFFFF)" />}
        {frame > 260 && <circle cx={destC.x} cy={destC.y + 8} r="12" fill="#FFFFFF" filter="drop-shadow(0 0 10px #FFFFFF)" />}
      </svg>

      {/* 4. Central Logistics Hub Pin (Solar Gold) */}
      <div
        style={{
          position: "absolute",
          left: hub.x,
          top: hub.y,
          transform: `translate(-50%, -100%) translateY(${hubYOffset}px) scale(${hubSquashX}, ${hubSquash})`,
          transformOrigin: "bottom center",
          filter: "drop-shadow(0 20px 30px rgba(255, 214, 0, 0.6))",
          pointerEvents: "none",
        }}
      >
        <svg width="200" height="260" viewBox="0 0 120 160">
          <defs>
            <linearGradient id="hubPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFEE58" />
              <stop offset="50%" stopColor="#FFD600" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
          </defs>
          <path
            d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z"
            fill="url(#hubPinGrad)"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <circle cx="60" cy="62" r="26" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
          <circle cx="60" cy="62" r="14" fill="#FFD600" filter="drop-shadow(0 0 8px #FFD600)" />
        </svg>

        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(25, 20, 5, 0.9)",
            border: "2px solid #FFD600",
            borderRadius: 8,
            padding: "4px 18px",
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: "0 0 18px rgba(255, 214, 0, 0.4)",
            whiteSpace: "nowrap",
          }}
        >
          CENTRAL HUB
        </div>
      </div>

      {/* 5. Destination Waypoint Pins (A, B, C) */}
      {frame >= 200 && (
        <div
          style={{
            position: "absolute",
            left: destA.x,
            top: destA.y,
            transform: `translate(-50%, -100%) translateY(${destAYOffset}px) scale(${destASquashX}, ${destASquash})`,
            transformOrigin: "bottom center",
            filter: "drop-shadow(0 20px 30px rgba(0, 229, 255, 0.6))",
            pointerEvents: "none",
          }}
        >
          <svg width="150" height="200" viewBox="0 0 120 160">
            <path d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="24" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="12" fill="#00E5FF" />
          </svg>
          <div style={{ position: "absolute", top: -25, left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", border: "1.5px solid #00E5FF", borderRadius: 6, padding: "2px 12px", color: "#FFF", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
            NODE 01
          </div>
        </div>
      )}

      {frame >= 230 && (
        <div
          style={{
            position: "absolute",
            left: destB.x,
            top: destB.y,
            transform: `translate(-50%, -100%) translateY(${destBYOffset}px) scale(${destBSquashX}, ${destBSquash})`,
            transformOrigin: "bottom center",
            filter: "drop-shadow(0 20px 30px rgba(255, 61, 0, 0.6))",
            pointerEvents: "none",
          }}
        >
          <svg width="150" height="200" viewBox="0 0 120 160">
            <path d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z" fill="#FF3D00" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="24" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="12" fill="#FF3D00" />
          </svg>
          <div style={{ position: "absolute", top: -25, left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", border: "1.5px solid #FF3D00", borderRadius: 6, padding: "2px 12px", color: "#FFF", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
            NODE 02
          </div>
        </div>
      )}

      {frame >= 260 && (
        <div
          style={{
            position: "absolute",
            left: destC.x,
            top: destC.y,
            transform: `translate(-50%, -100%) translateY(${destCYOffset}px) scale(${destCSquashX}, ${destCSquash})`,
            transformOrigin: "bottom center",
            filter: "drop-shadow(0 20px 30px rgba(118, 255, 3, 0.6))",
            pointerEvents: "none",
          }}
        >
          <svg width="150" height="200" viewBox="0 0 120 160">
            <path d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z" fill="#76FF03" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="24" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="12" fill="#76FF03" />
          </svg>
          <div style={{ position: "absolute", top: -25, left: "50%", transform: "translateX(-50%)", backgroundColor: "#000", border: "1.5px solid #76FF03", borderRadius: 6, padding: "2px 12px", color: "#FFF", fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
            NODE 03
          </div>
        </div>
      )}

      {/* Bottom Logistics Telemetry Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 120,
          display: "flex",
          gap: 40,
          fontFamily: "monospace",
          fontSize: 20,
          color: "rgba(255, 214, 0, 0.6)",
          letterSpacing: 3,
        }}
      >
        <div>NETWORK: SMART LOGISTICS GRID</div>
        <div>ACTIVE DISPATCHES: 3 NODES</div>
        <div>FLEET EFFICIENCY: 99.4%</div>
      </div>
    </AbsoluteFill>
  );
};
