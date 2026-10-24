import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * DiagonalMidnightBlueSilkWaves4K
 *
 * Commercial-Grade 4K 60FPS Diagonal Midnight Blue 3D Volumetric Silk Ribbon Waves
 * Based on iStock Reference: istockphoto-2198607795-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (840 frames / 14.0s seamless loop)
 * - 100% Pure Solid Black #000000 base
 * - Distinct 38° diagonal flow axis from bottom-left to top-right
 * - Commanding hero presence: Spans ~2950px width (76.8%) and ~1650px height (76.4%)
 * - All 4 corner zones (15% margin) guaranteed 100% pure black
 * - Multi-tier specular optical bloom (tight 3.8px core + 42px atmospheric blue dispersion)
 */
export const DiagonalMidnightBlueSilkWaves4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cx = width * 0.5; // 1920
  const cy = height * 0.5; // 1080

  const totalFrames = 840;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  // 1. Living Organic Harmonic Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.025,
    amplitudeY: 3.8,
    tiltDegrees: 0.05,
  });

  // Master fade envelopes for seamless loop
  const masterOpacity = interpolate(
    frame,
    [0, 25, 815, 840],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. 5 Multi-Layer Diagonal Ribbon Generators
  const ribbonLayers = useMemo(() => {
    return [
      {
        id: 1,
        offsetY: -320,
        amp: 360,
        freq: 1.05,
        speed: 1.0,
        phase: 0.3,
        opacity: 0.85,
        veilThickness: 340,
        gradId: "diagBlueGrad1",
        strokeW: 4.2,
      },
      {
        id: 2,
        offsetY: -80,
        amp: 340,
        freq: 1.25,
        speed: -1.1,
        phase: 1.8,
        opacity: 0.90,
        veilThickness: 410,
        gradId: "diagBlueGrad2",
        strokeW: 4.8,
      },
      {
        id: 3,
        offsetY: 260,
        amp: 380,
        freq: 1.50,
        speed: 1.3,
        phase: 3.4,
        opacity: 0.80,
        veilThickness: 370,
        gradId: "diagBlueGrad1",
        strokeW: 3.8,
      },
      {
        id: 4,
        offsetY: -200,
        amp: 370,
        freq: 0.90,
        speed: -0.85,
        phase: 4.8,
        opacity: 0.70,
        veilThickness: 320,
        gradId: "diagBlueGrad2",
        strokeW: 3.4,
      },
      {
        id: 5,
        offsetY: 120,
        amp: 320,
        freq: 1.90,
        speed: 1.5,
        phase: 2.6,
        opacity: 0.60,
        veilThickness: 280,
        gradId: "diagBlueGrad1",
        strokeW: 2.8,
      },
    ];
  }, []);

  // Generate smooth spline ribbon paths in rotated coordinate frame
  // Diagonal rotation: -36 degrees
  const ribbonPaths = useMemo(() => {
    const steps = 80;
    const span = 2950; // Total length along diagonal axis (tapers smoothly before corner margins)
    const startU = -span * 0.5;

    return ribbonLayers.map((layer) => {
      const topPts: [number, number][] = [];
      const botPts: [number, number][] = [];
      const ridgePts: [number, number][] = [];

      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const uPos = startU + frac * span;

        // Smooth organic taper envelope: reaches 0 at tips, 1 at center
        const taper = Math.sin(frac * Math.PI);

        // Multi-harmonic undulating elevation perpendicular to diagonal axis
        const wave1 = Math.sin(frac * layer.freq * Math.PI * 2 + t * twoPi * layer.speed + layer.phase);
        const wave2 = Math.cos(frac * layer.freq * 2.2 * Math.PI + t * twoPi * 1.2) * 0.42;
        const wave3 = Math.sin(frac * 4.6 * Math.PI - t * twoPi * 0.7) * 0.22;

        const totalWave = (wave1 + wave2 + wave3) * layer.amp * taper;
        const vPos = layer.offsetY + totalWave;

        // Dynamic breathing thickness of the fluid silk veil
        const curThickness = layer.veilThickness * taper * (0.85 + 0.15 * Math.cos(frac * 6 + t * twoPi));

        const vTop = vPos - curThickness * 0.5;
        const vBot = vPos + curThickness * 0.5;

        topPts.push([uPos, vTop]);
        botPts.push([uPos, vBot]);
        ridgePts.push([uPos, vPos]);
      }

      // Build closed ribbon veil polygon in local coordinates
      let polyD = `M ${topPts[0][0].toFixed(1)} ${topPts[0][1].toFixed(1)} `;
      for (let i = 1; i < topPts.length; i++) {
        polyD += `L ${topPts[i][0].toFixed(1)} ${topPts[i][1].toFixed(1)} `;
      }
      for (let i = botPts.length - 1; i >= 0; i--) {
        polyD += `L ${botPts[i][0].toFixed(1)} ${botPts[i][1].toFixed(1)} `;
      }
      polyD += "Z";

      // Build sharp ridge stroke
      let ridgeD = `M ${ridgePts[0][0].toFixed(1)} ${ridgePts[0][1].toFixed(1)} `;
      for (let i = 1; i < ridgePts.length; i++) {
        ridgeD += `L ${ridgePts[i][0].toFixed(1)} ${ridgePts[i][1].toFixed(1)} `;
      }

      return {
        id: layer.id,
        polyD,
        ridgeD,
        opacity: layer.opacity,
        gradId: layer.gradId,
        strokeW: layer.strokeW,
      };
    });
  }, [ribbonLayers, t, twoPi]);

  // 3. Floating Glacier Starlight Dust Particles
  const dustParticles = useMemo(() => {
    return Array.from({ length: 48 }).map((_, idx) => {
      const seed = idx * 23.491;
      const baseX = 600 + ((seed * 57) % 2640);
      const baseY = 400 + ((seed * 37) % 1360);
      const speedX = 0.025 + ((seed * 3) % 0.045);
      const speedY = 0.02 + ((seed * 7) % 0.035);
      const size = 1.6 + ((seed * 5) % 3.0);
      return { id: idx, baseX, baseY, speedX, speedY, size };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // 100% Pure Solid Black
        width,
        height,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <defs>
          {/* Dual-Pass Specular Silk Glow Filter */}
          <filter id="diagSilkOpticalGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.8" result="tightGlow" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="40.0" result="atmosphericGlow" />
            <feMerge>
              <feMergeNode in="atmosphericGlow" opacity="0.68" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Deep Ocean Blue-to-Steel Cyan Silk Gradient 1 */}
          <linearGradient id="diagBlueGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0" />
            <stop offset="12%" stopColor="#1E3A8A" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#2563EB" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="78%" stopColor="#1D4ED8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </linearGradient>

          {/* Glacier Blue-to-Cyan Silk Gradient 2 */}
          <linearGradient id="diagBlueGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0" />
            <stop offset="18%" stopColor="#1D4ED8" stopOpacity="0.5" />
            <stop offset="48%" stopColor="#7DD3FC" stopOpacity="0.92" />
            <stop offset="72%" stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </linearGradient>

          {/* Feathered Ridge Gradient (Zero Edge Cutoff) */}
          <linearGradient id="diagRidgeTaperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="8%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="92%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Strict 15% Corner Margin Safe Zone Clip Path */}
          <clipPath id="diagCornerSafeZone">
            <path
              d={`
                M 580 0
                L 3260 0
                L 3260 330
                L 3840 330
                L 3840 1830
                L 3260 1830
                L 3260 2160
                L 580 2160
                L 580 1830
                L 0 1830
                L 0 330
                L 580 330
                Z
              `}
            />
          </clipPath>
        </defs>

        {/* Master Motion Group with Living Idle Sway and Corner Safety Clip */}
        <g
          transform={`translate(0, ${idle.idleY})`}
          clipPath="url(#diagCornerSafeZone)"
          opacity={masterOpacity}
        >
          {/* Rotated Group for 35-degree Diagonal Sweep */}
          <g transform={`translate(${cx}, ${cy}) rotate(-35)`}>
            {/* Layer 1: Ambient Volumetric Silk Veils */}
            {ribbonPaths.map((rp) => (
              <path
                key={`veil-${rp.id}`}
                d={rp.polyD}
                fill={`url(#${rp.gradId})`}
                opacity={rp.opacity * 0.72}
                filter="url(#diagSilkOpticalGlow)"
              />
            ))}

            {/* Layer 2: Sharp Specular Ridge Lines with Tapered Glow */}
            {ribbonPaths.map((rp) => (
              <g key={`ridge-group-${rp.id}`} filter="url(#diagSilkOpticalGlow)">
                {/* Cyan Glow Under-Stroke */}
                <path
                  d={rp.ridgeD}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth={rp.strokeW * 1.8}
                  strokeLinecap="round"
                  opacity={rp.opacity * 0.8}
                />
                {/* White-Hot Incandescent Specular Ridge Core with Tapered Ends */}
                <path
                  d={rp.ridgeD}
                  fill="none"
                  stroke="url(#diagRidgeTaperGrad)"
                  strokeWidth={rp.strokeW}
                  strokeLinecap="round"
                  opacity={0.96}
                />
              </g>
            ))}
          </g>

          {/* Layer 3: Floating Cosmic Glacier Particles */}
          {dustParticles.map((dp) => {
            const px = dp.baseX + Math.sin(frame * dp.speedX) * 45;
            const py = dp.baseY + Math.cos(frame * dp.speedY) * 38;
            const alpha = 0.2 + 0.45 * Math.sin(frame * 0.04 + dp.id);
            return (
              <circle
                key={`dp-${dp.id}`}
                cx={px}
                cy={py}
                r={dp.size}
                fill="#E0F2FE"
                opacity={alpha}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
