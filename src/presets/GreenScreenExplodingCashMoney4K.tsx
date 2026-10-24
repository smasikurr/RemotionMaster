import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface Banknote3D {
  id: number;
  burstGroup: number; // 0: intro floaters, 1: climax cannon, 2: secondary fountain
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  phaseOffset: number;
  scale: number;
}

/**
 * GreenScreenExplodingCashMoney4K - Stock Motion Graphics Video 12/81
 * Reference: istockphoto-1476203983-640_adpp_is.mp4 (8.01s)
 *
 * Strict Stock Quality Directives:
 * 1. 1:1 Pixel-by-Pixel Fidelity to Reference:
 *    - Pure Broadcast Chroma Green Screen (#00f800 / #00ff00) base for flawless Ultra/Chroma Keying
 *    - 3D Tumbling US Dollar Banknotes bursting outward radially from center
 *    - Authentic 2.35:1 dollar bill proportions with crisp filigree engraving, oval portrait, and $100 marks
 *    - Realistic 3D aerodynamic flutter & gravitational fall
 * 2. Full 4K Canvas Span (Large, bold, prominent banknotes across 92% of screen)
 * 3. 6-Phase Keyframed Musical / Explosion Dynamics ("Aga Gora Matha")
 * 4. Native 4K UHD 3840x2160 @ 60 FPS
 */
