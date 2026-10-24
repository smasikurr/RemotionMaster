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
 * Deterministic PRNG for reproducible, flicker-free physics
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface WillowTendril {
  id: number;
  theta: number; // Angle of ejection [0, 2*PI]
  vMag: number; // Radial velocity magnitude
  drag: number; // Air resistance factor
  gravity: number; // Downward gravity acceleration
  trailLength: number; // Number of trail segments (28 to 40)
  colorHead: string;
  colorBody: string;
  colorTail: string;
  twinkleFreq: number;
  phase: number;
  vxScale: number;
  vyScale: number;
  maxLifeDt: number;
}

export const GoldenWillowFireworksExplosion4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cx = width * 0.5; // 1920
  const cyApex = 720; // Apex altitude of detonation

  // 1. Dual-frequency harmonic idle breathing (organic air convection)
  const idle = harmonicIdleMotion(frame, {
    speed: 0.035,
    amplitudeY: 6,
    tiltDegrees: 0.35,
  });

  // 2. Timeline Phases:
  // Phase 1: Rocket Launch Ascent (Frames 10 to 148)
  // Phase 2: Detonation Flash & Shockwave (Frames 146 to 175)
  // Phase 3: Cascading Weeping Willow Spark Waterfall (Frames 148 to 440)
  // Phase 4: Gentle Fade to Black (Frames 440 to 480)

  // Rocket Ascent Progress
  const launchProgress = interpolate(
    frame,
    [10, 146],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.12, 0.75, 0.25, 1),
    }
  );
  const rocketY = interpolate(launchProgress, [0, 1], [2220, cyApex]);
  const rocketActive = frame >= 8 && frame <= 147;

  // Detonation Flash Scale and Opacity (Frames 146 to 175)
  const flashProgress = interpolate(frame, [146, 149, 175], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shockwaveRadius = interpolate(frame, [146, 180], [12, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shockwaveOpacity = interpolate(frame, [146, 154, 180], [0.95, 0.65, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Residual Center Apex Glow (Keeps the core rich and luminous after detonation)
  const apexResidualGlow = interpolate(
    frame,
    [148, 170, 280, 380],
    [0.9, 0.65, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 3. Generate 300 Multi-Tiered Volumetric Weeping Willow (Kamuro) Tendrils
  const tendrils = useMemo<WillowTendril[]>(() => {
    const list: WillowTendril[] = [];
    const count = 300;

    for (let i = 0; i < count; i++) {
      const r1 = seededRandom(i * 13 + 3);
      const r2 = seededRandom(i * 19 + 7);
      const r3 = seededRandom(i * 29 + 11);
      const r4 = seededRandom(i * 37 + 17);

      // Radial angle with subtle organic jitter
      const theta = (i / count) * Math.PI * 2 + (r1 - 0.5) * 0.12;

      // 3-Tier Volumetric Shell Distribution:
      // - 30% Inner Core Shell: vMag = 5.0 to 10.0 px/f (fills center column)
      // - 40% Mid Shell: vMag = 10.5 to 18.0 px/f (mid volumetric curtain)
      // - 30% Outer Canopy Shell: vMag = 19.5 to 25.0 px/f (reaches ~76% width)
      const tierSelector = i % 10;
      let vMag: number;
      if (tierSelector < 3) {
        // Inner core
        vMag = 5.0 + r2 * 5.0;
      } else if (tierSelector < 7) {
        // Mid body
        vMag = 10.5 + r2 * 7.5;
      } else {
        // Outer canopy
        vMag = 19.5 + r2 * 5.5;
      }

      // Air resistance and gravity parameters
      const drag = 0.0088 + r3 * 0.002;
      const gravity = 0.20 + r1 * 0.035;

      // Long streaming weeping trails (28 to 38 trail nodes per tendril)
      const trailLength = 28 + Math.floor(r4 * 11);

      // Champagne silver-gold & warm amber color grading
      const colorHead = r1 > 0.35 ? "#FFFFFF" : "#FFFBEB";
      const colorBody = r2 > 0.5 ? "#FEF08A" : "#FBBF24";
      const colorTail = r3 > 0.5 ? "#F59E0B" : "#D97706";

      const twinkleFreq = 0.14 + r3 * 0.18;
      const phase = r4 * Math.PI * 2;

      // Upper hemisphere scaling: crest under top margin (Y > 360)
      const isUpper = Math.sin(theta) < 0;
      let vyScale = isUpper ? 0.27 : 1.0;
      let vxScale = 1.0;

      // Diagonal damping towards upper corners to keep them 100% pure black
      if (isUpper && Math.abs(Math.cos(theta)) > 0.5) {
        vxScale = 0.90;
        vyScale *= 0.85;
      }

      // Max lifespan per tendril
      const maxLifeDt = 190 + Math.floor(r1 * 75);

      list.push({
        id: i,
        theta,
        vMag,
        drag,
        gravity,
        trailLength,
        colorHead,
        colorBody,
        colorTail,
        twinkleFreq,
        phase,
        vxScale,
        vyScale,
        maxLifeDt,
      });
    }
    return list;
  }, []);

  // 4. Calculate Willow Streamer Coordinates for Current Frame
  const tBurst = Math.max(0, frame - 148);
  const willowActive = frame >= 148 && frame <= 480;

  // Master Willow Fade (smooth descent into pure black at the end)
  const willowMasterOpacity = interpolate(
    frame,
    [148, 155, 420, 480],
    [0.6, 1.0, 0.95, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // 100% Pure Solid Black (Strictly zero gradient)
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
          {/* Dual-Pass Multi-Tier Specular Optical Bloom */}
          <filter id="willowOpticalGlow" x="-30%" y="-30%" width="160%" height="160%">
            {/* Pass 1: Specular tight core (stdDeviation 3.2px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="tightCore" />
            {/* Pass 2: Atmospheric diffuse bloom (stdDeviation 24px) */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="diffuseBloom" />
            <feMerge>
              <feMergeNode in="diffuseBloom" />
              <feMergeNode in="tightCore" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Golden Rocket Spark Plume Gradient */}
          <linearGradient id="rocketPlumeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>

          {/* Detonation Flash Core Radial Gradient */}
          <radialGradient id="detonationFlashGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="20%" stopColor="#FFFBEB" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Residual Apex Core Glow Gradient */}
          <radialGradient id="residualApexGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#FBBF24" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Master Motion Group with Living Organic Convection Hover */}
        <g
          transform={`translate(0, ${idle.idleY}) rotate(${idle.idleRotate}, ${cx}, ${cyApex})`}
        >
          {/* Layer 1: Rocket Launch Ascent Plume (Frames 8 to 147) */}
          {rocketActive && (
            <g filter="url(#willowOpticalGlow)">
              {/* Rocket White-Hot Head Bullet */}
              <circle cx={cx} cy={rocketY} r={6.5} fill="#FFFFFF" />

              {/* Trailing Crackling Thrust Tail (Spanning 140px downwards) */}
              <line
                x1={cx}
                y1={rocketY}
                x2={cx}
                y2={rocketY + 130}
                stroke="url(#rocketPlumeGrad)"
                strokeWidth={5.5}
                strokeLinecap="round"
              />

              {/* Crackling Micro-Sparks Ejected from Engine */}
              {Array.from({ length: 16 }).map((_, sIdx) => {
                const sT = ((frame * 0.12 + sIdx * 0.22) % 1.0);
                const sY = rocketY + sT * 150;
                const sX = cx + (Math.sin(sIdx * 3.7 + frame * 0.25) * 14 * sT);
                const sOp = (1 - sT) * 0.9;
                return (
                  <circle
                    key={`r-spark-${sIdx}`}
                    cx={sX}
                    cy={sY}
                    r={2.5 * (1 - sT * 0.5)}
                    fill={sIdx % 2 === 0 ? "#FFFFFF" : "#FEF08A"}
                    opacity={sOp}
                  />
                );
              })}
            </g>
          )}

          {/* Layer 2: Detonation Flash & Expanding Shockwave Ring (Frames 146 to 180) */}
          {flashProgress > 0.01 && (
            <g filter="url(#willowOpticalGlow)">
              {/* Expanding Shockwave Ring */}
              <circle
                cx={cx}
                cy={cyApex}
                r={shockwaveRadius}
                fill="none"
                stroke="#FEF08A"
                strokeWidth={4.5}
                opacity={shockwaveOpacity}
              />

              {/* Blinding Radial Flash Core */}
              <circle
                cx={cx}
                cy={cyApex}
                r={240 * flashProgress}
                fill="url(#detonationFlashGrad)"
                opacity={flashProgress}
              />

              {/* 4-point Specular Flare Star */}
              <polygon
                points={`
                  ${cx},${cyApex - 180 * flashProgress}
                  ${cx + 15},${cyApex - 15}
                  ${cx + 180 * flashProgress},${cyApex}
                  ${cx + 15},${cyApex + 15}
                  ${cx},${cyApex + 180 * flashProgress}
                  ${cx - 15},${cyApex + 15}
                  ${cx - 180 * flashProgress},${cyApex}
                  ${cx - 15},${cyApex - 15}
                `}
                fill="#FFFFFF"
                opacity={flashProgress * 0.98}
              />
            </g>
          )}

          {/* Layer 3: Residual Detonation Apex Glow & Lingering Micro-Embers (Frames 148 to 380) */}
          {apexResidualGlow > 0.01 && (
            <g filter="url(#willowOpticalGlow)" opacity={apexResidualGlow}>
              {/* Soft Golden Volumetric Mist Cloud at Detonation Center */}
              <circle
                cx={cx}
                cy={cyApex + (frame - 148) * 0.25}
                r={90 + (frame - 148) * 0.35}
                fill="url(#residualApexGrad)"
              />

              {/* Lingering Slow-Drifting Core Embers */}
              {Array.from({ length: 24 }).map((_, eIdx) => {
                const eSeed = eIdx * 17.3 + 5.1;
                const eR1 = seededRandom(eSeed);
                const eR2 = seededRandom(eSeed * 1.7);
                const eR3 = seededRandom(eSeed * 2.3);

                const emberDt = frame - 148;
                const eAngle = eR1 * Math.PI * 2;
                const eSpeed = 0.6 + eR2 * 1.2;
                const ex = cx + Math.cos(eAngle) * (eSpeed * emberDt * 0.45);
                const ey = cyApex + Math.sin(eAngle) * (eSpeed * emberDt * 0.25) + 0.04 * Math.pow(emberDt, 1.4);
                const eTwinkle = 0.5 + 0.5 * Math.sin(frame * (0.15 + eR3 * 0.2) + eSeed);
                const eRadius = 1.4 + eR2 * 1.6;

                return (
                  <circle
                    key={`apex-ember-${eIdx}`}
                    cx={ex}
                    cy={ey}
                    r={eRadius}
                    fill={eIdx % 3 === 0 ? "#FFFFFF" : eIdx % 3 === 1 ? "#FEF08A" : "#F59E0B"}
                    opacity={eTwinkle * apexResidualGlow}
                  />
                );
              })}
            </g>
          )}

          {/* Layer 4: Full Volumetric Cascading Weeping Willow Spark Waterfall (Frames 148 to 480) */}
          {willowActive && (
            <g filter="url(#willowOpticalGlow)" opacity={willowMasterOpacity}>
              {tendrils.map((tendril) => {
                const dt = tBurst;
                if (dt <= 0) return null;

                // Tendril-specific lifetime fade
                let tendrilOpacity = 1.0;
                if (dt > tendril.maxLifeDt - 40) {
                  tendrilOpacity = Math.max(0, (tendril.maxLifeDt - dt) / 40);
                }
                if (tendrilOpacity <= 0.01) return null;

                // Radial initial velocity
                const vx0 = Math.cos(tendril.theta) * tendril.vMag * tendril.vxScale;
                const vy0 = Math.sin(tendril.theta) * tendril.vMag * tendril.vyScale;

                // Air drag factor: (1 - e^(-drag * dt)) / drag
                const dragFactor = (1 - Math.exp(-tendril.drag * dt)) / tendril.drag;

                // Head coordinates
                const pxHead = cx + vx0 * dragFactor;
                const pyHead = cyApex + vy0 * dragFactor + 0.5 * tendril.gravity * Math.pow(dt, 1.45);

                // Margin protection: if particle descends near bottom lateral edge, fade out
                let edgeFade = 1.0;
                if ((pxHead <= 620 || pxHead >= 3220) && pyHead > 1650) {
                  edgeFade = Math.max(0, 1.0 - (pyHead - 1650) / 100.0);
                }
                const effectiveTendrilOpacity = tendrilOpacity * edgeFade;
                if (effectiveTendrilOpacity <= 0.01) return null;

                // Generate Long Weeping Historical Trail (28 to 38 nodes)
                const trailPoints: [number, number, number][] = [];
                for (let seg = 0; seg < tendril.trailLength; seg++) {
                  // Step back in time by 2.2 frames per node
                  const trailDt = Math.max(0, dt - seg * 2.2);
                  const trailDragFactor = (1 - Math.exp(-tendril.drag * trailDt)) / tendril.drag;
                  const tx = cx + vx0 * trailDragFactor;
                  const ty = cyApex + vy0 * trailDragFactor + 0.5 * tendril.gravity * Math.pow(trailDt, 1.45);
                  const segProgress = seg / tendril.trailLength; // 0 (head) to 1 (tail)
                  const nodeOp = Math.pow(1 - segProgress, 1.35); // Smooth organic decay
                  trailPoints.push([tx, ty, nodeOp]);
                }

                // Shimmering micro-twinkle along the tendril
                const twinkle =
                  0.55 + 0.45 * Math.sin(frame * tendril.twinkleFreq + tendril.phase);

                return (
                  <g
                    key={`tendril-${tendril.id}`}
                    opacity={effectiveTendrilOpacity}
                  >
                    {/* Continuous Trailing Golden Halo Streak */}
                    {trailPoints.length > 1 && (
                      <polyline
                        points={trailPoints.map((pt) => `${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(" ")}
                        fill="none"
                        stroke={tendril.colorTail}
                        strokeWidth={4.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={twinkle * 0.38}
                      />
                    )}

                    {/* Bright Core Weeping Filament */}
                    {trailPoints.length > 1 && (
                      <polyline
                        points={trailPoints.map((pt) => `${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(" ")}
                        fill="none"
                        stroke={tendril.colorBody}
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={twinkle * 0.9}
                      />
                    )}

                    {/* White-Hot Leading Spark Pellet */}
                    <circle
                      cx={pxHead}
                      cy={pyHead}
                      r={3.2}
                      fill={tendril.colorHead}
                      opacity={twinkle * 0.98}
                    />

                    {/* Shimmering Spark Beads Along the Trail */}
                    {trailPoints.filter((_, idx) => idx % 3 === 1 && idx < 16).map((tPt, sIdx) => {
                      const beadSeed = tendril.id * 7 + sIdx * 13;
                      const beadTwinkle =
                        0.4 + 0.6 * Math.sin(frame * 0.3 + beadSeed);
                      return (
                        <circle
                          key={`bead-${tendril.id}-${sIdx}`}
                          cx={tPt[0] + Math.sin(sIdx * 2.1 + frame * 0.2) * 1.5}
                          cy={tPt[1]}
                          r={1.8 * tPt[2]}
                          fill={sIdx % 2 === 0 ? "#FFFFFF" : "#FEF08A"}
                          opacity={tPt[2] * beadTwinkle * 0.9}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
