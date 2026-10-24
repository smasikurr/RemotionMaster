import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import {
  anticipationSpring,
  harmonicIdleMotion,
  squashAndStretch,
} from "../physics/craftPhysics";
import { SPRING_PRESETS } from "../physics/springs";

/**
 * Deterministic PRNG for stable, reproducible particle coordinates
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface AcousticParticle {
  id: number;
  side: 1 | -1; // 1 for right, -1 for left
  baseDist: number;
  angle: number;
  size: number;
  type: "diamond" | "spark" | "orb";
  color: string;
  speed: number;
  phase: number;
}

export const HolographicAcousticSoundWavePulse4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const cx = width * 0.5; // 1920
  const cy = height * 0.5; // 1080

  // 1. Harmonic Idle Breathing (Organic floating micro-motion)
  const idle = harmonicIdleMotion(frame, {
    speed: 0.04,
    amplitudeY: 12,
    tiltDegrees: 0.8,
  });

  // 2. Rhythmic Voice / Acoustic Pulse Kick (Anticipation spring every 60 frames)
  const beatCycleFrames = 60;
  const currentBeatFrame = frame % beatCycleFrames;
  const beatKick = anticipationSpring(currentBeatFrame, fps, {
    delay: 4,
    anticipationFrames: 6,
    anticipationDepth: 0.06,
    springConfig: { damping: 12, stiffness: 140, mass: 0.9 },
  });

  // Dynamic vocal frequency modulation
  const voiceFreq =
    Math.sin(frame * 0.18) * 0.4 +
    Math.sin(frame * 0.32) * 0.25 +
    Math.sin(frame * 0.08) * 0.35;

  // 3. Concentric Traveling Acoustic Wavefront Arcs (6 wavefront tiers)
  const waveCount = 6;
  const rMin = 140;
  const rMax = 1460; // Outermost radius reaches 1460px (X: 460 to 3380 = 2920px span = 76% canvas)
  const arcSpanAngle = Math.PI * 0.235; // 42.3 degrees half-spread
  const arcSteps = 40;

  const waveArcs = useMemo(() => {
    const list = [];

    for (let k = 0; k < waveCount; k++) {
      // Continuous looping phase offset for each wavefront tier
      const rawPhase = ((frame + k * (beatCycleFrames * 2.5) / waveCount) % (beatCycleFrames * 2.5)) / (beatCycleFrames * 2.5);
      
      // Decelerating acoustic pressure propagation (faster near core, easing out)
      const easedPhase = Math.pow(rawPhase, 0.72);
      const r = rMin + (rMax - rMin) * easedPhase;

      // Amplitude envelope: stays intensely bright across 85% of travel, then dissipates smoothly
      const envelope = interpolate(
        rawPhase,
        [0, 0.08, 0.85, 1.0],
        [0.25, 0.95, 0.85, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      const opacity = envelope * (0.88 + 0.12 * Math.sin(frame * 0.2 + k));

      // Muscular crescent thickness: thickest at center horn, tapering to needles at tips
      const maxThickness = (18 + 14 * (1 - rawPhase * 0.6)) * (1.0 + 0.18 * voiceFreq);

      // Construct Right Crescent Arc Path
      let rightOuter = "";
      let rightInner = "";
      let rightCore = "";

      // Construct Left Crescent Arc Path
      let leftOuter = "";
      let leftInner = "";
      let leftCore = "";

      for (let i = 0; i <= arcSteps; i++) {
        const u = i / arcSteps;
        const theta = (u - 0.5) * 2 * arcSpanAngle; // -arcSpanAngle to +arcSpanAngle
        const taper = Math.pow(Math.cos((theta / arcSpanAngle) * (Math.PI / 2)), 1.3);
        const halfThick = (maxThickness * 0.5) * taper;

        // Acoustic harmonic flutter
        const waveFlutter = Math.sin(theta * 6 + frame * 0.1) * (2.5 * rawPhase);

        const rOut = r + halfThick + waveFlutter;
        const rIn = Math.max(rMin * 0.5, r - halfThick + waveFlutter);
        const rMid = r + waveFlutter;

        // Coordinates for Right Arc
        const rxOut = cx + rOut * Math.cos(theta);
        const ryOut = cy + rOut * Math.sin(theta);
        const rxIn = cx + rIn * Math.cos(theta);
        const ryIn = cy + rIn * Math.sin(theta);
        const rxMid = cx + rMid * Math.cos(theta);
        const ryMid = cy + rMid * Math.sin(theta);

        // Coordinates for Left Arc (Symmetric)
        const lxOut = cx - rOut * Math.cos(theta);
        const lyOut = cy + rOut * Math.sin(theta);
        const lxIn = cx - rIn * Math.cos(theta);
        const lyIn = cy + rIn * Math.sin(theta);
        const lxMid = cx - rMid * Math.cos(theta);
        const lyMid = cy + rMid * Math.sin(theta);

        if (i === 0) {
          rightOuter += `M ${rxOut.toFixed(1)} ${ryOut.toFixed(1)}`;
          rightInner = `L ${rxIn.toFixed(1)} ${ryIn.toFixed(1)}`;
          rightCore += `M ${rxMid.toFixed(1)} ${ryMid.toFixed(1)}`;

          leftOuter += `M ${lxOut.toFixed(1)} ${lyOut.toFixed(1)}`;
          leftInner = `L ${lxIn.toFixed(1)} ${lyIn.toFixed(1)}`;
          leftCore += `M ${lxMid.toFixed(1)} ${lyMid.toFixed(1)}`;
        } else {
          rightOuter += ` L ${rxOut.toFixed(1)} ${ryOut.toFixed(1)}`;
          rightInner = ` L ${rxIn.toFixed(1)} ${ryIn.toFixed(1)}` + rightInner;
          rightCore += ` L ${rxMid.toFixed(1)} ${ryMid.toFixed(1)}`;

          leftOuter += ` L ${lxOut.toFixed(1)} ${lyOut.toFixed(1)}`;
          leftInner = ` L ${lxIn.toFixed(1)} ${lyIn.toFixed(1)}` + leftInner;
          leftCore += ` L ${lxMid.toFixed(1)} ${lyMid.toFixed(1)}`;
        }
      }

      const rightD = rightOuter + " " + rightInner + " Z";
      const leftD = leftOuter + " " + leftInner + " Z";

      list.push({
        id: k,
        r,
        opacity,
        rightD,
        leftD,
        rightCore,
        leftCore,
        rawPhase,
      });
    }

    return list;
  }, [frame, waveCount, cx, cy, voiceFreq]);

  // 4. Acoustic Field Suspended Particles (140 micro-particles)
  const particles = useMemo<AcousticParticle[]>(() => {
    const list: AcousticParticle[] = [];
    const count = 140;
    const colors = [
      "#FFFFFF", // Pure specular white
      "#E0F2FE", // Soft icy cyan
      "#38BDF8", // Vibrant sky cyan
      "#00F0FF", // Electric laser cyan
      "#1E40AF", // Deep cobalt acoustic
    ];

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 17 + 5);
      const r2 = seededRandom(i * 23 + 9);
      const r3 = seededRandom(i * 31 + 13);
      const r4 = seededRandom(i * 41 + 17);

      const side: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const baseDist = 180 + r1 * 1230; // Distributed between 180px and 1410px from center
      const angle = (r2 - 0.5) * (Math.PI * 0.48); // within the acoustic spread cone
      const type: AcousticParticle["type"] =
        r3 < 0.4 ? "diamond" : r3 < 0.75 ? "spark" : "orb";
      const size = type === "diamond" ? 4 + r4 * 6 : type === "spark" ? 12 + r4 * 18 : 3 + r4 * 5;
      const color = colors[Math.floor(r2 * colors.length)];
      const speed = 0.05 + r1 * 0.08;
      const phase = r3 * Math.PI * 2;

      list.push({
        id: i,
        side,
        baseDist,
        angle,
        size,
        type,
        color,
        speed,
        phase,
      });
    }
    return list;
  }, []);

  // 5. Central Emitter Diaphragm Metrics
  const coreScale = 1.0 + 0.12 * beatKick + 0.08 * voiceFreq;
  const coreGlowRadius = 85 * coreScale;

  // 48 Equalizer Radial Ticks around Emitter
  const tickCount = 48;
  const tickLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < tickCount; i++) {
      const theta = (i / tickCount) * Math.PI * 2;
      // Audio spectrum simulated bounce
      const freqAmp = Math.sin(frame * 0.15 + i * 0.4) * 0.5 + 0.5;
      const tickLen = 8 + freqAmp * 18;
      const rInner = 100 * coreScale;
      const rOuter = rInner + tickLen;

      const x1 = cx + Math.cos(theta) * rInner;
      const y1 = cy + Math.sin(theta) * rInner;
      const x2 = cx + Math.cos(theta) * rOuter;
      const y2 = cy + Math.sin(theta) * rOuter;

      lines.push({ id: i, x1, y1, x2, y2, opacity: 0.4 + 0.6 * freqAmp });
    }
    return lines;
  }, [frame, coreScale, cx, cy]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Strictly 100% Solid Flat Black (Zero gradient for clean Screen/Add mode)
        width,
        height,
        overflow: "hidden",
        position: "relative",
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
        <defs>
          {/* Dual-Pass Multi-Tier Optical Specular Glow */}
          <filter id="acousticOpticalGlow" x="-30%" y="-30%" width="160%" height="160%">
            {/* Pass 1: Tight Specular Core (stdDeviation 4px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="tightCore" />
            {/* Pass 2: Atmospheric Diffuse Bloom (stdDeviation 24px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="diffuseBloom" />
            <feMerge>
              <feMergeNode in="diffuseBloom" />
              <feMergeNode in="tightCore" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ultra-Soft Atmospheric Bokeh Depth Blur */}
          <filter id="dustBokehBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>

          {/* Linear Gradients for Symmetrical Wavefront Ribbons */}
          <linearGradient id="waveRightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="waveLeftGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Central Emitter Core Radial Gradient */}
          <radialGradient id="emitterCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#00F0FF" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#0284C7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Master Motion Group with Living Breathing Harmonic Idle Motion */}
        <g
          transform={`translate(0, ${idle.idleY}) rotate(${idle.idleRotate}, ${cx}, ${cy})`}
        >
          {/* Layer 1: Suspended Acoustic Field Micro-Dust & Pressure Particles */}
          <g filter="url(#dustBokehBlur)">
            {particles.map((p) => {
              // Pressure wave oscillation: horizontal drift driven by wave phase
              const wavePush = Math.sin(frame * p.speed + p.phase) * 16;
              const px = cx + p.side * (p.baseDist + wavePush) * Math.cos(p.angle);
              const py = cy + (p.baseDist + wavePush) * Math.sin(p.angle);

              // Twinkle opacity
              const twinkle = 0.35 + 0.65 * Math.sin(frame * 0.12 + p.id);

              if (p.type === "diamond") {
                const r = p.size;
                return (
                  <polygon
                    key={`p-${p.id}`}
                    points={`${px},${py - r} ${px + r * 0.4},${py} ${px},${py + r} ${px - r * 0.4},${py}`}
                    fill={p.color}
                    opacity={twinkle * 0.8}
                  />
                );
              } else if (p.type === "spark") {
                const len = p.size;
                return (
                  <line
                    key={`p-${p.id}`}
                    x1={px}
                    y1={py}
                    x2={px + p.side * len}
                    y2={py}
                    stroke={p.color}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    opacity={twinkle * 0.75}
                  />
                );
              } else {
                return (
                  <circle
                    key={`p-${p.id}`}
                    cx={px}
                    cy={py}
                    r={p.size * 0.5}
                    fill={p.color}
                    opacity={twinkle * 0.65}
                  />
                );
              }
            })}
          </g>

          {/* Layer 2: Concentric Radiating Acoustic Wavefront Crescents */}
          <g filter="url(#acousticOpticalGlow)">
            {waveArcs.map((arc) => (
              <g key={`wave-pair-${arc.id}`}>
                {/* Right Wavefront Crescent */}
                <path
                  d={arc.rightD}
                  fill="url(#waveRightGrad)"
                  opacity={arc.opacity}
                />
                {/* Right Specular Core Filament */}
                <path
                  d={arc.rightCore}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  opacity={arc.opacity * 0.95}
                />

                {/* Left Wavefront Crescent (Symmetrical) */}
                <path
                  d={arc.leftD}
                  fill="url(#waveLeftGrad)"
                  opacity={arc.opacity}
                />
                {/* Left Specular Core Filament */}
                <path
                  d={arc.leftCore}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  opacity={arc.opacity * 0.95}
                />
              </g>
            ))}
          </g>

          {/* Layer 3: Central Holographic Acoustic Emitter Diaphragm (Hero Focal Point) */}
          <g filter="url(#acousticOpticalGlow)">
            {/* Ambient Acoustic Pressure Sphere */}
            <circle
              cx={cx}
              cy={cy}
              r={coreGlowRadius}
              fill="url(#emitterCoreGrad)"
              opacity={0.9}
            />

            {/* Concentric Diaphragm Micro-Rings */}
            <circle
              cx={cx}
              cy={cy}
              r={40 * coreScale}
              fill="none"
              stroke="#00F0FF"
              strokeWidth={2.5}
              opacity={0.85}
            />
            <circle
              cx={cx}
              cy={cy}
              r={68 * coreScale}
              fill="none"
              stroke="#38BDF8"
              strokeWidth={1.8}
              strokeDasharray="6 4"
              opacity={0.75}
            />
            <circle
              cx={cx}
              cy={cy}
              r={96 * coreScale}
              fill="none"
              stroke="#0284C7"
              strokeWidth={1.5}
              opacity={0.65}
            />

            {/* Segmented Equalizer Audio Meter Ticks */}
            {tickLines.map((tick) => (
              <line
                key={`tick-${tick.id}`}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="#00F0FF"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={tick.opacity}
              />
            ))}

            {/* Blinding White Specular Epicenter Flare */}
            <polygon
              points={`
                ${cx},${cy - 52 * coreScale}
                ${cx + 8},${cy - 8}
                ${cx + 52 * coreScale},${cy}
                ${cx + 8},${cy + 8}
                ${cx},${cy + 52 * coreScale}
                ${cx - 8},${cy + 8}
                ${cx - 52 * coreScale},${cy}
                ${cx - 8},${cy - 8}
              `}
              fill="#FFFFFF"
              opacity={0.98}
            />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
