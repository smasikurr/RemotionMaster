import React from "react";

/**
 * AE VFX Engine for Remotion Master
 * Implements high-end After Effects optical, volumetric, and motion graphic systems
 * in pure React / SVG / Canvas (Zero AI, 100% Code-Driven).
 */

// ============================================================================
// 1. DUAL-PASS & MULTI-TIER OPTICAL BLOOM SVG FILTER DEFS
// ============================================================================
export interface OpticalBloomProps {
  id?: string;
  tightStdDev?: number;
  midStdDev?: number;
  wideStdDev?: number;
}

export const OpticalBloomDefs: React.FC<OpticalBloomProps> = ({
  id = "aeOpticalBloom",
  tightStdDev = 3.5,
  midStdDev = 14.0,
  wideStdDev = 32.0,
}) => {
  return (
    <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
      {/* Pass 1: Razor tight specular core */}
      <feGaussianBlur in="SourceGraphic" stdDeviation={tightStdDev} result="tightGlow" />
      {/* Pass 2: Mid atmospheric glow */}
      <feGaussianBlur in="SourceGraphic" stdDeviation={midStdDev} result="midGlow" />
      {/* Pass 3: Wide volumetric bloom */}
      <feGaussianBlur in="SourceGraphic" stdDeviation={wideStdDev} result="wideGlow" />
      <feMerge>
        <feMergeNode in="wideGlow" />
        <feMergeNode in="midGlow" />
        <feMergeNode in="tightGlow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
};

// ============================================================================
// 2. VOLUMETRIC GOD-RAY CONES & SUNBURST BEAMS (AFTER EFFECTS SHINE STYLE)
// ============================================================================
export interface VolumetricGodRaysProps {
  cx: number;
  cy: number;
  rayCount?: number;
  innerRadius?: number;
  outerRadius?: number;
  innerSpreadDeg?: number;
  outerSpreadDeg?: number;
  rotation?: number; // degrees
  colorStart?: string;
  colorMid?: string;
  colorEnd?: string;
  blurStdDev?: number;
  pulsation?: number;
  filterId?: string;
}

export const VolumetricGodRays: React.FC<VolumetricGodRaysProps> = ({
  cx,
  cy,
  rayCount = 20,
  innerRadius = 60,
  outerRadius = 1800,
  innerSpreadDeg = 3.0,
  outerSpreadDeg = 16.0,
  rotation = 0,
  colorStart = "#FFFFFF",
  colorMid = "#F59E0B",
  colorEnd = "rgba(0, 0, 0, 0)",
  blurStdDev = 22,
  pulsation = 1.0,
  filterId = "volumetricGodRayBlur",
}) => {
  const rotRad = (rotation * Math.PI) / 180;

  // Build the volumetric cone polygon path
  const rays = React.useMemo(() => {
    const list: Array<{ path: string; id: number; opacity: number }> = [];
    const step = (Math.PI * 2) / rayCount;

    for (let i = 0; i < rayCount; i++) {
      const baseAngle = i * step + rotRad;
      const rInner = innerRadius;
      const rOuter = outerRadius * pulsation;

      const halfInner = (innerSpreadDeg * Math.PI) / 360;
      const halfOuter = (outerSpreadDeg * Math.PI) / 360;

      const a1 = baseAngle - halfInner;
      const a2 = baseAngle + halfInner;
      const a3 = baseAngle + halfOuter;
      const a4 = baseAngle - halfOuter;

      const x1 = cx + Math.cos(a1) * rInner;
      const y1 = cy + Math.sin(a1) * rInner;

      const x2 = cx + Math.cos(a2) * rInner;
      const y2 = cy + Math.sin(a2) * rInner;

      const x3 = cx + Math.cos(a3) * rOuter;
      const y3 = cy + Math.sin(a3) * rOuter;

      const x4 = cx + Math.cos(a4) * rOuter;
      const y4 = cy + Math.sin(a4) * rOuter;

      // Soft trapezoidal volumetric cone
      const path = `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} L ${x4.toFixed(1)} ${y4.toFixed(1)} Z`;
      
      // Multi-frequency organic brightness variations
      const op = 0.55 + 0.45 * Math.sin(i * 1.618 + 0.5);
      list.push({ path, id: i, opacity: op });
    }
    return list;
  }, [cx, cy, rayCount, innerRadius, outerRadius, innerSpreadDeg, outerSpreadDeg, rotRad, pulsation]);

  return (
    <g>
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurStdDev} />
        </filter>
        <radialGradient id={`${filterId}_grad`} cx={cx} cy={cy} r={outerRadius * 0.78 * pulsation} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colorStart} stopOpacity="1" />
          <stop offset="15%" stopColor={colorMid} stopOpacity="0.85" />
          <stop offset="42%" stopColor={colorMid} stopOpacity="0.38" />
          <stop offset="72%" stopColor={colorMid} stopOpacity="0.10" />
          <stop offset="95%" stopColor={colorEnd} stopOpacity="0" />
          <stop offset="100%" stopColor={colorEnd} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter={`url(#${filterId})`}>
        {rays.map((ray) => (
          <path
            key={`godray-${ray.id}`}
            d={ray.path}
            fill={`url(#${filterId}_grad)`}
            opacity={ray.opacity}
          />
        ))}
      </g>
    </g>
  );
};

