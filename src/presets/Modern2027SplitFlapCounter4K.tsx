import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const Modern2027SplitFlapCounter4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Digit Flip Progress
  // Digits: 2 - 0 - 2 - 7
  // Frame 0-120: Rapid rolling tumble
  // Frame 120-160: Digit 1 ('2') locks
  // Frame 160-200: Digit 2 ('0') locks
  // Frame 200-240: Digit 3 ('2') locks
  // Frame 240-300: Digit 4 ('7') snaps with huge impact and particle burst!

  const lockSpring1 = spring({ frame: frame - 60, fps, config: { damping: 12, stiffness: 180 } });
  const lockSpring2 = spring({ frame: frame - 100, fps, config: { damping: 12, stiffness: 180 } });
  const lockSpring3 = spring({ frame: frame - 140, fps, config: { damping: 12, stiffness: 180 } });
  const lockSpring4 = spring({ frame: frame - 180, fps, config: { damping: 10, stiffness: 160, mass: 1.2 } });

  // 4th digit flap flip rotation
  const flipAngle = interpolate(lockSpring4, [0, 1], [-180, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera scale bounce on final '7' lock
  const impactPunch = interpolate(frame, [180, 188, 210, 260], [1.0, 1.08, 0.98, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Idle floating breathing
  const idleY = Math.sin(frame * 0.06) * 12;
  const idleGlow = (Math.sin(frame * 0.08) + 1) * 0.5;

  // Master Loop Fade
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const digits = [
    { char: "2", springVal: lockSpring1, label: "MILLENNIUM" },
    { char: "0", springVal: lockSpring2, label: "CENTURY" },
    { char: "2", springVal: lockSpring3, label: "DECADE" },
    { char: "7", springVal: lockSpring4, label: "TARGET YEAR", isHero: true },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: masterFade,
      }}
    >
      {/* Background Volumetric Glow & Dynamic Radial Rays */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="neonFlapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Tech Grid Rays (Pure Solid Black Background) */}
        <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={`h-ray-${i}`}
              x1="0"
              y1={i * 100}
              x2={width}
              y2={i * 100}
              strokeDasharray="4 16"
            />
          ))}
          {Array.from({ length: 38 }).map((_, i) => (
            <line
              key={`v-ray-${i}`}
              x1={i * 100}
              y1="0"
              x2={i * 100}
              y2={height}
              strokeDasharray="4 16"
            />
          ))}
        </g>
      </svg>

      {/* Main Split-Flap Stage */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
          transform: `translateY(${idleY}px) scale(${impactPunch})`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Header HUD Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "12px 36px",
            backgroundColor: "rgba(10, 20, 35, 0.8)",
            border: "2px solid rgba(0, 229, 255, 0.6)",
            borderRadius: 12,
            boxShadow: "0 0 30px rgba(0, 229, 255, 0.3)",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#00E5FF",
              boxShadow: "0 0 16px #00E5FF",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 8,
              color: "#FFFFFF",
            }}
          >
            PRECISION CHRONO SYSTEM // NEW ERA ARRIVAL
          </span>
        </div>

        {/* 4 Titanium Mechanical Flap Modules */}
        <div style={{ display: "flex", gap: 40, perspective: 1200 }}>
          {digits.map((d, idx) => {
            const isHero = d.isHero;
            const yOffset = interpolate(d.springVal, [0, 1], [-400, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const cardOpacity = interpolate(d.springVal, [0, 0.2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={`digit-${idx}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                  transform: `translateY(${yOffset}px)`,
                  opacity: cardOpacity,
                }}
              >
                {/* 3D Flap Plate Container */}
                <div
                  style={{
                    position: "relative",
                    width: 320,
                    height: 480,
                    backgroundColor: "#11141A",
                    borderRadius: 24,
                    border: isHero
                      ? `4px solid rgba(0, 229, 255, ${0.7 + idleGlow * 0.3})`
                      : "4px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: isHero
                      ? "0 25px 60px rgba(0, 229, 255, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3)"
                      : "0 25px 50px rgba(0, 0, 0, 0.8), inset 0 2px 6px rgba(255, 255, 255, 0.1)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Background Radial Plate Depth */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      background: isHero
                        ? "radial-gradient(circle at 50% 30%, #1A2735 0%, #0A1017 100%)"
                        : "radial-gradient(circle at 50% 30%, #1F242C 0%, #0D1015 100%)",
                    }}
                  />

                  {/* Giant Clean Vector Digit */}
                  <span
                    style={{
                      position: "relative",
                      fontFamily: "sans-serif",
                      fontSize: 340,
                      fontWeight: 900,
                      color: isHero ? "#FFFFFF" : "#E0E0E0",
                      letterSpacing: -10,
                      textShadow: isHero
                        ? "0 0 40px rgba(0, 229, 255, 0.8), 0 10px 20px rgba(0, 0, 0, 0.9)"
                        : "0 10px 20px rgba(0, 0, 0, 0.9)",
                    }}
                  >
                    {d.char}
                  </span>

                  {/* Horizontal Center Split Seam & Mechanical Fasteners */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      height: 6,
                      backgroundColor: "#05070A",
                      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.9), 0 -2px 4px rgba(255, 255, 255, 0.1)",
                      zIndex: 10,
                    }}
                  />
                  {/* Left & Right Mechanical Hinges */}
                  <div
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 14,
                      height: 28,
                      backgroundColor: "#37474F",
                      borderRadius: 4,
                      border: "1px solid #78909C",
                      zIndex: 12,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 14,
                      height: 28,
                      backgroundColor: "#37474F",
                      borderRadius: 4,
                      border: "1px solid #78909C",
                      zIndex: 12,
                    }}
                  />
                </div>

                {/* Sub-label */}
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: 4,
                    color: isHero ? "#00E5FF" : "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Commercial Callout */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 6,
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          GLOBAL STANDARD CALENDAR // 2027 FISCAL & STRATEGIC PLANNING
        </div>
      </div>
    </AbsoluteFill>
  );
};
