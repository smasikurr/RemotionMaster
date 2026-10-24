import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// Deterministic pseudo-random generator
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export const Cinematic16mmVintageFilmFrame4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig(); // 3840 x 2160, 60 fps

  // Authentic vintage film projector runs at ~15-18 FPS
  // We quantize changes every 3-4 frames (giving 15-20 FPS vintage projector cadence)
  const filmStep = Math.floor(frame / 3);
  const subFrame = (frame % 3) / 3;

  // 1. Projector Gate Weave (subtle physical film jitter)
  const gateWeaveX = (hash(filmStep * 13.7) - 0.5) * 6;
  const gateWeaveY = (hash(filmStep * 29.3) - 0.5) * 5;

  // 2. Projector Shutter Exposure Breathing & Micro-Flicker
  const exposureFlicker = 1.0 + (hash(filmStep * 41.1) - 0.5) * 0.06;

  // 3. 6-Phase Musical / Stock Keyframe Dynamic Arc (600 frames = 10s)
  // Phase 1 (0-60): Projector warm-up roll
  // Phase 2 (60-180): Steady projection build
  // Phase 3 (180-300): Climax warm amber light burn & scratch flutter
  // Phase 4 (300-420): Clean vintage run
  // Phase 5 (420-540): Secondary warm edge flare
  // Phase 6 (540-600): Smooth resolve
  const burnIntensity = useMemo(() => {
    if (frame < 60) return interpolate(frame, [0, 60], [0.3, 0.7]);
    if (frame < 180) return 0.7 + Math.sin(frame * 0.05) * 0.15;
    if (frame < 300) return 0.85 + Math.sin(frame * 0.08) * 0.25; // Climax swell
    if (frame < 420) return 0.65 + Math.sin(frame * 0.04) * 0.15;
    if (frame < 540) return 0.8 + Math.sin(frame * 0.06) * 0.2;
    return interpolate(frame, [540, 600], [0.8, 0.5]);
  }, [frame]);

  // 4. Exact 16mm Film Aperture Geometry (Derived from 1:1 analysis of idea video)
  // In 3840x2160 canvas:
  // Left border ~ 230px, Right border ~ 226px, Top ~ 78px, Bottom ~ 88px
  const apX = 228 + gateWeaveX;
  const apY = 82 + gateWeaveY;
  const apW = 3384;
  const apH = 1996;
  const apRadius = 130;

  // 5. Film Scratches (Deterministic per filmStep)
  const scratches = useMemo(() => {
    const list: Array<{ x: number; y1: number; y2: number; opacity: number; width: number; color: string }> = [];
    // Number of scratches active
    const count = Math.floor(hash(filmStep * 7.9) * 4) + 1; // 1 to 4
    for (let i = 0; i < count; i++) {
      const seed = filmStep * 100 + i * 37;
      const x = apX + 100 + hash(seed * 3.1) * (apW - 200);
      const y1 = apY + hash(seed * 5.7) * (apH * 0.4);
      const len = 300 + hash(seed * 11.3) * (apH * 0.65);
      const opacity = 0.25 + hash(seed * 17.9) * 0.55;
      const w = 1.0 + hash(seed * 19.1) * 1.8;
      // Scratches can be dark (hair/emulsion scratch) or bright (light leak scratch)
      const isBright = hash(seed * 23.3) > 0.6;
      list.push({
        x,
        y1,
        y2: Math.min(y1 + len, apY + apH - 20),
        opacity,
        width: w,
        color: isBright ? 'rgba(255, 250, 240, 0.7)' : 'rgba(35, 25, 18, 0.65)',
      });
    }
    return list;
  }, [filmStep, apX, apY, apW, apH]);

  // 6. Dust Specks & Emulsion Flecks (Deterministic per filmStep)
  const dustSpecks = useMemo(() => {
    const list: Array<{ cx: number; cy: number; r: number; opacity: number; isDark: boolean }> = [];
    const count = 35 + Math.floor(hash(filmStep * 9.1) * 30);
    for (let i = 0; i < count; i++) {
      const seed = filmStep * 200 + i * 43;
      const cx = apX + 50 + hash(seed * 2.3) * (apW - 100);
      const cy = apY + 40 + hash(seed * 6.7) * (apH - 80);
      const r = 1.2 + hash(seed * 13.1) * 3.2;
      const opacity = 0.3 + hash(seed * 17.3) * 0.6;
      const isDark = hash(seed * 31.7) > 0.35;
      list.push({ cx, cy, r, opacity, isDark });
    }
    return list;
  }, [filmStep, apX, apY, apW, apH]);

  // 7. Organic Film Hair / Thread (appears intermittently every 12-16 film frames)
  const activeHair = useMemo(() => {
    const hairCycle = Math.floor(filmStep / 14);
    const inCycle = filmStep % 14;
    // Hair stays for 2-3 film frames then gets sucked out of the projector gate
    if (inCycle > 2) return null;

    const seed = hairCycle * 577;
    const startX = apX + 200 + hash(seed * 1.7) * (apW - 400);
    const startY = apY + 100 + hash(seed * 3.9) * (apH - 200);
    const length = 120 + hash(seed * 7.1) * 160;
    const angle = hash(seed * 11.3) * Math.PI * 2;

    const cp1x = startX + Math.cos(angle) * (length * 0.4) + (hash(seed * 13.1) - 0.5) * 60;
    const cp1y = startY + Math.sin(angle) * (length * 0.4) + (hash(seed * 17.3) - 0.5) * 60;
    const cp2x = startX + Math.cos(angle) * (length * 0.8) + (hash(seed * 19.7) - 0.5) * 80;
    const cp2y = startY + Math.sin(angle) * (length * 0.8) + (hash(seed * 23.9) - 0.5) * 80;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    return {
      d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
      opacity: 0.65 + hash(seed * 29.1) * 0.25,
      strokeWidth: 2.2,
    };
  }, [filmStep, apX, apY, apW, apH]);

  // 8. Authentic Color Tones (Extracted 1:1 from idea video)
  // Center: [253, 243, 232] (#FDF3E8)
  // Margin inner: [220, 211, 200] (#DCD3C8)
  // Outer frame border: [12, 10, 8] (#0C0A08)
  const baseCenterColor = `rgba(253, 243, 232, ${Math.min(1.0, 0.98 * exposureFlicker)})`;
  const baseMarginColor = `rgba(218, 208, 196, ${Math.min(1.0, 0.95 * exposureFlicker)})`;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070605', overflow: 'hidden' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Radial vintage film vignette inside aperture */}
          <radialGradient
            id="apertureGlow"
            cx="50%"
            cy="50%"
            r="65%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor={baseCenterColor} />
            <stop offset="70%" stopColor={baseMarginColor} />
            <stop offset="96%" stopColor="#c5b8a5" />
            <stop offset="100%" stopColor="#8d7e6c" />
          </radialGradient>

          {/* Warm Golden Film Burn / Edge Light Leak */}
          <radialGradient
            id="filmBurnLeft"
            cx="0%"
            cy="35%"
            r="50%"
          >
            <stop offset="0%" stopColor={`rgba(255, 175, 80, ${0.45 * burnIntensity})`} />
            <stop offset="50%" stopColor={`rgba(255, 130, 40, ${0.2 * burnIntensity})`} />
            <stop offset="100%" stopColor="rgba(255, 120, 30, 0)" />
          </radialGradient>

          <radialGradient
            id="filmBurnRight"
            cx="100%"
            cy="65%"
            r="45%"
          >
            <stop offset="0%" stopColor={`rgba(255, 190, 100, ${0.4 * burnIntensity})`} />
            <stop offset="60%" stopColor={`rgba(255, 140, 50, ${0.15 * burnIntensity})`} />
            <stop offset="100%" stopColor="rgba(255, 140, 50, 0)" />
          </radialGradient>

          {/* Soft Gate Border Shadow / Depth Bevel */}
          <filter id="gateShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path for the 16mm rounded film aperture */}
          <clipPath id="filmApertureClip">
            <rect
              x={apX}
              y={apY}
              width={apW}
              height={apH}
              rx={apRadius}
              ry={apRadius}
            />
          </clipPath>
        </defs>

        {/* 1. OUTER FILM STOCK BORDER (Pure dark film stock with subtle edge texture) */}
        <rect width={width} height={height} fill="#080706" />

        {/* 2. THE 16MM FILM APERTURE WINDOW */}
        <g clipPath="url(#filmApertureClip)">
          {/* Base Illuminated Film Paper / Projector Light */}
          <rect
            x={apX}
            y={apY}
            width={apW}
            height={apH}
            fill="url(#apertureGlow)"
          />

          {/* Dynamic Light Leaks & Burns */}
          <rect
            x={apX}
            y={apY}
            width={apW}
            height={apH}
            fill="url(#filmBurnLeft)"
            style={{ mixBlendMode: 'screen' }}
          />
          <rect
            x={apX}
            y={apY}
            width={apW}
            height={apH}
            fill="url(#filmBurnRight)"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Film Dust Specks */}
          {dustSpecks.map((d, idx) => (
            <circle
              key={`dust-${idx}`}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.isDark ? '#1a140e' : '#fffdfa'}
              opacity={d.opacity}
            />
          ))}

          {/* Vertical Film Scratches */}
          {scratches.map((s, idx) => (
            <line
              key={`scratch-${idx}`}
              x1={s.x}
              y1={s.y1}
              x2={s.x}
              y2={s.y2}
              stroke={s.color}
              strokeWidth={s.width}
              opacity={s.opacity}
              strokeLinecap="round"
            />
          ))}

          {/* Organic Curly Film Hair */}
          {activeHair && (
            <path
              d={activeHair.d}
              fill="none"
              stroke="#1b120c"
              strokeWidth={activeHair.strokeWidth}
              strokeLinecap="round"
              opacity={activeHair.opacity}
            />
          )}

          {/* Micro Projector Gate Bevel along aperture edge */}
          <rect
            x={apX}
            y={apY}
            width={apW}
            height={apH}
            rx={apRadius}
            ry={apRadius}
            fill="none"
            stroke="rgba(30, 20, 10, 0.45)"
            strokeWidth={12}
          />
        </g>

        {/* 3. PHYSICAL FILM GATE APERTURE BEVEL OVERLAY (gives realistic 3D projector gate edge) */}
        <rect
          x={apX}
          y={apY}
          width={apW}
          height={apH}
          rx={apRadius}
          ry={apRadius}
          fill="none"
          stroke="#060504"
          strokeWidth={14}
        />
        <rect
          x={apX}
          y={apY}
          width={apW}
          height={apH}
          rx={apRadius}
          ry={apRadius}
          fill="none"
          stroke="rgba(0,0,0,0.7)"
          strokeWidth={6}
        />
      </svg>
    </AbsoluteFill>
  );
};
