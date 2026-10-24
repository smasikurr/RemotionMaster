import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * FinancialAnalyticsDonutChartDashboard4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Commercial 3D Financial Analytics, Fintech Dashboard & Radial Chart Animation:
 * - Pastel Periwinkle Mist backdrop (#E2E4F3 to #D0D3EB) with ambient lighting bloom
 * - Central 3D floating Dashboard Screen with pure white cards & Deep Violet typography (#382B54)
 * - Multi-segment Donut Chart with Electric Lilac (#BDBFF0) & Royal Iris (#5C54D6)
 * - Floating profit growth pills, percentage readouts, and animated progress bars
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const FinancialAnalyticsDonutChartDashboard4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  // Harmonic Float & Tilt Cycles (Integer harmonic multipliers for seamless loop)
  const baseFloatY = Math.sin(normT * twoPi * 2) * 18;
  const cardTilt = Math.sin(normT * twoPi * 2) * 1.5;
  const chartRotation = normT * 360 * 2; // 2 full 360-degree spins over 12s
  const pulseScale = 1 + Math.sin(normT * twoPi * 3) * 0.04;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#E2E4F3",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Periwinkle Radial Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 48%, #F0F2FA 0%, #E2E4F3 55%, #CED2EB 100%)",
        }}
      />

      {/* Subtle Dot Grid Background */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }}>
        <defs>
          <pattern id="finGrid" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
            <circle cx="45" cy="45" r="2.5" fill="#A8ADDA" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#finGrid)" />
      </svg>

      {/* Layer 2: Main Floating Assembly */}
      <div
        style={{
          position: "relative",
          width: 1600,
          height: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${baseFloatY}px) rotate(${cardTilt}deg)`,
        }}
      >
        {/* Soft Drop Shadow under Hero */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            width: 950,
            height: 75,
            borderRadius: "50%",
            backgroundColor: "rgba(65, 55, 110, 0.22)",
            filter: "blur(35px)",
            transform: `scale(${1 - baseFloatY / 150})`,
          }}
        />

        {/* 2.1 Central Main Dashboard Card */}
        <div
          style={{
            position: "absolute",
            width: 860,
            height: 900,
            backgroundColor: "#FFFFFF",
            borderRadius: 40,
            boxShadow: "0 35px 85px rgba(50, 40, 95, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            padding: "50px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#5C54D6" }} />
              <div style={{ color: "#382B54", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
                FINANCIAL TELEMETRY
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#F0EFFF",
                color: "#5C54D6",
                fontSize: 14,
                fontWeight: 800,
                padding: "8px 18px",
                borderRadius: 20,
              }}
            >
              Q4 FORECAST
            </div>
          </div>

          {/* Center: Radial Donut Gauge & Live Yield */}
          <div
            style={{
              height: 380,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Rotating Segmented Donut Ring */}
            <svg
              width="340"
              height="340"
              viewBox="0 0 340 340"
              style={{
                position: "absolute",
                transform: `rotate(${chartRotation}deg)`,
              }}
            >
              {/* Segment 1: Electric Lilac */}
              <circle
                cx="170"
                cy="170"
                r="130"
                fill="none"
                stroke="#BDBFF0"
                strokeWidth="32"
                strokeDasharray="240 580"
                strokeLinecap="round"
              />
              {/* Segment 2: Royal Iris */}
              <circle
                cx="170"
                cy="170"
                r="130"
                fill="none"
                stroke="#5C54D6"
                strokeWidth="32"
                strokeDasharray="320 500"
                strokeDashoffset="-270"
                strokeLinecap="round"
              />
              {/* Segment 3: Deep Violet */}
              <circle
                cx="170"
                cy="170"
                r="130"
                fill="none"
                stroke="#382B54"
                strokeWidth="32"
                strokeDasharray="160 660"
                strokeDashoffset="-620"
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Core Stat Display */}
            <div
              style={{
                width: 170,
                height: 170,
                borderRadius: "50%",
                backgroundColor: "#F9F8FE",
                boxShadow: "0 10px 30px rgba(92, 84, 214, 0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${pulseScale})`,
              }}
            >
              <div style={{ color: "#7B7FEB", fontSize: 13, fontWeight: 800, letterSpacing: 1.5 }}>YIELD</div>
              <div style={{ color: "#382B54", fontSize: 36, fontWeight: 900, letterSpacing: -0.5 }}>+34.8%</div>
              <div style={{ color: "#10B981", fontSize: 13, fontWeight: 800 }}>▲ LIVE</div>
            </div>
          </div>

          {/* Bottom Data Progress Bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Asset Allocation (Liquid)", val: "$2.4M", pct: 78, color: "#5C54D6" },
              { label: "Smart Contract Hedging", val: "$1.8M", pct: 64, color: "#BDBFF0" },
              { label: "Reserve Treasury", val: "$950K", pct: 45, color: "#382B54" },
            ].map((bar, bi) => {
              const animatedWidth = bar.pct + Math.sin(normT * twoPi * 2 + bi) * 5;
              return (
                <div key={`bar-${bi}`} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ color: "#6A5E82", fontSize: 15, fontWeight: 700 }}>{bar.label}</div>
                    <div style={{ color: "#382B54", fontSize: 16, fontWeight: 900 }}>{bar.val}</div>
                  </div>
                  <div style={{ width: "100%", height: 12, backgroundColor: "#F0EFFF", borderRadius: 6, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${animatedWidth}%`,
                        height: "100%",
                        backgroundColor: bar.color,
                        borderRadius: 6,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2.2 Floating Profit Growth Pill (Top Right) */}
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 80,
            backgroundColor: "#FFFFFF",
            padding: "18px 32px",
            borderRadius: 35,
            boxShadow: "0 20px 50px rgba(92, 84, 214, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `translateY(${Math.sin(normT * twoPi * 3) * 15}px)`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            ↗
          </div>
          <div>
            <div style={{ color: "#7B7FEB", fontSize: 12, fontWeight: 800 }}>ANNUAL ROI</div>
            <div style={{ color: "#382B54", fontSize: 20, fontWeight: 900 }}>+48.6% EXP</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
