import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  CyanFlutedGlassRefractionCanvas,
  CyanFlutedGlassRefractionCanvasProps,
} from '../craft/CyanFlutedGlassRefractionCanvas';

/**
 * CyanFlutedGlassRefraction4K
 *
 * 1:1 Broadcast Replica of Reference: istockphoto-2224930581-640_adpp_is.mp4 (V47)
 * Dynamic Sweeping Volumetric Caustic Light Beam through 36 Architectural Fluted Glass Ribs
 * 3840x2160 UHD @ 60.000 FPS CFR, 900 frames (15.0s duration).
 */
export const CyanFlutedGlassRefraction4K: React.FC<CyanFlutedGlassRefractionCanvasProps> = (
  props
) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#00060C' }}>
      <CyanFlutedGlassRefractionCanvas
        fluteCount={36}
        refractionStrength={1.0}
        waveSpeed={1.35}
        beamWidth={1.0}
        contrast={1.35}
        brightness={0.80}
        {...props}
      />
    </AbsoluteFill>
  );
};
