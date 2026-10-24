import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * ArchitecturalMobileUiTerracotta4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Architectural Minimalist Mobile Dashboard & Media UI Animation:
 * - Warm Platinum Sand backdrop (#DCDDD8) with subtle architectural vignette
 * - Dual floating UI panels: Crisp Matte White (#FFFFFF) & Terracotta Coral (#C86D68)
 * - Animated viewfinder focus rings, telemetry graphs, and floating notification badges
 * - Soft Slate Lavender (#C0C7D7) and Graphite (#2D3139) typography
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const ArchitecturalMobileUiTerracotta4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  // Harmonic Float & Tilt Cycles (Integer harmonic multipliers for seamless loop)
  const baseFloatY = Math.sin(normT * twoPi * 2) * 20;
  const leftTilt = Math.sin(normT * twoPi * 2) * 1.8;
  const rightTilt = Math.cos(normT * twoPi * 2) * -1.8;
  const ringPulse = 1 + Math.sin(normT * twoPi * 3) * 0.06;
  const waveCycle = (normT * 4) % 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#DCDDD8",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Warm Architectural Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, #ECEEE9 0%, #DCDDD8 60%, #CACBC5 100%)",
        }}
      />

      {/* Subtle Architectural Blueprint Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }}>
        <defs>
          <pattern id="archGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#A9ABA2" strokeWidth="1" />
            <circle cx="120" cy="120" r="2" fill="#8F9288" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#archGrid)" />
      </svg>

      {/* Layer 2: Main Floating Composition Assembly */}
      <div
        style={{
          position: "relative",
          width: 1700,
          height: 1100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${baseFloatY}px)`,
        }}
      >
        {/* Soft Ambient Ground Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            width: 1100,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "rgba(90, 95, 85, 0.22)",
            filter: "blur(35px)",
            transform: `scale(${1 - baseFloatY / 160})`,
          }}
        />

        {/* 2.1 Left UI Panel: Crisp White Minimalist Data Screen */}
        <div
          style={{
            position: "absolute",
            left: 120,
            width: 680,
            height: 900,
            backgroundColor: "#FFFFFF",
            borderRadius: 36,
            boxShadow: "0 35px 80px rgba(70, 75, 70, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            padding: "48px 44px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: `rotate(${leftTilt}deg)`,
            zIndex: 5,
          }}
        >
          {/* Top Header Row */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#C86D68" }} />
                <div style={{ color: "#2D3139", fontSize: 22, fontWeight: 800, letterSpacing: 1.5 }}>STUDIO OVERVIEW</div>
              </div>
              <div style={{ backgroundColor: "#ECEEE9", padding: "6px 16px", borderRadius: 20, fontSize: 14, fontWeight: 700, color: "#787C85" }}>
                LIVE SYNC
              </div>
            </div>

            {/* Metric Big Number */}
            <div style={{ color: "#1D2128", fontSize: 56, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>
              94.8%
            </div>
            <div style={{ color: "#787C85", fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>
              EFFICIENCY INDEX
            </div>
          </div>

          {/* Middle: Continuous Live Telemetry Wave Line */}
          <div style={{ height: 180, width: "100%", position: "relative" }}>
            <svg width="100%" height="100%" viewBox="0 0 592 180" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C86D68" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C86D68" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Animated Wave Path */}
              {(() => {
                const points: string[] = [];
                for (let x = 0; x <= 592; x += 16) {
                  const nx = x / 592;
                  const y = 90 + Math.sin(nx * twoPi * 2 + waveCycle * twoPi) * 45 + Math.cos(nx * twoPi * 4) * 15;
                  points.push(`${x},${y}`);
                }
                const pathD = `M 0,180 L ${points.join(" L ")} L 592,180 Z`;
                const lineD = `M ${points.join(" L ")}`;
                return (
                  <>
                    <path d={pathD} fill="url(#waveGrad)" />
                    <path d={lineD} fill="none" stroke="#C86D68" strokeWidth="5" strokeLinecap="round" />
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Bottom Data Cards List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Rendering Queue", val: "Optimal", color: "#C86D68" },
              { label: "Color Grading (Rec.709)", val: "Calibrated", color: "#787C85" },
              { label: "Temporal Sampling", val: "60.00 FPS", color: "#C0C7D7" },
            ].map((item, idx) => (
              <div
                key={`metric-${idx}`}
                style={{
                  backgroundColor: "#F7F8F6",
                  borderRadius: 18,
                  padding: "16px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ECEEE9",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: item.color }} />
                  <div style={{ color: "#454A54", fontSize: 16, fontWeight: 700 }}>{item.label}</div>
                </div>
                <div style={{ color: "#1D2128", fontSize: 16, fontWeight: 800 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2.2 Right UI Panel: Terracotta Coral Media Viewfinder */}
        <div
          style={{
            position: "absolute",
            right: 120,
            width: 720,
            height: 940,
            backgroundColor: "#C86D68",
            borderRadius: 40,
            boxShadow: "0 40px 90px rgba(160, 75, 70, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "50px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: `rotate(${rightTilt}deg)`,
            zIndex: 10,
          }}
        >
          {/* Top Bar: Camera Mode */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, letterSpacing: 2 }}>
              VIEWFINDER 4K
            </div>
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 800,
                padding: "8px 18px",
                borderRadius: 20,
              }}
            >
              UHD 60P
            </div>
          </div>

          {/* Center: Concentric Animated Lens Target */}
          <div
            style={{
              position: "relative",
              height: 480,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Outer Rotating Hash Ring */}
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              style={{
                position: "absolute",
                transform: `rotate(${normT * 360 * 2}deg)`,
              }}
            >
              <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="12 16" />
            </svg>

            {/* Inner Pulsing Circle */}
            <div
              style={{
                width: 240,
                height: 240,
                borderRadius: "50%",
                border: "4px solid #FFFFFF",
                transform: `scale(${ringPulse})`,
                boxShadow: "0 0 35px rgba(255, 255, 255, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Crosshair Center */}
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
              <div style={{ position: "absolute", width: 50, height: 2, backgroundColor: "#FFFFFF" }} />
              <div style={{ position: "absolute", height: 50, width: 2, backgroundColor: "#FFFFFF" }} />
            </div>

            {/* 4 Corner Viewfinder Brackets */}
            <div style={{ position: "absolute", top: 20, left: 30, width: 35, height: 35, borderTop: "4px solid #FFFFFF", borderLeft: "4px solid #FFFFFF" }} />
            <div style={{ position: "absolute", top: 20, right: 30, width: 35, height: 35, borderTop: "4px solid #FFFFFF", borderRight: "4px solid #FFFFFF" }} />
            <div style={{ position: "absolute", bottom: 20, left: 30, width: 35, height: 35, borderBottom: "4px solid #FFFFFF", borderLeft: "4px solid #FFFFFF" }} />
            <div style={{ position: "absolute", bottom: 20, right: 30, width: 35, height: 35, borderBottom: "4px solid #FFFFFF", borderRight: "4px solid #FFFFFF" }} />
          </div>

          {/* Bottom Status Readout */}
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.18)",
              borderRadius: 22,
              padding: "20px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>ISO / APERTURE</div>
              <div style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 900, fontFamily: "monospace" }}>ISO 200 · f/2.8</div>
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>SHUTTER</div>
              <div style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 900, fontFamily: "monospace" }}>1/120s CFR</div>
            </div>
          </div>
        </div>

        {/* 2.3 Floating Slate Lavender Accent Pill */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 60,
            backgroundColor: "#C0C7D7",
            padding: "16px 32px",
            borderRadius: 40,
            boxShadow: "0 18px 45px rgba(80, 85, 100, 0.25)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `translateY(${Math.sin(normT * twoPi * 3) * 14}px)`,
            zIndex: 15,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
          <div style={{ color: "#2D3139", fontSize: 17, fontWeight: 900, letterSpacing: 1 }}>
            AUTOFOCUS LOCKED
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
