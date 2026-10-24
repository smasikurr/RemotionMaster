import React from "react";
import { AbsoluteFill } from "remotion";
import {
  StudioWhiteAudioSpectrumWaveformCanvas,
  StudioWhiteAudioSpectrumWaveformCanvasProps,
} from "../craft/StudioWhiteAudioSpectrumWaveformCanvas";

/**
 * StudioWhiteAudioSpectrumWaveform4K
 *
 * 1:1 Broadcast Replica of Reference: istockphoto-2221812813-640_adpp_is.mp4
 * Minimalist Studio White Audio Spectrum Waveform Visualizer
 * 3840x2160 UHD @ 60.000 FPS CFR, 600 frames (10.0s duration).
 * Fully modular and customizable for backend web app tools via React props!
 */
export const StudioWhiteAudioSpectrumWaveform4K: React.FC<StudioWhiteAudioSpectrumWaveformCanvasProps> = (
  props
) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <StudioWhiteAudioSpectrumWaveformCanvas
        width={3840}
        height={2160}
        barCount={45}
        barWidth={30}
        barSpacing={82}
        color="#ffffff"
        backgroundColor="#000000"
        maxHeight={1320}
        {...props}
      />
    </AbsoluteFill>
  );
};
