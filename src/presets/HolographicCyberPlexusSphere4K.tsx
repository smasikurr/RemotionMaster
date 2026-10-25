import React from "react";
import { useVideoConfig } from "remotion";
import { DualColorNeonQuestionMarkCanvas } from "../craft/DualColorNeonQuestionMarkCanvas";

/**
 * HolographicCyberPlexusSphere4K (Rebuilt as 1:1 Dual-Color Neon Question Mark Badge)
 * Stock Motion Graphics Video 10/81
 * Reference: istockphoto-1422388955-640_adpp_is.mp4 (14.06s)
 *
 * 1:1 Authentic Re-creation:
 * - Commanding center emblem: Bent hollow neon glass question mark badge
 * - Interlocking rotating dual-color outer neon circular arcs (Electric Cyan-Blue & Hot Magenta-Pink)
 * - Multi-pass physical neon tube glow with incandescent white gas core
 * - Analog neon voltage micro-flicker & breathing
 * - 100% Solid Pure #000000 base for instant Screen / Add blending
 */
export const HolographicCyberPlexusSphere4K: React.FC = () => {
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
      <DualColorNeonQuestionMarkCanvas width={width} height={height} />
    </div>
  );
};
