import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

export const KineticMinimalistLogoReveal4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Entrance Spring for the Central Monogram
  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 70, mass: 0.9 },
  });

  const logoRotation = interpolate(frame, [10, 90], [-45, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // 2. Stroke Draw Progress (0 to 1)
  const drawProgress = interpolate(frame, [5, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // 3. Facet Fill Opacity & Specular Sheen
  const fillOpacity = interpolate(frame, [45, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Diagonal Light Gleam Sweep across Logo
  const gleamX = interpolate(frame, [70, 150], [-400, 1200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  // 4. Text Reveal (Brand & Tagline)
  const textOpacity = interpolate(frame, [60, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textTranslateY = interpolate(frame, [60, 105], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const letterSpacing = interpolate(frame, [65, 180], [12, 28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.1, 0.9, 0.2, 1),
  });

  const lineWidth = interpolate(frame, [85, 140], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // 5. Ambient Micro-particles (40 floating stars)
  const particles = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const angle = (i / 48) * Math.PI * 2 + (i * 0.37);
      const dist = 180 + (i % 7) * 90;
      const speed = 0.4 + (i % 5) * 0.2;
      const size = 2.5 + (i % 4) * 2.0;
      return { angle, dist, speed, size, seed: i };
    });
  }, []);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#000000",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Background Subtle Radial Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(25, 32, 48, 0.45) 0%, rgba(0, 0, 0, 0.95) 75%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating Micro-Embers / Dust Particles */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {particles.map((p, idx) => {
          const currentDist = p.dist + (frame * p.speed * 2.2);
          const px = width / 2 + Math.cos(p.angle) * currentDist;
          const py = height / 2 - 120 + Math.sin(p.angle) * currentDist * 0.7;
          const pAlpha = interpolate(
            frame,
            [20, 60, 240, 290],
            [0, 0.75, 0.75, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          if (px < 0 || px > width || py < 0 || py > height) return null;
          return (
            <circle
              key={idx}
              cx={px}
              cy={py}
              r={p.size}
              fill="#94a3b8"
              opacity={pAlpha}
              filter="blur(1px)"
            />
          );
        })}
      </svg>

      {/* Main Logo & Identity Center Stage */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          transform: `translateY(-40px)`,
        }}
      >
        {/* Geometric Origami Hex Monogram Emblem */}
        <div
          style={{
            position: "relative",
            width: 720,
            height: 720,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
            filter: "drop-shadow(0 20px 45px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 35px rgba(56, 189, 248, 0.2))",
          }}
        >
          <svg
            viewBox="-200 -200 400 400"
            width={720}
            height={720}
            style={{ overflow: "visible" }}
          >
            <defs>
              {/* Metallic Gradients for Facets */}
              <linearGradient id="facetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="facetGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="60%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="facetGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>

              {/* Gleam Clip Path */}
              <clipPath id="logoClip">
                <polygon points="0,-160 138.56,-80 138.56,80 0,160 -138.56,80 -138.56,-80" />
              </clipPath>
            </defs>

            {/* Inner Facet 1: Top-Right */}
            <polygon
              points="0,0 0,-160 138.56,-80"
              fill="url(#facetGrad1)"
              fillOpacity={fillOpacity}
              stroke="url(#edgeGlow)"
              strokeWidth={4.5}
              strokeDasharray={480}
              strokeDashoffset={480 * (1 - drawProgress)}
            />

            {/* Inner Facet 2: Right */}
            <polygon
              points="0,0 138.56,-80 138.56,80"
              fill="url(#facetGrad2)"
              fillOpacity={fillOpacity * 0.9}
              stroke="url(#edgeGlow)"
              strokeWidth={4.5}
              strokeDasharray={480}
              strokeDashoffset={480 * (1 - drawProgress)}
            />

            {/* Inner Facet 3: Bottom-Right */}
            <polygon
              points="0,0 138.56,80 0,160"
              fill="url(#facetGrad3)"
              fillOpacity={fillOpacity * 0.85}
              stroke="url(#edgeGlow)"
              strokeWidth={4.5}
              strokeDasharray={480}
              strokeDashoffset={480 * (1 - drawProgress)}
            />

            {/* Inner Facet 4: Bottom-Left */}
            <polygon
              points="0,0 0,160 -138.56,80"
              fill="url(#facetGrad1)"
              fillOpacity={fillOpacity * 0.75}
              stroke="url(#edgeGlow)"
              strokeWidth={4.5}
              strokeDasharray={480}
              strokeDashoffset={480 * (1 - drawProgress)}
            />

            {/* Inner Facet 5: Left */}
            <polygon
              points="0,0 -138.56,80 -138.56,-80"
              fill="url(#facetGrad2)"
              fillOpacity={fillOpacity * 0.8}
              stroke="url(#edgeGlow)"
              strokeWidth={4.5}
              strokeDasharray={480}
              strokeDashoffset={480 * (1 - drawProgress)}
            />

            {/* Inner Facet 6: Top-Left */}
            <polygon
              points="0,0 -138.56,-80 0,-160"
              fill="url(#facetGrad3)"
              fillOpacity={fillOpacity * 0.95}
              stroke="url(#edgeGlow)"
              strokeWidth={4.5}
              strokeDasharray={480}
              strokeDashoffset={480 * (1 - drawProgress)}
            />

            {/* Central Precision Hex Core */}
            <circle
              cx={0}
              cy={0}
              r={18}
              fill="#ffffff"
              opacity={fillOpacity}
              filter="drop-shadow(0 0 12px #38bdf8)"
            />

            {/* Diagonal Specular Gleam Sweep */}
            <g clipPath="url(#logoClip)">
              <rect
                x={gleamX - 100}
                y={-220}
                width={160}
                height={440}
                fill="url(#edgeGlow)"
                opacity={0.35}
                transform="rotate(25)"
                style={{ mixBlendMode: "screen", filter: "blur(8px)" }}
              />
            </g>
          </svg>
        </div>

        {/* Brand Typography & Tagline */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          {/* Main Brand Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: `${letterSpacing}px`,
              color: "#ffffff",
              textTransform: "uppercase",
              textShadow: "0 4px 24px rgba(0,0,0,0.9), 0 0 30px rgba(56, 189, 248, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            BRAND LOGO
          </div>

          {/* Elegant Horizontal Divider Rules */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 20,
            }}
          >
            <div
              style={{
                width: lineWidth,
                height: 2,
                background: "linear-gradient(90deg, transparent, #38bdf8)",
              }}
            />
            <div
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#38bdf8",
                transform: "rotate(45deg)",
                boxShadow: "0 0 10px #38bdf8",
              }}
            />
            <div
              style={{
                width: lineWidth,
                height: 2,
                background: "linear-gradient(90deg, #38bdf8, transparent)",
              }}
            />
          </div>

          {/* Subtitle / Tagline */}
          <div
            style={{
              marginTop: 18,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "14px",
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            INNOVATION & TECHNOLOGY
          </div>
        </div>
      </div>
    </div>
  );
};
