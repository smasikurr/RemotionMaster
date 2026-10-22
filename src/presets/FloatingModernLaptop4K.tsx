import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * FloatingModernLaptop4K
 * Generic 3D modern laptop mockup floating & rotating smoothly with pure chroma green screen (#00FF00).
 * 4K UHD (3840x2160) @ 60 FPS, 10s loop (600 frames).
 */
export const FloatingModernLaptop4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 600;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  const rotY = Math.sin(t * twoPi) * 22;
  const rotX = 12 + Math.cos(t * twoPi) * 8;
  const floatY = Math.sin(t * twoPi * 2) * 35;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D0F14",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1200,
        width,
        height,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 45%, #1E2330 0%, #0D0F14 70%, #06070A 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "16%",
          width: 1400,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.25) 50%, transparent 80%)",
          filter: "blur(30px)",
          transform: `scale(${1 - floatY * 0.003})`,
        }}
      />

      <div
        style={{
          position: "relative",
          width: 1600,
          height: 980,
          transformStyle: "preserve-3d",
          transform: `translateY(${floatY}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 920,
            backgroundColor: "#2B2B2B",
            borderRadius: "24px 24px 0 0",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.3)",
            padding: "24px 24px 0 24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              alignSelf: "center",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#111111",
              marginBottom: 12,
              boxShadow: "0 0 2px rgba(255,255,255,0.2)",
            }}
          />
          <div
            style={{
              flex: 1,
              backgroundColor: "#00FF00",
              borderRadius: "12px 12px 0 0",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: "-4%",
            width: "108%",
            height: 28,
            bottom: -20,
            backgroundColor: "#1E1E1E",
            borderRadius: "0 0 20px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8), inset 0 2px 2px rgba(255,255,255,0.2)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 140px rgba(0, 0, 0, 0.75)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
