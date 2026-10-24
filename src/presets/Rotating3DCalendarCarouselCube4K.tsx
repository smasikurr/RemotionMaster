import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const Rotating3DCalendarCarouselCube4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const totalFrames = 600;

  // Continuous 360-degree rotation across 600 frames (mathematical seamless loop)
  const rotationY = (frame / totalFrames) * 360;
  const rotationX = -15 + Math.sin((frame / totalFrames) * Math.PI * 2) * 5;

  // Floating idle bobbing
  const hoverY = Math.sin((frame / totalFrames) * Math.PI * 4) * 16;

  // 4 Carousel Faces (Q1: JAN-FEB-MAR, Q2: APR-MAY-JUN, Q3: JUL-AUG-SEP, Q4: OCT-NOV-DEC)
  const quarters = [
    {
      quarter: "Q1",
      title: "FIRST QUARTER 2027",
      months: ["JANUARY", "FEBRUARY", "MARCH"],
      days: ["31 DAYS", "28 DAYS", "31 DAYS"],
      accent: "#00E5FF",
    },
    {
      quarter: "Q2",
      title: "SECOND QUARTER 2027",
      months: ["APRIL", "MAY", "JUNE"],
      days: ["30 DAYS", "31 DAYS", "30 DAYS"],
      accent: "#2979FF",
    },
    {
      quarter: "Q3",
      title: "THIRD QUARTER 2027",
      months: ["JULY", "AUGUST", "SEPTEMBER"],
      days: ["31 DAYS", "31 DAYS", "30 DAYS"],
      accent: "#7C4DFF",
    },
    {
      quarter: "Q4",
      title: "FOURTH QUARTER 2027",
      months: ["OCTOBER", "NOVEMBER", "DECEMBER"],
      days: ["31 DAYS", "30 DAYS", "31 DAYS"],
      accent: "#00E676",
    },
  ];

  const faceWidth = 720;
  const faceHeight = 940;
  const radius = 520; // 3D carousel cylinder radius

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
          <filter id="cubeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
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

        {/* Floor 3D Ellipse Projection */}
        <ellipse
          cx={width / 2}
          cy={height / 2 + 560}
          rx="700"
          ry="140"
          fill="none"
          stroke="rgba(0, 229, 255, 0.2)"
          strokeWidth="3"
          strokeDasharray="16 32"
          transform={`rotate(${frame * 0.5} ${width / 2} ${height / 2 + 560})`}
        />
      </svg>

      {/* 3D Carousel Scene Container */}
      <div
        style={{
          perspective: 2200,
          perspectiveOrigin: "50% 50%",
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${hoverY}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: faceWidth,
            height: faceHeight,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          }}
        >
          {quarters.map((q, idx) => {
            const angle = idx * 90;
            return (
              <div
                key={q.quarter}
                style={{
                  position: "absolute",
                  width: faceWidth,
                  height: faceHeight,
                  backgroundColor: "#0D1117",
                  border: `3px solid ${q.accent}`,
                  borderRadius: 28,
                  boxShadow: `0 20px 80px ${q.accent}33`,
                  display: "flex",
                  flexDirection: "column",
                  padding: "44px 38px",
                  backfaceVisibility: "hidden",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `2px solid ${q.accent}44`,
                    paddingBottom: 24,
                    marginBottom: 32,
                  }}
                >
                  <div>
                    <div style={{ color: q.accent, fontSize: 32, fontWeight: 900, letterSpacing: 3 }}>
                      {q.quarter} 2027
                    </div>
                    <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 18, marginTop: 4 }}>
                      {q.title}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: `${q.accent}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: q.accent,
                      fontWeight: 800,
                      border: `1.5px solid ${q.accent}`,
                    }}
                  >
                    ★
                  </div>
                </div>

                {/* 3 Months Stack */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
                  {q.months.map((m, mIdx) => (
                    <div
                      key={m}
                      style={{
                        backgroundColor: "#161B22",
                        borderRadius: 18,
                        padding: "24px 28px",
                        border: "1.5px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ color: "#FFFFFF", fontSize: 26, fontWeight: 800 }}>
                          {m}
                        </div>
                        <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 18, marginTop: 4 }}>
                          {q.days[mIdx]}
                        </div>
                      </div>
                      <div
                        style={{
                          color: q.accent,
                          fontSize: 28,
                          fontWeight: 900,
                          letterSpacing: 2,
                        }}
                      >
                        2027
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop: "1.5px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontSize: 16,
                    letterSpacing: 2,
                  }}
                >
                  <span>CALENDAR CAROUSEL</span>
                  <span>SEAMLESS LOOP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
