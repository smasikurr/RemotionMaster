import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import * as THREE from 'three';

export interface CyberpunkOscilloscopeHUDSceneProps {
  seed?: number;
}

export const CyberpunkOscilloscopeHUDScene: React.FC<CyberpunkOscilloscopeHUDSceneProps> = ({
  seed = 60,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const time = frame / 60.0;

  // Intro animation: Frame expands from center over first 45 frames (0.75s)
  const introProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // -------------------------------------------------------------
  // THREE.JS 3D RIBBED GYRO ORBS RENDERER
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    // High-contrast studio lighting for dark titanium metal
    const ambientLight = new THREE.AmbientLight(0x404856, 2.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111620, 2.0);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 4.8);
    dirLight1.position.set(12, 18, 14);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa0c0e0, 3.2);
    dirLight2.position.set(-14, -6, 10);
    scene.add(dirLight2);

    // Dark Titanium Metallic Material with sharp anisotropic specular
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0x303642,
      metalness: 0.92,
      roughness: 0.25,
    });

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a202c,
      metalness: 0.88,
      roughness: 0.32,
    });

    const createRibbedGyroOrb = (orbRadius: number) => {
      const orbGroup = new THREE.Group();

      // Central Spindle
      const spindleGeo = new THREE.CylinderGeometry(
        orbRadius * 0.14,
        orbRadius * 0.14,
        orbRadius * 2.18,
        32
      );
      const spindle = new THREE.Mesh(spindleGeo, coreMaterial);
      orbGroup.add(spindle);

      // Horizontal Latitude Ribs (14 stacked rings)
      const numRings = 14;
      const tubeR = orbRadius * 0.045;
      for (let i = 0; i < numRings; i++) {
        const theta = -1.24 + (i / (numRings - 1)) * 2.48;
        const ringY = orbRadius * Math.sin(theta);
        const ringR = orbRadius * Math.cos(theta);

        if (ringR > 0.15) {
          const ringGeo = new THREE.TorusGeometry(ringR, tubeR, 16, 64);
          const ringMesh = new THREE.Mesh(ringGeo, orbMaterial);
          ringMesh.position.y = ringY;
          ringMesh.rotation.x = Math.PI / 2;
          orbGroup.add(ringMesh);
        }
      }

      // 4 Vertical Meridian Rib Arches
      for (let j = 0; j < 4; j++) {
        const archGeo = new THREE.TorusGeometry(orbRadius, tubeR, 16, 64);
        const archMesh = new THREE.Mesh(archGeo, orbMaterial);
        archMesh.rotation.y = (j * Math.PI) / 4;
        orbGroup.add(archMesh);
      }

      return orbGroup;
    };

    // Orb Radius 3.2
    const orbRadius = 3.2;
    const orb1 = createRibbedGyroOrb(orbRadius);
    scene.add(orb1);

    const orb2 = createRibbedGyroOrb(orbRadius);
    scene.add(orb2);

    // Trajectory: Floating symmetrically at left and right edges, rotating gracefully
    const orb1X = 6.0 - Math.sin(time * 0.35) * 1.5;
    const orb1Y = 0.4 + Math.cos(time * 0.45) * 0.6;
    const orb1Z = -1.0 + Math.sin(time * 0.25) * 0.6;
    orb1.position.set(orb1X, orb1Y, orb1Z);
    orb1.rotation.x = time * 0.55;
    orb1.rotation.y = time * 0.95;
    orb1.rotation.z = time * 0.35;

    const orb2X = -6.0 + Math.sin(time * 0.35) * 1.5;
    const orb2Y = -0.2 - Math.cos(time * 0.45) * 0.6;
    const orb2Z = -1.2 - Math.sin(time * 0.25) * 0.6;
    orb2.position.set(orb2X, orb2Y, orb2Z);
    orb2.rotation.x = -time * 0.50;
    orb2.rotation.y = -time * 0.85;
    orb2.rotation.z = time * 0.30;

    const introScale = Math.min(1.0, introProgress);
    orb1.scale.set(introScale, introScale, introScale);
    orb2.scale.set(introScale, introScale, introScale);

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
    };
  }, [frame, width, height, time, introProgress]);

  // -------------------------------------------------------------
  // 2D SCI-FI HUD & AUDIO OSCILLOSCOPE WAVEFORM
  // -------------------------------------------------------------
  const hudW = 2920 * introProgress;
  const hudH = 1220 * introProgress;
  const hudLeft = (width - hudW) / 2;
  const hudTop = (height - hudH) / 2;
  const centerY = height / 2;

  // Maximum allowed waveform half-height so it remains strictly inside the HUD box
  const maxWaveformHalfHeight = (hudH / 2) - 80;

  // Dense Waveform line generation (600 vertical audio spikes)
  const wavePoints = 600;
  const waveStartX = (width - 2740) / 2;
  const waveStep = 2740 / (wavePoints - 1);

  const waveLines = Array.from({ length: wavePoints }, (_, i) => {
    const x = waveStartX + i * waveStep;
    const normX = i / (wavePoints - 1);

    // Speech & acoustic envelope with distinct resonant formants
    const formant1 = Math.exp(-Math.pow((normX - 0.20) * 5.2, 2)) * 1.30;
    const formant2 = Math.exp(-Math.pow((normX - 0.32) * 6.2, 2)) * 1.45;
    const formant3 = Math.exp(-Math.pow((normX - 0.52) * 4.4, 2)) * 1.20;
    const formant4 = Math.exp(-Math.pow((normX - 0.76) * 5.8, 2)) * 0.90;
    const voiceEnvelope = formant1 + formant2 + formant3 + formant4 + 0.16;

    // Fast oscillating spiky acoustic carriers
    const carrier1 = Math.sin(i * 1.82 + time * 38.0);
    const carrier2 = Math.cos(i * 3.45 - time * 29.0);
    const carrier3 = Math.sin(i * 7.15 + time * 52.0);
    const noiseSpike = Math.sin(i * 41.2 + time * 70.0);

    // Audio rhythm pulse bursts (rhythmic speech cadences)
    const burst1 = Math.pow(Math.max(0, Math.sin(time * 3.8)), 2.2);
    const burst2 = Math.pow(Math.max(0, Math.cos(time * 5.8 + 0.5)), 2.8);
    const totalActivity = 0.55 + burst1 * 0.65 + burst2 * 0.40;

    const rawHeight =
      Math.abs(carrier1 * 0.45 + carrier2 * 0.35 + carrier3 * 0.20 + noiseSpike * 0.15) *
      voiceEnvelope *
      totalActivity *
      420 *
      introProgress;

    // Clamp strictly within HUD interior
    const h = Math.min(maxWaveformHalfHeight, Math.max(4, rawHeight));

    return {
      x,
      y1: centerY - h,
      y2: centerY + h,
    };
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 3D Three.js WebGL Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          zIndex: 1,
        }}
      />

      {/* 2D Cyberpunk Oscilloscope HUD Overlay */}
      {introProgress > 0.05 && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {/* Subtle Cartesian dot grid inside HUD */}
          <g opacity={0.35 * introProgress}>
            {Array.from({ length: 33 }).map((_, c) =>
              Array.from({ length: 13 }).map((_, r) => (
                <circle
                  key={`dot_${c}_${r}`}
                  cx={hudLeft + 60 + c * ((hudW - 120) / 32)}
                  cy={hudTop + 50 + r * ((hudH - 100) / 12)}
                  r={1.5}
                  fill="#7894ac"
                />
              ))
            )}
          </g>

          {/* 6 Vertical Dashed Grid Divider Lines */}
          <g stroke="#ffffff" strokeWidth="1.2" strokeDasharray="4 8" opacity={0.45 * introProgress}>
            {[0.16, 0.32, 0.48, 0.64, 0.80].map((frac, idx) => (
              <line
                key={`vdiv_${idx}`}
                x1={hudLeft + hudW * frac}
                y1={hudTop + 20}
                x2={hudLeft + hudW * frac}
                y2={hudTop + hudH - 65}
              />
            ))}
          </g>

          {/* Bold Pure White HUD Outer Frame & Chamfered Angles */}
          <g stroke="#ffffff" strokeWidth="2.2" fill="none" opacity={0.96 * introProgress}>
            {/* Outer Boundary with Chamfered Tabs */}
            <path
              d={`
                M ${hudLeft + 55} ${hudTop}
                H ${hudLeft + hudW - 55}
                L ${hudLeft + hudW} ${hudTop + 55}
                V ${hudTop + hudH - 65}
                H ${hudLeft}
                V ${hudTop + 55}
                Z
              `}
            />

            {/* Corner Bracket Accents */}
            <path d={`M ${hudLeft} ${hudTop + 65} L ${hudLeft} ${hudTop} L ${hudLeft + 65} ${hudTop}`} />
            <path d={`M ${hudLeft + hudW - 65} ${hudTop} L ${hudLeft + hudW} ${hudTop} L ${hudLeft + hudW} ${hudTop + 65}`} />
            <path d={`M ${hudLeft} ${hudTop + hudH - 65} L ${hudLeft + 65} ${hudTop + hudH - 65}`} />
            <path d={`M ${hudLeft + hudW - 65} ${hudTop + hudH - 65} L ${hudLeft + hudW} ${hudTop + hudH - 65}`} />

            {/* Top Cutout Tabs */}
            <rect x={hudLeft + 80} y={hudTop - 6} width={180} height={12} fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
            <rect x={hudLeft + 480} y={hudTop - 6} width={180} height={12} fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
            <rect x={hudLeft + 880} y={hudTop - 6} width={180} height={12} fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
            <rect x={hudLeft + hudW - 400} y={hudTop - 6} width={220} height={12} fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* Bottom Track of Chevron / Cross Tech Boxes [×] [×] [×] ... */}
          <g stroke="#ffffff" strokeWidth="1.2" fill="none" opacity={0.92 * introProgress}>
            {Array.from({ length: 28 }).map((_, bIdx) => {
              const boxW = (hudW - 240) / 28;
              const bX = hudLeft + 20 + bIdx * boxW;
              const bY = hudTop + hudH - 52;
              const bH = 36;
              return (
                <g key={`box_${bIdx}`}>
                  <rect x={bX} y={bY} width={boxW - 4} height={bH} />
                  <line x1={bX} y1={bY} x2={bX + boxW - 4} y2={bY + bH} opacity="0.6" />
                  <line x1={bX + boxW - 4} y1={bY} x2={bX} y2={bY + bH} opacity="0.6" />
                </g>
              );
            })}
            {/* Hexagon cursor indicator on right side of bottom bar */}
            <polygon
              points={`
                ${hudLeft + hudW - 190},${hudTop + hudH - 34}
                ${hudLeft + hudW - 175},${hudTop + hudH - 50}
                ${hudLeft + hudW - 150},${hudTop + hudH - 50}
                ${hudLeft + hudW - 135},${hudTop + hudH - 34}
                ${hudLeft + hudW - 150},${hudTop + hudH - 18}
                ${hudLeft + hudW - 175},${hudTop + hudH - 18}
              `}
              fill="#ffffff"
            />
          </g>

          {/* Technical Telemetry Text & Metadata */}
          <g fill="#ffffff" fontFamily="monospace" fontSize="16" letterSpacing="2" opacity={0.95 * introProgress}>
            <text x={hudLeft + 45} y={hudTop + 45}>
              FINAL EPISODE // DATE: DECEMBER 14, 2024
            </text>
            <text x={hudLeft + 45} y={hudTop + 72} fill="#8ba2b8" fontSize="13">
              THE NEWSROOM // SYS.MONITOR.v4
            </text>

            <text x={hudLeft + hudW - 340} y={hudTop + 45} textAnchor="start">
              CH-01 // 96.0 kHz / 24-BIT
            </text>
            <text x={hudLeft + hudW - 340} y={hudTop + 72} fill="#ff3b30" fontSize="13">
              ● [REC 00:11:42:00]
            </text>
          </g>

          {/* Left Vertical Decibel Scale Markers & Sliders */}
          <g stroke="#ffffff" strokeWidth="1.5" opacity={0.85 * introProgress}>
            {[-380, -260, -140, 0, 140, 260, 380].map((offset, idx) => (
              <g key={`db_${idx}`}>
                <line
                  x1={hudLeft + 22}
                  y1={centerY + offset}
                  x2={hudLeft + 44}
                  y2={centerY + offset}
                />
                <circle cx={hudLeft + 52} cy={centerY + offset} r={2.0} fill="#ffffff" />
              </g>
            ))}
          </g>

          {/* Right Vertical Target Reticle */}
          <g stroke="#ffffff" strokeWidth="1.5" fill="none" opacity={0.85 * introProgress}>
            <circle cx={hudLeft + hudW - 55} cy={centerY} r={32} />
            <circle cx={hudLeft + hudW - 55} cy={centerY} r={14} />
            <line
              x1={hudLeft + hudW - 95}
              y1={centerY}
              x2={hudLeft + hudW - 15}
              y2={centerY}
            />
            <line
              x1={hudLeft + hudW - 55}
              y1={centerY - 40}
              x2={hudLeft + hudW - 55}
              y2={centerY + 40}
            />
          </g>

          {/* CENTER HORIZONTAL RED REFERENCE BASELINE */}
          <line
            x1={hudLeft + 15}
            y1={centerY}
            x2={hudLeft + hudW - 15}
            y2={centerY}
            stroke="#ff3b30"
            strokeWidth="2.2"
            opacity={0.96 * introProgress}
            style={{
              filter: 'drop-shadow(0px 0px 5px rgba(255, 59, 48, 0.7))',
            }}
          />

          {/* DENSE HIGH-FREQUENCY OSCILLOSCOPE AUDIO WAVEFORM (Pure Brilliant White Acoustic Spectrum) */}
          <g
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{
              filter:
                'drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.95)) drop-shadow(0px 0px 8px rgba(180, 240, 255, 0.5))',
            }}
          >
            {waveLines.map((wl, idx) => (
              <line key={`wl_${idx}`} x1={wl.x} y1={wl.y1} x2={wl.x} y2={wl.y2} />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
};
