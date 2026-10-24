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
 * Deterministic pseudo-random number generator
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface ColumnConfig {
  id: number;
  cx: number;
  targetHeight: number;
  finalPercent: number;
  delayFrame: number;
  label: string;
}

export const GreenScreen3DFinancialBarChartGrowth4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 1. Living Breathing Idle Micro-Motion (Disney/Buck principle: never lifeless)
  const idle = harmonicIdleMotion(frame, {
    speed: 0.038,
    amplitudeY: 9,
    tiltDegrees: 0.7,
  });

  // 2. Foundation Platform Entrance Spring
  const platformSpring = spring({
    frame: frame - 6,
    fps,
    config: SPRING_PRESETS.snappy,
  });
  const platformScaleX = interpolate(platformSpring, [0, 1], [0.1, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. 5 Dimensional Column Configurations
  const baseY = 1710;
  const colWidth = 230;
  const colDepth = 72;

  const columns: ColumnConfig[] = useMemo(
    () => [
      { id: 0, cx: 860, targetHeight: 360, finalPercent: 24, delayFrame: 16, label: "Q1" },
      { id: 1, cx: 1390, targetHeight: 580, finalPercent: 48, delayFrame: 22, label: "Q2" },
      { id: 2, cx: 1920, targetHeight: 820, finalPercent: 72, delayFrame: 28, label: "Q3" },
      { id: 3, cx: 2450, targetHeight: 1080, finalPercent: 95, delayFrame: 34, label: "Q4" },
      { id: 4, cx: 2980, targetHeight: 1360, finalPercent: 120, delayFrame: 40, label: "FY" },
    ],
    []
  );

  // 4. Calculate Column Dynamics with Anticipation Spring & Volume Preservation
  const colStates = columns.map((col) => {
    // Anticipation spring: pulls back down slightly before explosive rise
    const progress = anticipationSpring(frame, fps, {
      delay: col.delayFrame,
      anticipationFrames: 7,
      anticipationDepth: 0.05,
      springConfig: { damping: 14, stiffness: 95, mass: 1.1 },
    });

    const prevProgress = anticipationSpring(Math.max(0, frame - 1), fps, {
      delay: col.delayFrame,
      anticipationFrames: 7,
      anticipationDepth: 0.05,
      springConfig: { damping: 14, stiffness: 95, mass: 1.1 },
    });

    const currentHeight = Math.max(8, progress * col.targetHeight);
    const deform = squashAndStretch(progress, prevProgress, 0.45);

    // Percentage counter spring (starts 8 frames after column launch)
    const countProgress = spring({
      frame: Math.max(0, frame - (col.delayFrame + 8)),
      fps,
      config: SPRING_PRESETS.smooth,
    });
    const currentPercent = Math.round(countProgress * col.finalPercent);

    // Badge entrance
    const badgeSpring = spring({
      frame: Math.max(0, frame - (col.delayFrame + 14)),
      fps,
      config: SPRING_PRESETS.bouncy,
    });

    return {
      ...col,
      currentHeight,
      deform,
      currentPercent,
      badgeScale: badgeSpring,
      topY: baseY - currentHeight,
    };
  });

  // 5. Growth Trend Line & Arrow Path Coordinates
  // Connects column tops with an authentic dynamic rally zigzag
  const p0 = [colStates[0].cx, colStates[0].topY - 32];
  const p1 = [colStates[1].cx, colStates[1].topY - 32];
  // Dynamic market rally inflection between Col 1 and Col 2
  const pInflect = [colStates[1].cx + 265, colStates[1].topY + 28];
  const p2 = [colStates[2].cx, colStates[2].topY - 32];
  const p3 = [colStates[3].cx, colStates[3].topY - 32];
  const p4 = [colStates[4].cx, colStates[4].topY - 32];
  const pArrowTip = [colStates[4].cx + 205, colStates[4].topY + 5];

  const trendPathD = `M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} L ${pInflect[0]} ${pInflect[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} L ${p4[0]} ${p4[1]} L ${pArrowTip[0]} ${pArrowTip[1]}`;

  // Trend line draw animation
  const trendDrawSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 18, stiffness: 75, mass: 1.0 },
  });
  const totalTrendLength = 2600;
  const strokeOffset = interpolate(trendDrawSpring, [0, 1], [totalTrendLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 6. Arrow Head Entrance and Specular Pulse
  const arrowAngle = Math.atan2(pArrowTip[1] - p4[1], pArrowTip[0] - p4[0]) * (180 / Math.PI);
  const arrowScale = spring({
    frame: frame - 68,
    fps,
    config: SPRING_PRESETS.elastic,
  });
  const arrowPulse = 1.0 + 0.08 * Math.sin(frame * 0.12);

  // 7. Ambient Golden Growth Sparks / Rising Micro-Coins (48 particles)
  const growthParticles = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const r1 = seededRandom(i * 19 + 3);
      const r2 = seededRandom(i * 23 + 7);
      const r3 = seededRandom(i * 31 + 13);

      const colIndex = i % 5;
      const baseX = columns[colIndex].cx + (r1 - 0.5) * 220;
      const startY = baseY - (r2 * 0.6) * columns[colIndex].targetHeight;
      const riseDist = 120 + r3 * 180;
      const size = 5 + r1 * 8;
      const speed = 0.04 + r2 * 0.05;
      const phase = r3 * Math.PI * 2;

      return { id: i, baseX, startY, riseDist, size, speed, phase, colIndex };
    });
  }, [columns]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#00f800", // 100% Pure Chroma Green (Zero gradient, perfect keying)
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
          {/* Subtle 3D Bevel Shadow Filter */}
          <filter id="column3DShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="8" dy="18" stdDeviation="12" floodColor="rgba(0, 45, 0, 0.45)" />
          </filter>

          {/* Glowing Arrow Filter */}
          <filter id="arrowNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="core" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="bloom" />
            <feMerge>
              <feMergeNode in="bloom" />
              <feMergeNode in="core" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients for 3D Isometric Columns */}
          {/* Top Cap Specular Gradient */}
          <linearGradient id="topCapGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF3B0" />
            <stop offset="70%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FFD13B" />
          </linearGradient>

          {/* Front Face Warm Gold Gradient */}
          <linearGradient id="frontFaceGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFAA00" />
            <stop offset="30%" stopColor="#FFC300" />
            <stop offset="70%" stopColor="#FFD60A" />
            <stop offset="100%" stopColor="#FF9E00" />
          </linearGradient>

          {/* Extruded Side Face Shaded Amber Gradient */}
          <linearGradient id="sideFaceAmber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E85D04" />
            <stop offset="50%" stopColor="#D00000" />
            <stop offset="100%" stopColor="#9D0208" />
          </linearGradient>

          {/* Cobalt Blue Trend Arrow Gradient */}
          <linearGradient id="trendArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="40%" stopColor="#1D4ED8" />
            <stop offset="75%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Platform Extrusion Gradient */}
          <linearGradient id="platformGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Master Motion Group with Living Breathing Idle Hover */}
        <g
          transform={`translate(0, ${idle.idleY}) rotate(${idle.idleRotate}, 1920, 1100)`}
        >
          {/* Layer 1: Ground Baseline Platform (Extruded 3D Foundation) */}
          <g
            transform={`translate(1920, ${baseY + 18}) scale(${platformScaleX}, 1)`}
            filter="url(#column3DShadow)"
          >
            {/* Platform Top Face */}
            <polygon
              points="-1360,-14 1360,-14 1330,14 -1330,14"
              fill="#334155"
              stroke="#64748B"
              strokeWidth={2}
            />
            {/* Platform Front Bevel */}
            <polygon
              points="-1330,14 1330,14 1330,36 -1330,36"
              fill="url(#platformGrad)"
              stroke="#1E293B"
              strokeWidth={2}
            />
            {/* Vibrant Baseline Accent Line */}
            <line
              x1="-1320"
              y1="14"
              x2="1320"
              y2="14"
              stroke="#38BDF8"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>

          {/* Layer 2: 5 Dimensional 3D Isometric Columns */}
          {colStates.map((col) => {
            const hw = (colWidth * 0.5) * col.deform.scaleX;
            const hd = colDepth * 0.5;
            const topY = baseY - col.currentHeight * col.deform.scaleY;
            const cx = col.cx;

            // Number of horizontal coin ridges based on height
            const coinRidgeCount = Math.floor(col.currentHeight / 32);

            return (
              <g key={`col-3d-${col.id}`} filter="url(#column3DShadow)">
                {/* 1. Front Isometric Face */}
                <polygon
                  points={`
                    ${cx - hw},${topY}
                    ${cx},${topY + hd}
                    ${cx},${baseY + hd}
                    ${cx - hw},${baseY}
                  `}
                  fill="url(#frontFaceGold)"
                  stroke="#FFD000"
                  strokeWidth={1.5}
                />

                {/* 2. Extruded 3D Right Side Face */}
                <polygon
                  points={`
                    ${cx},${topY + hd}
                    ${cx + hw},${topY}
                    ${cx + hw},${baseY}
                    ${cx},${baseY + hd}
                  `}
                  fill="url(#sideFaceAmber)"
                  stroke="#C1440E"
                  strokeWidth={1.5}
                />

                {/* 3. Horizontal Coin Rim Grooves (Reference Stacked Coin Identity) */}
                {Array.from({ length: coinRidgeCount }).map((_, rIdx) => {
                  const ry = baseY - (rIdx + 1) * 32 * col.deform.scaleY;
                  if (ry <= topY + hd) return null;
                  return (
                    <g key={`ridge-${col.id}-${rIdx}`}>
                      {/* Front face ridge */}
                      <line
                        x1={cx - hw}
                        y1={ry}
                        x2={cx}
                        y2={ry + hd}
                        stroke="rgba(255, 255, 255, 0.45)"
                        strokeWidth={1.8}
                      />
                      {/* Side face ridge */}
                      <line
                        x1={cx}
                        y1={ry + hd}
                        x2={cx + hw}
                        y2={ry}
                        stroke="rgba(0, 0, 0, 0.35)"
                        strokeWidth={1.8}
                      />
                    </g>
                  );
                })}

                {/* 4. Top Isometric Specular Face (Diamond / Rhombus Cap) */}
                <polygon
                  points={`
                    ${cx},${topY - hd}
                    ${cx + hw},${topY}
                    ${cx},${topY + hd}
                    ${cx - hw},${topY}
                  `}
                  fill="url(#topCapGold)"
                  stroke="#FFFFFF"
                  strokeWidth={2.5}
                />

                {/* Coin Dollar Symbol / Star on Top Cap */}
                <circle
                  cx={cx}
                  cy={topY}
                  r={16}
                  fill="#FFD700"
                  stroke="#E85D04"
                  strokeWidth={2}
                />
                <text
                  x={cx}
                  y={topY + 6}
                  textAnchor="middle"
                  fill="#78350F"
                  fontSize={18}
                  fontWeight="900"
                  fontFamily="system-ui, sans-serif"
                >
                  $
                </text>

                {/* Quarter Label at the Base */}
                <text
                  x={cx}
                  y={baseY + 75}
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize={26}
                  fontWeight="800"
                  fontFamily="system-ui, sans-serif"
                  style={{ letterSpacing: 2 }}
                >
                  {col.label}
                </text>
              </g>
            );
          })}

          {/* Layer 3: Ascending Cobalt Blue Growth Trend Line */}
          <path
            d={trendPathD}
            fill="none"
            stroke="#1E3A8A"
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalTrendLength}
            strokeDashoffset={strokeOffset}
            opacity={0.4}
            transform="translate(0, 10)"
          />
          <path
            d={trendPathD}
            fill="none"
            stroke="url(#trendArrowGrad)"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalTrendLength}
            strokeDashoffset={strokeOffset}
            filter="url(#arrowNeonGlow)"
          />
          {/* Inner Specular Core Line */}
          <path
            d={trendPathD}
            fill="none"
            stroke="#E0F2FE"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalTrendLength}
            strokeDashoffset={strokeOffset}
          />

          {/* Dynamic Trend Data Markers (Pulsing Circles on Each Column Peak) */}
          {colStates.map((col, idx) => {
            const my = col.topY - 32;
            const showMarker = frame > col.delayFrame + 18;
            if (!showMarker) return null;
            return (
              <g key={`marker-${idx}`} transform={`translate(${col.cx}, ${my})`}>
                <circle r={14} fill="#2563EB" stroke="#FFFFFF" strokeWidth={3} />
                <circle r={6} fill="#FFFFFF" />
              </g>
            );
          })}

          {/* Layer 4: Glowing Arrow Head at the Apex */}
          {frame > 68 && (
            <g
              transform={`translate(${pArrowTip[0]}, ${pArrowTip[1]}) rotate(${arrowAngle}) scale(${arrowScale * arrowPulse})`}
              filter="url(#arrowNeonGlow)"
            >
              {/* Outer Glow Arrow */}
              <polygon
                points="0,0 -48,-28 -34,0 -48,28"
                fill="#2563EB"
                stroke="#38BDF8"
                strokeWidth={3}
              />
              {/* Inner Specular Arrow Core */}
              <polygon
                points="-4,0 -40,-16 -28,0 -40,16"
                fill="#FFFFFF"
              />
              {/* Pulsing Target Ring */}
              <circle
                r={22}
                fill="none"
                stroke="#38BDF8"
                strokeWidth={2.5}
                strokeDasharray="4 6"
              />
            </g>
          )}

          {/* Layer 5: Floating Percentage Growth Badges */}
          {colStates.map((col) => {
            if (col.badgeScale <= 0.05) return null;
            const badgeY = col.topY - 110;
            const cx = col.cx;

            return (
              <g
                key={`badge-${col.id}`}
                transform={`translate(${cx}, ${badgeY}) scale(${col.badgeScale})`}
                filter="url(#column3DShadow)"
              >
                {/* Modern Dark Pill Background */}
                <rect
                  x={-85}
                  y={-28}
                  width={170}
                  height={56}
                  rx={16}
                  fill="#0F172A"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                />

                {/* Accent Top Lip */}
                <line
                  x1={-70}
                  y1={-26}
                  x2={70}
                  y2={-26}
                  stroke="#38BDF8"
                  strokeWidth={2}
                  strokeLinecap="round"
                />

                {/* Percentage Text with Green Growth Triangle */}
                <text
                  x={-48}
                  y={8}
                  fill="#22C55E"
                  fontSize={20}
                  fontWeight="900"
                  fontFamily="system-ui, sans-serif"
                >
                  ▲
                </text>
                <text
                  x={12}
                  y={9}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={25}
                  fontWeight="800"
                  fontFamily="system-ui, sans-serif"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  +{col.currentPercent}%
                </text>
              </g>
            );
          })}

          {/* Layer 6: Ambient Rising Golden Growth Sparks / Micro-Coin Flakes */}
          {growthParticles.map((p) => {
            const col = colStates[p.colIndex];
            if (frame < col.delayFrame + 12) return null;

            const t = (frame * p.speed + p.phase) % 1.0;
            const py = p.startY - t * p.riseDist;
            const px = p.baseX + Math.sin(frame * 0.08 + p.id) * 14;
            const fade = Math.sin(t * Math.PI);
            const op = fade * 0.85;

            return (
              <g key={`g-spark-${p.id}`} transform={`translate(${px}, ${py})`}>
                <polygon
                  points={`0,${-p.size} ${p.size * 0.4},0 0,${p.size} ${-p.size * 0.4},0`}
                  fill="#FFD700"
                  opacity={op}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
