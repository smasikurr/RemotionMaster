import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const CyberneticAiBrainSynapseNetwork4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Initial Spring entrance for Neural Cortex Core
  const coreSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.9 },
  });
  const coreScale = interpolate(coreSpring, [0, 1], [0.35, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coreOpacity = interpolate(coreSpring, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Synapse network draw expansion (Frames 20 to 180)
  const networkDraw = interpolate(frame, [20, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous idle neural breathing and micro-rotation
  const idleHoverY = Math.sin(frame * 0.06) * 10;
  const idleRot = Math.sin(frame * 0.03) * 1.5;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Synthesize realistic dual-hemisphere brain lobe node coordinates
  const nodes = useMemo(() => {
    const list: { id: number; x: number; y: number; r: number; hemi: "left" | "right"; tier: number }[] = [];
    const basePoints = [
      // Left hemisphere outer contour & internal gyri
      { x: -140, y: -260, r: 8, t: 1 }, { x: -280, y: -210, r: 10, t: 1 }, { x: -380, y: -120, r: 12, t: 1 },
      { x: -440, y: 0, r: 11, t: 1 }, { x: -420, y: 130, r: 13, t: 1 }, { x: -330, y: 240, r: 10, t: 1 },
      { x: -190, y: 290, r: 9, t: 1 }, { x: -90, y: 260, r: 7, t: 1 },
      // Left internal cluster
      { x: -180, y: -140, r: 14, t: 2 }, { x: -260, y: -40, r: 12, t: 2 }, { x: -250, y: 80, r: 15, t: 2 },
      { x: -140, y: 140, r: 11, t: 2 }, { x: -90, y: 0, r: 16, t: 3 }, { x: -140, y: -30, r: 13, t: 2 },
      { x: -200, y: 30, r: 10, t: 2 }, { x: -320, y: 60, r: 9, t: 2 }, { x: -290, y: 160, r: 11, t: 2 },

      // Right hemisphere outer contour & internal gyri
      { x: 140, y: -260, r: 8, t: 1 }, { x: 280, y: -210, r: 10, t: 1 }, { x: 380, y: -120, r: 12, t: 1 },
      { x: 440, y: 0, r: 11, t: 1 }, { x: 420, y: 130, r: 13, t: 1 }, { x: 330, y: 240, r: 10, t: 1 },
      { x: 190, y: 290, r: 9, t: 1 }, { x: 90, y: 260, r: 7, t: 1 },
      // Right internal cluster
      { x: 180, y: -140, r: 14, t: 2 }, { x: 260, y: -40, r: 12, t: 2 }, { x: 250, y: 80, r: 15, t: 2 },
      { x: 140, y: 140, r: 11, t: 2 }, { x: 90, y: 0, r: 16, t: 3 }, { x: 140, y: -30, r: 13, t: 2 },
      { x: 200, y: 30, r: 10, t: 2 }, { x: 320, y: 60, r: 9, t: 2 }, { x: 290, y: 160, r: 11, t: 2 },

      // Corpus callosum central bridge nodes
      { x: 0, y: -180, r: 15, t: 3 }, { x: 0, y: -70, r: 18, t: 3 },
      { x: 0, y: 40, r: 18, t: 3 }, { x: 0, y: 160, r: 16, t: 3 }, { x: 0, y: 270, r: 12, t: 3 },
    ];

    basePoints.forEach((p, idx) => {
      list.push({
        id: idx,
        x: p.x * 2.2,
        y: p.y * 2.2,
        r: p.r * 1.4,
        hemi: p.x < 0 ? "left" : p.x > 0 ? "right" : "left",
        tier: p.t,
      });
    });
    return list;
  }, []);

  // Synapse connections between nearby nodes
  const connections = useMemo(() => {
    const conns: { id: string; i: number; j: number; d: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 320) {
          conns.push({ id: `${i}-${j}`, i, j, d: dist });
        }
      }
    }
    return conns;
  }, [nodes]);

  // Traveling action potential signals
  const activeSignals = useMemo(() => {
    return connections.slice(0, 32);
  }, [connections]);

  const centerX = width / 2;
  const centerY = height / 2 - 20;

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
        fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          transform: `translate(0px, ${idleHoverY}px) scale(${coreScale}) rotate(${idleRot}deg)`,
          transformOrigin: `${centerX}px ${centerY}px`,
        }}
      >
        <defs>
          <filter id="synapseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`ag-h-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`ag-v-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>

        {/* Concentric Rotating Tech Rings around Brain Core */}
        <g transform={`translate(${centerX}, ${centerY})`} fill="none">
          <circle r="780" stroke="rgba(41, 121, 255, 0.15)" strokeWidth="2" strokeDasharray="8 24" />
          <circle
            r="860"
            stroke="rgba(0, 229, 255, 0.2)"
            strokeWidth="3"
            strokeDasharray="40 80"
            transform={`rotate(${frame * 0.4})`}
          />
          <circle
            r="940"
            stroke="rgba(124, 77, 255, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="16 48"
            transform={`rotate(${-frame * 0.3})`}
          />
        </g>

        {/* Neural Synapse Interconnect Axons */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {connections.map((c) => {
            const p1 = nodes[c.i];
            const p2 = nodes[c.j];
            const isCenter = c.d < 180;
            const strokeColor = isCenter
              ? "rgba(0, 229, 255, 0.45)"
              : "rgba(41, 121, 255, 0.25)";
            const strokeW = isCenter ? 3.5 : 2;

            return (
              <line
                key={c.id}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={strokeColor}
                strokeWidth={strokeW}
                opacity={networkDraw}
              />
            );
          })}
        </g>

        {/* Dynamic Action Potential Pulses Traveling Across Synapses */}
        <g transform={`translate(${centerX}, ${centerY})`} filter="url(#synapseGlow)">
          {activeSignals.map((c, idx) => {
            const p1 = nodes[c.i];
            const p2 = nodes[c.j];
            const speed = 40 + (idx % 5) * 8;
            const t = ((frame + idx * 15) % speed) / speed;
            const curX = p1.x + (p2.x - p1.x) * t;
            const curY = p1.y + (p2.y - p1.y) * t;
            const pulseRadius = 6 + Math.sin(frame * 0.2 + idx) * 2;

            return (
              <circle
                key={`sig-${idx}`}
                cx={curX}
                cy={curY}
                r={pulseRadius}
                fill={idx % 2 === 0 ? "#00E5FF" : "#7C4DFF"}
                opacity={networkDraw > 0.4 ? 0.9 : 0}
              />
            );
          })}
        </g>

        {/* Synapse Nodes */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {nodes.map((node) => {
            const nodePulse = Math.sin(frame * 0.1 + node.id * 0.4) * 2.5;
            const glowColor =
              node.tier === 3
                ? "#00E5FF"
                : node.id % 2 === 0
                ? "#2979FF"
                : "#7C4DFF";

            return (
              <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={Math.max(2, (node.r + nodePulse) * 1.8)}
                  fill={glowColor}
                  opacity="0.25"
                  filter="url(#synapseGlow)"
                />
                <circle
                  r={node.r + nodePulse}
                  fill={glowColor}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <circle r={node.r * 0.35} fill="#FFFFFF" />
              </g>
            );
          })}
        </g>

        {/* HUD Technical Telemetry & Analytics Header */}
        <g transform="translate(180, 220)">
          <rect
            x="0"
            y="0"
            width="420"
            height="140"
            rx="12"
            fill="rgba(0, 20, 40, 0.6)"
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="2"
          />
          <text
            x="30"
            y="45"
            fill="#00E5FF"
            fontSize="24"
            fontWeight="700"
            letterSpacing="3"
          >
            NEURAL ENGINE v4.2
          </text>
          <text
            x="30"
            y="85"
            fill="rgba(255, 255, 255, 0.75)"
            fontSize="20"
            fontWeight="500"
            letterSpacing="1.5"
          >
            ACTIVE SYNAPSES: {Math.floor(interpolate(frame, [0, 180], [120, 2048], { extrapolateRight: "clamp" }))}
          </text>
          <text
            x="30"
            y="118"
            fill="#2979FF"
            fontSize="18"
            fontWeight="600"
            letterSpacing="2"
          >
            STATUS: SYNCHRONIZED
          </text>
        </g>

        {/* HUD Right Analytics Gauge */}
        <g transform="translate(3240, 220)">
          <rect
            x="0"
            y="0"
            width="420"
            height="140"
            rx="12"
            fill="rgba(0, 20, 40, 0.6)"
            stroke="rgba(124, 77, 255, 0.4)"
            strokeWidth="2"
          />
          <text
            x="30"
            y="45"
            fill="#7C4DFF"
            fontSize="24"
            fontWeight="700"
            letterSpacing="3"
          >
            COMPUTE EFFICIENCY
          </text>
          <text
            x="30"
            y="85"
            fill="#00E5FF"
            fontSize="28"
            fontWeight="800"
            letterSpacing="2"
          >
            {(98.4 + Math.sin(frame * 0.1) * 0.8).toFixed(1)}%
          </text>
          <text
            x="30"
            y="118"
            fill="rgba(255, 255, 255, 0.6)"
            fontSize="18"
            fontWeight="500"
            letterSpacing="1.5"
          >
            LATENCY: 1.4 MS
          </text>
        </g>

        {/* Bottom Neural Calibration Bar */}
        <g transform={`translate(${width / 2 - 400}, ${height - 180})`}>
          <rect
            x="0"
            y="0"
            width="800"
            height="12"
            rx="6"
            fill="rgba(255, 255, 255, 0.1)"
          />
          <rect
            x="0"
            y="0"
            width={800 * Math.min(1, frame / 480)}
            height="12"
            rx="6"
            fill="#00E5FF"
            filter="url(#synapseGlow)"
          />
          <text
            x="400"
            y="48"
            fill="rgba(255, 255, 255, 0.7)"
            fontSize="20"
            fontWeight="600"
            letterSpacing="4"
            textAnchor="middle"
          >
            AUTONOMOUS COGNITIVE CO-PROCESSOR BUS
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
