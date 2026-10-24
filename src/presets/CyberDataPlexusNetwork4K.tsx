import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * CyberDataPlexusNetwork4K - Stock Motion Graphics Video 08/81
 * Reference: istockphoto-1328175442-640_adpp_is.mp4 (13.11s)
 *
 * User Correction:
 * - NO TINY ELEMENTS. Expanded to fill the 4K canvas (3500 x 1950 px)
 * - Rich, high-density interconnected neural nodes (80 nodes)
 * - Commanding glowing specular cores, thick cybernetic lines, deep depth
 * - Pure #000000 background for effortless Screen/Add/Luma blending
 */
export const CyberDataPlexusNetwork4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig(); // 3840 x 2160, 60fps

  const cx = width / 2; // 1920
  const cy = height / 2; // 1080

  // Canvas-filling bounding dimensions (fills 92% of width, 90% of height)
  const spreadW = 3450;
  const spreadH = 1920;

  const time = frame / fps;

  // Keyframed network energy pulse ("Aga Gora Matha")
  const networkPulse = interpolate(
    frame,
    [0, 60, 150, 220, 270, 360, 430, 490, 550, 600],
    [0.55, 0.85, 1.05, 1.40, 0.90, 0.70, 1.35, 1.10, 0.75, 0.55],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 75 interconnected neural plexus nodes spread generously across the canvas
  const nodeCount = 75;
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      // Stratified random distribution across the full canvas
      const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const seed2 = Math.cos(i * 269.5 + 183.3) * 23421.631;
      const seed3 = Math.sin(i * 419.2 + 87.1) * 38291.127;

      const normX = (seed - Math.floor(seed)) - 0.5; // [-0.5, 0.5]
      const normY = (seed2 - Math.floor(seed2)) - 0.5; // [-0.5, 0.5]

      const baseX = normX * spreadW;
      const baseY = normY * spreadH;

      const speedX = 0.4 + (Math.abs(seed3) % 0.6);
      const speedY = 0.4 + (Math.abs(seed) % 0.6);
      const orbitRadius = 40 + (i % 5) * 15;
      const baseSize = 7.0 + (i % 4) * 4.5; // 7.0px to 20.5px bold nodes!

      return {
        id: i,
        baseX,
        baseY,
        seed: i * 53.7,
        speedX,
        speedY,
        orbitRadius,
        baseSize,
      };
    });
  }, [nodeCount, spreadW, spreadH]);

  // Compute animated node positions with organic floating motion
  const animatedNodes = useMemo(() => {
    return nodes.map((n) => {
      const t = time;
      const ox = Math.sin(t * n.speedX + n.seed) * n.orbitRadius;
      const oy = Math.cos(t * n.speedY + n.seed * 0.7) * n.orbitRadius;
      const z = Math.sin(t * 0.5 + n.seed * 1.3); // [-1, 1] depth

      const x = cx + n.baseX + ox;
      const y = cy + n.baseY + oy;

      const depthScale = 0.75 + (z + 1) * 0.35;
      const alpha = Math.min(1.0, (0.45 + (z + 1) * 0.35) * networkPulse);
      const currentSize = n.baseSize * depthScale;

      return {
        ...n,
        x,
        y,
        z,
        depthScale,
        alpha,
        currentSize,
      };
    });
  }, [nodes, time, networkPulse, cx, cy]);

  // Compute interconnecting edges (connect nearby nodes across wide threshold)
  const edges = useMemo(() => {
    const list: Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      alpha: number;
      width: number;
      color: string;
    }> = [];

    const maxDist = 480; // Wide distance for rich interconnected canvas mesh

    for (let i = 0; i < animatedNodes.length; i++) {
      const p1 = animatedNodes[i];
      for (let j = i + 1; j < animatedNodes.length; j++) {
        const p2 = animatedNodes[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const prox = 1.0 - dist / maxDist;
          const avgZ = (p1.z + p2.z) / 2;
          const depthFactor = 0.5 + (avgZ + 1) * 0.35;
          const edgeAlpha = prox * depthFactor * 0.75 * networkPulse;

          if (edgeAlpha > 0.05) {
            const lineWidth = interpolate(prox, [0, 1], [1.2, 3.2]) * depthFactor;
            // Authentic cyan-blue palette
            const color = `rgba(0, 229, 255, ${edgeAlpha})`;

            list.push({
              id: `${i}-${j}`,
              x1: p1.x,
              y1: p1.y,
              x2: p2.x,
              y2: p2.y,
              alpha: edgeAlpha,
              width: lineWidth,
              color,
            });
          }
        }
      }
    }
    return list;
  }, [animatedNodes, networkPulse]);

  // Sort nodes by depth for correct 3D rendering
  const sortedNodes = useMemo(() => {
    return [...animatedNodes].sort((a, b) => a.z - b.z);
  }, [animatedNodes]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Node Specular Bloom Filter */}
          <filter id="cyberNodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. INTERCONNECTING NETWORK EDGES */}
        {edges.map((e) => (
          <line
            key={e.id}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={e.color}
            strokeWidth={e.width}
            strokeLinecap="round"
          />
        ))}

        {/* 2. BOLD GLOWING PLEXUS NODES */}
        {sortedNodes.map((n) => {
          const isFront = n.z > -0.2;

          return (
            <g key={`node-${n.id}`}>
              {/* Outer Cyan Halo */}
              {isFront && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.currentSize * 2.5}
                  fill="#00e5ff"
                  opacity={n.alpha * 0.35}
                  filter="url(#cyberNodeGlow)"
                />
              )}

              {/* Core Node Body */}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.currentSize}
                fill="#00f0ff"
                opacity={n.alpha}
              />

              {/* Specular White Center Pinpoint */}
              {isFront && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.currentSize * 0.45}
                  fill="#ffffff"
                  opacity={Math.min(1.0, n.alpha * 1.4)}
                />
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
