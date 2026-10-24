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
 * Deterministic pseudo-random generator
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface FrostParticle {
  id: number;
  u: number; // normalized position along wave [0.05, 0.95]
  offsetY: number; // base vertical scatter
  burstDist: number; // radial displacement upon wave front impact
  burstAngle: number; // trajectory angle (radians)
  size: number;
  type: "diamond" | "streak" | "bokeh";
  color: string;
  twinkleSpeed: number;
  phase: number;
  triggerFrame: number;
}

export const CinematicIceTealParticleWaveWipe4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  // 1. Master Fade Envelope (Clean frame 0 entry and frame 300 exit)
  const masterOpacity = interpolate(
    frame,
    [0, 10, 290, 300],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Harmonic Idle Breathing (Senior Motion Standard: never static holds)
  const idle = harmonicIdleMotion(frame, {
    speed: 0.04,
    amplitudeY: 15,
    tiltDegrees: 1.8,
  });

  // 3. Dynamic Wave Head & Tail Sweep Coordinates
  // Anticipation Spring launches the wave head violently across the canvas
  const headSpring = anticipationSpring(frame, fps, {
    delay: 12,
    anticipationFrames: 8,
    anticipationDepth: 0.04,
    springConfig: { damping: 18, stiffness: 45, mass: 1.1 },
  });

  // Wave Head sweeps from X=380 to X=3580
  const waveHeadX = interpolate(
    headSpring,
    [0, 1],
    [380, 3580],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Wave Tail trails behind, expanding canvas coverage to > 3,300px
  // In the exit phase (frame 190-290), tail sweeps forward to clear the screen
  const tailProgress = interpolate(
    frame,
    [0, 30, 75, 190, 285],
    [0, 0.05, 0.08, 0.12, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    }
  );
  const waveTailX = interpolate(
    tailProgress,
    [0, 1],
    [300, 3700],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Effective wave start and end clamped safely inside the 4K horizontal canvas
  const effectiveStart = Math.min(waveTailX, waveHeadX - 40);
  const effectiveEnd = Math.max(waveHeadX, effectiveStart + 120);

  // Dynamic squash & stretch of wave crest based on acceleration velocity
  const prevHeadSpring = anticipationSpring(Math.max(0, frame - 1), fps, {
    delay: 12,
    anticipationFrames: 8,
    anticipationDepth: 0.04,
    springConfig: { damping: 18, stiffness: 45, mass: 1.1 },
  });
  const crestDeform = squashAndStretch(headSpring, prevHeadSpring, 0.8);

  // 4. Generate 220 Deterministic Frost Crystals & Embers
  const particles = useMemo<FrostParticle[]>(() => {
    const list: FrostParticle[] = [];
    const count = 220;
    const colors = [
      "#FFFFFF", // Specular frost white
      "#E0FFFF", // Light cyan
      "#00F5FF", // Electric cyber cyan
      "#00F5D4", // Radiant ice mint
      "#38BDF8", // Luminous arctic sky
      "#A5F3FC", // Micro diamond frost
    ];

    for (let i = 0; i < count; i++) {
      const u = 0.06 + (i / count) * 0.88; // 6% to 94% along the curve
      const r1 = seededRandom(i * 11 + 3);
      const r2 = seededRandom(i * 17 + 7);
      const r3 = seededRandom(i * 23 + 13);
      const r4 = seededRandom(i * 29 + 19);

      // Base vertical scatter
      const offsetY = (r1 - 0.5) * 240;
      // Burst distance when wave strikes
      const burstDist = 60 + r2 * 200;
      // Angle perpendicular to flow + scatter
      const burstAngle = (r3 - 0.5) * Math.PI * 0.8 + (r1 > 0.5 ? Math.PI / 2 : -Math.PI / 2);
      // Particle type
      const type: FrostParticle["type"] =
        r4 < 0.38 ? "diamond" : r4 < 0.72 ? "streak" : "bokeh";
      const size = type === "diamond" ? 4 + r1 * 8 : type === "streak" ? 14 + r1 * 26 : 5 + r1 * 11;
      const color = colors[Math.floor(r2 * colors.length)];
      const twinkleSpeed = 0.08 + r3 * 0.12;
      const phase = r1 * Math.PI * 2;
      // Trigger frame dynamically mapped to when the wave front reaches this U position
      const triggerFrame = Math.round(20 + u * 68);

      list.push({
        id: i,
        u,
        offsetY,
        burstDist,
        burstAngle,
        size,
        type,
        color,
        twinkleSpeed,
        phase,
        triggerFrame,
      });
    }
    return list;
  }, []);

  // 5. Mathematical Generation of the 3 Layered Fluid Ribbons
  const sampleSteps = 80;

  // Ribbon 1: Primary Hero Wave Ribbon (Commands 70%+ visual gravity)
  const primaryRibbon = useMemo(() => {
    const topPts: [number, number][] = [];
    const botPts: [number, number][] = [];
    const midPts: [number, number][] = [];

    const span = effectiveEnd - effectiveStart;
    if (span <= 10) return { pathD: "", midPts: [] };

    for (let i = 0; i <= sampleSteps; i++) {
      const u = i / sampleSteps;
      const x = effectiveStart + u * span;

      // S-curve fluid backbone centered safely at Y=1080
      const arch = Math.sin(u * Math.PI) * 75;
      const w1 = Math.sin(u * 2.8 * Math.PI - frame * 0.055) * 115;
      const w2 = Math.cos(u * 5.4 * Math.PI + frame * 0.04) * 55;
      const w3 = Math.sin(u * 7.6 * Math.PI - frame * 0.075) * 25;

      const yMid = 1080 - arch * 0.4 + w1 + w2 + w3;

      // Muscular swelling envelope tapering smoothly to needle points
      const envelope = Math.pow(Math.sin(u * Math.PI), 0.78);
      const microRipple = 1.0 + 0.14 * Math.sin(u * 9 * Math.PI + frame * 0.09);
      const halfThickness = 145 * envelope * microRipple;

      topPts.push([x, yMid - halfThickness]);
      botPts.push([x, yMid + halfThickness]);
      midPts.push([x, yMid]);
    }

    let pathD = `M ${topPts[0][0].toFixed(1)} ${topPts[0][1].toFixed(1)}`;
    for (let i = 1; i < topPts.length; i++) {
      pathD += ` L ${topPts[i][0].toFixed(1)} ${topPts[i][1].toFixed(1)}`;
    }
    for (let i = botPts.length - 1; i >= 0; i--) {
      pathD += ` L ${botPts[i][0].toFixed(1)} ${botPts[i][1].toFixed(1)}`;
    }
    pathD += " Z";

    return { pathD, midPts };
  }, [effectiveStart, effectiveEnd, frame, sampleSteps]);

  // Ribbon 2: Secondary Harmonic Counter-Flow Ribbon (Ice Mint Turquoise)
  const secondaryRibbon = useMemo(() => {
    const topPts: [number, number][] = [];
    const botPts: [number, number][] = [];

    const span = effectiveEnd - effectiveStart;
    if (span <= 10) return "";

    for (let i = 0; i <= sampleSteps; i++) {
      const u = i / sampleSteps;
      const x = effectiveStart + u * span;

      // Counter-phase undulation weaving dynamically over & under Ribbon 1
      const w1 = Math.sin(u * 3.4 * Math.PI + frame * 0.065 + 1.2) * 105;
      const w2 = Math.cos(u * 6.2 * Math.PI - frame * 0.05 - 0.8) * 45;

      const yMid = 1080 + w1 + w2;
      const envelope = Math.pow(Math.sin(u * Math.PI), 0.85);
      const halfThickness = 80 * envelope;

      topPts.push([x, yMid - halfThickness]);
      botPts.push([x, yMid + halfThickness]);
    }

    let pathD = `M ${topPts[0][0].toFixed(1)} ${topPts[0][1].toFixed(1)}`;
    for (let i = 1; i < topPts.length; i++) {
      pathD += ` L ${topPts[i][0].toFixed(1)} ${topPts[i][1].toFixed(1)}`;
    }
    for (let i = botPts.length - 1; i >= 0; i--) {
      pathD += ` L ${botPts[i][0].toFixed(1)} ${botPts[i][1].toFixed(1)}`;
    }
    pathD += " Z";

    return pathD;
  }, [effectiveStart, effectiveEnd, frame, sampleSteps]);

  // Ribbon 3: Tertiary Atmospheric Ether Veil Ribbon (Deep Royal Cyber Cyan)
  const tertiaryRibbon = useMemo(() => {
    const topPts: [number, number][] = [];
    const botPts: [number, number][] = [];

    const span = effectiveEnd - effectiveStart;
    if (span <= 10) return "";

    for (let i = 0; i <= sampleSteps; i++) {
      const u = i / sampleSteps;
      const x = effectiveStart + u * span;

      // High-frequency fluttering wake ribbon
      const w1 = Math.sin(u * 4.6 * Math.PI - frame * 0.08) * 65;
      const w2 = Math.cos(u * 8.2 * Math.PI + frame * 0.06) * 30;

      const yMid = 1080 + w1 + w2;
      const envelope = Math.pow(Math.sin(u * Math.PI), 0.9);
      const halfThickness = 48 * envelope;

      topPts.push([x, yMid - halfThickness]);
      botPts.push([x, yMid + halfThickness]);
    }

    let pathD = `M ${topPts[0][0].toFixed(1)} ${topPts[0][1].toFixed(1)}`;
    for (let i = 1; i < topPts.length; i++) {
      pathD += ` L ${topPts[i][0].toFixed(1)} ${topPts[i][1].toFixed(1)}`;
    }
    for (let i = botPts.length - 1; i >= 0; i--) {
      pathD += ` L ${botPts[i][0].toFixed(1)} ${botPts[i][1].toFixed(1)}`;
    }
    pathD += " Z";

    return pathD;
  }, [effectiveStart, effectiveEnd, frame, sampleSteps]);

  // 6. Striated Kinetic Internal Speed Fibers (Reference Video Anime Speed Striations)
  const fiberCount = 14;
  const fibers = useMemo(() => {
    if (primaryRibbon.midPts.length === 0) return [];

    const list = [];
    const span = effectiveEnd - effectiveStart;

    for (let k = 0; k < fiberCount; k++) {
      // Normal offset from -0.8 to +0.8 inside the ribbon body
      const v = (k / (fiberCount - 1)) * 1.6 - 0.8;
      let d = "";

      for (let i = 0; i < primaryRibbon.midPts.length; i++) {
        const u = i / (primaryRibbon.midPts.length - 1);
        const [x, yMid] = primaryRibbon.midPts[i];
        const envelope = Math.pow(Math.sin(u * Math.PI), 0.78);
        const yFib = yMid + v * (145 * envelope);

        if (i === 0) {
          d += `M ${x.toFixed(1)} ${yFib.toFixed(1)}`;
        } else {
          d += ` L ${x.toFixed(1)} ${yFib.toFixed(1)}`;
        }
      }

      const isCore = Math.abs(v) < 0.25;
      const strokeW = isCore ? 4.5 : 2.2;
      const strokeCol = isCore ? "#FFFFFF" : k % 2 === 0 ? "#00F5FF" : "#00F5D4";
      const dashLen = 140 + k * 28;
      const gapLen = 80 + (k % 4) * 35;
      const speed = 28 + (k % 3) * 14;
      const offset = -(frame * speed + k * 90);
      const opacity = isCore ? 0.95 : 0.65 + 0.25 * Math.sin(frame * 0.1 + k);

      list.push({ id: `fiber-${k}`, d, strokeW, strokeCol, dashLen, gapLen, offset, opacity });
    }
    return list;
  }, [primaryRibbon.midPts, effectiveStart, effectiveEnd, frame]);

  // Leading wave crest coordinates for lens flares and particle emitters
  const crestX = effectiveEnd;
  const crestMidY = primaryRibbon.midPts.length > 0
    ? primaryRibbon.midPts[primaryRibbon.midPts.length - 1][1]
    : 1080;

  // Leading crest pulse & specular shockwave scale
  const crestPulse = Math.sin(frame * 0.15) * 0.15 + 1.0;
  const shockwaveExpansion = (frame * 12) % 180;
  const shockwaveOpacity = interpolate(shockwaveExpansion, [0, 180], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // 100% Pure Solid Black Base (Strictly zero gradient)
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
        <defs>
          {/* Dual-Tier Multi-Pass Specular Optical Bloom */}
          <filter id="iceBloomCore" x="-40%" y="-40%" width="180%" height="180%">
            {/* Pass 1: Specular tight core (stdDeviation 3.5px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="tightCore" />
            {/* Pass 1.5: Mid harmonic body (stdDeviation 12px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="midBloom" />
            {/* Pass 2: Atmospheric volumetric falloff (stdDeviation 28px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="atmosphericBloom" />
            <feMerge>
              <feMergeNode in="atmosphericBloom" />
              <feMergeNode in="midBloom" />
              <feMergeNode in="tightCore" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Secondary Soft Atmospheric Veil Glow */}
          <filter id="iceGlowSoft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur6" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur22" />
            <feMerge>
              <feMergeNode in="blur22" />
              <feMergeNode in="blur6" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Linear Gradients for Flowing Fluid Waves */}
          <linearGradient id="primaryWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#001824" stopOpacity="0" />
            <stop offset="12%" stopColor="#005F73" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#00B4D8" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#00F5D4" stopOpacity="0.95" />
            <stop offset="88%" stopColor="#00F5FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="secondaryWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#023047" stopOpacity="0" />
            <stop offset="25%" stopColor="#0077B6" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#00F5D4" stopOpacity="0.85" />
            <stop offset="90%" stopColor="#2DD4BF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="tertiaryWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#03045E" stopOpacity="0" />
            <stop offset="40%" stopColor="#0077B6" stopOpacity="0.45" />
            <stop offset="80%" stopColor="#00B4D8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#90E0EF" stopOpacity="0.9" />
          </linearGradient>

          {/* Radial Specular Core Flash */}
          <radialGradient id="crestFlashGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="28%" stopColor="#E0FFFF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#00F5FF" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#00B4D8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Master Motion Group with Living Harmonic Idle Breathing */}
        <g
          transform={`translate(0, ${idle.idleY}) rotate(${idle.idleRotate}, ${width / 2}, ${height / 2})`}
        >
          {/* Layer 1: Tertiary Atmospheric Ether Veil Ribbon */}
          {tertiaryRibbon && (
            <path
              d={tertiaryRibbon}
              fill="url(#tertiaryWaveGrad)"
              filter="url(#iceGlowSoft)"
              opacity={0.65}
            />
          )}

          {/* Layer 2: Secondary Harmonic Counter-Flow Ribbon */}
          {secondaryRibbon && (
            <path
              d={secondaryRibbon}
              fill="url(#secondaryWaveGrad)"
              filter="url(#iceBloomCore)"
              opacity={0.82}
            />
          )}

          {/* Layer 3: Primary Commanding Hero Wave Ribbon */}
          {primaryRibbon.pathD && (
            <path
              d={primaryRibbon.pathD}
              fill="url(#primaryWaveGrad)"
              filter="url(#iceBloomCore)"
              opacity={0.96}
            />
          )}

          {/* Layer 4: Striated Kinetic Internal Speed Fibers */}
          <g filter="url(#iceBloomCore)">
            {fibers.map((fib) => (
              <path
                key={fib.id}
                d={fib.d}
                stroke={fib.strokeCol}
                strokeWidth={fib.strokeW}
                strokeDasharray={`${fib.dashLen} ${fib.gapLen}`}
                strokeDashoffset={fib.offset}
                strokeLinecap="round"
                fill="none"
                opacity={fib.opacity}
              />
            ))}
          </g>

          {/* Layer 5: Swarm of 180+ Micro Frost Crystals & Embers */}
          <g filter="url(#iceBloomCore)">
            {particles.map((p) => {
              // Triggered burst dynamics
              const burstProgress = spring({
                frame: Math.max(0, frame - p.triggerFrame),
                fps,
                config: SPRING_PRESETS.snappy,
              });

              // Active visibility window
              const arrivalDiff = frame - p.triggerFrame;
              if (arrivalDiff < -4) return null;

              // Trailing velocity drag: explosive impulse followed by deceleration
              const dist = burstProgress * p.burstDist;
              const dragX = Math.max(0, arrivalDiff * 2.2); // downstream airflow drag

              // Base wave coordinate at particle U
              const baseX = effectiveStart + p.u * (effectiveEnd - effectiveStart);
              const baseY = 1080 + p.offsetY;

              const px = baseX + Math.cos(p.burstAngle) * dist - dragX;
              const py = baseY + Math.sin(p.burstAngle) * dist;

              // Harmonic micro-flutter
              const flutterX = Math.sin(frame * p.twinkleSpeed + p.phase) * 6;
              const flutterY = Math.cos(frame * p.twinkleSpeed * 0.8 + p.phase) * 5;

              // Shimmering twinkle opacity
              const twinkle =
                0.4 + 0.6 * Math.sin(frame * p.twinkleSpeed * 1.5 + p.phase);
              const lifeFade = interpolate(
                arrivalDiff,
                [0, 10, 180, 240],
                [0.2, 1.0, 0.9, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const pOpacity = twinkle * lifeFade;

              if (p.type === "diamond") {
                // 4-point Diamond Frost Crystal Star
                const r = p.size * (0.8 + 0.3 * burstProgress);
                return (
                  <polygon
                    key={`crystal-${p.id}`}
                    points={`
                      ${px + flutterX},${py + flutterY - r}
                      ${px + flutterX + r * 0.35},${py + flutterY}
                      ${px + flutterX},${py + flutterY + r}
                      ${px + flutterX - r * 0.35},${py + flutterY}
                    `}
                    fill={p.color}
                    opacity={pOpacity}
                  />
                );
              } else if (p.type === "streak") {
                // Directional High-Speed Needle Spark
                const len = p.size * (1.0 + 0.5 * (1 - burstProgress));
                return (
                  <line
                    key={`streak-${p.id}`}
                    x1={px + flutterX}
                    y1={py + flutterY}
                    x2={px + flutterX - len}
                    y2={py + flutterY - len * 0.15}
                    stroke={p.color}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    opacity={pOpacity}
                  />
                );
              } else {
                // Soft Radiant Bokeh Frost Orb
                return (
                  <circle
                    key={`bokeh-${p.id}`}
                    cx={px + flutterX}
                    cy={py + flutterY}
                    r={p.size * 0.5}
                    fill={p.color}
                    opacity={pOpacity * 0.85}
                  />
                );
              }
            })}
          </g>

          {/* Layer 6: Leading Wave Crest Specular Starburst & Shockwave Rings */}
          {waveHeadX > 400 && waveHeadX <= 3600 && (
            <g
              transform={`translate(${crestX}, ${crestMidY}) scale(${crestDeform.scaleX * crestPulse}, ${crestDeform.scaleY * crestPulse})`}
              filter="url(#iceBloomCore)"
            >
              {/* Expanding Concentric Shockwave Ripple */}
              <ellipse
                cx={0}
                cy={0}
                rx={shockwaveExpansion}
                ry={shockwaveExpansion * 0.55}
                stroke="#00F5FF"
                strokeWidth={3}
                fill="none"
                opacity={shockwaveOpacity}
              />

              {/* Blinding White Core Orb */}
              <circle
                cx={0}
                cy={0}
                r={65}
                fill="url(#crestFlashGrad)"
                opacity={0.95}
              />

              {/* 4-point Specular Flare Star */}
              <polygon
                points="0,-160 16,-20 180,0 16,20 0,160 -16,20 -180,0 -16,-20"
                fill="#FFFFFF"
                opacity={0.98}
              />

              {/* Diagonal Cross Rays */}
              <polygon
                points="0,-85 10,-12 95,0 10,12 0,85 -10,12 -95,0 -10,-12"
                transform="rotate(45)"
                fill="#E0FFFF"
                opacity={0.8}
              />

              {/* Forward Needle Energy Bursts */}
              {Array.from({ length: 8 }).map((_, s) => {
                const angle = ((s - 3.5) / 4) * 0.45;
                const len = 70 + (s % 3) * 35;
                const sx = Math.cos(angle) * len;
                const sy = Math.sin(angle) * len;
                return (
                  <line
                    key={`burst-needle-${s}`}
                    x1={0}
                    y1={0}
                    x2={sx}
                    y2={sy}
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    opacity={0.88}
                  />
                );
              })}
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
