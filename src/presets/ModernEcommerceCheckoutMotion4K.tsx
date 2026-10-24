import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * ModernEcommerceCheckoutMotion4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-End Commercial 3D E-Commerce Checkout & Gift Voucher Animation:
 * - Mint Aqua Teal backdrop (#5CE0D3 to #2BA89B) with soft ambient vignette
 * - Central 3D floating shopping bag with crisp white geometric geometry
 * - Golden Orange (#F7A207) discount coupon card with barcode & holographic shine
 * - Floating 3D golden coins, discount badges, and smooth harmonic parallax bobbing
 * - 100% mathematical seamless loop closure (frame 0 == frame 720)
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const ModernEcommerceCheckoutMotion4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const TOTAL_FRAMES = 720;
  const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0
  const twoPi = Math.PI * 2;

  // Harmonic Float & Easing (Integer harmonic multipliers for seamless loop)
  const mainFloatY = Math.sin(normT * twoPi * 2) * 22;
  const mainTilt = Math.sin(normT * twoPi * 2) * 2.5; // subtle tilt in degrees
  const cardFloatY = Math.sin(normT * twoPi * 3 + 0.8) * 16;
  const badgePulse = 1 + Math.sin(normT * twoPi * 4) * 0.05;

  // Floating Micro-Coins positions & 3D spins
  const coins = [
    { x: -520, y: -220, r: 60, speed: 2, delay: 0 },
    { x: 540, y: -160, r: 75, speed: 3, delay: 1.2 },
    { x: -440, y: 260, r: 50, speed: 2, delay: 2.5 },
    { x: 480, y: 320, r: 65, speed: 3, delay: 0.7 },
  ];

  // Shimmer Sweep Offset (Cycles 6 times across 12s)
  const shimmerOffset = ((normT * 6) % 1.0) * 1200 - 400;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#5CE0D3",
        overflow: "hidden",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Layer 1: Ambient Mint Aqua Radial Glow & Subtle Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 48%, #72ECE0 0%, #5CE0D3 55%, #35B5A7 100%)",
        }}
      />

      {/* Subtle Dot Grid Background */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="3.5" fill="#FFFFFF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>

      {/* Layer 2: Floating Ambient Gold Coins */}
      {coins.map((coin, idx) => {
        const coinFloat = Math.sin(normT * twoPi * coin.speed + coin.delay) * 25;
        const spinScaleX = Math.cos(normT * twoPi * coin.speed + coin.delay);
        return (
          <div
            key={`coin-${idx}`}
            style={{
              position: "absolute",
              transform: `translate(${coin.x}px, ${coin.y + coinFloat}px) scaleX(${spinScaleX})`,
              width: coin.r * 2,
              height: coin.r * 2,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FFE17D 0%, #F7A207 70%, #C47900 100%)",
              boxShadow: "0 15px 35px rgba(196, 121, 0, 0.35), inset 0 2px 4px #FFF5D0",
              border: "3px solid #FFF5D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: coin.r * 1.3,
                height: coin.r * 1.3,
                borderRadius: "50%",
                border: "2px dashed #C47900",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: coin.r * 0.8,
                fontWeight: 900,
                fontFamily: "-apple-system, sans-serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              $
            </div>
          </div>
        );
      })}

      {/* Layer 3: Main Central Hero Assembly (Shopping Bag + Coupon Card) */}
      <div
        style={{
          position: "relative",
          width: 1400,
          height: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${mainFloatY}px) rotate(${mainTilt}deg)`,
        }}
      >
        {/* Soft Drop Shadow under Hero */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            width: 800,
            height: 70,
            borderRadius: "50%",
            backgroundColor: "rgba(35, 110, 102, 0.28)",
            filter: "blur(30px)",
            transform: `scale(${1 - mainFloatY / 150})`,
          }}
        />

        {/* 3.1 Hero Pure White Shopping Bag */}
        <div
          style={{
            position: "absolute",
            width: 760,
            height: 820,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Bag Handles */}
          <svg width="340" height="180" viewBox="0 0 340 180" style={{ marginBottom: -30, zIndex: 1 }}>
            <path
              d="M 60 170 C 60 40, 280 40, 280 170"
              fill="none"
              stroke="#DCE5EE"
              strokeWidth="24"
              strokeLinecap="round"
            />
          </svg>

          {/* Bag Body */}
          <div
            style={{
              width: "100%",
              height: 670,
              backgroundColor: "#FFFFFF",
              borderRadius: 36,
              boxShadow: "0 30px 70px rgba(28, 95, 88, 0.22), inset 0 2px 6px rgba(255, 255, 255, 0.9)",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(220, 230, 240, 0.8)",
            }}
          >
            {/* Bag Top Rim Shadow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 40,
                background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.04), transparent)",
              }}
            />

            {/* Subtle Vertical Bag Pleat Lines */}
            <div style={{ position: "absolute", left: 160, top: 0, bottom: 0, width: 2, backgroundColor: "rgba(0,0,0,0.03)" }} />
            <div style={{ position: "absolute", right: 160, top: 0, bottom: 0, width: 2, backgroundColor: "rgba(0,0,0,0.03)" }} />
          </div>
        </div>

        {/* 3.2 Floating Golden Voucher / Discount Card (Overlapping Bag) */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 380,
            borderRadius: 28,
            background: "linear-gradient(135deg, #FFB92D 0%, #F7A207 60%, #E68500 100%)",
            boxShadow: "0 25px 60px rgba(180, 100, 0, 0.38), inset 0 2px 4px rgba(255, 255, 255, 0.6)",
            transform: `translateY(${cardFloatY + 30}px) rotate(-4deg)`,
            padding: "36px 48px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          {/* Shimmer Light Reflection Sweep */}
          <div
            style={{
              position: "absolute",
              top: -200,
              left: shimmerOffset,
              width: 140,
              height: 800,
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)",
              transform: "rotate(25deg)",
              pointerEvents: "none",
            }}
          />

          {/* Top Row: VIP Discount & Star Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 42,
                  borderRadius: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  border: "2px solid #FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 28, height: 18, border: "2px solid #FFFFFF", borderRadius: 4 }} />
              </div>
              <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 26, letterSpacing: 2, textTransform: "uppercase" }}>
                PREMIUM PASS
              </div>
            </div>
            
            {/* Pulsing % Badge */}
            <div
              style={{
                transform: `scale(${badgePulse})`,
                backgroundColor: "#FFFFFF",
                color: "#E68500",
                fontWeight: 900,
                fontSize: 22,
                padding: "8px 20px",
                borderRadius: 24,
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>50%</span>
              <span style={{ fontSize: 16 }}>OFF</span>
            </div>
          </div>

          {/* Middle: Barcode & Coupon Digits */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Barcode Graphic */}
            <div style={{ display: "flex", gap: 4, height: 50, alignItems: "flex-end" }}>
              {[6, 2, 8, 3, 10, 4, 7, 2, 9, 5, 12, 3, 6, 8, 4, 10, 2, 8, 4].map((bw, bi) => (
                <div
                  key={`bar-${bi}`}
                  style={{
                    width: bw * 1.8,
                    height: "100%",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>CODE</div>
              <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 800, letterSpacing: 3, fontFamily: "monospace" }}>
                STOCK-2026
              </div>
            </div>
          </div>

          {/* Bottom Row: Accent Dot Line & Expiry */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px dashed rgba(255,255,255,0.4)",
              paddingTop: 16,
            }}
          >
            <div style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 700, letterSpacing: 1.5 }}>
              LIMITED EDITION VOUCHER
            </div>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600 }}>
              VALID WORLDWIDE
            </div>
          </div>
        </div>

        {/* 3.3 Floating Success / Add to Cart Pill Badge */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            right: 140,
            backgroundColor: "#FFFFFF",
            padding: "16px 32px",
            borderRadius: 40,
            boxShadow: "0 18px 45px rgba(28, 95, 88, 0.28)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 15,
            transform: `translateY(${Math.sin(normT * twoPi * 3 + 1.5) * 12}px)`,
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
            ✓
          </div>
          <div style={{ color: "#182B70", fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>
            ORDER CONFIRMED
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
