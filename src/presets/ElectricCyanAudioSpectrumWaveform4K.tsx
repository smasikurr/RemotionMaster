import React from "react";
import { AbsoluteFill } from "remotion";
import { ElectricCyanAudioSpectrumWaveformCanvas } from "../craft/ElectricCyanAudioSpectrumWaveformCanvas";

/**
 * ElectricCyanAudioSpectrumWaveform4K
 *
 * True 1:1 Electric Cyan Laser Audio Waveform Spectrum with Optical Needles
 * Faithfully matches iStock reference: istockphoto-2217230456-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (600 frames / 10.00s seamless broadcast spec)
 * - Pure Black Void Backing (#000000) for seamless Screen/Add blending
 * - Symmetrical horizontal sound frequency diamond needles
 * - Tri-pass bloom: Outer radiant cyan aura, bright ice blue body, hot white core
 * - Optical laser needle spikes & tip cross glare
 * - 100% procedural Canvas 2D math, zero external assets
 */
export const ElectricCyanAudioSpectrumWaveform4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ElectricCyanAudioSpectrumWaveformCanvas width={3840} height={2160} />
    </AbsoluteFill>
  );
};
