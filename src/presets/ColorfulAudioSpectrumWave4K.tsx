import React from "react";
import { useVideoConfig } from "remotion";
import { DigitalLEDMatrixEqualizerCanvas } from "../craft/DigitalLEDMatrixEqualizerCanvas";

/**
 * ColorfulAudioSpectrumWave4K - Stock Motion Graphics Video 01/81
 * Reference: istockphoto-1124719368-640_adpp_is.mp4 (7.47s)
 *
 * 1:1 Authentic Re-creation:
 * - Full-screen 3840x2160 LED Digital Equalizer Frequency Matrix
 * - Multicolored rows: Central intense incandescent white, coral crimson red, scarlet orange, outer amber yellow dots
 * - Pulse dynamics synced to electronic beat & traveling multi-frequency soundwaves
 * - 100% Solid Pure #000000 background for instant Add / Screen compositing
 */
export const ColorfulAudioSpectrumWave4K: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DigitalLEDMatrixEqualizerCanvas width={width} height={height} />
    </div>
  );
};
