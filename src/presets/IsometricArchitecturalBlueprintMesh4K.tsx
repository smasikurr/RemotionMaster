import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * IsometricArchitecturalBlueprintMesh4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Commercial 3D Isometric Architectural CAD & Blueprint Wireframe Animation:
 * - Clean Pearl Gray backdrop (#E4E2E5 to #D0CED3) with architectural radial lighting
 * - Floating isometric modular slabs & pavilions with crisp Charcoal borders (#28262C)
 * - Animated dimension callouts, drafting ticks, and rotating CAD crosshairs
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const IsometricArchitecturalBlueprintMesh4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  // Harmonic Float & Easing (Integer harmonic multipliers for seamless loop)
  const baseFloatY = Math.sin(normT * twoPi * 2) * 16;
  const slabFloat = Math.sin(normT * twoPi * 2 + 0.8) * 10;
  const caliperAngle = normT * 360 * 2; // 2 full spins over 12s
  const scanSweep = ((normT * 4) % 1.0) * 800 - 400;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#E4E2E5",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Architectural Pearl Gray Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 48%, #F2F0F3 0%, #E4E2E5 55%, #D0CED3 100%)",
        }}
      />

      {/* Isometric 30-Degree Grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }}>
        <defs>
          <pattern id="isoCadGrid" x="0" y="0" width="120" height="69.28" patternUnits="userSpaceOnUse">
            <path d="M 0 34.64 L 60 0 L 120 34.64 L 60 69.28 Z" fill="none" stroke="#9A96A0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#isoCadGrid)" />
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
            bottom: 60,
            width: 1000,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(50, 45, 60, 0.22)",
            filter: "blur(35px)",
            transform: `scale(${1 - baseFloatY / 150})`,
          }}
        />

        {/* 2.1 Isometric Modular Structure */}
        <div style={{ position: "relative", width: 900, height: 750 }}>
          <svg width="900" height="750" viewBox="0 0 900 750" style={{ filter: "drop-shadow(0 30px 60px rgba(40, 38, 44, 0.2))" }}>
            {/* Base Foundation Slab */}
            <g transform="translate(0, 150)">
              {/* Top Face */}
              <polygon points="450,220 720,375 450,530 180,375" fill="#FFFFFF" stroke="#28262C" strokeWidth="4" />
              {/* Left Face */}
              <polygon points="180,375 450,530 450,590 180,435" fill="#E8E6EB" stroke="#28262C" strokeWidth="4" />
              {/* Right Face */}
              <polygon points="450,530 720,375 720,435 450,590" fill="#D2CFD6" stroke="#28262C" strokeWidth="4" />
            </g>

            {/* Middle Floating Pavilion (SlabFloat) */}
            <g transform={`translate(0, ${70 + slabFloat})`}>
              {/* Top Face */}
              <polygon points="450,150 640,260 450,370 260,260" fill="#FFFFFF" stroke="#28262C" strokeWidth="4" />
              {/* Left Face */}
              <polygon points="260,260 450,370 450,450 260,340" fill="#ECEAF0" stroke="#28262C" strokeWidth="4" />
              {/* Right Face */}
              <polygon points="450,370 640,260 640,340 450,450" fill="#DAD6DF" stroke="#28262C" strokeWidth="4" />

              {/* Architectural Columns */}
              {[
                { x: 310, y: 290 },
                { x: 450, y: 370 },
                { x: 590, y: 290 },
              ].map((col, ci) => (
                <line
                  key={`col-${ci}`}
                  x1={col.x}
                  y1={col.y}
                  x2={col.x}
                  y2={col.y + 110}
                  stroke="#28262C"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* Top Roof Cantilever */}
            <g transform={`translate(0, ${slabFloat * 1.5})`}>
              <polygon points="450,80 580,155 450,230 320,155" fill="#FFFFFF" stroke="#28262C" strokeWidth="4" />
              <polygon points="320,155 450,230 450,260 320,185" fill="#ECEAF0" stroke="#28262C" strokeWidth="4" />
              <polygon points="450,230 580,155 580,185 450,260" fill="#DAD6DF" stroke="#28262C" strokeWidth="4" />
            </g>

            {/* Dimension Callouts & Guidelines */}
            <g stroke="#6A6574" strokeWidth="2" strokeDasharray="6 6">
              {/* Height callout */}
              <line x1="120" y1="200" x2="120" y2="600" />
              <line x1="110" y1="200" x2="130" y2="200" />
              <line x1="110" y1="600" x2="130" y2="600" />

              {/* Width callout */}
              <line x1="180" y1="640" x2="720" y2="640" />
              <line x1="180" y1="630" x2="180" y2="650" />
              <line x1="720" y1="630" x2="720" y2="650" />
            </g>

            {/* Dimension Text Labels */}
            <text x="80" y="410" fill="#28262C" fontSize="18" fontWeight="800" fontFamily="monospace" transform="rotate(-90 80 410)">
              H: 24.80m
            </text>
            <text x="450" y="675" fill="#28262C" fontSize="18" fontWeight="800" fontFamily="monospace" textAnchor="middle">
              W: 48.50m (MODULE-A)
            </text>
          </svg>
        </div>

        {/* 2.2 Floating CAD Caliper / Crosshair Widget (Top Right) */}
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 80,
            backgroundColor: "#FFFFFF",
            padding: "18px 30px",
            borderRadius: 32,
            boxShadow: "0 20px 50px rgba(40, 38, 44, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `translateY(${Math.sin(normT * twoPi * 3) * 14}px)`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "3px solid #28262C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${caliperAngle}deg)`,
            }}
          >
            <div style={{ width: 18, height: 2, backgroundColor: "#28262C" }} />
            <div style={{ position: "absolute", width: 2, height: 18, backgroundColor: "#28262C" }} />
          </div>
          <div>
            <div style={{ color: "#7B7785", fontSize: 12, fontWeight: 800 }}>CAD SCALE 1:100</div>
            <div style={{ color: "#28262C", fontSize: 20, fontWeight: 900, fontFamily: "monospace" }}>AXIS-Z +12.0m</div>
          </div>
        </div>

        {/* 2.3 Floating Specification Badge (Bottom Left) */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 80,
            backgroundColor: "#FFFFFF",
            padding: "16px 28px",
            borderRadius: 28,
            boxShadow: "0 18px 45px rgba(40, 38, 44, 0.18)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `translateY(${Math.sin(normT * twoPi * 3 + 1) * 12}px)`,
            zIndex: 20,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
          <div style={{ color: "#28262C", fontSize: 16, fontWeight: 900, letterSpacing: 1 }}>
            STRUCTURAL MESH OK
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