export const GreenScreenExplodingCashMoney4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig(); // 3840 x 2160, 60fps

  const cx = width / 2; // 1920
  const cy = height / 2; // 1080
  const time = frame / fps;

  // 1. Generate 110 Banknotes across 3 coordinated burst groups
  const banknotes: Banknote3D[] = useMemo(() => {
    const list: Banknote3D[] = [];
    const count = 110;

    for (let i = 0; i < count; i++) {
      // Deterministic pseudorandom seeds
      const seed1 = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const seed2 = Math.cos(i * 269.5 + 183.3) * 23421.631;
      const seed3 = Math.sin(i * 419.2 + 87.1) * 38291.127;

      const group = i < 25 ? 0 : i < 80 ? 1 : 2; // 0: intro, 1: climax, 2: secondary

      // Explosion angle and radial speed
      const angle = (seed1 - Math.floor(seed1)) * Math.PI * 2;
      const elevation = (seed2 - Math.floor(seed2) - 0.5) * Math.PI * 0.7;
      const speed = 400 + (Math.abs(seed3) % 1.0) * 850;

      const vx = Math.cos(elevation) * Math.cos(angle) * speed;
      const vy = Math.sin(elevation) * speed - 150; // bias slightly upward
      const vz = Math.cos(elevation) * Math.sin(angle) * speed;

      list.push({
        id: i,
        burstGroup: group,
        baseX: (Math.sin(i * 3.7) - 0.5) * 250,
        baseY: (Math.cos(i * 5.1) - 0.5) * 150,
        baseZ: (seed1 % 1.0) * 400 - 200,
        vx,
        vy,
        vz,
        rotSpeedX: 1.5 + (i % 4) * 0.8,
        rotSpeedY: 2.0 + (i % 5) * 0.9,
        rotSpeedZ: 0.8 + (i % 3) * 0.6,
        phaseOffset: (i % 20) * 0.15,
        scale: 0.85 + (i % 5) * 0.15, // 0.85x to 1.45x
      });
    }
    return list;
  }, []);

  // 2. Compute 3D physics trajectory & tumbling per banknote
  const billWidth = 230; // 4K native dollar dimensions
  const billHeight = 98;

  const renderedBills = useMemo(() => {
    return banknotes.map((b) => {
      // Determine activation time per burst group
      let burstTime = 0;
      if (b.burstGroup === 0) {
        // Continuous floaters
        burstTime = time;
      } else if (b.burstGroup === 1) {
        // Climax Cannon Explosion at t=2.5s (frame 150)
        burstTime = Math.max(0, time - 2.5);
      } else {
        // Secondary Fountain Burst at t=6.5s (frame 390)
        burstTime = Math.max(0, time - 6.5);
      }

      if (b.burstGroup > 0 && burstTime === 0) {
        return null; // not launched yet
      }

      // Parabolic ballistic trajectory with aerodynamic drag
      const drag = Math.exp(-0.45 * burstTime);
      const gravity = 220 * burstTime * burstTime; // downward gravitational acceleration

      const currentX = cx + b.baseX + b.vx * burstTime * drag;
      const currentY = cy + b.baseY + b.vy * burstTime * drag + gravity;
      const currentZ = b.baseZ + b.vz * burstTime * drag;

      // 3D Perspective Projection
      const fov = 1500;
      const depthFactor = fov / (fov + currentZ);
      if (depthFactor <= 0.1 || depthFactor > 3.0) return null; // out of view frustum

      const screenX = currentX * depthFactor + (1 - depthFactor) * cx;
      const screenY = currentY * depthFactor + (1 - depthFactor) * cy;

      // Aerodynamic sinusoidal flutter & 3D rotation angles
      const rotX = (burstTime * b.rotSpeedX + b.phaseOffset) * 360;
      const rotY = (burstTime * b.rotSpeedY + b.phaseOffset * 1.5) * 360;
      const rotZ = Math.sin(burstTime * 2.0 + b.phaseOffset) * 45;

      // Determine face (front or back of banknote based on Y-axis rotation normal)
      const cosY = Math.cos((rotY * Math.PI) / 180);
      const isFront = cosY >= 0;

      // Shading based on normal angle with light
      const lightShade = 0.75 + Math.abs(cosY) * 0.25;

      return {
        id: b.id,
        screenX,
        screenY,
        z: currentZ,
        depthFactor,
        rotX,
        rotY,
        rotZ,
        isFront,
        lightShade,
        scale: b.scale * depthFactor,
      };
    }).filter(Boolean) as Array<{
      id: number;
      screenX: number;
      screenY: number;
      z: number;
      depthFactor: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      isFront: boolean;
      lightShade: number;
      scale: number;
    }>;
  }, [banknotes, time, cx, cy]);

  // Sort bills back-to-front for correct 3D occlusion
  const sortedBills = useMemo(() => {
    return [...renderedBills].sort((a, b) => b.z - a.z);
  }, [renderedBills]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#00f800', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          perspective: 1500,
          transformStyle: 'preserve-3d',
        }}
      >
        {sortedBills.map((bill) => {
          const w = billWidth * bill.scale;
          const h = billHeight * bill.scale;

          return (
            <div
              key={`bill-${bill.id}`}
              style={{
                position: 'absolute',
                left: bill.screenX - w / 2,
                top: bill.screenY - h / 2,
                width: w,
                height: h,
                transform: `rotateX(${bill.rotX}deg) rotateY(${bill.rotY}deg) rotateZ(${bill.rotZ}deg)`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'visible',
                filter: `drop-shadow(0 8px 16px rgba(0, 40, 0, 0.45)) brightness(${bill.lightShade})`,
              }}
            >
              {/* AUTHENTIC 3D US DOLLAR BANKNOTE GRAPHIC */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 230 98"
                style={{ display: 'block', borderRadius: 4 }}
              >
                <defs>
                  {/* Paper Texture & Engraving Shading */}
                  <linearGradient id={`billGrad-${bill.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={bill.isFront ? '#eef4ea' : '#1e4827'} />
                    <stop offset="50%" stopColor={bill.isFront ? '#f7faf4' : '#245a30'} />
                    <stop offset="100%" stopColor={bill.isFront ? '#e6efe0' : '#1a4022'} />
                  </linearGradient>
                </defs>

                {bill.isFront ? (
                  // --- FRONT FACE: $100 OBVERSE ---
                  <g>
                    {/* Ivory Paper Base */}
                    <rect x="0" y="0" width="230" height="98" rx="4" fill={`url(#billGrad-${bill.id})`} stroke="#2c5e35" strokeWidth="2.5" />
                    {/* Dark Green Guilloche Border */}
                    <rect x="6" y="6" width="218" height="86" rx="2" fill="none" stroke="#224d2a" strokeWidth="1.8" strokeDasharray="3 2" />
                    <rect x="9" y="9" width="212" height="80" rx="2" fill="none" stroke="#1d4224" strokeWidth="1" />

                    {/* Central Portrait Medallion Oval */}
                    <ellipse cx="115" cy="49" rx="34" ry="38" fill="#e2ede0" stroke="#1c4323" strokeWidth="2" />
                    <ellipse cx="115" cy="49" rx="30" ry="34" fill="#cddfc9" />
                    {/* Presidential Silhouette Icon */}
                    <circle cx="115" cy="41" r="14" fill="#2d5835" />
                    <path d="M 98 67 C 98 55, 132 55, 132 67 Z" fill="#2d5835" />

                    {/* Monetary Numerals "100" in 4 Corners */}
                    <text x="14" y="24" fontFamily="Impact, Arial Black, sans-serif" fontSize="13" fill="#1b4221" fontWeight="bold">100</text>
                    <text x="216" y="24" fontFamily="Impact, Arial Black, sans-serif" fontSize="13" fill="#1b4221" fontWeight="bold" textAnchor="end">100</text>
                    <text x="14" y="86" fontFamily="Impact, Arial Black, sans-serif" fontSize="13" fill="#1b4221" fontWeight="bold">100</text>
                    <text x="216" y="86" fontFamily="Impact, Arial Black, sans-serif" fontSize="13" fill="#1b4221" fontWeight="bold" textAnchor="end">100</text>

                    {/* Treasury Header & Seal */}
                    <text x="115" y="16" fontFamily="Times New Roman, serif" fontSize="7.5" fill="#1b4221" textAnchor="middle" letterSpacing="0.5">THE UNITED STATES OF AMERICA</text>
                    <circle cx="172" cy="49" r="12" fill="none" stroke="#2a6636" strokeWidth="1.5" strokeDasharray="2 1" />
                    <text x="172" y="52" fontFamily="Arial, sans-serif" fontSize="7" fill="#2a6636" textAnchor="middle" fontWeight="bold">USA</text>
                  </g>
                ) : (
                  // --- BACK FACE: CLASSIC GREENBACK REVERSE ---
                  <g>
                    {/* Rich Dark Greenback Base */}
                    <rect x="0" y="0" width="230" height="98" rx="4" fill={`url(#billGrad-${bill.id})`} stroke="#16381e" strokeWidth="2.5" />
                    {/* Intricate Engraved Frame */}
                    <rect x="5" y="5" width="220" height="88" rx="3" fill="none" stroke="#337843" strokeWidth="2.2" strokeDasharray="4 2" />
                    <rect x="8" y="8" width="214" height="82" fill="none" stroke="#1d4826" strokeWidth="1.5" />

                    {/* Central Independence Hall Vignette */}
                    <rect x="75" y="26" width="80" height="46" rx="2" fill="#2d6e3c" stroke="#1c4826" strokeWidth="1.5" />
                    {/* Columns & Dome */}
                    <rect x="82" y="36" width="66" height="30" fill="#1e4827" />
                    <polygon points="115,28 105,36 125,36" fill="#3a854a" />
                    <line x1="88" y1="42" x2="88" y2="64" stroke="#449957" strokeWidth="2" />
                    <line x1="98" y1="42" x2="98" y2="64" stroke="#449957" strokeWidth="2" />
                    <line x1="115" y1="42" x2="115" y2="64" stroke="#449957" strokeWidth="2" />
                    <line x1="132" y1="42" x2="132" y2="64" stroke="#449957" strokeWidth="2" />
                    <line x1="142" y1="42" x2="142" y2="64" stroke="#449957" strokeWidth="2" />

                    {/* Huge "100" Numeral Center Watermark */}
                    <text x="40" y="58" fontFamily="Impact, Arial Black, sans-serif" fontSize="28" fill="#4fa764" opacity="0.9">100</text>
                    <text x="190" y="58" fontFamily="Impact, Arial Black, sans-serif" fontSize="28" fill="#4fa764" opacity="0.9" textAnchor="end">100</text>
                    <text x="115" y="19" fontFamily="Times New Roman, serif" fontSize="7" fill="#75cb8a" textAnchor="middle" letterSpacing="1">ONE HUNDRED DOLLARS</text>
                  </g>
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
