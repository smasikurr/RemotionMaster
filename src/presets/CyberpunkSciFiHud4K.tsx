import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * CyberpunkSciFiHud4K
 * High-demand Sci-Fi HUD telemetry screen with targeting reticle, audio oscilloscope,
 * and scrolling hexadecimal columns.
 * 4K UHD (3840x2160) @ 60 FPS, 10s seamless loop (600 frames).
 */
export const CyberpunkSciFiHud4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 600;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  const hexColumns = useMemo(() => {
    const cols = [];
    const hexChars = "0123456789ABCDEF";
    for (let c = 0; c < 4; c++) {
      const rows = [];
      for (let r = 0; r < 36; r++) {
        const h1 = hexChars[(c * 7 + r * 13) % 16];
        const h2 = hexChars[(c * 11 + r * 17) % 16];
        const h3 = hexChars[(c * 3 + r * 19) % 16];
        rows.push(`0x${h1}${h2}${h3}`);
      }
      cols.push(rows);
    }
    return cols;
  }, []);

  const radarAngle = (t * 360 * 3) % 360;
  const ringAngle1 = (t * 360 * 2) % 360;
  const ringAngle2 = (-t * 360 * 1) % 360;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden", width, height }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <filter id="hudMasterGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0066FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${width / 2}, ${height / 2})`} filter="url(#hudMasterGlow)">
          {[220, 380, 540, 700, 840].map((radius, idx) => (
            <circle
              key={`dial-${idx}`}
              cx={0}
              cy={0}
              r={radius}
              fill="none"
              stroke={idx % 2 === 0 ? "#00F0FF" : "#0066FF"}
              strokeWidth={idx === 2 ? 3 : 1.5}
              strokeOpacity={0.4 + (idx % 2) * 0.25}
              strokeDasharray={idx === 1 ? "14 10" : idx === 3 ? "35 15" : "none"}
            />
          ))}

          <line x1={-920} y1={0} x2={920} y2={0} stroke="#0066FF" strokeWidth={1.5} strokeOpacity={0.45} />
          <line x1={0} y1={-920} x2={0} y2={920} stroke="#0066FF" strokeWidth={1.5} strokeOpacity={0.45} />

          <g transform={`rotate(${ringAngle1})`}>
            <circle cx={0} cy={0} r={760} fill="none" stroke="#00F0FF" strokeWidth={5} strokeDasharray="120 40 20 40 60 40" strokeOpacity={0.85} />
          </g>

          <g transform={`rotate(${ringAngle2})`}>
            <circle cx={0} cy={0} r={620} fill="none" stroke="#0066FF" strokeWidth={4} strokeDasharray="10 20" strokeOpacity={0.7} />
          </g>

          <g transform={`rotate(${radarAngle})`}>
            <path d="M 0 0 L 840 0 A 840 840 0 0 1 727 420 Z" fill="url(#radarSweepGrad)" opacity={0.4} />
            <line x1={0} y1={0} x2={840} y2={0} stroke="#FFFFFF" strokeWidth={2.5} strokeOpacity={0.9} />
          </g>

          <circle cx={0} cy={0} r={55} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
          <circle cx={0} cy={0} r={10} fill="#00F0FF" />
          <path d="M -85 -50 L -85 -85 L -50 -85" fill="none" stroke="#00F0FF" strokeWidth={4} />
          <path d="M 85 -50 L 85 -85 L 50 -85" fill="none" stroke="#00F0FF" strokeWidth={4} />
          <path d="M -85 50 L -85 85 L -50 85" fill="none" stroke="#00F0FF" strokeWidth={4} />
          <path d="M 85 50 L 85 85 L 50 85" fill="none" stroke="#00F0FF" strokeWidth={4} />
        </g>

        {/* Oscilloscope Panel */}
        <g transform={`translate(0, ${height - 280})`} filter="url(#hudMasterGlow)">
          <line x1={300} y1={120} x2={width - 300} y2={120} stroke="#0066FF" strokeWidth={1} strokeOpacity={0.4} />
          {(() => {
            const points = [];
            for (let s = 0; s <= 100; s++) {
              const px = 300 + (s / 100) * (width - 600);
              const normX = s / 100;
              const waveY =
                120 +
                Math.sin(normX * Math.PI * 12 + t * twoPi * 4) * 45 * Math.sin(normX * Math.PI) +
                Math.sin(normX * Math.PI * 24 + t * twoPi * 8) * 20 * Math.sin(normX * Math.PI);
              points.push(`${px},${waveY}`);
            }
            return <path d={`M ${points.join(" L ")}`} fill="none" stroke="#00F0FF" strokeWidth={3} strokeOpacity={0.9} />;
          })()}
          <text x={320} y={40} fill="#00F0FF" fontSize={22} fontFamily="monospace" fontWeight="bold">
            AUDIO SPECTRUM // CH-1 DYNAMIC OSCILLOSCOPE ACTIVE
          </text>
        </g>

        {/* Hex Columns Left & Right */}
        {[0, 1].map((colIdx) => {
          const colX = 140 + colIdx * 180;
          const scrollY = (t * 1200 * (1 + colIdx * 0.3)) % 800;
          return (
            <g key={`hex-l-${colIdx}`} transform={`translate(${colX}, 0)`}>
              {hexColumns[colIdx].map((code, rowIdx) => {
                const py = (rowIdx * 45 - scrollY + 1600) % 1500 + 200;
                return (
                  <text key={`hl-${colIdx}-${rowIdx}`} x={0} y={py} fill={rowIdx % 3 === 0 ? "#00F0FF" : "#0066FF"} fontSize={22} fontFamily="monospace" opacity={0.7}>
                    {code}
                  </text>
                );
              })}
            </g>
          );
        })}
        {[2, 3].map((colIdx) => {
          const colX = width - 420 + (colIdx - 2) * 180;
          const scrollY = (-t * 1000 * (1 + (colIdx - 2) * 0.4) + 2000) % 800;
          return (
            <g key={`hex-r-${colIdx}`} transform={`translate(${colX}, 0)`}>
              {hexColumns[colIdx].map((code, rowIdx) => {
                const py = (rowIdx * 45 - scrollY + 1600) % 1500 + 200;
                return (
                  <text key={`hr-${colIdx}-${rowIdx}`} x={0} y={py} fill={rowIdx % 2 === 0 ? "#00F0FF" : "#0066FF"} fontSize={22} fontFamily="monospace" opacity={0.7}>
                    {code}
                  </text>
                );
              })}
            </g>
          );
        })}

        <g transform="translate(140, 120)" fill="#00F0FF">
          <text fontSize={32} fontFamily="monospace" fontWeight="bold">REMOTION_MASTER // HUD_01</text>
          <text y={45} fontSize={20} fontFamily="monospace" fill="#0066FF">AZIMUTH: {Math.round(radarAngle)}° | STATUS: TRACKING</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
