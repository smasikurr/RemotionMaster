import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * CybersecurityShieldBiometricSearch4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Commercial 3D Cybersecurity, Identity Verification & Biometric Search UI:
 * - Ice Blue backdrop (#ADD5EE to #7FBDE3) with ambient lighting bloom
 * - 3D floating Security Shield with glowing verification checkmark & biometric rings
 * - Floating Optical Magnifying Glass with sweeping holographic laser scan
 * - Multi-layer verified database card with Deep Navy (#314671) typography
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const CybersecurityShieldBiometricSearch4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  // Harmonic Float & Easing (Integer harmonic multipliers for seamless loop)
  const baseFloatY = Math.sin(normT * twoPi * 2) * 20;
  const glassOrbitX = Math.cos(normT * twoPi * 2) * 50;
  const glassOrbitY = Math.sin(normT * twoPi * 2) * 25;
  const scanSweepY = ((normT * 4) % 1.0) * 180 - 90;
  const shieldPulse = 1 + Math.sin(normT * twoPi * 3) * 0.04;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ADD5EE",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Ice Blue Radial Glow & Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 48%, #CDE8F8 0%, #ADD5EE 55%, #7FBDE3 100%)",
        }}
      />

      {/* Perspective Floor Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={`grid-x-${i}`}
            x1={width / 2 + (i - 7) * 240}
            y1={height / 2 + 380}
            x2={width / 2 + (i - 7) * 480}
            y2={height}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        ))}
        {Array.from({ length: 8 }).map((_, j) => {
          const gy = height / 2 + 380 + j * 95;
          return <line key={`grid-y-${j}`} x1={0} y1={gy} x2={width} y2={gy} stroke="#FFFFFF" strokeWidth="1.5" />;
        })}
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
          transform: `translateY(${baseFloatY}px)`,
        }}
      >
        {/* Soft Drop Shadow under assembly */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            width: 1000,
            height: 75,
            borderRadius: "50%",
            backgroundColor: "rgba(35, 75, 110, 0.25)",
            filter: "blur(35px)",
            transform: `scale(${1 - baseFloatY / 150})`,
          }}
        />

        {/* 2.1 Central Main UI Database Screen */}
        <div
          style={{
            position: "absolute",
            width: 820,
            height: 880,
            backgroundColor: "#FFFFFF",
            borderRadius: 40,
            boxShadow: "0 35px 85px rgba(25, 60, 95, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            padding: "50px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#10B981" }} />
              <div style={{ color: "#314671", fontSize: 22, fontWeight: 900, letterSpacing: 1.5 }}>
                SECURITY PROTOCOL
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#EBF3FB",
                color: "#314671",
                fontSize: 14,
                fontWeight: 800,
                padding: "8px 18px",
                borderRadius: 20,
              }}
            >
              ENCRYPTED 256-BIT
            </div>
          </div>

          {/* Biometric Scan Target Box */}
          <div
            style={{
              height: 380,
              backgroundColor: "#F4F8FC",
              borderRadius: 28,
              border: "2px dashed #CDE2F4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Holographic Laser Scan Line */}
            <div
              style={{
                position: "absolute",
                top: `calc(50% + ${scanSweepY}px)`,
                left: 0,
                right: 0,
                height: 4,
                background: "linear-gradient(90deg, transparent, #00C8FF, #FFFFFF, #00C8FF, transparent)",
                boxShadow: "0 0 20px #00C8FF",
              }}
            />

            {/* Fingerprint / Biometric Rings Graphic */}
            <svg width="220" height="220" viewBox="0 0 220 220" style={{ opacity: 0.85 }}>
              {[30, 50, 70, 90].map((r, ri) => (
                <circle
                  key={`bio-ring-${ri}`}
                  cx="110"
                  cy="110"
                  r={r}
                  fill="none"
                  stroke="#314671"
                  strokeWidth="5"
                  strokeDasharray={`${30 + ri * 15} ${15 + ri * 8}`}
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>

          {/* Database Verification Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Identity Integrity", val: "100% VERIFIED", color: "#10B981" },
              { label: "SSL Handshake", val: "SECURE (TLS 1.3)", color: "#314671" },
              { label: "Intrusion Detection", val: "0 THREATS", color: "#10B981" },
            ].map((st, si) => (
              <div
                key={`stat-${si}`}
                style={{
                  backgroundColor: "#F9FBFE",
                  padding: "16px 22px",
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #EBF3FB",
                }}
              >
                <div style={{ color: "#61749B", fontSize: 16, fontWeight: 700 }}>{st.label}</div>
                <div style={{ color: st.color, fontSize: 16, fontWeight: 900 }}>{st.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2.2 Floating 3D Security Shield (Left) */}
        <div
          style={{
            position: "absolute",
            left: 120,
            transform: `scale(${shieldPulse}) translateY(${Math.sin(normT * twoPi * 2 + 1) * 15}px)`,
            zIndex: 20,
          }}
        >
          <svg width="260" height="310" viewBox="0 0 260 310" style={{ filter: "drop-shadow(0 25px 45px rgba(25, 60, 95, 0.35))" }}>
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4364A1" />
                <stop offset="70%" stopColor="#314671" />
                <stop offset="100%" stopColor="#213152" />
              </linearGradient>
            </defs>
            {/* Shield Body */}
            <path
              d="M 130 15 L 235 55 C 235 185, 130 285, 130 285 C 130 285, 25 185, 25 55 Z"
              fill="url(#shieldGrad)"
              stroke="#FFFFFF"
              strokeWidth="6"
            />
            {/* Center Checkmark */}
            <path
              d="M 85 150 L 115 180 L 175 115"
              fill="none"
              stroke="#10B981"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 2.3 Floating 3D Magnifying Glass / Inspection Lens (Right) */}
        <div
          style={{
            position: "absolute",
            right: 140,
            transform: `translate(${glassOrbitX}px, ${glassOrbitY}px)`,
            zIndex: 25,
          }}
        >
          <svg width="280" height="280" viewBox="0 0 280 280" style={{ filter: "drop-shadow(0 25px 50px rgba(20, 50, 80, 0.35))" }}>
            {/* Handle */}
            <line x1="180" y1="180" x2="260" y2="260" stroke="#314671" strokeWidth="24" strokeLinecap="round" />
            <line x1="180" y1="180" x2="260" y2="260" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            {/* Rim */}
            <circle cx="110" cy="110" r="85" fill="rgba(255, 255, 255, 0.25)" stroke="#314671" strokeWidth="20" />
            <circle cx="110" cy="110" r="75" fill="rgba(205, 235, 255, 0.3)" stroke="#FFFFFF" strokeWidth="4" />
            {/* Glass Lens Highlight */}
            <path
              d="M 60 70 A 65 65 0 0 1 150 60"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
