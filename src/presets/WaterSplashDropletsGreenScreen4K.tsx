import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  WaterSplashGreenScreenCanvas,
  WaterSplashGreenScreenCanvasProps,
} from '../craft/WaterSplashGreenScreenCanvas';

/**
 * WaterSplashDropletsGreenScreen4K
 *
 * 1:1 Broadcast Replica of Reference: istockphoto-2225148620-640_adpp_is.mp4 (V48)
 * VFX Chroma Key Green Screen Water Splash & Fluid Droplets Burst Transition
 * 3840x2160 UHD @ 60.000 FPS CFR, 900 frames (15.0s duration).
 */
export const WaterSplashDropletsGreenScreen4K: React.FC<WaterSplashGreenScreenCanvasProps> = (
  props
) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#007400' }}>
      <WaterSplashGreenScreenCanvas
        greenColor="#007400"
        dropletCount={380}
        splashSpeed={1.0}
        seed={48}
        {...props}
      />
    </AbsoluteFill>
  );
};
