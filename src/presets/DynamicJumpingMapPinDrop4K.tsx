import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const DynamicJumpingMapPinDrop4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 580, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cycle time for periodic bouncing (every 150 frames = 2.5s bounce cycle)
  const cycleLength = 150;
  const cycleFrame = frame % cycleLength;
  const cycleIndex = Math.floor(frame / cycleLength);

  // Drop and Bounce spring physics
  const dropSpring = spring({
    frame: cycleFrame,
    fps,
    config: { damping: 9, stiffness: 140, mass: 0.9 },
  });

  // Vertical position: drop from -600px above down to ground plane
  const groundY = height / 2 + 180;
  const startY = groundY - 500;
  const pinY = interpolate(dropSpring, [0, 1], [startY, groundY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Squash and stretch upon landing
  // At apex/fall: stretched (scaleX 0.9, scaleY 1.15). On landing bounce: squashed (scaleX 1.25, scaleY 0.8)
  const bouncePhase = cycleFrame / 40;
  const squashFactor =
    cycleFrame < 25
      ? interpolate(cycleFrame, [0, 8, 16, 25], [1.1, 0.78, 1.15, 1.0])
      : 1.0 + Math.sin(frame * 0.08) * 0.02;
  const stretchFactor =
    cycleFrame < 25
      ? interpolate(cycleFrame, [0, 8, 16, 25], [0.9, 1.28, 0.88, 1.0])
      : 1.0 - Math.sin(frame * 0.08) * 0.02;

  // Expanding ground ripple rings (triggered after impact)
  const rippleRings = [0, 15, 30, 45].map((delay) => {
    const rProgress = interpolate(
      cycleFrame - delay,
      [0, 65],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const radius = rProgress * 360;
    const opacity = interpolate(rProgress, [0, 0.2, 0.8, 1], [0, 0.85, 0.3, 0]);
    return { radius, opacity };
  });

  // Rotating ground radar reticle
  const reticleAngle = (frame * 1.2) % 360;

  // Beacon pulse rings from pin head
  const beaconRings = [0, 25, 50].map((delay) => {
    const bProgress = ((frame + delay) % 75) / 75;
    const radius = bProgress * 120 + 30;
    const opacity = interpolate(bProgress, [0, 0.3, 0.8, 1], [0, 0.8, 0.2, 0]);
    return { radius, opacity };
  });

  // Particle dust hovering in 3D space
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 35; i++) {
      const seedX = Math.sin(i * 19.33 + 77.11) * 43758.5453;
      const seedY = Math.sin(i * 41.17 + 13.91) * 23421.631;
      const posX = ((seedX - Math.floor(seedX)) * 2000) + (width - 2000) / 2;
      const posY = ((seedY - Math.floor(seedY)) * 1200) + (height - 1200) / 2;
      const size = 2 + (i % 4) * 1.5;
      const speed = 0.4 + (i % 3) * 0.3;
      pts.push({ posX, posY, size, speed, id: i });
    }
    return pts;
  }, [width, height]);

  const centerX = width / 2;

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
          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Isometric Grid Lines */}
        <g stroke="rgba(0, 229, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={`g-h-${i}`}
              x1="0"
              y1={i * 120}
              x2={width}
              y2={i * 120}
              strokeDasharray="4 20"
            />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line
              key={`g-v-${i}`}
              x1={i * 120}
              y1="0"
              x2={i * 120}
              y2={height}
              strokeDasharray="4 20"
            />
          ))}
        </g>

        {/* Subtle Ambient Dust Particles */}
        <g fill="#00E5FF">
          {particles.map((p) => {
            const currentY = (p.posY - frame * p.speed * 2) % height;
            const op = Math.sin((frame + p.id * 10) * 0.05) * 0.35 + 0.35;
            return (
              <circle
                key={`p-${p.id}`}
                cx={p.posX}
                cy={currentY < 0 ? currentY + height : currentY}
                r={p.size}
                opacity={op}
              />
            );
          })}
        </g>

        {/* GROUND RETICLE & RIPPLE WAVES (Center at centerX, groundY) */}
        <g transform={`translate(${centerX}, ${groundY})`}>
          {/* Ground Contact Shadow (Expands when pin is near ground) */}
          <ellipse
            cx="0"
            cy="0"
            rx={interpolate(pinY, [startY, groundY], [20, 110])}
            ry={interpolate(pinY, [startY, groundY], [8, 42])}
            fill="rgba(0, 229, 255, 0.25)"
            filter="url(#pinGlow)"
          />

          {/* Dynamic Expanding Ground Ripple Rings */}
          {rippleRings.map((ring, idx) => (
            <ellipse
              key={`rip-${idx}`}
              cx="0"
              cy="0"
              rx={ring.radius * 1.5}
              ry={ring.radius * 0.55}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2.5"
              opacity={ring.opacity}
            />
          ))}

          {/* Rotating Ground Reticle */}
          <g transform={`rotate(${reticleAngle})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="180"
              ry="70"
              fill="none"
              stroke="rgba(0, 229, 255, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="10 8"
            />
            {/* 4 Cardinal Tick Marks */}
            <line x1="-200" y1="0" x2="-160" y2="0" stroke="#00E5FF" strokeWidth="2.5" />
            <line x1="160" y1="0" x2="200" y2="0" stroke="#00E5FF" strokeWidth="2.5" />
            <line x1="0" y1="-80" x2="0" y2="-60" stroke="#00E5FF" strokeWidth="2.5" />
            <line x1="0" y1="60" x2="0" y2="80" stroke="#00E5FF" strokeWidth="2.5" />
          </g>
        </g>

        {/* DYNAMIC JUMPING MAP PIN */}
        <g transform={`translate(${centerX}, ${pinY})`}>
          {/* Beacon Pulses around Pin Head */}
          <g transform="translate(0, -220)">
            {beaconRings.map((b, idx) => (
              <circle
                key={`b-ring-${idx}`}
                cx="0"
                cy="0"
                r={b.radius}
                fill="none"
                stroke="#FF2A6D"
                strokeWidth="2.5"
                opacity={b.opacity}
              />
            ))}
          </g>

          {/* Animated Pin Mesh with Squash & Stretch */}
          <g transform={`scale(${squashFactor}, ${stretchFactor})`}>
            {/* Glowing Drop-Pin Body (3D Sleek Gradient Styling in Pure Vector) */}
            <path
              d="M0,0 C-35,-80 -90,-150 -90,-220 C-90,-280 -45,-320 0,-320 C45,-320 90,-280 90,-220 C90,-150 35,-80 0,0 Z"
              fill="#FF0055"
              stroke="#FFFFFF"
              strokeWidth="5"
              filter="url(#pinGlow)"
            />
            {/* Inner Pin Head Core */}
            <circle
              cx="0"
              cy="-220"
              r="40"
              fill="#FFFFFF"
              stroke="#050505"
              strokeWidth="6"
            />
            {/* Core Center Pulse Dot */}
            <circle
              cx="0"
              cy="-220"
              r="16"
              fill="#00E5FF"
              filter="url(#pinGlow)"
            />
          </g>
        </g>

        {/* TELEMETRY HUD OVERLAYS */}
        {/* Top-Left GPS Telemetry Box */}
        <g transform="translate(180, 180)">
          <rect
            x="0"
            y="0"
            width="440"
            height="140"
            rx="12"
            fill="rgba(0, 20, 35, 0.7)"
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="2"
          />
          <text x="24" y="38" fill="#00E5FF" fontSize="20" fontWeight="700" letterSpacing="3">
            GPS TELEMETRY LOCK
          </text>
          <text x="24" y="74" fill="#FFFFFF" fontSize="22" fontWeight="700" letterSpacing="1.5">
            LAT: 37°46'29.7"N
          </text>
          <text x="24" y="104" fill="#FFFFFF" fontSize="22" fontWeight="700" letterSpacing="1.5">
            LONG: 122°25'09.9"W
          </text>
          <text x="24" y="126" fill="#00E676" fontSize="16" fontWeight="600" letterSpacing="2">
            WAYPOINT ACCURACY: ±0.01m
          </text>
        </g>

        {/* Top-Right Target Status Box */}
        <g transform="translate(3200, 180)">
          <rect
            x="0"
            y="0"
            width="440"
            height="140"
            rx="12"
            fill="rgba(20, 0, 15, 0.7)"
            stroke="rgba(255, 0, 85, 0.4)"
            strokeWidth="2"
          />
          <text x="24" y="38" fill="#FF0055" fontSize="20" fontWeight="700" letterSpacing="3">
            TARGET BEACON STATUS
          </text>
          <text x="24" y="78" fill="#FFFFFF" fontSize="26" fontWeight="800" letterSpacing="2">
            ACTIVE TRACKING
          </text>
          <text x="24" y="112" fill="rgba(255, 255, 255, 0.7)" fontSize="16" fontWeight="600" letterSpacing="2">
            BOUNCE DAMPING: 9.0 N·s/m
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
