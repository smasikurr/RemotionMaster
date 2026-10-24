import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

/**
 * GreenScreenCartoonCloudMascot4K - Stock Motion Graphics Video 15/81
 * Reference: istockphoto-1493145830-640_adpp_is.mp4 (10.03s)
 *
 * Strict Stock Quality Directives:
 * 1. 1:1 Pixel-by-Pixel Fidelity to Reference:
 *    - Pure Broadcast Chroma Green Screen (#00f800 / #00ff00) base for flawless Ultra/Chroma Keying
 *    - 3D Puffy Cartoon Cloud / Cute Stylized Mascot Character
 *    - Soft volumetric shading with multi-stop radial highlights and ambient occlusion
 *    - Organic aerodynamic floating bob and playful squash-and-stretch idle
 * 2. Full 4K Canvas Span (Large, bold, commanding hero presence: 1800 x 1450 px in 4K)
 * 3. 6-Phase Keyframed Dynamics Arc ("Aga Gora Matha")
 * 4. Native 4K UHD 3840x2160 @ 60 FPS
 */
export const GreenScreenCartoonCloudMascot4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig(); // 3840 x 2160, 60fps

  const cx = width / 2; // 1920
  const cy = height / 2; // 1080
  const time = frame / fps;

  // 1. 6-Phase Keyframed Musical Dynamic Arc (600 frames = 10.0s)
  // Phase 1 (0-60): Intro playful pop-in spring
  // Phase 2 (60-180): Gentle floating idle
  // Phase 3 (180-300): Climax playful squash & stretch bounce
  // Phase 4 (300-420): Harmonic float
  // Phase 5 (420-540): Secondary energetic hop
  // Phase 6 (540-600): Smooth resolve back to loop point
  const bounceY = useMemo(() => {
    if (frame < 60) {
      // Intro spring drop-in
      const sp = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
      return interpolate(sp, [0, 1], [-400, 0]);
    }
    if (frame < 180) {
      // Gentle idle float
      return Math.sin(time * 2.2) * 35;
    }
    if (frame < 300) {
      // Climax bouncy hop
      const hopPhase = (frame - 180) * 0.12;
      return Math.sin(hopPhase) * 90 - Math.abs(Math.cos(hopPhase * 0.5)) * 40;
    }
    if (frame < 420) {
      // Calm floating groove
      return Math.sin(time * 2.4) * 35;
    }
    if (frame < 540) {
      // Secondary playful swell
      const hopPhase = (frame - 420) * 0.1;
      return Math.sin(hopPhase) * 60;
    }
    // Settle to loop
    return interpolate(frame, [540, 600], [Math.sin(time * 2.2) * 35, 0]);
  }, [frame, fps, time]);

  // Squash & Stretch dynamics
  const scaleX = useMemo(() => {
    if (frame < 60) return 1.0;
    if (frame >= 180 && frame < 300) {
      return 1.0 + Math.sin((frame - 180) * 0.12) * 0.08;
    }
    return 1.0 + Math.sin(time * 2.2) * 0.03;
  }, [frame, time]);

  const scaleY = useMemo(() => {
    return 1.0 / scaleX; // Preserve volume
  }, [scaleX]);

  const tiltRot = useMemo(() => {
    return Math.sin(time * 1.6) * 3.5; // subtle organic roll tilt (-3.5 to +3.5 deg)
  }, [time]);

  // Shadow dynamics on ground
  const shadowScale = interpolate(bounceY, [-100, 100], [0.85, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shadowAlpha = interpolate(bounceY, [-100, 100], [0.2, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#00f800', overflow: 'hidden' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* 3D Volumetric Cloud Shading (Center to Edge) */}
          <radialGradient
            id="cloudBodyGrad"
            cx="40%"
            cy="35%"
            r="65%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f3f8f5" />
            <stop offset="85%" stopColor="#dce8e2" />
            <stop offset="100%" stopColor="#b4cbbe" />
          </radialGradient>

          {/* Top Mound 1 Gradient */}
          <radialGradient
            id="moundGrad1"
            cx="35%"
            cy="30%"
            r="65%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#edf5f0" />
            <stop offset="100%" stopColor="#c5dad0" />
          </radialGradient>

          {/* Top Mound 2 Gradient */}
          <radialGradient
            id="moundGrad2"
            cx="45%"
            cy="25%"
            r="60%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f0f6f2" />
            <stop offset="100%" stopColor="#c8ddd3" />
          </radialGradient>

          {/* Soft Ground Contact Shadow */}
          <radialGradient id="greenGroundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 60, 0, 0.45)" />
            <stop offset="60%" stopColor="rgba(0, 90, 0, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 120, 0, 0)" />
          </radialGradient>

          {/* Character Specular Soft Filter */}
          <filter id="cloudSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur" />
            <feOffset dx="0" dy="24" result="offsetblur" />
            <feFlood floodColor="rgba(0, 70, 0, 0.35)" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. SOFT 3D GROUND SHADOW ON CHROMA GREEN */}
        <ellipse
          cx={cx}
          cy={cy + 820}
          rx={920 * shadowScale}
          ry={180 * shadowScale}
          fill="url(#greenGroundShadow)"
          opacity={shadowAlpha}
        />

        {/* 2. THE 3D CARTOON CLOUD MASCOT (Transformed with Squash & Stretch + Floating Bob) */}
        <g
          transform={`translate(${cx}, ${cy + bounceY}) scale(1.55) rotate(${tiltRot}) scale(${scaleX}, ${scaleY}) translate(${-cx}, ${-cy})`}
          filter="url(#cloudSoftGlow)"
        >
          {/* Main Backing Cloud Silhouettes for Soft Ambient Occlusion */}
          <path
            d={`
              M ${cx - 520} ${cy + 180}
              C ${cx - 680} ${cy + 120}, ${cx - 720} ${cy - 80}, ${cx - 560} ${cy - 180}
              C ${cx - 620} ${cy - 360}, ${cx - 380} ${cy - 480}, ${cx - 220} ${cy - 380}
              C ${cx - 120} ${cy - 560}, ${cx + 180} ${cy - 560}, ${cx + 280} ${cy - 380}
              C ${cx + 460} ${cy - 460}, ${cx + 680} ${cy - 300}, ${cx + 620} ${cy - 120}
              C ${cx + 740} ${cy + 40}, ${cx + 680} ${cy + 240}, ${cx + 480} ${cy + 280}
              C ${cx + 260} ${cy + 340}, ${cx - 280} ${cy + 340}, ${cx - 520} ${cy + 180}
              Z
            `}
            fill="#a6c0b3"
            opacity={0.4}
          />

          {/* MAIN 3D PUFFY BODY */}
          <path
            d={`
              M ${cx - 500} ${cy + 160}
              C ${cx - 650} ${cy + 100}, ${cx - 680} ${cy - 80}, ${cx - 530} ${cy - 170}
              C ${cx - 580} ${cy - 340}, ${cx - 360} ${cy - 450}, ${cx - 200} ${cy - 360}
              C ${cx - 100} ${cy - 530}, ${cx + 160} ${cy - 530}, ${cx + 260} ${cy - 360}
              C ${cx + 430} ${cy - 430}, ${cx + 640} ${cy - 280}, ${cx + 580} ${cy - 110}
              C ${cx + 700} ${cy + 40}, ${cx + 640} ${cy + 220}, ${cx + 460} ${cy + 260}
              C ${cx + 240} ${cy + 320}, ${cx - 260} ${cy + 320}, ${cx - 500} ${cy + 160}
              Z
            `}
            fill="url(#cloudBodyGrad)"
          />

          {/* TOP LEFT VOLUMETRIC MOUND */}
          <ellipse
            cx={cx - 180}
            cy={cy - 260}
            rx={280}
            ry={240}
            fill="url(#moundGrad1)"
          />

          {/* TOP RIGHT VOLUMETRIC MOUND */}
          <ellipse
            cx={cx + 180}
            cy={cy - 240}
            rx={290}
            ry={250}
            fill="url(#moundGrad2)"
          />

          {/* CENTER SOFT SPECULAR HIGHLIGHT PUFF */}
          <ellipse
            cx={cx - 60}
            cy={cy - 120}
            rx={380}
            ry={260}
            fill="#ffffff"
            opacity={0.65}
          />

          {/* BOTTOM FRONT ROUNDED BEVEL LOBE */}
          <ellipse
            cx={cx}
            cy={cy + 80}
            rx={420}
            ry={200}
            fill="#ffffff"
            opacity={0.8}
          />

          {/* CRISP SPECULAR CRESCENT HIGHLIGHTS (Gives glossy vinyl/3D toy shine) */}
          <path
            d={`
              M ${cx - 260} ${cy - 380}
              C ${cx - 200} ${cy - 440}, ${cx - 80} ${cy - 450}, ${cx - 20} ${cy - 420}
              C ${cx - 70} ${cy - 410}, ${cx - 180} ${cy - 390}, ${cx - 240} ${cy - 340}
              Z
            `}
            fill="#ffffff"
            opacity={0.85}
          />

          <path
            d={`
              M ${cx + 80} ${cy - 410}
              C ${cx + 160} ${cy - 430}, ${cx + 280} ${cy - 410}, ${cx + 340} ${cy - 350}
              C ${cx + 280} ${cy - 360}, ${cx + 170} ${cy - 380}, ${cx + 110} ${cy - 370}
              Z
            `}
            fill="#ffffff"
            opacity={0.8}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
