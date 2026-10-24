import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  CompactCenterAudioWaveformCanvas,
  CompactCenterAudioWaveformCanvasProps,
} from '../craft/CompactCenterAudioWaveformCanvas';

/**
 * CompactCenterAudioWaveform4K
 *
 * 1:1 Broadcast Replica of Reference: istockphoto-2221813125-640_adpp_is.mp4 (V46)
 * Compact Centered Minimalist White Audio Spectrum Waveform Visualizer
 * 21 centered white bars, width 24px, spacing 88px, symmetric pill caps and silence dots.
 * 3840x2160 UHD @ 60.000 FPS CFR, 600 frames (10.0s duration).
 */
export const CompactCenterAudioWaveform4K: React.FC<CompactCenterAudioWaveformCanvasProps> = (
  props
) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <CompactCenterAudioWaveformCanvas
        barCount={21}
        barWidth={24}
        barSpacing={88}
        maxHeight={780}
        minHeight={0}
        color="#FFFFFF"
        backgroundColor="#000000"
        {...props}
      />
    </AbsoluteFill>
  );
};
