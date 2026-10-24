import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { HeroStaging } from "../craft/HeroStaging";

/**
 * ElectricBlueAudioSpectrum4K - Stock Motion Graphics Video 06/81
 * Reference: istockphoto-1308029391-640_adpp_is.mp4 (10.0s)
 *
 * Strict Fix based on User Feedback:
 * 1. ZERO LEFT-TO-RIGHT DRIFT! Stationary in-place vertical bouncing only!
 * 2. EXACT COLOR PALETTE AS IS: Deep electric blue (#00B0FF, #2979FF) and specular white caps (matching reference)
 * 3. NO extra curved squiggly lines!
 * 4. ZERO blobs or background gradients (100% Solid Pure #000000 base)
 * 5. 100% Centered on 4K canvas (Cx: 0.50, Cy: 0.50)
 * 6. Structured keyframed musical dynamics ("Aga Gora Matha")
 */
export const ElectricBlueAudioSpectrum4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  // Hero container bounded strictly to central safe viewport
  const heroW = 2800;
  const heroH = 1000;
  const centerX = heroW * 0.5;
  const centerY = heroH * 0.5;

  const time = frame / fps;

  // =========================================================================
  // STRUCTURED KEYFRAMED MOTION ENVELOPE ("AGA GORA MATHA")
  // =========================================================================
  const dynamicKeyframeAmp = interpolate(
    frame,
    [0, 60, 150, 200, 240, 360, 420, 480, 540, 600],
    [0.17, 0.45, 1.45, 1.20, 0.35, 0.35, 1.30, 0.90, 0.30, 0.17],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Transient kick pulse
  const kickPulse = Math.pow(Math.max(0, Math.sin(time * 10.0)), 8) * 0.45;
  const totalAmp = dynamicKeyframeAmp * (1.0 + kickPulse);

  // Number of vertical frequency rods across the baseline (High density: 64 rods)
  const BAR_COUNT = 64;
  const bars = useMemo(() => {
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const normDist = (i - (BAR_COUNT - 1) / 2) / ((BAR_COUNT - 1) / 2);
      const absDist = Math.abs(normDist);
      const envelope = Math.exp(-Math.pow(absDist * 1.85, 2));

      // Fixed pseudo-random seed per bar to PREVENT left-to-right traveling wave
      const seed = Math.sin(i * 543.21) * 65432.1;
      const f1 = 8.0 + (i % 6) * 3.2;
      const f2 = 14.0 + (i % 8) * 2.6;

      return { id: i, normDist, absDist, envelope, seed, f1, f2 };
    });
  }, [BAR_COUNT]);

  const barHeights = useMemo(() => {
    return bars.map((b) => {
      // IN-PLACE VERTICAL BOUNCING: NO traveling horizontal wave term!
      const pulse1 = Math.abs(Math.sin(time * b.f1 + b.seed));
      const pulse2 = Math.abs(Math.cos(time * b.f2 + b.seed * 1.4));
      const flutter = Math.sin(time * 42.0 + b.seed) * 0.18;

      const rawVal = (pulse1 * 0.55 + pulse2 * 0.35 + flutter + kickPulse) * b.envelope * totalAmp;
      return Math.max(6, rawVal * 390);
    });
  }, [bars, time, totalAmp, kickPulse]);

  return (
    <HeroStaging width={width} height={height} ambientGrid={false}>
      <div
        style={{
          width: heroW,
          height: heroH,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Layer 1: Central Horizon Axis Line */}
        <div
          style={{
            position: "absolute",
            width: 2600,
            height: 2,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0, 176, 255, 0.4) 15%, rgba(255, 255, 255, 0.95) 50%, rgba(0, 176, 255, 0.4) 85%, transparent 100%)",
            top: centerY - 1,
            left: 100,
            boxShadow: "0 0 14px rgba(0, 176, 255, 0.6)",
          }}
        />

        {/* Layer 2: Stationary In-Place Vertical Spectrum Analyzer Rods */}
        <div
          style={{
            position: "absolute",
            width: 2600,
            height: 1000,
            left: 100,
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "none",
          }}
        >
          {bars.map((b, i) => {
            const h = barHeights[i];
            return (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 14,
                  height: "100%",
                }}
              >
                {/* Top Rod */}
                <div
                  style={{
                    width: 7.0,
                    height: h,
                    background:
                      "linear-gradient(to top, rgba(0, 176, 255, 0.95), rgba(255, 255, 255, 0.98))",
                    borderRadius: "3px 3px 1px 1px",
                    boxShadow: "0 0 10px rgba(0, 176, 255, 0.65)",
                    transform: "translateY(-2px)",
                  }}
                />
                {/* Specular White Cap Dot at the peak */}
                <div
                  style={{
                    width: 9.0,
                    height: 3.5,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 1.5,
                    boxShadow:
                      "0 0 6px #FFFFFF, 0 0 12px rgba(0, 176, 255, 0.95)",
                    transform: `translateY(-${h + 4}px)`,
                    position: "absolute",
                  }}
                />
                {/* Bottom Mirrored Rod */}
                <div
                  style={{
                    width: 7.0,
                    height: h * 0.72,
                    background:
                      "linear-gradient(to bottom, rgba(41, 121, 255, 0.85), rgba(26, 35, 126, 0.45))",
                    borderRadius: "1px 1px 3px 3px",
                    boxShadow: "0 0 8px rgba(41, 121, 255, 0.4)",
                    transform: "translateY(2px)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </HeroStaging>
  );
};
