import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const CurvedGlobalFlightRouteRadarConnection4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Duration: 600 frames (10.00 seconds @ 60 FPS)
  const p1 = { x: 750, y: 1350 };
  const p2 = { x: 3050, y: 820 };

  // 1. Origin Blue Pin Entrance & Bouncy Squash-Stretch (Frames 0 - 50)
  const pin1Spring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.8 },
  });

  const pin1YOffset = interpolate(pin1Spring, [0, 1], [-750, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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

  // 2. Destination Pin Entrance & Bouncy Squash-Stretch (Frames 240 - 290)
  const pin2Spring = spring({
    frame: frame - 240,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.8 },
  });

  const pin2YOffset = interpolate(pin2Spring, [0, 1], [-750, 0], {
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
  const idleHover1 = Math.sin(frame * 0.08) * 8;
  const idleTilt1 = Math.cos(frame * 0.05) * 3;
  const idleHover2 = Math.sin(frame * 0.08 + 2.0) * 8;
  const idleTilt2 = Math.cos(frame * 0.05 + 2.0) * -3;

  // 4. Smooth S-Curve Flight Path Definition (Cubic Bézier)
  const pathData = `
    M 750 1350 
    C 1350 850, 1600 1650, 2200 1150 
    C 2550 850, 2750 720, 3050 820
  `;
  const totalLength = 3200;

  // Flight Route Drawing Progress (Frames 45 to 240)
  const drawProgress = interpolate(frame, [45, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeDashoffset = totalLength * (1 - drawProgress);

  // Continuous radar sweep angle
  const radarAngle1 = (frame * 3.5) % 360;
  const radarAngle2 = (frame * 3.5 + 180) % 360;

  // Multi-sample spline evaluation for traveling plane icon & angle
  const splinePoints = useMemo(() => {
    const pts: { x: number; y: number; angle: number }[] = [];
    const samples = 200;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      let x = 0;
      let y = 0;
      if (t <= 0.5) {
        const u = t / 0.5;
        const p0 = { x: 750, y: 1350 };
        const p1c = { x: 1350, y: 850 };
        const p2c = { x: 1600, y: 1650 };
        const p3 = { x: 2200, y: 1150 };
        x = (1 - u) ** 3 * p0.x + 3 * (1 - u) ** 2 * u * p1c.x + 3 * (1 - u) * u ** 2 * p2c.x + u ** 3 * p3.x;
        y = (1 - u) ** 3 * p0.y + 3 * (1 - u) ** 2 * u * p1c.y + 3 * (1 - u) * u ** 2 * p2c.y + u ** 3 * p3.y;
      } else {
        const u = (t - 0.5) / 0.5;
        const p0 = { x: 2200, y: 1150 };
        const p1c = { x: 2550, y: 850 };
        const p2c = { x: 2750, y: 720 };
        const p3 = { x: 3050, y: 820 };
        x = (1 - u) ** 3 * p0.x + 3 * (1 - u) ** 2 * u * p1c.x + 3 * (1 - u) * u ** 2 * p2c.x + u ** 3 * p3.x;
        y = (1 - u) ** 3 * p0.y + 3 * (1 - u) ** 2 * u * p1c.y + 3 * (1 - u) * u ** 2 * p2c.y + u ** 3 * p3.y;
      }
      pts.push({ x, y, angle: 0 });
    }
    // Calculate tangent angles
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i + 1].x - pts[i].x;
      const dy = pts[i + 1].y - pts[i].y;
      pts[i].angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    }
    pts[pts.length - 1].angle = pts[pts.length - 2].angle;
    return pts;
  }, []);

  const planeIdx = Math.min(splinePoints.length - 1, Math.floor(drawProgress * (splinePoints.length - 1)));
  const planeData = splinePoints[planeIdx] || { x: p1.x, y: p1.y, angle: 0 };

  // Loop Master Fade
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
          <radialGradient id="blueGlow1" cx="20%" cy="65%" r="40%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blueGlow2" cx="80%" cy="38%" r="40%">
            <stop offset="0%" stopColor="#2979FF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="neonBlueGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={width} height={height} fill="url(#blueGlow1)" />
        <rect width={width} height={height} fill="url(#blueGlow2)" />

        {/* Global Longitude / Latitude Arc Grid Overlay */}
        <g stroke="rgba(0, 229, 255, 0.08)" strokeWidth="1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={`lat-${i}`}
              cx={width / 2}
              cy={height / 2 + 100}
              rx={1800 - i * 140}
              ry={900 - i * 70}
              fill="none"
              strokeDasharray="6 20"
            />
          ))}
        </g>

        {/* Radar Rotating Scanner Line - Origin */}
        <g transform={`translate(${p1.x}, ${p1.y + 10})`}>
          <circle r="160" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="2" strokeDasharray="4 8" />
          <circle r="260" fill="none" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1.5" />
          <line
            x1="0"
            y1="0"
            x2={260 * Math.cos((radarAngle1 * Math.PI) / 180)}
            y2={260 * Math.sin((radarAngle1 * Math.PI) / 180)}
            stroke="#00E5FF"
            strokeWidth="2.5"
            opacity="0.6"
            filter="url(#neonBlueGlow)"
          />
        </g>

        {/* Radar Rotating Scanner Line - Destination */}
        {frame > 240 && (
          <g transform={`translate(${p2.x}, ${p2.y + 10})`}>
            <circle r="160" fill="none" stroke="rgba(41, 121, 255, 0.2)" strokeWidth="2" strokeDasharray="4 8" />
            <circle r="260" fill="none" stroke="rgba(41, 121, 255, 0.15)" strokeWidth="1.5" />
            <line
              x1="0"
              y1="0"
              x2={260 * Math.cos((radarAngle2 * Math.PI) / 180)}
              y2={260 * Math.sin((radarAngle2 * Math.PI) / 180)}
              stroke="#2979FF"
              strokeWidth="2.5"
              opacity="0.6"
              filter="url(#neonBlueGlow)"
            />
          </g>
        )}

        {/* Outer Glow Route Underlay */}
        {drawProgress > 0 && (
          <path
            d={pathData}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="36 24"
            strokeDashoffset={strokeDashoffset}
            pathLength={totalLength}
            opacity="0.3"
            filter="url(#neonBlueGlow)"
          />
        )}

        {/* Sharp White Crisp Dashed Flight Route Line */}
        {drawProgress > 0 && (
          <path
            d={pathData}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="28 18"
            strokeDashoffset={strokeDashoffset}
            pathLength={totalLength}
            opacity="0.95"
            filter="drop-shadow(0 0 10px rgba(0, 229, 255, 0.8))"
          />
        )}

        {/* Traveling Jet Airplane Silhouette leading the route */}
        {drawProgress > 0 && drawProgress < 1 && (
          <g transform={`translate(${planeData.x}, ${planeData.y}) rotate(${planeData.angle})`}>
            {/* Plane Aura Glow */}
            <circle r="40" fill="#00E5FF" opacity="0.3" filter="url(#neonBlueGlow)" />
            {/* Sleek Jet Icon */}
            <path
              d="M 28 0 L -18 -20 L -8 -6 L -24 -6 L -30 -14 L -36 -14 L -32 0 L -36 14 L -30 14 L -24 6 L -8 6 L -18 20 Z"
              fill="#FFFFFF"
              filter="drop-shadow(0 0 8px #00E5FF)"
            />
          </g>
        )}

        {/* Ground Touch Anchor Dots */}
        <circle cx={p1.x} cy={p1.y + 8} r="12" fill="#00E5FF" filter="drop-shadow(0 0 12px #00E5FF)" />
        {frame > 240 && (
          <circle cx={p2.x} cy={p2.y + 8} r="12" fill="#00E5FF" filter="drop-shadow(0 0 12px #00E5FF)" />
        )}
      </svg>

      {/* 5. Origin Electric Blue Pin (DEP AIRPORT) */}
      <div
        style={{
          position: "absolute",
          left: p1.x,
          top: p1.y,
          transform: `translate(-50%, -100%) translateY(${pin1YOffset + idleHover1}px) rotate(${idleTilt1}deg) scale(${pin1SquashX}, ${pin1Squash})`,
          transformOrigin: "bottom center",
          filter: "drop-shadow(0 20px 30px rgba(0, 229, 255, 0.6))",
          pointerEvents: "none",
        }}
      >
        <svg width="180" height="240" viewBox="0 0 120 160">
          <defs>
            <linearGradient id="bluePin1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#0091EA" />
              <stop offset="100%" stopColor="#01579B" />
            </linearGradient>
          </defs>
          <path
            d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z"
            fill="url(#bluePin1)"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <circle cx="60" cy="62" r="26" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
          <circle cx="60" cy="62" r="14" fill="#00E5FF" filter="drop-shadow(0 0 8px #00E5FF)" />
        </svg>

        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(10, 20, 35, 0.9)",
            border: "2px solid #00E5FF",
            borderRadius: 8,
            padding: "4px 18px",
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            boxShadow: "0 0 18px rgba(0, 229, 255, 0.4)",
            whiteSpace: "nowrap",
          }}
        >
          ORIGIN: JFK
        </div>
      </div>

      {/* 6. Destination Blue Pin (ARR AIRPORT) */}
      {frame >= 240 && (
        <div
          style={{
            position: "absolute",
            left: p2.x,
            top: p2.y,
            transform: `translate(-50%, -100%) translateY(${pin2YOffset + idleHover2}px) rotate(${idleTilt2}deg) scale(${pin2SquashX}, ${pin2Squash})`,
            transformOrigin: "bottom center",
            filter: "drop-shadow(0 20px 30px rgba(41, 121, 255, 0.6))",
            pointerEvents: "none",
          }}
        >
          <svg width="180" height="240" viewBox="0 0 120 160">
            <defs>
              <linearGradient id="bluePin2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#448AFF" />
                <stop offset="50%" stopColor="#2979FF" />
                <stop offset="100%" stopColor="#1565C0" />
              </linearGradient>
            </defs>
            <path
              d="M 60 10 C 28 10, 8 32, 8 64 C 8 98, 52 144, 60 152 C 68 144, 112 98, 112 64 C 112 32, 92 10, 60 10 Z"
              fill="url(#bluePin2)"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
            <circle cx="60" cy="62" r="26" fill="#000000" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="62" r="14" fill="#448AFF" filter="drop-shadow(0 0 8px #448AFF)" />
          </svg>

          <div
            style={{
              position: "absolute",
              top: -30,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(10, 20, 35, 0.9)",
              border: "2px solid #2979FF",
              borderRadius: 8,
              padding: "4px 18px",
              color: "#FFFFFF",
              fontFamily: "sans-serif",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2,
              boxShadow: "0 0 18px rgba(41, 121, 255, 0.4)",
              whiteSpace: "nowrap",
            }}
          >
            DEST: LHR
          </div>
        </div>
      )}

      {/* Flight Telemetry HUD Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 120,
          display: "flex",
          gap: 40,
          fontFamily: "monospace",
          fontSize: 20,
          color: "rgba(0, 229, 255, 0.5)",
          letterSpacing: 3,
        }}
      >
        <div>FLIGHT: BA-178</div>
        <div>ALTITUDE: 38,000 FT</div>
        <div>AIRSPEED: 540 KTS</div>
        <div>STATUS: ON SCHEDULE</div>
      </div>
    </AbsoluteFill>
  );
};
