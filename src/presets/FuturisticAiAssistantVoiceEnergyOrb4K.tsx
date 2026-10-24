import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const FuturisticAiAssistantVoiceEnergyOrb4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 140, mass: 0.9 },
  });
  const orbScale = interpolate(enterSpring, [0, 1], [0.3, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Multimodal Voice Speech Simulation (Dynamic Wave Amplitudes)
  const voiceActivity = Math.sin(frame * 0.12) * Math.cos(frame * 0.05);
  const speechExpansion = interpolate(voiceActivity, [-1, 1], [0.85, 1.2]);

  // Sinuous Audio Waveform Ribbons (5 Harmonic Waves)
  const wavePoints = useMemo(() => {
    const numPoints = 80;
    const waves = [
      { freq: 0.04, amp: 140, color: "#00E5FF", stroke: 4, opacity: 0.85 },
      { freq: 0.06, amp: 110, color: "#2979FF", stroke: 3, opacity: 0.7 },
      { freq: 0.03, amp: 160, color: "#7C4DFF", stroke: 3.5, opacity: 0.75 },
      { freq: 0.08, amp: 80, color: "#00E676", stroke: 2, opacity: 0.6 },
      { freq: 0.05, amp: 130, color: "#FF007A", stroke: 2.5, opacity: 0.65 },
    ];

    return waves.map((w, wIdx) => {
      const pts: { x: number; y: number }[] = [];
      const phase = (frame * 0.1 + wIdx * 1.5);
      const span = 2600;
      const startX = (width - span) / 2;

      for (let i = 0; i <= numPoints; i++) {
        const x = startX + (i / numPoints) * span;
        const normX = (i / numPoints) * 2 - 1; // -1 to 1
        const envelope = Math.exp(-normX * normX * 2.5); // Gaussian bell envelope
        const y = height / 2 + Math.sin(i * w.freq * 20 + phase) * w.amp * envelope * speechExpansion;
        pts.push({ x, y });
      }

      // Format SVG path d
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        d += ` L ${pts[i].x} ${pts[i].y}`;
      }
      return { d, color: w.color, stroke: w.stroke, opacity: w.opacity };
    });
  }, [frame, width, height, speechExpansion]);

  // Orbiting acoustic shockwaves
  const rings = [
    { baseR: 300, speed: 1.2, color: "#00E5FF" },
    { baseR: 440, speed: -0.9, color: "#2979FF" },
    { baseR: 580, speed: 0.7, color: "#7C4DFF" },
    { baseR: 720, speed: -0.5, color: "#00E5FF" },
  ];

  const centerX = width / 2;
  const centerY = height / 2;

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
        }}
      >
        <defs>
          <filter id="voiceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="rgba(0, 229, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`ag-h-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`ag-v-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>

        {/* Central Pulsating Orb and Concentric Rings */}
        <g
          transform={`translate(${centerX}, ${centerY}) scale(${orbScale})`}
          filter="url(#voiceGlow)"
        >
          {rings.map((ring, idx) => {
            const rot = (frame * ring.speed) % 360;
            const rPulse = ring.baseR + Math.sin(frame * 0.1 + idx) * 16;
            return (
              <g key={`ring-${idx}`} transform={`rotate(${rot})`}>
                <circle
                  r={rPulse}
                  stroke={ring.color}
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="16 32"
                  opacity="0.45"
                />
              </g>
            );
          })}

          {/* Core Voice Energy Spheres */}
          <circle
            r={180 * speechExpansion}
            fill="#00E5FF"
            opacity="0.25"
          />
          <circle
            r={130 * speechExpansion}
            fill="#2979FF"
            opacity="0.5"
          />
          <circle
            r={80 * speechExpansion}
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>

        {/* Dynamic Horizontal Voice Waveform Ribbons */}
        <g filter="url(#voiceGlow)">
          {wavePoints.map((w, idx) => (
            <path
              key={`wave-${idx}`}
              d={w.d}
              fill="none"
              stroke={w.color}
              strokeWidth={w.stroke}
              opacity={w.opacity}
            />
          ))}
        </g>

        {/* HUD Telemetry Top Left */}
        <g transform="translate(180, 200)">
          <rect
            x="0"
            y="0"
            width="460"
            height="130"
            rx="12"
            fill="rgba(0, 16, 32, 0.7)"
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="2"
          />
          <text
            x="28"
            y="42"
            fill="#00E5FF"
            fontSize="22"
            fontWeight="700"
            letterSpacing="3"
          >
            VOICE SYNTHESIS MATRIX
          </text>
          <text
            x="28"
            y="80"
            fill="rgba(255, 255, 255, 0.75)"
            fontSize="18"
            fontWeight="500"
            letterSpacing="1.5"
          >
            SPECTRAL HARMONICS: 5 BANDS
          </text>
          <text
            x="28"
            y="110"
            fill="#00E676"
            fontSize="18"
            fontWeight="700"
            letterSpacing="2"
          >
            LATENCY: REAL-TIME (CFR 60)
          </text>
        </g>

        {/* HUD Telemetry Top Right */}
        <g transform="translate(3200, 200)">
          <rect
            x="0"
            y="0"
            width="460"
            height="130"
            rx="12"
            fill="rgba(0, 16, 32, 0.7)"
            stroke="rgba(124, 77, 255, 0.4)"
            strokeWidth="2"
          />
          <text
            x="28"
            y="42"
            fill="#7C4DFF"
            fontSize="22"
            fontWeight="700"
            letterSpacing="3"
          >
            ACOUSTIC MODULATION
          </text>
          <text
            x="28"
            y="80"
            fill="#FFFFFF"
            fontSize="24"
            fontWeight="800"
            letterSpacing="2"
          >
            {(voiceActivity * 100).toFixed(1)} dBFS
          </text>
          <text
            x="28"
            y="110"
            fill="rgba(255, 255, 255, 0.6)"
            fontSize="18"
            fontWeight="500"
            letterSpacing="1.5"
          >
            STATUS: MULTIMODAL ACTIVE
          </text>
        </g>

        {/* Bottom Audio Frequency Spectrum Bar */}
        <g transform={`translate(${width / 2 - 450}, ${height - 180})`}>
          <text
            x="450"
            y="-20"
            fill="rgba(255, 255, 255, 0.7)"
            fontSize="18"
            fontWeight="600"
            letterSpacing="4"
            textAnchor="middle"
          >
            VOICE FREQUENCY SPECTRUM ANALYZER
          </text>
          <g transform="translate(0, 0)">
            {Array.from({ length: 45 }).map((_, i) => {
              const h = Math.abs(Math.sin(frame * 0.15 + i * 0.3)) * 40 + 8;
              return (
                <rect
                  key={`eq-${i}`}
                  x={i * 20}
                  y={40 - h}
                  width="12"
                  height={h}
                  rx="3"
                  fill="#00E5FF"
                  opacity="0.8"
                />
              );
            })}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
