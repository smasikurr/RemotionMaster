import React from "react";
import { AbsoluteFill } from "remotion";
import { CartoonFireworksConfettiBurstsCanvas } from "../craft/CartoonFireworksConfettiBurstsCanvas";

/**
 * CartoonFireworksConfettiBursts4K
 *
 * 1:1 Broadcast Replica of Reference: istockphoto-2217725259-640_adpp_is.mp4
 * 2D Motion Graphics Flat Cartoon Fireworks Bursts, Confetti Poppers, and Starbursts.
 * 3840x2160 UHD @ 60.000 FPS CFR, 360 frames (6.0s duration).
 */
export const CartoonFireworksConfettiBursts4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <CartoonFireworksConfettiBurstsCanvas width={3840} height={2160} />
    </AbsoluteFill>
  );
};
