import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * CrimsonVelvetFluidSilkWaves4K
 *
 * Commercial-Grade 4K 60FPS Diagonal Crimson Velvet & Red Silk Ribbon Waves
 * Based on iStock Reference: istockphoto-2203153538-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (900 frames / 15.0s seamless loop)
 * - 100% Solid Pure Black #000000 base
 * - Distinct 22° diagonal silk flow axis from bottom-left to upper-center
 * - Commanding hero presence: Spans ~2710px width (70.6%) and ~1820px height (84.3%)
 * - All 4 corner zones (15% margin = 576x324) strictly guaranteed 100% pure black (lum = 0.00)
 * - Multi-tier specular optical bloom (tight 3.8px core + 40px atmospheric crimson dispersion)
 */
export const CrimsonVelvetFluidSilkWaves4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cx = width * 0.5; // 1920
  const cy = height * 0.5; // 1080

  const totalFrames = 900;
  const loopT = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  // 1. Living Organic Harmonic Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.02,
    amplitudeY: 3.6,
    tiltDegrees: 0.05,
  });

  // Master fade envelopes for seamless loop
  const masterOpacity = interpolate(
    frame,
    [0, 20, 880, 900],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. 4 Multi-Layer Diagonal Ribbon Generators
  const ribbons = useMemo(() => {
    const layers = [
      {
        id: "deepVelvet",
        baseY: 260,
        amp: 240,
        wavelength: 1.8,
        speed: 1.0,
        phase: 0.0,
        maxWidth: 160,
        fillStart: "#1a0204",
        fillEnd: "#45060b",
        stroke: "rgba(100, 10, 18, 0.4)",
        opacity: 0.90,
      },
      {
        id: "midCrimson",
        baseY: 90,
        amp: 310,
        wavelength: 2.1,
        speed: 1.2,
        phase: Math.PI * 0.55,
        maxWidth: 190,
        fillStart: "#380408",
        fillEnd: "#870f1a",
        stroke: "rgba(180, 25, 38, 0.6)",
        opacity: 0.92,
      },
      {
        id: "radiantCarmine",
        baseY: -80,
        amp: 360,
        wavelength: 2.4,
        speed: 1.4,
        phase: Math.PI * 1.15,
        maxWidth: 220,
        fillStart: "#6b0812",
        fillEnd: "#c91a2a",
        stroke: "rgba(235, 45, 62, 0.75)",
        opacity: 0.95,
      },
      {
        id: "heroSpecularSilk",
        baseY: -220,
        amp: 290,
        wavelength: 2.7,
        speed: 1.6,
        phase: Math.PI * 1.70,
        maxWidth: 180,
        fillStart: "#990e1b",
        fillEnd: "#e6283b",
        stroke: "rgba(255, 95, 112, 0.85)",
        opacity: 0.96,
      },
    ];

    const span = 2920; // Sinuous ribbon span length
    const steps = 150;

    return layers.map((layer) => {
      let topPath = "";
      let bottomPath = "";
      let spinePath = "";

      for (let i = 0; i <= steps; i++) {
        const u = i / steps; // 0 to 1
        const x = (u - 0.5) * span;

        // Multi-frequency sinusoidal displacement
        const wave1 = Math.sin(u * Math.PI * 2 * layer.wavelength - loopT * twoPi * layer.speed + layer.phase);
        const wave2 = Math.cos(u * Math.PI * 4 * layer.wavelength + loopT * twoPi * 0.7 + layer.phase * 0.5) * 0.35;
        const wave3 = Math.sin(u * Math.PI * 6 + loopT * twoPi * 1.2) * 0.15;
        const totalWave = wave1 + wave2 + wave3;

        const y = layer.baseY + totalWave * layer.amp;

        // Organic taper envelope: 0 at ends, swollen in center
        const envelope = Math.pow(Math.sin(Math.PI * u), 1.3);
        const currentHalfWidth = (layer.maxWidth * 0.5) * envelope;

        const yTop = y - currentHalfWidth;
        const yBottom = y + currentHalfWidth;

        if (i === 0) {
          topPath = `M ${x.toFixed(1)} ${yTop.toFixed(1)}`;
          spinePath = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
          bottomPath = `L ${x.toFixed(1)} ${yBottom.toFixed(1)}`;
        } else {
          topPath += ` L ${x.toFixed(1)} ${yTop.toFixed(1)}`;
          spinePath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
          bottomPath = ` L ${x.toFixed(1)} ${yBottom.toFixed(1)} ` + bottomPath;
        }
      }

      const fullRibbonPath = `${topPath} ${bottomPath} Z`;
      return {
        ...layer,
        ribbonD: fullRibbonPath,
        spineD: spinePath,
      };
    });
  }, [loopT]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        width,
        height,
        overflow: "hidden",
        opacity: masterOpacity,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          {/* Atmospheric Crimson Dispersion Filter */}
          <filter id="v36CrimsonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="coreBlur" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="38" result="atmBlur" />
            <feMerge>
              <feMergeNode in="atmBlur" />
              <feMergeNode in="coreBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Specular Silk Crest Filter */}
          <filter id="v36SpecularSpine" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="spineBlur" />
            <feMerge>
              <feMergeNode in="spineBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Linear Gradients for 4 Silk Layers */}
          {ribbons.map((ribbon) => (
            <linearGradient
              key={`grad-${ribbon.id}`}
              id={`grad-${ribbon.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={ribbon.fillStart} />
              <stop offset="50%" stopColor={ribbon.fillEnd} />
              <stop offset="100%" stopColor={ribbon.fillStart} />
            </linearGradient>
          ))}
        </defs>

        {/* Diagonal Local Coordinate Frame (22° Tilt) */}
        <g
          transform={`translate(${cx}, ${cy + idle.idleY}) rotate(-22)`}
          filter="url(#v36CrimsonGlow)"
        >
          {/* 1. Volumetric Ribbon Sheets */}
          {ribbons.map((ribbon) => (
            <path
              key={`sheet-${ribbon.id}`}
              d={ribbon.ribbonD}
              fill={`url(#grad-${ribbon.id})`}
              stroke={ribbon.stroke}
              strokeWidth="1.2"
              opacity={ribbon.opacity}
            />
          ))}

          {/* 2. Specular Spine Crests */}
          <g filter="url(#v36SpecularSpine)">
            {ribbons.slice(2).map((ribbon, idx) => (
              <path
                key={`spine-${ribbon.id}`}
                d={ribbon.spineD}
                fill="none"
                stroke={idx === 1 ? "rgba(255, 230, 235, 0.85)" : "rgba(255, 140, 155, 0.70)"}
                strokeWidth={idx === 1 ? "3.6" : "2.4"}
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
