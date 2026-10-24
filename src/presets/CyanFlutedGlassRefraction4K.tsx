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
 * Abstract Cyan / Teal / Deep Navy Blue Fluted Ribbed Glass Refraction
 * 38 architectural cylindrical flutes refracting organic luminous fluid caustics
 * 3840x2160 UHD @ 60.000 FPS CFR, 900 frames (15.0s duration).
 */
export const CyanFlutedGlassRefraction4K: React.FC<CyanFlutedGlassRefractionCanvasProps> = (
  props
) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000810' }}>
      <CyanFlutedGlassRefractionCanvas
        fluteCount={38}
        refractionStrength={1.0}
        waveScale={1.35}
        waveSpeed={0.85}
        specularPower={2.2}
        brightness={1.0}
        contrast={1.25}
        {...props}
      />
    </AbsoluteFill>
  );
};
