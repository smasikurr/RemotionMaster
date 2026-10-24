import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * Deterministic PRNG for reproducible micro-variations
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Synthesizes realistic human voiceover audio speech envelope
 * Generates natural cadence: words, syllables, plosives, and breath pauses
 */
function getVoiceEnvelope(t: number): number {
  // Speech cadence structure across 7.0 seconds (420 frames @ 60 FPS)
  const phonemes = [
    // Phrase 1: "Audio Waveform"
    { center: 0.38, dur: 0.12, amp: 0.45, plosive: false },
    { center: 0.55, dur: 0.07, amp: 0.82, plosive: true },
    { center: 0.75, dur: 0.14, amp: 0.48, plosive: false },
    { center: 1.05, dur: 0.13, amp: 0.65, plosive: false },
    { center: 1.25, dur: 0.06, amp: 0.94, plosive: true },
    { center: 1.45, dur: 0.12, amp: 0.52, plosive: false },
    { center: 1.68, dur: 0.15, amp: 0.38, plosive: false },

    // Breath Pause (1.85 to 2.25s)

    // Phrase 2: "Studio Voiceover Articulation"
    { center: 2.35, dur: 0.10, amp: 0.52, plosive: false },
    { center: 2.55, dur: 0.08, amp: 0.78, plosive: true },
    { center: 2.75, dur: 0.14, amp: 0.58, plosive: false },
    { center: 3.00, dur: 0.16, amp: 0.48, plosive: false },

    // Climax Speech Transients around 3.5s (Frame 210)
    { center: 3.25, dur: 0.08, amp: 0.86, plosive: true },
    { center: 3.42, dur: 0.06, amp: 0.96, plosive: true },
    { center: 3.50, dur: 0.05, amp: 1.00, plosive: true }, // Maximum voice spike
    { center: 3.58, dur: 0.07, amp: 0.92, plosive: true },

    // Phrase 3: "Precision Audio Spectrum"
    { center: 4.15, dur: 0.14, amp: 0.60, plosive: false },
    { center: 4.40, dur: 0.07, amp: 0.88, plosive: true },
    { center: 4.65, dur: 0.15, amp: 0.45, plosive: false },

    // Breath Pause (4.85 to 5.15s)

    // Phrase 4: "Commercial Master Dynamics"
    { center: 5.30, dur: 0.09, amp: 0.82, plosive: true },
    { center: 5.50, dur: 0.15, amp: 0.68, plosive: false },
    { center: 5.75, dur: 0.07, amp: 0.92, plosive: true },
    { center: 6.00, dur: 0.14, amp: 0.50, plosive: false },
    { center: 6.25, dur: 0.18, amp: 0.35, plosive: false },
  ];

  const baseAmbient = 0.012;
  let maxAmp = baseAmbient;

  for (let i = 0; i < phonemes.length; i++) {
    const p = phonemes[i];
    const dt = (t - p.center) / (p.dur * 0.5);
    if (Math.abs(dt) < 2.8) {
      let shape = Math.exp(-0.5 * dt * dt);
      if (p.plosive) {
        shape = Math.pow(shape, 1.6);
      }
      const val = shape * p.amp;
      if (val > maxAmp) {
        maxAmp = val;
      }
    }
  }

  // Vocal fold formant micro-flutter
  const vocalJitter = 1.0 + 0.06 * Math.sin(t * 140.0) * Math.cos(t * 85.0);
  return Math.min(1.0, Math.max(0.012, maxAmp * vocalJitter));
}

