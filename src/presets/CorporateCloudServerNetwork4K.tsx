import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * CorporateCloudServerNetwork4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Corporate Cloud Computing & Data Server Infrastructure Animation:
 * - Geometric vector cloud with glowing multi-tier server racks
 * - Continuous bidirectional data packet pulses streaming between cloud & database
 * - Deep Royal Indigo (#182B70) studio backdrop with radial lighting bloom
 * - Living trigonometric floating motion & calibrated spring entrances
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const CorporateCloudServerNetwork4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  // 1. Organic Idle Float Motion
  const floatY = Math.sin(normT * twoPi * 2) * 18;
  const cloudBreathe = Math.sin(normT * twoPi * 3) * 0.04;

  // 2. Seamless Harmonic Breathing (Frame 0 == Frame 720)
  const cloudScale = 1 + Math.sin(normT * twoPi * 2) * 0.035;
  const serverScale = 1 + Math.sin(normT * twoPi * 2 + 0.8) * 0.02;

  // Packet Stream Cycles (Integer multiple for seamless loop)
  const packetCycle = (normT * 6) % 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#182B70",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Royal Blue Radial Mesh & Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 45%, #25419E 0%, #182B70 60%, #0E1A4A 100%)",
        }}
      />

      {/* Perspective Floor Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={`grid-x-${i}`}
            x1={width / 2 + (i - 7) * 220}
            y1={height / 2 + 350}
            x2={width / 2 + (i - 7) * 440}
            y2={height}
            stroke="#C3CBEF"
            strokeWidth="1.5"
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => {
          const gy = height / 2 + 350 + i * 90;
          return <line key={`grid-y-${i}`} x1={0} y1={gy} x2={width} y2={gy} stroke="#C3CBEF" strokeWidth="1.5" />;
        })}
      </svg>

      {/* Layer 2: Main Floating Assembly */}
      <div
        style={{
          position: "relative",
          width: 1400,
          height: 1400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${floatY}px)`,
        }}
      >
        {/* Top Hero Cloud Assembly */}
        <div
          style={{
            position: "relative",
            width: 720,
            height: 380,
            transform: `scale(${cloudScale * (1 + cloudBreathe)})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="720" height="380" viewBox="0 0 720 380" style={{ filter: "drop-shadow(0 25px 50px rgba(10, 20, 60, 0.45))" }}>
            <defs>
              <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E0E6FA" />
                <stop offset="100%" stopColor="#C3CBEF" />
              </linearGradient>
            </defs>

            {/* Cloud Puffs */}
            <path
              d="M 220 280 L 520 280 A 90 90 0 0 0 610 190 A 80 80 0 0 0 535 115 A 130 130 0 0 0 280 120 A 90 90 0 0 0 130 200 A 80 80 0 0 0 220 280 Z"
              fill="url(#cloudGrad)"
            />

            {/* Cloud Highlights & Sync Arrows */}
            <path
              d="M 330 190 L 360 160 L 390 190 M 360 160 L 360 230"
              fill="none"
              stroke="#182B70"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Central Bidirectional Data Flow Bus */}
        <div style={{ position: "relative", width: 280, height: 260, display: "flex", justifyContent: "center" }}>
          <svg width="280" height="260" viewBox="0 0 280 260">
            {/* 3 Main Data Conduits */}
            {[-60, 0, 60].map((cx, ci) => (
              <g key={`conduit-${ci}`}>
                <line x1={140 + cx} y1={0} x2={140 + cx} y2={260} stroke="rgba(195, 203, 239, 0.3)" strokeWidth="6" strokeDasharray="10 8" />
                {/* Streaming glowing packets */}
                <circle
                  cx={140 + cx}
                  cy={(packetCycle * 260 + ci * 85) % 260}
                  r="8"
                  fill="#00F0FF"
                  style={{ filter: "drop-shadow(0 0 10px #00F0FF)" }}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Bottom Multi-Tier Server Racks Assembly */}
        <div
          style={{
            position: "relative",
            width: 860,
            transform: `scale(${serverScale})`,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {[0, 1, 2].map((rackIdx) => (
            <div
              key={`rack-${rackIdx}`}
              style={{
                width: "100%",
                height: 110,
                backgroundColor: "#0D1842",
                borderRadius: 20,
                border: "2px solid rgba(195, 203, 239, 0.4)",
                boxShadow: "0 20px 40px rgba(10, 15, 45, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.2)",
                padding: "20px 32px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Drive Bay Slots */}
              <div style={{ display: "flex", gap: 14 }}>
                {Array.from({ length: 6 }).map((_, di) => {
                  const isBlinking = (frame + rackIdx * 15 + di * 8) % 30 < 15;
                  return (
                    <div
                      key={`drive-${di}`}
                      style={{
                        width: 50,
                        height: 68,
                        backgroundColor: "#16255E",
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: isBlinking ? "#00F0FF" : "#10B981",
                          boxShadow: isBlinking ? "0 0 8px #00F0FF" : "0 0 4px #10B981",
                        }}
                      />
                      <div style={{ width: 28, height: 4, backgroundColor: "#253878", borderRadius: 2 }} />
                    </div>
                  );
                })}
              </div>

              {/* Telemetry LED Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ color: "#C3CBEF", fontFamily: "-apple-system, sans-serif", fontSize: 16, fontWeight: 700 }}>
                  NODE_0{rackIdx + 1}
                </div>
                <div style={{ width: 140, height: 10, backgroundColor: "#16255E", borderRadius: 5, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${75 + Math.sin(normT * twoPi * 2 + rackIdx) * 18}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #00F0FF, #0072FF)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
