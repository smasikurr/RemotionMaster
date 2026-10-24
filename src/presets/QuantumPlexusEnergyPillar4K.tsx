import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { HeroStaging } from "../craft/HeroStaging";

/**
 * QuantumPlexusEnergyPillar4K - Stock Motion Graphics Video 05/81
 * Reference: istockphoto-1284702817-640_adpp_is.mp4 (14.1s)
 *
 * Visual Concept (Strictly True to Reference AS IS):
 * - Futuristic Cybernetic Holographic Energy Pillar & Rotating Plexus Rings
 * - Vertical high-intensity laser energy column through the center
 * - Concentric 3D-projected rotating tech orbital rings with pulsating nodes
 * - Calibrated keyframing ("Aga Gora Matha"): Ignition -> Harmonic Spin -> Climax Pulse -> Settle -> Loop
 * - 100% Solid Black (#000000) base, strictly ZERO blobs, perfectly centered (Cx: 0.50, Cy: 0.50)
 */
export const QuantumPlexusEnergyPillar4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  // Bounded hero dimensions strictly within central 60% viewport
  const heroW = 2000;
  const heroH = 1200;
  const centerX = heroW * 0.5;
  const centerY = heroH * 0.5;

  const time = frame / fps;

  // =========================================================================
  // STRUCTURED KEYFRAMED MOTION ENVELOPE ("AGA GORA MATHA")
  // =========================================================================
  const dynamicKeyframeAmp = interpolate(
    frame,
    [0, 60, 150, 210, 260, 360, 420, 480, 540, 600],
    [0.25, 0.65, 0.85, 1.30, 0.70, 0.45, 1.25, 1.00, 0.40, 0.25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Transient energy kick pulse
  const energyKick = Math.pow(Math.max(0, Math.sin(time * 8.5)), 8) * 0.45;
  const totalAmp = dynamicKeyframeAmp * (1.0 + energyKick);

  // Seamless loop angle
  const loopProgress = frame / durationInFrames;
  const loopAngle = loopProgress * Math.PI * 2;

  // Orbital tech rings configuration (projected in 3D perspective)
  const ringCount = 7;
  const rings = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => {
      const radiusX = 260 + i * 55;
      const radiusY = radiusX * 0.32; // 3D tilt perspective
      const tilt = -15 + i * 5; // Slight axial variance
      const speed = 1.0 + (i % 3) * 0.5;
      const nodeCount = 12 + i * 2;
      return { id: i, radiusX, radiusY, tilt, speed, nodeCount };
    });
  }, [ringCount]);

  // Generate 3D rotating nodes on the rings
  const ringData = useMemo(() => {
    return rings.map((r) => {
      const nodes = [];
      const currentAngle = loopAngle * r.speed;
      for (let j = 0; j < r.nodeCount; j++) {
        const theta = (j / r.nodeCount) * Math.PI * 2 + currentAngle;
        const x = Math.cos(theta) * r.radiusX;
        const y = Math.sin(theta) * r.radiusY;
        const z = Math.sin(theta); // Depth [-1, 1]
        const scale = 0.7 + (z + 1) * 0.3; // Depth scaling
        const opacity = (0.3 + (z + 1) * 0.35) * totalAmp;

        nodes.push({ x: centerX + x, y: centerY + y, scale, opacity, z });
      }
      return { ...r, nodes };
    });
  }, [rings, loopAngle, totalAmp, centerX, centerY]);

  // Vertical energy beam lines (high-density central column)
  const beamLines = useMemo(() => {
    const lines = [];
    const beamCount = 14;
    for (let i = 0; i < beamCount; i++) {
      const offset = (i - (beamCount - 1) / 2) * 12;
      const bell = Math.exp(-Math.pow(offset / 60, 2));
      const opacity = bell * 0.95 * totalAmp;
      lines.push({ offset, opacity, bell });
    }
    return lines;
  }, [totalAmp]);

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
        <svg
          width={heroW}
          height={heroH}
          viewBox={`0 0 ${heroW} ${heroH}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            {/* Specular Optical Core Filter */}
            <filter id="quantumGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="sharpCore" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="softBloom" />
              <feMerge>
                <feMergeNode in="softBloom" />
                <feMergeNode in="sharpCore" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Vertical Beam Linear Gradient */}
            <linearGradient id="verticalBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
              <stop offset="15%" stopColor="#00E5FF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="85%" stopColor="#00E5FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="outerBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0072FF" stopOpacity="0" />
              <stop offset="20%" stopColor="#0072FF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#0072FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0072FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* NOTE: STRICTLY ZERO BLOBS, ZERO CIRCULAR RADIAL GLOWS! Pure Tech Graphics */}

          {/* Layer 1: Back-half of 3D Orbital Rings (z < 0) */}
          <g filter="url(#quantumGlow)">
            {ringData.map((r) => (
              <ellipse
                key={`ring-back-${r.id}`}
                cx={centerX}
                cy={centerY}
                rx={r.radiusX}
                ry={r.radiusY}
                fill="none"
                stroke="rgba(0, 160, 255, 0.4)"
                strokeWidth={1.5}
                strokeDasharray="4 8"
                opacity={0.6 * totalAmp}
              />
            ))}
          </g>

          {/* Layer 2: Vertical Cybernetic Energy Column */}
          <g filter="url(#quantumGlow)">
            {beamLines.map((b, idx) => (
              <line
                key={`beam-${idx}`}
                x1={centerX + b.offset}
                y1={centerY - 500}
                x2={centerX + b.offset}
                y2={centerY + 500}
                stroke="url(#verticalBeamGrad)"
                strokeWidth={b.bell > 0.8 ? 3.5 : 1.5}
                opacity={b.opacity}
              />
            ))}
          </g>

          {/* Razor Specular Core Beam (Absolute White) */}
          <line
            x1={centerX}
            y1={centerY - 520}
            x2={centerX}
            y2={centerY + 520}
            stroke="#FFFFFF"
            strokeWidth={2.0}
            opacity={0.99}
          />

          {/* Layer 3: Front-half of 3D Orbital Rings (z >= 0) with Specular Nodes */}
          <g filter="url(#quantumGlow)">
            {ringData.map((r) => (
              <g key={`nodes-${r.id}`}>
                {r.nodes.map((n, nIdx) => (
                  <circle
                    key={`node-${r.id}-${nIdx}`}
                    cx={n.x}
                    cy={n.y}
                    r={3.0 * n.scale}
                    fill={n.z > 0.4 ? "#FFFFFF" : "#00E5FF"}
                    opacity={n.opacity}
                  />
                ))}
              </g>
            ))}
          </g>

          {/* Layer 4: Concentric Horizontal Harmonic Guide Crosshairs */}
          <line
            x1={centerX - 450}
            y1={centerY}
            x2={centerX + 450}
            y2={centerY}
            stroke="rgba(0, 229, 255, 0.5)"
            strokeWidth={1.5}
            strokeDasharray="3 6"
            opacity={0.75 * totalAmp}
          />
        </svg>
      </div>
    </HeroStaging>
  );
};