export const MinimalistStudioAudioWaveformWhite4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 4K Canvas Geometry
  const cy = height * 0.5; // 1080 (Exact vertical symmetry axis)
  const barCount = 122; // Spectrum bar density
  const barSpacing = 26; // 26px spacing
  const barStrokeWidth = 4.8; // Refined charcoal bar line thickness
  const totalWaveWidth = (barCount - 1) * barSpacing; // 3146px (81.93% of canvas)
  const startX = (width - totalWaveWidth) * 0.5; // 347px

  // Playhead Soundhead Cursor Index (at ~80% of width)
  const playheadIndex = 104; // X = 347 + 104 * 26 = 3051px (79.45% of width)
  const playheadX = startX + playheadIndex * barSpacing;

  // 1. Organic Idle Micro-Breathing
  const idle = harmonicIdleMotion(frame, {
    speed: 0.03,
    amplitudeY: 3,
    tiltDegrees: 0,
  });

  // Current audio playback time in seconds
  const currentTime = frame / 60;

  // Master fade envelopes (Smooth entrance and exit)
  const masterOpacity = interpolate(
    frame,
    [0, 25, 395, 420],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Compute Waveform Bars Configuration for Current Frame
  const bars = useMemo(() => {
    const list = [];
    const maxBarHeight = 780; // Peak voice transient height (symmetric: 390px up, 390px down)
    const minBarHeight = 10; // Baseline ambient audio tick

    for (let i = 0; i < barCount; i++) {
      const x = startX + i * barSpacing;

      let height = minBarHeight;
      let barOpacity = 1.0;

      if (i <= playheadIndex) {
        // Historical recorded voice audio scrolling to the left
        // Time represented by this bar:
        const timeOffset = (playheadIndex - i) * 0.022; // 0.022s per bar
        const barTime = currentTime - timeOffset;

        const envelopeAmp = getVoiceEnvelope(barTime);

        // Micro-random organic jitter between adjacent spectrum bands
        const rJitter = seededRandom(i * 13 + Math.floor(frame * 0.1) * 7);
        const jitterMult = 0.94 + rJitter * 0.12;

        const rawHeight = minBarHeight + envelopeAmp * (maxBarHeight - minBarHeight) * jitterMult;

        // Left edge smooth taper (dissolve into white canvas as audio scrolls away)
        let leftTaper = 1.0;
        if (x < 650) {
          leftTaper = Math.max(0.0, (x - startX) / (650 - startX));
        }

        height = Math.max(minBarHeight * leftTaper, rawHeight * leftTaper);
        barOpacity = Math.max(0.05, leftTaper);
      } else {
        // Upcoming audio ahead of the active playhead cursor (quiet ambient baseline)
        const aheadDist = i - playheadIndex;
        const rAhead = seededRandom(i * 19 + frame * 0.05);
        const ambientTick = minBarHeight * (0.8 + rAhead * 0.4);

        // Right edge taper
        let rightTaper = 1.0;
        if (x > 3350) {
          rightTaper = Math.max(0.0, 1.0 - (x - 3350) / (startX + totalWaveWidth - 3350));
        }

        height = ambientTick * rightTaper;
        barOpacity = 0.65 * rightTaper;
      }

      list.push({
        id: i,
        x,
        height,
        opacity: barOpacity,
      });
    }

    return list;
  }, [barCount, barSpacing, startX, totalWaveWidth, playheadIndex, currentTime, frame]);

  // Current height of the active bar right at the playhead
  const currentPlayheadHeight = bars[playheadIndex]?.height || 10;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f1f5f9", // Uniform Clean Studio Off-White / Light Gray Canvas
        width,
        height,
        overflow: "hidden",
        position: "relative",
        opacity: masterOpacity,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Subtle Master Vertical Breathing Group */}
        <g transform={`translate(0, ${idle.idleY})`}>
          {/* ================================================================= */}
          {/* LAYER 1: 122 Symmetrical Charcoal Voice Audio Spectrum Bars */}
          {/* ================================================================= */}
          {bars.map((bar) => {
            const halfH = bar.height * 0.5;
            const y1 = cy - halfH;
            const y2 = cy + halfH;

            return (
              <line
                key={`voice-bar-${bar.id}`}
                x1={bar.x}
                y1={y1}
                x2={bar.x}
                y2={y2}
                stroke="#0f172a" // Charcoal / Slate dark lines
                strokeWidth={barStrokeWidth}
                strokeLinecap="round"
                opacity={bar.opacity}
              />
            );
          })}

          {/* ================================================================= */}
          {/* LAYER 2: Vertical Soundhead Playhead Cursor at X = 3051px */}
          {/* ================================================================= */}
          {/* Hairline playhead level guide */}
          <line
            x1={playheadX}
            y1={cy - currentPlayheadHeight * 0.5 - 28}
            x2={playheadX}
            y2={cy + currentPlayheadHeight * 0.5 + 28}
            stroke="#0f172a"
            strokeWidth={1.5}
            opacity={0.4}
          />

          {/* Top Playhead Level Pip Indicator */}
          <circle
            cx={playheadX}
            cy={cy - currentPlayheadHeight * 0.5 - 34}
            r={3.5}
            fill="#0f172a"
            opacity={0.85}
          />

          {/* Bottom Playhead Level Pip Indicator */}
          <circle
            cx={playheadX}
            cy={cy + currentPlayheadHeight * 0.5 + 34}
            r={3.5}
            fill="#0f172a"
            opacity={0.85}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
