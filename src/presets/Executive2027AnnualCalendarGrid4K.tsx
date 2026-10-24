import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const Executive2027AnnualCalendarGrid4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 12 Months Metadata for 2027
  const months = [
    { name: "JANUARY", days: 31, startDay: 5 },   // Fri
    { name: "FEBRUARY", days: 28, startDay: 1 },  // Mon
    { name: "MARCH", days: 31, startDay: 1 },     // Mon
    { name: "APRIL", days: 30, startDay: 4 },     // Thu
    { name: "MAY", days: 31, startDay: 6 },       // Sat
    { name: "JUNE", days: 30, startDay: 2 },      // Tue
    { name: "JULY", days: 31, startDay: 4 },      // Thu
    { name: "AUGUST", days: 31, startDay: 0 },    // Sun
    { name: "SEPTEMBER", days: 30, startDay: 3 }, // Wed
    { name: "OCTOBER", days: 31, startDay: 5 },   // Fri
    { name: "NOVEMBER", days: 30, startDay: 1 },  // Mon
    { name: "DECEMBER", days: 31, startDay: 3 },  // Wed
  ];

  // Gear Rotations
  const gearRotLeft = (frame * 0.8) % 360;
  const gearRotRight = (-frame * 0.8) % 360;

  // Master Fade Loop
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
        fontFamily: "sans-serif",
      }}
    >
      {/* Decorative Technical Blueprint Gears (Pure Solid Black Background, Zero Gradient) */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* Left Giant Gear */}
        <g
          transform={`translate(150, ${height - 120}) rotate(${gearRotLeft})`}
          opacity="0.12"
        >
          <circle r="320" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <circle r="220" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="12 12" />
          {Array.from({ length: 16 }).map((_, i) => (
            <rect
              key={`g-l-${i}`}
              x="-22"
              y="-350"
              width="44"
              height="60"
              fill="#FFFFFF"
              transform={`rotate(${(i * 360) / 16})`}
            />
          ))}
        </g>

        {/* Right Giant Gear */}
        <g
          transform={`translate(${width - 150}, ${height - 120}) rotate(${gearRotRight})`}
          opacity="0.12"
        >
          <circle r="320" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <circle r="220" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="12 12" />
          {Array.from({ length: 16 }).map((_, i) => (
            <rect
              key={`g-r-${i}`}
              x="-22"
              y="-350"
              width="44"
              height="60"
              fill="#FFFFFF"
              transform={`rotate(${(i * 360) / 16})`}
            />
          ))}
        </g>
      </svg>

      {/* Top Header Row */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 160,
          right: 160,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "2px solid rgba(255, 255, 255, 0.15)",
          paddingBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: 6,
              color: "#FFFFFF",
            }}
          >
            CALENDAR
          </h1>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              color: "#00E5FF",
              letterSpacing: 4,
              marginTop: 6,
            }}
          >
            ANNUAL STRATEGIC PLANNER // 365 DAYS
          </div>
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 6,
            textShadow: "0 0 35px rgba(0, 229, 255, 0.6)",
          }}
        >
          2027
        </div>
      </div>

      {/* 4x3 Grid of 12 Monthly Cards */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 160,
          right: 160,
          bottom: 100,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 36,
        }}
      >
        {months.map((m, idx) => {
          // Staggered Spring Jump In (Frame delay: idx * 12)
          const cardSpring = spring({
            frame: frame - (30 + idx * 12),
            fps,
            config: { damping: 12, stiffness: 160, mass: 0.8 },
          });

          const scale = interpolate(cardSpring, [0, 1], [0.6, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(cardSpring, [0, 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const yOffset = interpolate(cardSpring, [0, 1], [60, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={`month-${idx}`}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                boxShadow:
                  "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transform: `translateY(${yOffset}px) scale(${scale})`,
                opacity,
              }}
            >
              {/* Card Header (Black with White Title & Month Number Badge) */}
              <div
                style={{
                  backgroundColor: "#11141A",
                  padding: "10px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: "#00E5FF",
                      color: "#000000",
                      fontSize: 14,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: 20,
                      fontWeight: 800,
                      letterSpacing: 2,
                    }}
                  >
                    {m.name}
                  </span>
                </div>
              </div>

              {/* Day Headers (S M T W T F S) */}
              <div
                style={{
                  backgroundColor: "#E2E8F0",
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  padding: "6px 12px",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#475569",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "#EF4444" }}>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              {/* Days Numeric Grid */}
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  padding: "8px 12px",
                  alignContent: "center",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1E293B",
                  textAlign: "center",
                  rowGap: 4,
                }}
              >
                {/* Empty cells before month start */}
                {Array.from({ length: m.startDay }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}
                {/* Month Days */}
                {Array.from({ length: m.days }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayOfWeek = (m.startDay + i) % 7;
                  const isSunday = dayOfWeek === 0;

                  return (
                    <span
                      key={`day-${dayNum}`}
                      style={{
                        color: isSunday ? "#EF4444" : "#1E293B",
                        padding: "2px 0",
                      }}
                    >
                      {dayNum}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
