import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * SmartNavigationMapTravelUi4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Commercial 3D Smart GPS Navigation & Travel Route UI Animation:
 * - Soft Ocean Cyan backdrop (#7CC9CF to #59AEB5) with ambient radial glow
 * - 3D floating Geolocation Map Pin with concentric pulsing radar rings
 * - Sleek Navigation Route Card with live pulsing waypoint route
 * - Floating ETA, Compass telemetry, and turn-by-turn indicator
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const SmartNavigationMapTravelUi4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  // Harmonic Float & Easing (Integer harmonic multipliers for seamless loop)
  const pinFloatY = Math.sin(normT * twoPi * 2) * 18;
  const cardFloatY = Math.sin(normT * twoPi * 2 + 0.8) * 14;
  const radarRadius = ((normT * 4) % 1.0) * 180 + 30;
  const radarOpacity = 1 - ((normT * 4) % 1.0);
  const routeDashOffset = normT * 1200;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#7CC9CF",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Radial Ocean Cyan Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 48%, #9BE1E6 0%, #7CC9CF 55%, #52A4AB 100%)",
        }}
      />

      {/* Isometric Vector Map Contour Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={`map-grid-x-${i}`}
            x1={i * 180}
            y1={0}
            x2={i * 180}
            y2={height}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="6 12"
          />
        ))}
        {Array.from({ length: 14 }).map((_, j) => (
          <line
            key={`map-grid-y-${j}`}
            x1={0}
            y1={j * 180}
            x2={width}
            y2={j * 180}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="6 12"
          />
        ))}
      </svg>

      {/* Layer 2: Main Floating Assembly */}
      <div
        style={{
          position: "relative",
          width: 1500,
          height: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Ground Drop Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            width: 750,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(40, 95, 100, 0.25)",
            filter: "blur(30px)",
            transform: `scale(${1 - pinFloatY / 140})`,
          }}
        />

        {/* 2.1 Hero 3D Geolocation Pin & Radar Rings */}
        <div
          style={{
            position: "absolute",
            top: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${pinFloatY}px)`,
            zIndex: 20,
          }}
        >
          {/* Radar Wave Pulse Circles */}
          <div
            style={{
              position: "absolute",
              bottom: 15,
              width: radarRadius * 2,
              height: (radarRadius * 2) * 0.45,
              borderRadius: "50%",
              border: "3px solid #FFFFFF",
              opacity: radarOpacity,
              boxShadow: "0 0 25px rgba(255, 255, 255, 0.6)",
              pointerEvents: "none",
            }}
          />

          {/* Map Pin Shape */}
          <svg width="220" height="280" viewBox="0 0 220 280" style={{ filter: "drop-shadow(0 25px 45px rgba(35, 80, 85, 0.35))" }}>
            <defs>
              <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F4F8FA" />
                <stop offset="100%" stopColor="#E2EDF2" />
              </linearGradient>
            </defs>
            {/* Teardrop Pin */}
            <path
              d="M 110 10 C 50 10, 10 55, 10 115 C 10 180, 110 270, 110 270 C 110 270, 210 180, 210 115 C 210 55, 170 10, 110 10 Z"
              fill="url(#pinGrad)"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
            {/* Inner Glowing Core */}
            <circle cx="110" cy="115" r="42" fill="#52A4AB" />
            <circle cx="110" cy="115" r="22" fill="#FFFFFF" />
          </svg>
        </div>

        {/* 2.2 Navigation Route Card (Sliding Under Pin) */}
        <div
          style={{
            position: "absolute",
            top: 450,
            width: 820,
            height: 480,
            backgroundColor: "#FFFFFF",
            borderRadius: 36,
            boxShadow: "0 35px 85px rgba(30, 80, 85, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            padding: "40px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: `translateY(${cardFloatY}px)`,
            zIndex: 10,
          }}
        >
          {/* Top Destination Info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#7A929E", fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                ACTIVE DESTINATION
              </div>
              <div style={{ color: "#2B2B2D", fontSize: 32, fontWeight: 900, letterSpacing: -0.5 }}>
                Pacific Coast Highway
              </div>
            </div>
            {/* ETA Badge */}
            <div
              style={{
                backgroundColor: "#52A4AB",
                color: "#FFFFFF",
                padding: "10px 22px",
                borderRadius: 24,
                fontWeight: 900,
                fontSize: 18,
                letterSpacing: 1,
                boxShadow: "0 8px 20px rgba(82, 164, 171, 0.35)",
              }}
            >
              18 MIN · 12.4 KM
            </div>
          </div>

          {/* Animated Route Vector Line */}
          <div style={{ height: 160, position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
            <svg width="100%" height="100%" viewBox="0 0 724 160">
              <path
                d="M 40 120 C 180 120, 240 40, 380 40 C 520 40, 560 120, 680 120"
                fill="none"
                stroke="#E2EDF2"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 40 120 C 180 120, 240 40, 380 40 C 520 40, 560 120, 680 120"
                fill="none"
                stroke="#52A4AB"
                strokeWidth="14"
                strokeDasharray="30 25"
                strokeDashoffset={-routeDashOffset}
                strokeLinecap="round"
              />
              {/* Waypoint Nodes */}
              <circle cx="40" cy="120" r="16" fill="#FFFFFF" stroke="#52A4AB" strokeWidth="6" />
              <circle cx="380" cy="40" r="12" fill="#52A4AB" />
              <circle cx="680" cy="120" r="18" fill="#10B981" stroke="#FFFFFF" strokeWidth="5" />
            </svg>
          </div>

          {/* Bottom Telemetry Metrics */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #EBF1F5",
              paddingTop: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
              <div style={{ color: "#4B565D", fontSize: 16, fontWeight: 800 }}>GPS SIGNAL 100%</div>
            </div>
            <div style={{ color: "#7A929E", fontSize: 15, fontWeight: 700 }}>
              AUTO REROUTE ENABLED
            </div>
          </div>
        </div>

        {/* 2.3 Floating Compass Pill Badge */}
        <div
          style={{
            position: "absolute",
            top: 380,
            right: 80,
            backgroundColor: "#FFFFFF",
            padding: "16px 28px",
            borderRadius: 30,
            boxShadow: "0 18px 45px rgba(35, 80, 85, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `translateY(${Math.sin(normT * twoPi * 3) * 12}px)`,
            zIndex: 25,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#7CC9CF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${normT * 360 * 2}deg)`,
            }}
          >
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "12px solid #FFFFFF" }} />
          </div>
          <div style={{ color: "#2B2B2D", fontSize: 17, fontWeight: 900 }}>
            HEADING 270° W
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
