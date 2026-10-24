import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const February2027DailyTearOffCalendar4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Entrance spring (Frames 0 - 50)
  const popSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.9 },
  });
  const calScale = interpolate(popSpring, [0, 1], [0.4, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const calOpacity = interpolate(popSpring, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Daily Flip Sequence across 28 days of February 2027
  // Day counter increments every 18 frames
  const dayNumber = Math.min(28, Math.floor(interpolate(frame, [45, 480], [1, 28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

  // Current page flip flip angle
  const flipCycle = ((frame - 45) % 18) / 18;
  const flipAngle = frame >= 45 && frame < 480
    ? interpolate(flipCycle, [0, 0.4, 1], [0, -85, 0])
    : 0;

  // Weekdays for Feb 2027 (Feb 1 was Monday)
  const weekdays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const currentWeekday = weekdays[(dayNumber - 1) % 7];

  // Idle floating
  const idleHover = Math.sin(frame * 0.08) * 10;

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
          <filter id="calShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="24" stdDeviation="30" floodColor="rgba(0, 229, 255, 0.25)" />
          </filter>
          <filter id="neonCalGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`ag-h-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`ag-v-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>
      </svg>

      {/* Main 3D Desk Calendar Block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${idleHover}px) scale(${calScale})`,
          opacity: calOpacity,
        }}
      >
        {/* Calendar Spiral Binder Rings */}
        <div style={{ display: "flex", gap: 80, marginBottom: -25, zIndex: 10 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`ring-${i}`}
              style={{
                width: 24,
                height: 60,
                backgroundColor: "#2979FF",
                borderRadius: 12,
                boxShadow: "0 0 16px rgba(41, 121, 255, 0.8)",
                border: "2px solid #FFFFFF",
              }}
            />
          ))}
        </div>

        {/* Calendar Card Body */}
        <div
          style={{
            width: 1100,
            height: 1250,
            backgroundColor: "#0D1117",
            borderRadius: 36,
            border: "3px solid rgba(0, 229, 255, 0.4)",
            boxShadow: "0 30px 100px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              height: 240,
              backgroundColor: "#161B22",
              borderBottom: "3px solid rgba(0, 229, 255, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 70px",
            }}
          >
            <div>
              <div style={{ color: "#00E5FF", fontSize: 32, fontWeight: 800, letterSpacing: 4 }}>
                FEBRUARY 2027
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 22, marginTop: 6, letterSpacing: 2 }}>
                ANNUAL EXECUTIVE PLANNER
              </div>
            </div>
            <div
              style={{
                backgroundColor: "rgba(0, 229, 255, 0.15)",
                color: "#00E5FF",
                padding: "10px 24px",
                borderRadius: 12,
                fontSize: 24,
                fontWeight: 700,
                border: "1px solid rgba(0, 229, 255, 0.4)",
              }}
            >
              28 DAYS
            </div>
          </div>

          {/* Central Flip Date Display */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transformOrigin: "top center",
              transform: `perspective(1000px) rotateX(${flipAngle}deg)`,
            }}
          >
            <div
              style={{
                color: "#FFFFFF",
                fontSize: 340,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: -10,
                textShadow: "0 0 60px rgba(0, 229, 255, 0.4)",
              }}
            >
              {dayNumber < 10 ? `0${dayNumber}` : dayNumber}
            </div>

            <div
              style={{
                color: "#00E5FF",
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: 10,
                marginTop: 20,
              }}
            >
              {currentWeekday}
            </div>
          </div>

          {/* Bottom Month Mini-Bar */}
          <div
            style={{
              height: 140,
              backgroundColor: "#161B22",
              borderTop: "2px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 60px",
            }}
          >
            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 22, letterSpacing: 2 }}>
              PROGRESS
            </div>
            {/* Progress dots for 28 days */}
            <div style={{ display: "flex", gap: 14 }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={`dot-${i}`}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: i + 1 <= dayNumber ? "#00E5FF" : "rgba(255, 255, 255, 0.15)",
                    boxShadow: i + 1 === dayNumber ? "0 0 12px #00E5FF" : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
