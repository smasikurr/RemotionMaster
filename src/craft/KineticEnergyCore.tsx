import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  anticipationSpring,
  harmonicIdleMotion,
  coupledEntrance,
} from "../physics/craftPhysics";

export interface KineticEnergyCoreProps {
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
}

/**
 * KineticEnergyCore
 * Production-proven Hero component demonstrating elite After Effects motion craft:
 * - Anticipation pull-back entrance.
 * - Dynamic harmonic idle breathing.
 * - Layered counter-rotating geometric gyroscopes.
 * - Multi-stage specular glow without corner clutter.
 */
export const KineticEnergyCore: React.FC<KineticEnergyCoreProps> = ({
  primaryColor = "#00E5FF",
  secondaryColor = "#7C4DFF",
  size = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Anticipation Entrance Spring
  const entrance = anticipationSpring(frame, fps, {
    delay: 5,
    anticipationFrames: 8,
    anticipationDepth: 0.1,
  });

  // 2. Continuous Harmonic Idle Breathing (Keeps element alive at rest)
  const idle = harmonicIdleMotion(frame, {
    speed: 0.045,
    amplitudeY: 12,
    tiltDegrees: 4,
  });

  // 3. Procedural Orbiting Particle Constellation
  const particles = useMemo(() => {
    const list = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 0.8 + (i % 3) * 0.4;
      const radius = size * 0.38 + (i % 4) * 25;
      const pSize = 3 + (i % 3) * 2;
      list.push({ angle, speed, radius, pSize, id: i });
    }
    return list;
  }, [size]);

  // Rotational choreographies
  const outerSpin = (frame * 0.75) % 360;
  const innerSpin = (-frame * 1.2) % 360;
  const corePulse = Math.sin(frame * 0.08) * 0.15 + 1.0;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transform: `translateY(${idle.idleY}px) rotate(${idle.idleRotate}deg) scale(${entrance * idle.idleScale})`,
        transformOrigin: "center center",
      }}
    >
      <svg
        width={size * 1.5}
        height={size * 1.5}
        viewBox={`${-size * 0.75} ${-size * 0.75} ${size * 1.5} ${size * 1.5}`}
        style={{ overflow: "visible" }}
      >
        {/* Layer 1: Ambient Orbital Particles */}
        <g filter="url(#cinematicGlow)">
          {particles.map((p) => {
            const currentAngle = p.angle + (frame * 0.02 * p.speed);
            const x = Math.cos(currentAngle) * p.radius;
            const y = Math.sin(currentAngle) * p.radius * 0.65; // 3D perspective slant
            const op = Math.sin(frame * 0.1 + p.id) * 0.35 + 0.65;
            return (
              <circle
                key={`orb-p-${p.id}`}
                cx={x}
                cy={y}
                r={p.pSize}
                fill={p.id % 2 === 0 ? primaryColor : secondaryColor}
                opacity={op}
              />
            );
          })}
        </g>

        {/* Layer 2: Outer Counter-Rotating Gyroscopic Rings */}
        <g transform={`rotate(${outerSpin})`}>
          <ellipse
            cx="0"
            cy="0"
            rx={size * 0.48}
            ry={size * 0.48}
            fill="none"
            stroke={primaryColor}
            strokeWidth="3"
            strokeDasharray="24 16 8 16"
            filter="url(#cinematicGlow)"
          />
          {/* Tick marks on outer ring */}
          {Array.from({ length: 8 }).map((_, i) => {
            const rad = (i * 45 * Math.PI) / 180;
            const r1 = size * 0.45;
            const r2 = size * 0.51;
            return (
              <line
                key={`tick-${i}`}
                x1={Math.cos(rad) * r1}
                y1={Math.sin(rad) * r1}
                x2={Math.cos(rad) * r2}
                y2={Math.sin(rad) * r2}
                stroke={primaryColor}
                strokeWidth="2.5"
                filter="url(#cinematicGlow)"
              />
            );
          })}
        </g>

        {/* Layer 3: Inner Gyroscopic Ellipse with Tilted Perspective */}
        <g transform={`rotate(${innerSpin})`}>
          <ellipse
            cx="0"
            cy="0"
            rx={size * 0.35}
            ry={size * 0.22}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="3.5"
            strokeDasharray="16 12"
            filter="url(#cinematicGlow)"
          />
        </g>

        {/* Layer 4: Geometric Hexagonal Core */}
        <g transform={`scale(${corePulse})`} filter="url(#cinematicGlow)">
          <polygon
            points={Array.from({ length: 6 })
              .map((_, i) => {
                const angle = (i * 60 * Math.PI) / 180;
                const r = size * 0.16;
                return `${Math.cos(angle) * r},${Math.sin(angle) * r}`;
              })
              .join(" ")}
            fill="rgba(0, 229, 255, 0.12)"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          {/* Specular Core Star Dot */}
          <circle cx="0" cy="0" r="14" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="28" fill="none" stroke={primaryColor} strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};
