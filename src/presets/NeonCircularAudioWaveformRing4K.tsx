import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { harmonicIdleMotion } from "../physics/craftPhysics";

/**
 * NeonCircularAudioWaveformRing4K
 *
 * Commercial-grade 4K 60FPS Neon Circular Audio Spectrum / Sound Waveform Ring
 * Based on iStock reference: istockphoto-2188295863-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (600 frames / 10.0s seamless loop)
 * - 100% Pure Solid Black #000000 base
 * - Commanding hero presence: ~1640px diameter (75.9% of canvas height)
 * - All 4 corner zones (15% margin) guaranteed 100% pure black
 * - Multi-tier specular optical bloom (tight core + atmospheric halo)
 * - Authentic multi-octave audio frequency synthesis (kick, snare, bass, treble)
 */
export const NeonCircularAudioWaveformRing4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cx = width * 0.5; // 1920
  const cy = height * 0.5; // 1080

  const totalFrames = 600;
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;

  // 1. Organic Living Idle Motion
  const idle = harmonicIdleMotion(frame, {
    speed: 0.04,
    amplitudeY: 3.0,
    tiltDegrees: 0.08,
  });

  // Slow, hypnotic clockwise ring drift (0.04 deg/frame)
  const ringRotation = (frame * 0.04) % 360;

  // Master fade envelopes for seamless loop
  const masterOpacity = interpolate(
    frame,
    [0, 20, 580, 600],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Multi-Octave Audio Rhythm Engine (120 BPM simulated electronic track)
  // Beat interval: 60fps / (120bpm / 60s) = 30 frames per beat
  const beatFrame = frame % 30;
  const kickImpulse = Math.pow(Math.max(0, 1 - beatFrame / 10), 2.2) * 45; // 0 to 45px explosive bass thump

  // Snare on backbeats (every 60 frames, offset by 15)
  const snareFrame = (frame + 15) % 60;
  const snareImpulse = Math.pow(Math.max(0, 1 - snareFrame / 14), 2.0) * 35;

  // Breathing base radius (calibrated for commanding 74-76% canvas height)
  const baseRadius = 605 + Math.sin(t * twoPi * 2) * 14 + kickImpulse * 0.25;

  // 3. Generate 112 Radial Frequency Bands (56 sharp peaks + 56 valleys)
  const numBands = 112;
  const waveformPath = useMemo(() => {
    let d = "";
    for (let i = 0; i < numBands; i++) {
      const angle = (i / numBands) * twoPi;
      const isPeak = i % 2 === 1;

      let r = baseRadius;
      if (isPeak) {
        // Frequency-dependent amplitude shaping
        // Bass region: angles ~ 0.5pi to 1.0pi (bottom to left)
        const bassWeight = 0.5 + 0.5 * Math.sin(angle - Math.PI * 0.3);
        // Treble region: angles ~ 1.5pi to 2.0pi (top to right)
        const trebleWeight = 0.5 + 0.5 * Math.cos(angle - Math.PI * 0.8);

        // Harmonic wave oscillations
        const h1 = Math.sin(angle * 4 + t * twoPi * 3) * 32;
        const h2 = Math.cos(angle * 7 - t * twoPi * 5) * 24;
        const h3 = Math.sin(angle * 13 + t * twoPi * 8) * 16;
        const jitter = Math.sin(angle * 29 + frame * 0.35) * 8;

        const dynamicAmp =
          50 +
          kickImpulse * bassWeight * 1.8 +
          snareImpulse * trebleWeight * 1.4 +
          Math.abs(h1 + h2 + h3) +
          jitter;

        r = baseRadius + Math.max(25, Math.min(235, dynamicAmp));
      } else {
        // Valley point sits slightly inward from base radius for crisp teeth definition
        r = baseRadius - 15 - Math.sin(angle * 6 + t * twoPi) * 8;
      }

      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;

      if (i === 0) {
        d += `M ${px.toFixed(2)} ${py.toFixed(2)} `;
      } else {
        d += `L ${px.toFixed(2)} ${py.toFixed(2)} `;
      }
    }
    d += "Z";
    return d;
  }, [baseRadius, cx, cy, kickImpulse, snareImpulse, t, frame]);

  // 4. Subtle Inner Concentric Audio Rings
  const innerRing1 = baseRadius * 0.82;
  const innerRing2 = baseRadius * 0.65;

  // 5. Ambient Floating Audio Dust Particles in Center Nexus
  const particles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, idx) => {
      const seed = idx * 17.391;
      const rad = 40 + ((seed * 11) % 360);
      const baseAngle = ((seed * 31) % 360) * (Math.PI / 180);
      const speed = 0.02 + ((seed * 7) % 0.04);
      const size = 2.0 + ((seed * 3) % 4.0);
      return { id: idx, rad, baseAngle, speed, size };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // 100% Pure Solid Black
        width,
        height,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <defs>
          {/* Dual-Pass Specular Neon Bloom Filter */}
          <filter id="neonSpectrumGlow" x="-50%" y="-50%" width="200%" height="200%">
            {/* Pass 1: Razor tight specular core */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="tightGlow" />
            {/* Pass 2: Atmospheric diffuse neon bloom */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="15.0" result="midGlow" />
            {/* Pass 3: Wide ambient aura */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="38.0" result="wideGlow" />
            <feMerge>
              <feMergeNode in="wideGlow" opacity="0.4" />
              <feMergeNode in="midGlow" />
              <feMergeNode in="tightGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Smooth Conical/Angular Linear Gradient Emulation across 4 Quadrants */}
          <linearGradient id="neonGradientH" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" /> {/* Cyan / Periwinkle */}
            <stop offset="28%" stopColor="#818CF8" /> {/* Soft Cyber Blue */}
            <stop offset="55%" stopColor="#A855F7" /> {/* Electric Purple */}
            <stop offset="78%" stopColor="#EC4899" /> {/* Hot Magenta */}
            <stop offset="100%" stopColor="#F43F5E" /> {/* Vibrant Rose Pink */}
          </linearGradient>

          <linearGradient id="neonGradientAlt" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="35%" stopColor="#D946EF" />
            <stop offset="70%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Center Ambient Glow */}
          <radialGradient id="centerAmbientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.14" />
            <stop offset="45%" stopColor="#EC4899" stopOpacity="0.06" />
            <stop offset="85%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Master Motion Group with Living Harmonic Idle & Master Opacity */}
        <g
          transform={`translate(0, ${idle.idleY})`}
          opacity={masterOpacity}
        >
          {/* Layer 1: Ambient Radial Energy Core */}
          <circle
            cx={cx}
            cy={cy}
            r={baseRadius * 1.05}
            fill="url(#centerAmbientGlow)"
          />

          {/* Layer 2: Subtle Inner Concentric Dashed Ghost Rings */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRing1}
            fill="none"
            stroke="url(#neonGradientH)"
            strokeWidth={1.8}
            strokeDasharray="6 12"
            opacity={0.32}
            transform={`rotate(${-frame * 0.08}, ${cx}, ${cy})`}
          />
          <circle
            cx={cx}
            cy={cy}
            r={innerRing2}
            fill="none"
            stroke="url(#neonGradientAlt)"
            strokeWidth={1.4}
            strokeDasharray="4 18"
            opacity={0.22}
            transform={`rotate(${frame * 0.12}, ${cx}, ${cy})`}
          />

          {/* Layer 3: Ambient Center Audio Dust Particles */}
          {particles.map((p) => {
            const angle = p.baseAngle + frame * p.speed;
            const px = cx + Math.cos(angle) * p.rad;
            const py = cy + Math.sin(angle) * p.rad;
            const alpha = 0.25 + 0.35 * Math.sin(frame * 0.05 + p.id);
            return (
              <circle
                key={`p-${p.id}`}
                cx={px}
                cy={py}
                r={p.size}
                fill="#FDF4FF"
                opacity={alpha}
              />
            );
          })}

          {/* Layer 4: HERO Radial Audio Waveform Ring with Optical Bloom */}
          <g
            filter="url(#neonSpectrumGlow)"
            transform={`rotate(${ringRotation}, ${cx}, ${cy})`}
          >
            {/* Primary Colored Neon Waveform Stroke */}
            <path
              d={waveformPath}
              fill="none"
              stroke="url(#neonGradientH)"
              strokeWidth={4.2}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.96}
            />

            {/* Specular Pure White-Hot Highlight Core for Intense Luminescence */}
            <path
              d={waveformPath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={1.8}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.88}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
