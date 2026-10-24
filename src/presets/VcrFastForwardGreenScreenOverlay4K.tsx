import React from "react";
import { AbsoluteFill } from "remotion";
import { VcrFastForwardGreenScreenCanvas } from "../craft/VcrFastForwardGreenScreenCanvas";

/**
 * VcrFastForwardGreenScreenOverlay4K
 *
 * True 1:1 Vintage VCR VHS Fast-Forward (FF >>) Tape Glitch & Timecode Overlay
 * Faithfully matches iStock reference: istockphoto-2217105145-640_adpp_is.mp4
 *
 * Specifications:
 * - 3840x2160 UHD @ 60 FPS (600 frames / 10.00s)
 * - Pure Chroma Key Green Background (#23ff2c) for 1-click editor keying
 * - Authentic helical scan tracking distortion bands with horizontal drift
 * - Top-left iconic VCR OSD: "FF ▶▶"
 * - Bottom-right high-speed 7-segment digital timecode counter (00:03:02 to 00:59:24)
 * - Micro CRT scanlines & analog tape noise
 * - 100% procedural Canvas 2D math, zero external image assets
 */
export const VcrFastForwardGreenScreenOverlay4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#23ff2c" }}>
      <VcrFastForwardGreenScreenCanvas width={3840} height={2160} />
    </AbsoluteFill>
  );
};
