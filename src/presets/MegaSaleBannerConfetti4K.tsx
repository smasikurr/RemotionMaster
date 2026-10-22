import React, { useMemo } from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * MegaSaleBannerConfetti4K
 * E-commerce promotional sale banner with spring typography bounce & downward falling confetti physics.
 * 4K UHD (3840x2160) @ 60 FPS, 8s promo (480 frames).
 */
export const MegaSaleBannerConfetti4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 140, mass: 1 },
    durationInFrames: 40,
  });

  const sweepProgress = (frame % 90) / 90;
  const sweepX = -400 + sweepProgress * (width + 800);

  const confetti = useMemo(() => {
    const list = [];
    const colors = ["#FF1E27", "#FFC107", "#FFFFFF", "#00F0FF", "#E91E63"];
    for (let i = 0; i < 120; i++) {
      list.push({
        baseX: (i * 31.7) % 100,
        speed: 3 + (i % 5),
        rotSpeed: 4 + (i % 7),
        sizeW: 14 + (i % 12),
        sizeH: 22 + (i % 18),
        color: colors[i % colors.length],
        delay: (i * 4) % 120,
      });
    }
    return list;
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080608",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width,
        height,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, #2A080C 0%, #0D0305 60%, #000000 100%)",
        }}
      />

      {confetti.map((c, idx) => {
        const localTime = Math.max(0, frame - c.delay);
        const cy = ((localTime * c.speed * 8) % (height + 200)) - 100;
        const rot = localTime * c.rotSpeed;
        const driftX = Math.sin(localTime * 0.05 + idx) * 45;

        return (
          <div
            key={`conf-${idx}`}
            style={{
              position: "absolute",
              left: `${c.baseX}%`,
              top: cy,
              width: c.sizeW,
              height: c.sizeH,
              backgroundColor: c.color,
              transform: `translateX(${driftX}px) rotate(${rot}deg) rotateX(${rot * 0.7}deg)`,
              borderRadius: 3,
              boxShadow: `0 0 10px ${c.color}60`,
            }}
          />
        );
      })}

      <div
        style={{
          transform: `scale(${titleSpring}) translateY(${(1 - titleSpring) * 160}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 15,
          zIndex: 5,
        }}
      >
        <div
          style={{
            padding: "16px 48px",
            borderRadius: 40,
            backgroundColor: "#FF1E27",
            color: "#FFFFFF",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: 8,
            textTransform: "uppercase",
            boxShadow: "0 10px 30px rgba(255, 30, 39, 0.5)",
          }}
        >
          LIMITED TIME OFFER
        </div>

        <div
          style={{
            position: "relative",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 220,
            fontWeight: 900,
            letterSpacing: -6,
            color: "#FFC107",
            textTransform: "uppercase",
            textShadow: `
              0 4px 0 #D4AF37,
              0 8px 0 #996515,
              0 14px 25px rgba(0, 0, 0, 0.9),
              0 0 60px rgba(255, 193, 7, 0.4)
            `,
            overflow: "hidden",
            padding: "0 40px",
          }}
        >
          MEGA SALE
        </div>

        <div
          style={{
            padding: "24px 70px",
            borderRadius: 60,
            background: "linear-gradient(90deg, #FF1E27, #E91E63)",
            color: "#FFFFFF",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: 4,
            boxShadow: "0 15px 50px rgba(233, 30, 99, 0.6)",
          }}
        >
          UP TO 50% OFF
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: sweepX,
          top: 0,
          bottom: 0,
          width: 280,
          transform: "skewX(-25deg)",
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
          filter: "blur(20px)",
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 160px rgba(0, 0, 0, 0.85)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
