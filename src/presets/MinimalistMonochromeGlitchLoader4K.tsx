import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const MinimalistMonochromeGlitchLoader4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // Periodic sharp glitch slice offsets
  const isGlitch = (frame >= 70 && frame <= 82) || (frame >= 200 && frame <= 214) || (frame >= 350 && frame <= 364);
  const sliceY = isGlitch ? Math.sin(frame * 3) * 18 : 0;
  const sliceX = isGlitch ? Math.cos(frame * 4) * 25 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = 2000;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Pure solid black base, zero gradient
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: masterFade,
        fontFamily: "Inter, 'Helvetica Neue', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: barWidth,
          transform: `translate(${sliceX}px, ${sliceY}px)`,
        }}
      >
        {/* Massive Minimalist Typography Percentage Readout */}
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 260,
            fontWeight: 900,
            letterSpacing: -8,
            lineHeight: 1,
            marginBottom: 40,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <span>{percent < 10 ? `0${percent}` : percent}</span>
          <span style={{ fontSize: 90, marginTop: 24, marginLeft: 16, opacity: 0.6 }}>
            %
          </span>
        </div>

        {/* Minimal Thin Vector Progress Track */}
        <div
          style={{
            width: barWidth,
            height: 8,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: 4,
            }}
          />
        </div>

        {/* Minimalist Sub-Labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: barWidth,
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: 20,
            letterSpacing: 4,
            fontWeight: 600,
          }}
        >
          <span>SYSTEM LOADING</span>
          <span>HIGH-PRECISION BUFFER</span>
          <span>60 FPS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
