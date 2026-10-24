import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface Node3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  hueOffset: number;
}

export const HolographicCyberPlexusSphere4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig(); // 3840 x 2160, 60 fps

  const cx = width / 2; // 1920
  const cy = height / 2; // 1080
  const sphereRadius = 920; // Expanded to fill 86% of vertical canvas (1840px diameter)

  // 1. Generate 240 3D vertices using Fibonacci sphere distribution for uniform spherical coverage
  const nodes: Node3D[] = useMemo(() => {
    const list: Node3D[] = [];
    const count = 220;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      list.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        size: 5.5 + (Math.sin(i * 13.7) * 0.5 + 0.5) * 6.5, // 5.5 to 12.0 px bold nodes!
        hueOffset: i / count,
      });
    }
    return list;
  }, []);

  // 2. 6-Phase Musical / Keyframed Composition Arc
  // Phase 1 (0-60): Intro assemble
  // Phase 2 (60-180): Orbit build
  // Phase 3 (180-300): Climax quantum energy burst
  // Phase 4 (300-420): Breakdown & harmonic rotation
  // Phase 5 (420-540): Secondary swell
  // Phase 6 (540-600): Seamless loop resolve
  const phaseIntensity = useMemo(() => {
    if (frame < 60) return interpolate(frame, [0, 60], [0.4, 0.8]);
    if (frame < 180) return 0.8 + Math.sin(frame * 0.05) * 0.15;
    if (frame < 300) return 0.95 + Math.sin(frame * 0.08) * 0.25; // Climax drop
    if (frame < 420) return 0.75 + Math.sin(frame * 0.04) * 0.15;
    if (frame < 540) return 0.85 + Math.sin(frame * 0.06) * 0.2;
    return interpolate(frame, [540, 600], [0.85, 0.4]);
  }, [frame]);

  // 3. Seamless 360-degree rotation (exact loop over 600 frames)
  const rotY = (frame / 600) * Math.PI * 2;
  const tiltX = 0.32; // ~18.3 degrees tilt for dynamic isometric 3D perspective

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(tiltX);
  const sinX = Math.sin(tiltX);

  // 4. Project 3D nodes onto 2D screen with depth buffering
  const projectedNodes = useMemo(() => {
    return nodes.map((n, idx) => {
      // Rotation around Y axis
      const x1 = n.baseX * cosY - n.baseZ * sinY;
      const y1 = n.baseY;
      const z1 = n.baseX * sinY + n.baseZ * cosY;

      // Tilt around X axis
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      // Perspective projection
      const fov = 1600;
      const distance = fov / (fov + z2 * sphereRadius);
      const screenX = cx + x2 * sphereRadius * distance;
      const screenY = cy + y2 * sphereRadius * distance;

      // Depth attenuation: front (z2 > 0) is bright & large; back (z2 < 0) is dim & small
      const depthAlpha = interpolate(z2, [-1, 1], [0.15, 0.95]);
      const depthSize = n.size * distance * (0.6 + 0.6 * (z2 + 1));

      return {
        idx,
        screenX,
        screenY,
        z: z2,
        alpha: depthAlpha * phaseIntensity,
        size: depthSize,
        hueOffset: n.hueOffset,
        origX: x2,
        origY: y2,
        origZ: z2,
      };
    });
  }, [nodes, cosY, sinY, cosX, sinX, cx, cy, sphereRadius, phaseIntensity]);

  // 5. Compute Plexus Connection Lines between nearby neighbors
  const connectionLines = useMemo(() => {
    const lines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      alpha: number;
      strokeColor: string;
      width: number;
      avgZ: number;
    }> = [];

    const maxDist = 0.38; // 3D distance threshold on unit sphere

    for (let i = 0; i < projectedNodes.length; i++) {
      const p1 = projectedNodes[i];
      for (let j = i + 1; j < projectedNodes.length; j++) {
        const p2 = projectedNodes[j];

        const dx = p1.origX - p2.origX;
        const dy = p1.origY - p2.origY;
        const dz = p1.origZ - p2.origZ;
        const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist3D < maxDist) {
          const proxAlpha = 1.0 - dist3D / maxDist;
          const avgZ = (p1.z + p2.z) / 2;
          const depthAlpha = interpolate(avgZ, [-1, 1], [0.08, 0.75]);
          const totalAlpha = proxAlpha * depthAlpha * phaseIntensity;

          if (totalAlpha > 0.04) {
            // Authentic palette from idea video: electric blue (#00e5ff) to cobalt (#3d5afe) to magenta (#e040fb)
            const colorMix = (p1.hueOffset + p2.hueOffset) / 2;
            let strokeColor = 'rgba(0, 229, 255, ';
            if (colorMix > 0.6) strokeColor = 'rgba(224, 64, 251, ';
            else if (colorMix > 0.3) strokeColor = 'rgba(61, 90, 254, ';

            lines.push({
              x1: p1.screenX,
              y1: p1.screenY,
              x2: p2.screenX,
              y2: p2.screenY,
              alpha: totalAlpha,
              strokeColor: `${strokeColor}${totalAlpha})`,
              width: interpolate(avgZ, [-1, 1], [0.8, 2.2]),
              avgZ,
            });
          }
        }
      }
    }
    // Sort lines by depth so background renders first
    lines.sort((a, b) => a.avgZ - b.avgZ);
    return lines;
  }, [projectedNodes, phaseIntensity]);

  // Sort nodes by depth for correct 3D occlusions
  const sortedNodes = useMemo(() => {
    return [...projectedNodes].sort((a, b) => a.z - b.z);
  }, [projectedNodes]);

  // 6. Central Core Energy Glow Pulse
  const coreGlowRadius = 220 + Math.sin(frame * 0.08) * 40 * phaseIntensity;
  const coreAlpha = 0.35 + Math.sin(frame * 0.1) * 0.15;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Radial Core Energy Bloom */}
          <radialGradient id="cyberCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`rgba(255, 255, 255, ${coreAlpha * 0.9})`} />
            <stop offset="25%" stopColor={`rgba(0, 229, 255, ${coreAlpha * 0.7})`} />
            <stop offset="55%" stopColor={`rgba(61, 90, 254, ${coreAlpha * 0.4})`} />
            <stop offset="85%" stopColor={`rgba(224, 64, 251, ${coreAlpha * 0.15})`} />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>

          {/* Node Specular Bloom Filter */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. CENTRAL QUANTUM CORE GLOW */}
        <circle
          cx={cx}
          cy={cy}
          r={coreGlowRadius}
          fill="url(#cyberCoreGlow)"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* 2. PLEXUS CONNECTION LINES (Back & Front 3D Lines) */}
        {connectionLines.map((l, idx) => (
          <line
            key={`line-${idx}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={l.strokeColor}
            strokeWidth={l.width}
            strokeLinecap="round"
          />
        ))}

        {/* 3. 3D SPHERICAL NODES WITH DEPTH & SPECULAR HIGHLIGHTS */}
        {sortedNodes.map((n) => {
          // Node color selection based on position and depth
          let nodeColor = '#00e5ff';
          if (n.hueOffset > 0.65) nodeColor = '#e040fb';
          else if (n.hueOffset > 0.35) nodeColor = '#3d5afe';

          const isFront = n.z > 0.3;

          return (
            <g key={`node-${n.idx}`}>
              {/* Outer Glow for front nodes */}
              {isFront && (
                <circle
                  cx={n.screenX}
                  cy={n.screenY}
                  r={n.size * 2.2}
                  fill={nodeColor}
                  opacity={n.alpha * 0.35}
                  filter="url(#nodeGlow)"
                />
              )}
              {/* Main Node Body */}
              <circle
                cx={n.screenX}
                cy={n.screenY}
                r={n.size}
                fill={nodeColor}
                opacity={n.alpha}
              />
              {/* Crisp Specular Center Dot for front nodes */}
              {isFront && (
                <circle
                  cx={n.screenX}
                  cy={n.screenY}
                  r={n.size * 0.45}
                  fill="#ffffff"
                  opacity={Math.min(1.0, n.alpha * 1.3)}
                />
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
