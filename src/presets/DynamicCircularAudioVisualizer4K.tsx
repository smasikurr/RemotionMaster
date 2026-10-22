import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * DynamicCircularAudioVisualizer4K
 * Circular radial equalizer with 128 frequency bars pulsating rhythmically with neon gradient.
 * 4K UHD (3840x2160) @ 60 FPS, 10s loop (600 frames).
 */
export const DynamicCircularAudioVisualizer4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const totalFrames = 600;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  const numBars = 128;
  const centerRadius = 320;
  const beatProgress = (frame % 30) / 30;
  const centerPulse = 1 + Math.sin(beatProgress * Math.PI) * 0.08;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden", width, height }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="neonEqualizerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF007F" />
            <stop offset="50%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#7928CA" />
          </linearGradient>

          <filter id="equalizerGlow">
            <feGaussianBlur stdDeviation="4.5" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {[0, 1, 2].map((ring) => {
            const ringProg = (t * 4 + ring * 0.33) % 1;
            const ringRadius = centerRadius + ringProg * 450;
            const ringAlpha = (1 - ringProg) * 0.45;
            return (
              <circle
                key={`ring-${ring}`}
                cx={0}
                cy={0}
                r={ringRadius}
                fill="none"
                stroke="#FF007F"
                strokeWidth={2}
                strokeOpacity={ringAlpha}
                filter="url(#equalizerGlow)"
              />
            );
          })}

          <g filter="url(#equalizerGlow)">
            {Array.from({ length: numBars }).map((_, i) => {
              const angle = (i / numBars) * Math.PI * 2;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);

              const freqSeed = Math.abs(Math.sin(angle * 3));
              const waveBeat = Math.sin(freqSeed * 10 + t * twoPi * 4);
              const waveHarmonic = Math.cos(angle * 6 - t * twoPi * 2);
              const barLength = 20 + Math.abs(waveBeat * 160 + waveHarmonic * 80);

              const x1 = cos * (centerRadius * centerPulse);
              const y1 = sin * (centerRadius * centerPulse);
              const x2 = cos * (centerRadius * centerPulse + barLength);
              const y2 = sin * (centerRadius * centerPulse + barLength);

              return (
                <line
                  key={`bar-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#neonEqualizerGrad)"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          <circle cx={0} cy={0} r={centerRadius * centerPulse} fill="#080310" stroke="#FF007F" strokeWidth={3} filter="url(#equalizerGlow)" />
          <circle cx={0} cy={0} r={centerRadius * centerPulse * 0.85} fill="#030106" stroke="#7928CA" strokeWidth={2} strokeDasharray="8 12" />
          <circle cx={0} cy={0} r={28} fill="#FF007F" opacity={0.8} />
          <circle cx={0} cy={0} r={12} fill="#FFFFFF" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
