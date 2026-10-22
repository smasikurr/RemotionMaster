import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * CorporatePlexusDataNetwork4K
 * 3D constellation of interconnected glowing nodes drifting dynamically.
 * 4K UHD (3840x2160) @ 60 FPS, 10s loop (600 frames).
 */
export const CorporatePlexusDataNetwork4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 600;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < 140; i++) {
      const baseX = ((i * 37.1) % 86) + 7;
      const baseY = ((i * 49.3) % 80) + 10;
      const ampX = 40 + (i % 30);
      const ampY = 30 + ((i * 2) % 25);
      const freq = 1 + (i % 3);
      const phase = i * 0.45;
      const size = 3 + (i % 5);
      list.push({ baseX, baseY, ampX, ampY, freq, phase, size, id: i });
    }
    return list;
  }, []);

  const currentNodes = nodes.map((n) => {
    const angle = t * twoPi * n.freq + n.phase;
    const x = (n.baseX * width) / 100 + Math.cos(angle) * n.ampX;
    const y = (n.baseY * height) / 100 + Math.sin(angle) * n.ampY;
    return { ...n, x, y };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#030814", overflow: "hidden", width, height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, #001F54 0%, #030814 75%, #01040A 100%)",
        }}
      />

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <filter id="plexusMasterGlow">
            <feGaussianBlur stdDeviation="3.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {currentNodes.map((n1, i) =>
          currentNodes.slice(i + 1, i + 10).map((n2, j) => {
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const threshold = 340;
            if (dist > threshold) return null;
            const lineAlpha = (1 - dist / threshold) * 0.55;

            return (
              <line
                key={`plx-${i}-${j}`}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="#00E8C6"
                strokeWidth={1.5}
                strokeOpacity={lineAlpha}
              />
            );
          })
        )}

        {currentNodes.map((n) => {
          const pulse = Math.sin(t * twoPi * n.freq * 2 + n.phase) * 0.25 + 0.75;
          return (
            <g key={`pnode-${n.id}`} filter="url(#plexusMasterGlow)">
              <circle cx={n.x} cy={n.y} r={n.size * 2 * pulse} fill="#00E8C6" opacity={0.35} />
              <circle cx={n.x} cy={n.y} r={n.size} fill="#FFFFFF" />
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 160px rgba(0, 0, 0, 0.85)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
