import { spring, SpringConfig } from "remotion";

/**
 * Standard Spring Physics Presets
 * Derived from Remotion official best practices.
 */
export const SPRING_PRESETS = {
  // Snappy entrance for UI cards, buttons, badges
  snappy: { damping: 20, stiffness: 200, mass: 1 },
  // Bouncy entrance for celebratory elements, emojis, alerts
  bouncy: { damping: 8, stiffness: 100, mass: 1 },
  // Smooth organic entrance for luxury typography, camera moves
  smooth: { damping: 200, stiffness: 100, mass: 1 },
  // Heavy weighted impact for massive numbers, hardware mockups
  heavy: { damping: 15, stiffness: 80, mass: 2 },
  // Highly elastic overshoot for comic/cartoon bursts
  elastic: { damping: 6, stiffness: 150, mass: 0.8 },
} as const satisfies Record<string, SpringConfig>;

export type SpringPresetName = keyof typeof SPRING_PRESETS;

/**
 * Helper to compute an organic spring value with optional delay
 */
export function getSpringValue(
  frame: number,
  fps: number,
  preset: SpringPresetName = "snappy",
  delayFrames: number = 0,
  durationInFrames?: number
): number {
  return spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_PRESETS[preset],
    durationInFrames,
  });
}
