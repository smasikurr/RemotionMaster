import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * EmeraldAuroraBorealisFluidWave4K
 *
 * Commercial-Grade 4K 60FPS Northern Lights / Emerald Silk Fluid Waves
 * Based on iStock Reference: istockphoto-2190191496-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (600 frames / 10.0s seamless loop)
 * - 100% Pure Solid Black #000000 base
 * - Commanding hero presence: Spans ~2950px width (76.8%) and ~1650px height (76.4%)
 * - All 4 corner zones (15% margin) guaranteed 100% pure black
 * - Multi-tier specular optical bloom (tight 3.5px core + 38px atmospheric green veil)
 * - Organic 3D fluid ribbon curtains with soft tapered feathered ends
 */
export const EmeraldAuroraBorealisFluidWave4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 600;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  // 1. Living Organic Harmonic Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.03,
    amplitudeY: 4.5,
    tiltDegrees: 0.08,
  });

  // Master fade envelopes for seamless loop
  const masterOpacity = interpolate(
    frame,
    [0, 25, 575, 600],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. 5 Multi-Layer Fluid Ribbon Generators
  const ribbonLayers = useMemo(() => {
    return [
      {
        id: 1,
        yBase: 0.38,
        amp: 360,
        freq: 1.1,
        speed: 1.0,
        phase: 0.2,
        opacity: 0.85,
        veilThickness: 320,
        gradId: "auroraEmeraldGrad1",
        strokeW: 4.2,
      },
      {
        id: 2,
        yBase: 0.50,
        amp: 340,
        freq: 1.3,
        speed: -1.2,
        phase: 1.9,
        opacity: 0.90,
        veilThickness: 380,
        gradId: "auroraEmeraldGrad2",
        strokeW: 4.8,
      },
      {
        id: 3,
        yBase: 0.64,
        amp: 410,
        freq: 1.6,
        speed: 1.4,
        phase: 3.5,
        opacity: 0.80,
        veilThickness: 360,
        gradId: "auroraEmeraldGrad1",
        strokeW: 3.8,
      },
      {
        id: 4,
        yBase: 0.44,
        amp: 390,
        freq: 0.95,
        speed: -0.9,
        phase: 4.8,
        opacity: 0.70,
        veilThickness: 310,
        gradId: "auroraEmeraldGrad2",
        strokeW: 3.4,
      },
      {
        id: 5,
        yBase: 0.56,
        amp: 320,
        freq: 2.1,
        speed: 1.6,
        phase: 2.7,
        opacity: 0.60,
        veilThickness: 260,
        gradId: "auroraEmeraldGrad1",
        strokeW: 2.8,
      },
    ];
  }, []);

  // Generate smooth spline ribbon paths across safe horizontal canvas
  // X bounds: [480, 3360] -> Width: 2880px (75.0% canvas width)
  // Corner margin boxes: [0..576, 0..324] and [3264..3840, 1836..2160]
  // With sine taper at u=0 and u=1, amplitude smoothly collapses to 0 at edges.
  const ribbonPaths = useMemo(() => {
    const steps = 80;
    const startX = 480;
    const endX = 3360;
    const spanX = endX - startX;

    return ribbonLayers.map((layer) => {
      const topPts: [number, number][] = [];
      const botPts: [number, number][] = [];
      const ridgePts: [number, number][] = [];

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = startX + u * spanX;

        // Smooth organic taper envelope: reaches 0 at tips, 1 at center
        const taper = Math.sin(u * Math.PI);

        // Multi-harmonic undulating elevation
        const wave1 = Math.sin(u * layer.freq * Math.PI * 2 + t * twoPi * layer.speed + layer.phase);
        const wave2 = Math.cos(u * layer.freq * 2.2 * Math.PI + t * twoPi * 1.3) * 0.42;
        const wave3 = Math.sin(u * 4.8 * Math.PI - t * twoPi * 0.75) * 0.22;

        const totalWave = (wave1 + wave2 + wave3) * layer.amp * taper;
        const centerY = height * layer.yBase + totalWave;

        // Dynamic breathing thickness of the fluid silk veil
        const curThickness = layer.veilThickness * taper * (0.85 + 0.15 * Math.cos(u * 6 + t * twoPi));

        const topY = centerY - curThickness * 0.5;
        const botY = centerY + curThickness * 0.5;

        topPts.push([x, topY]);
        botPts.push([x, botY]);
        ridgePts.push([x, centerY]);
      }

      // Build closed ribbon veil polygon
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
  }, [height, ribbonLayers, t, twoPi]);

  // 3. Floating Aurora Starlight Dust Motes
  const dustParticles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, idx) => {
      const seed = idx * 23.491;
      const baseX = 550 + ((seed * 57) % 2740);
      const baseY = 380 + ((seed * 37) % 1400);
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
          {/* Dual-Pass Specular Aurora Glow Filter */}
          <filter id="auroraOpticalGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.6" result="tightGlow" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="38.0" result="atmosphericGlow" />
            <feMerge>
              <feMergeNode in="atmosphericGlow" opacity="0.65" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Deep Emerald-to-Mint Silk Gradient 1 */}
          <linearGradient id="auroraEmeraldGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" stopOpacity="0" />
            <stop offset="12%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#34D399" stopOpacity="0.95" />
            <stop offset="78%" stopColor="#059669" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0" />
          </linearGradient>

          {/* Mint-to-Cyan Aurora Gradient 2 */}
          <linearGradient id="auroraEmeraldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#065F46" stopOpacity="0" />
            <stop offset="18%" stopColor="#10B981" stopOpacity="0.5" />
            <stop offset="48%" stopColor="#6EE7B7" stopOpacity="0.92" />
            <stop offset="72%" stopColor="#34D399" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#065F46" stopOpacity="0" />
          </linearGradient>

          {/* Feathered Ridge Gradient (Zero Edge Cutoff) */}
          <linearGradient id="ridgeTaperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="8%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="75%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="92%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Strict 15% Corner Margin Safe Zone Clip Path */}
          <clipPath id="auroraCornerSafeZone">
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
          clipPath="url(#auroraCornerSafeZone)"
          opacity={masterOpacity}
        >
          {/* Layer 1: Ambient Volumetric Aurora Silk Veils */}
          {ribbonPaths.map((rp) => (
            <path
              key={`veil-${rp.id}`}
              d={rp.polyD}
              fill={`url(#${rp.gradId})`}
              opacity={rp.opacity * 0.72}
              filter="url(#auroraOpticalGlow)"
            />
          ))}

          {/* Layer 2: Sharp Specular Ridge Lines with Tapered Glow */}
          {ribbonPaths.map((rp) => (
            <g key={`ridge-group-${rp.id}`} filter="url(#auroraOpticalGlow)">
              {/* Mint Glow Under-Stroke */}
              <path
                d={rp.ridgeD}
                fill="none"
                stroke="#6EE7B7"
                strokeWidth={rp.strokeW * 1.8}
                strokeLinecap="round"
                opacity={rp.opacity * 0.8}
              />
              {/* White-Hot Incandescent Specular Ridge Core with Tapered Ends */}
              <path
                d={rp.ridgeD}
                fill="none"
                stroke="url(#ridgeTaperGrad)"
                strokeWidth={rp.strokeW}
                strokeLinecap="round"
                opacity={0.96}
              />
            </g>
          ))}

          {/* Layer 3: Floating Cosmic Dust Particles */}
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
                fill="#ECFDF5"
                opacity={alpha}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