// ============================================================================
// 3. ANAMORPHIC LENS FLARE STREAK (OPTICAL FLARES STYLE)
// ============================================================================
export interface AnamorphicStreakProps {
  cx: number;
  cy: number;
  width: number;
  height: number;
  angle?: number;
  colorCore?: string;
  colorAura?: string;
  opacity?: number;
}

export const AnamorphicStreak: React.FC<AnamorphicStreakProps> = ({
  cx,
  cy,
  width = 2800,
  height = 14,
  angle = 0,
  colorCore = "#FFFFFF",
  colorAura = "#F59E0B",
  opacity = 0.95,
}) => {
  const gradId = `streakGrad_${cx}_${cy}`;
  return (
    <g transform={`rotate(${angle}, ${cx}, ${cy})`} opacity={opacity}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colorAura} stopOpacity="0" />
          <stop offset="20%" stopColor={colorAura} stopOpacity="0.18" />
          <stop offset="45%" stopColor={colorCore} stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="55%" stopColor={colorCore} stopOpacity="0.9" />
          <stop offset="80%" stopColor={colorAura} stopOpacity="0.18" />
          <stop offset="100%" stopColor={colorAura} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Atmospheric Diffuse Streak */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={width * 0.5}
        ry={height * 2.8}
        fill={`url(#${gradId})`}
        opacity={0.65}
      />
      {/* Specular Razor Core */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={width * 0.42}
        ry={height * 0.55}
        fill={`url(#${gradId})`}
        opacity={0.98}
      />
    </g>
  );
};

// ============================================================================
// 4. SOLAR FUSION CORE & CORONA
// ============================================================================
export interface SolarFusionCoreProps {
  cx: number;
  cy: number;
  coreRadius?: number;
  coronaRadius?: number;
  haloRadius?: number;
  coreColor?: string;
  coronaColor?: string;
  haloColor?: string;
}

export const SolarFusionCore: React.FC<SolarFusionCoreProps> = ({
  cx,
  cy,
  coreRadius = 45,
  coronaRadius = 150,
  haloRadius = 450,
  coreColor = "#FFFFFF",
  coronaColor = "#F59E0B",
  haloColor = "#92400E",
}) => {
  const gradId = `solarGrad_${cx}_${cy}`;
  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx={cx} cy={cy} r={haloRadius} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={coreColor} stopOpacity="1" />
          <stop offset={`${(coreRadius / haloRadius * 100).toFixed(1)}%`} stopColor={coreColor} stopOpacity="0.98" />
          <stop offset={`${(coronaRadius / haloRadius * 100).toFixed(1)}%`} stopColor={coronaColor} stopOpacity="0.75" />
          <stop offset="65%" stopColor={haloColor} stopOpacity="0.20" />
          <stop offset="90%" stopColor={haloColor} stopOpacity="0.04" />
          <stop offset="100%" stopColor={haloColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={haloRadius} fill={`url(#${gradId})`} />
      <circle cx={cx} cy={cy} r={coreRadius} fill={coreColor} />
    </g>
  );
};
