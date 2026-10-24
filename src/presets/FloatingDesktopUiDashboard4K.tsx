import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * FloatingDesktopUiDashboard4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end 3D floating desktop workspace with:
 * - Ultra-thin modern studio display on aluminum pedestal
 * - Animated live dashboard (revenue area chart, bar metrics, activity feed)
 * - Floating staggered UI cards (Analytics pill, Message notification, Performance gauge)
 * - Calibrated spring entrances & continuous trigonometric breathing
 * - Soft pastel cyan studio backdrop with realistic drop shadows
 * 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const FloatingDesktopUiDashboard4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const loopT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0 to 1
  const twoPi = Math.PI * 2;

  // 1. Living Organic Idle Motion (Harmonic trigonometric oscillation for 100% seamless loop)
  // Float cycles: 2 complete cycles over 12s -> sin(loopT * 2 * 2pi) == 0 at frame 0 and 720
  const floatY = Math.sin(loopT * twoPi * 2) * 22;
  const rotY = Math.sin(loopT * twoPi) * 8; // subtle orbital rotation
  const rotX = 6 + Math.cos(loopT * twoPi * 2) * 3;

  // 2. Spring Entrances for Monitor & Floating UI Cards
  const monitorSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 85, mass: 1.2 }, // smooth luxury entrance
  });

  const card1Spring = spring({
    frame: frame - 25, // Staggered entrance at ~0.4s
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 }, // snappy spring
  });

  const card2Spring = spring({
    frame: frame - 50, // Staggered entrance at ~0.8s
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.9 },
  });

  const card3Spring = spring({
    frame: frame - 75, // Staggered entrance at ~1.2s
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.7 },
  });

  // 3. Dynamic Animated Dashboard Data (Charts & Metrics)
  const chartProgress = interpolate(frame, [30, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Metric Counter: Counts from $0 to $128,450
  const counterVal = Math.floor(
    interpolate(frame, [40, 200], [0, 128450], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#7FC4D4",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 2000,
      }}
    >
      {/* Layer 1: Soft Studio Radial Gradient Mesh & Floor Horizon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 38%, #96D5E3 0%, #7FC4D4 55%, #62AFC0 100%)",
        }}
      />

      {/* Floating Ambient Lighting Dust Particles */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {Array.from({ length: 24 }).map((_, idx) => {
          const px = (idx * 163 + frame * 0.4) % width;
          const py = (idx * 97 + Math.sin(frame * 0.02 + idx) * 40) % height;
          const pr = 2 + (idx % 4);
          const pAlpha = 0.2 + (Math.sin(frame * 0.05 + idx * 2) * 0.5 + 0.5) * 0.35;
          return <circle key={`dust-${idx}`} cx={px} cy={py} r={pr} fill="#FFFFFF" opacity={pAlpha} />;
        })}
      </svg>

      {/* Realistic Floor Contact Shadow */}
      <div
        style={{
          position: "absolute",
          bottom: 240,
          width: 2200,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(32, 68, 78, 0.45) 0%, rgba(32, 68, 78, 0.15) 50%, transparent 80%)",
          filter: "blur(40px)",
          transform: `scale(${1 - floatY * 0.003})`,
        }}
      />

      {/* Layer 2: Main 3D Floating Rig (Monitor + Stand + Orbiting Widgets) */}
      <div
        style={{
          position: "relative",
          width: 2400,
          height: 1450,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          transform: `translateY(${floatY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${monitorSpring})`,
        }}
      >
        {/* Monitor Screen Frame */}
        <div
          style={{
            position: "relative",
            width: 1980,
            height: 1180,
            backgroundColor: "#16191F",
            borderRadius: 36,
            padding: 16,
            boxShadow: "0 45px 100px rgba(18, 44, 52, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.25)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Bezel Camera Dot */}
          <div
            style={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#2E333D",
              boxShadow: "0 0 2px rgba(255, 255, 255, 0.3)",
            }}
          />

          {/* Active Screen Display (Modern Dashboard) */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#F4F7FC",
              borderRadius: 24,
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Sidebar Navigation */}
            <div
              style={{
                width: 280,
                backgroundColor: "#1E222D",
                padding: "36px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Brand Logo Pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #00C6FF, #0072FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 18, height: 18, border: "3px solid #FFF", borderRadius: 4 }} />
                </div>
                <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 22, letterSpacing: 0.5, fontFamily: "-apple-system, sans-serif" }}>
                  SYNC<span style={{ color: "#00C6FF" }}>OS</span>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              {["Dashboard", "Analytics", "Customers", "Campaigns", "Settings"].map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 16px",
                    borderRadius: 12,
                    backgroundColor: i === 0 ? "rgba(0, 198, 255, 0.15)" : "transparent",
                    color: i === 0 ? "#00C6FF" : "#8A94A6",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "-apple-system, sans-serif",
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: i === 0 ? "#00C6FF" : "#4A5263" }} />
                  {item}
                </div>
              ))}

              <div style={{ marginTop: "auto", padding: "16px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 16 }}>
                <div style={{ color: "#8A94A6", fontSize: 13, fontWeight: 600 }}>STORAGE USED</div>
                <div style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 800, marginTop: 4 }}>78.4% of 10 TB</div>
                <div style={{ width: "100%", height: 6, backgroundColor: "#323846", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
                  <div style={{ width: "78%", height: "100%", background: "linear-gradient(90deg, #00C6FF, #0072FF)" }} />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: "36px 44px", display: "flex", flexDirection: "column", gap: 28, overflow: "hidden" }}>
              {/* Top Header Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#111827", fontFamily: "-apple-system, sans-serif" }}>
                    Performance Overview
                  </div>
                  <div style={{ fontSize: 16, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                    Live telemetry across global server infrastructure
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ padding: "10px 20px", borderRadius: 10, backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", fontWeight: 700, color: "#374151", fontSize: 14 }}>
                    Last 30 Days ▼
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B6B, #FF8E53)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 800 }}>
                    JD
                  </div>
                </div>
              </div>

              {/* Metric Cards Row */}
              <div style={{ display: "flex", gap: 24 }}>
                {[
                  { label: "Total Revenue", val: `$${counterVal.toLocaleString()}`, change: "+24.8%", pos: true },
                  { label: "Active Nodes", val: "14,892", change: "+8.2%", pos: true },
                  { label: "Latency Avg", val: "18.4 ms", change: "-4.6%", pos: true },
                  { label: "Error Rate", val: "0.002%", change: "Optimal", pos: true },
                ].map((stat, idx) => (
                  <div
                    key={stat.label}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 18,
                      padding: "20px 24px",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>{stat.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginTop: 6, fontFamily: "-apple-system, sans-serif" }}>
                      {stat.val}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      ▲ {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Area Chart Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 22,
                  padding: "28px 32px",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Network Throughput Flow</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0072FF", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#0072FF" }} /> Inbound (TB/s)
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#FF6B6B", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FF6B6B" }} /> Outbound (TB/s)
                    </span>
                  </div>
                </div>

                {/* Animated Vector SVG Area Chart */}
                <div style={{ flex: 1, position: "relative" }}>
                  <svg style={{ width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 1000 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0072FF" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#0072FF" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="chartGradPink" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines */}
                    {[50, 120, 190, 260].map((gy) => (
                      <line key={`grid-${gy}`} x1="0" y1={gy} x2="1000" y2={gy} stroke="#F3F4F6" strokeWidth="2" strokeDasharray="6 6" />
                    ))}

                    {/* Inbound Area Wave */}
                    {(() => {
                      const points = [
                        [0, 240], [120, 210], [240, 140], [360, 170], [480, 80], [600, 110], [720, 60], [840, 130], [1000, 70]
                      ];
                      const animatedPoints = points.map(([x, y]) => [
                        x,
                        300 - (300 - y) * chartProgress + Math.sin(x * 0.01 + loopT * twoPi * 2) * 12
                      ]);
                      const dPath = animatedPoints.reduce((acc, [x, y], i) => (i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`), "");
                      return (
                        <>
                          <path d={`${dPath} L 1000 300 L 0 300 Z`} fill="url(#chartGradBlue)" />
                          <path d={dPath} fill="none" stroke="#0072FF" strokeWidth="4" strokeLinecap="round" />
                          {animatedPoints.map(([x, y], pi) => (
                            <circle key={`pt-b-${pi}`} cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#0072FF" strokeWidth="3" />
                          ))}
                        </>
                      );
                    })()}

                    {/* Outbound Area Wave */}
                    {(() => {
                      const points2 = [
                        [0, 270], [140, 250], [280, 200], [420, 220], [540, 160], [680, 180], [800, 120], [920, 150], [1000, 110]
                      ];
                      const animatedPoints2 = points2.map(([x, y]) => [
                        x,
                        300 - (300 - y) * chartProgress + Math.cos(x * 0.01 + loopT * twoPi * 2) * 10
                      ]);
                      const dPath2 = animatedPoints2.reduce((acc, [x, y], i) => (i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`), "");
                      return (
                        <>
                          <path d={`${dPath2} L 1000 300 L 0 300 Z`} fill="url(#chartGradPink)" />
                          <path d={dPath2} fill="none" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Realistic Aluminum Monitor Pedestal Stand */}
        <div
          style={{
            width: 220,
            height: 160,
            background: "linear-gradient(to right, #4A5160, #8A94A6, #4A5160)",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.35)",
            borderRadius: "0 0 16px 16px",
            zIndex: -1,
            marginTop: -10,
          }}
        />
        <div
          style={{
            width: 560,
            height: 32,
            background: "linear-gradient(to right, #3A404D, #7A8496, #3A404D)",
            borderRadius: "16px",
            boxShadow: "0 25px 45px rgba(22, 50, 58, 0.4)",
            zIndex: -1,
          }}
        />

        {/* Layer 3: Floating Orbiting UI Cards (Elevated 3D Motion) */}

        {/* Floating Card 1: Top-Right Performance Gauge */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 40,
            width: 380,
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: "24px 28px",
            boxShadow: "0 35px 70px rgba(18, 44, 52, 0.35), 0 0 0 1px rgba(0,0,0,0.06)",
            transform: `translate3d(0, ${Math.sin(loopT * twoPi * 2 + 1) * 26}px, 140px) scale(${card1Spring})`,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div style={{ position: "relative", width: 68, height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="68" height="68" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r="28" fill="none" stroke="#E5E7EB" strokeWidth="6" />
              <circle
                cx="34" cy="34" r="28" fill="none" stroke="#10B981" strokeWidth="6"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 * (1 - 0.94)}
                strokeLinecap="round"
                transform="rotate(-90 34 34)"
              />
            </svg>
            <div style={{ position: "absolute", fontSize: 15, fontWeight: 800, color: "#111827" }}>94%</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", letterSpacing: 0.5 }}>UPTIME STATUS</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981", marginTop: 2 }}>ALL SYSTEMS OK</div>
          </div>
        </div>

        {/* Floating Card 2: Mid-Left Floating Message Notification Card */}
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 20,
            width: 420,
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: "24px 28px",
            boxShadow: "0 40px 80px rgba(18, 44, 52, 0.4), 0 0 0 1px rgba(0,0,0,0.06)",
            transform: `translate3d(0, ${Math.sin(loopT * twoPi * 2 + 2.5) * 30}px, 200px) scale(${card2Spring})`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #FF416C, #FF4B2B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 800 }}>
              ★
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>New Milestone Reached!</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>2 minutes ago</div>
            </div>
          </div>
          <div style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.4 }}>
            Monthly transaction volume surpassed <strong style={{ color: "#111827" }}>$1.2M</strong> threshold with 99.98% uptime.
          </div>
        </div>

        {/* Floating Card 3: Bottom-Right Mini Bar Chart Analytics Widget */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            right: 80,
            width: 360,
            backgroundColor: "#1E222D",
            borderRadius: 24,
            padding: "24px 28px",
            boxShadow: "0 45px 90px rgba(18, 44, 52, 0.5), 0 0 0 1px rgba(255,255,255,0.1)",
            transform: `translate3d(0, ${Math.cos(loopT * twoPi * 2 + 3.8) * 24}px, 160px) scale(${card3Spring})`,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF" }}>CONVERSION SPIKE</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#00C6FF", padding: "2px 8px", backgroundColor: "rgba(0,198,255,0.15)", borderRadius: 6 }}>
              +34.2%
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 90 }}>
            {[45, 68, 52, 88, 74, 98, 82].map((bh, bi) => (
              <div key={`bar-${bi}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: "100%",
                    height: `${bh * (0.8 + Math.sin(loopT * twoPi * 2 + bi) * 0.2)}%`,
                    background: bi === 5 ? "linear-gradient(to top, #00C6FF, #0072FF)" : "#374151",
                    borderRadius: 6,
                    transition: "height 0.2s ease",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
