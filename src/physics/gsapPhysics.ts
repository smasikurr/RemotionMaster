import { Easing } from "remotion";

/**
 * GSAP-Inspired Easing Curves & Motion Physics
 * Synthesizing GreenSock (GSAP) professional animation curves for Remotion.
 */

export const GSAP_EASINGS = {
  // Power curves (Quad, Cubic, Quart, Quint)
  power1In: Easing.bezier(0.55, 0.085, 0.68, 0.53),
  power1Out: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  power1InOut: Easing.bezier(0.455, 0.03, 0.515, 0.955),

  power2In: Easing.bezier(0.55, 0.055, 0.675, 0.19),
  power2Out: Easing.bezier(0.215, 0.61, 0.355, 1),
  power2InOut: Easing.bezier(0.645, 0.045, 0.355, 1),

  power3In: Easing.bezier(0.895, 0.03, 0.685, 0.22),
  power3Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  power3InOut: Easing.bezier(0.77, 0, 0.175, 1),

  power4In: Easing.bezier(0.755, 0.05, 0.855, 0.06),
  power4Out: Easing.bezier(0.23, 1, 0.32, 1),
  power4InOut: Easing.bezier(0.86, 0, 0.07, 1),

  // Exponential & Circular
  expoIn: Easing.bezier(0.95, 0.05, 0.795, 0.035),
  expoOut: Easing.bezier(0.19, 1, 0.22, 1),
  expoInOut: Easing.bezier(1, 0, 0, 1),

  circIn: Easing.bezier(0.6, 0.04, 0.98, 0.335),
  circOut: Easing.bezier(0.075, 0.82, 0.165, 1),
  circInOut: Easing.bezier(0.785, 0.135, 0.15, 0.86),

  // Back (overshoot)
  backIn: Easing.bezier(0.6, -0.28, 0.735, 0.045),
  backOut: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  backInOut: Easing.bezier(0.68, -0.55, 0.265, 1.55),
};

/**
 * GSAP Custom Wiggle Simulation
 * Creates organic oscillating micro-movements, camera shakes, or jitter.
 */
export function customWiggle({
  frame,
  fps = 60,
  durationInSeconds = 1,
  wiggles = 6,
  amplitude = 10,
  decay = true,
}: {
  frame: number;
  fps?: number;
  durationInSeconds?: number;
  wiggles?: number;
  amplitude?: number;
  decay?: boolean;
}): number {
  const totalFrames = durationInSeconds * fps;
  if (frame <= 0) return 0;
  if (frame >= totalFrames) return 0;

  const progress = frame / totalFrames;
  const decayFactor = decay ? Math.pow(1 - progress, 2) : 1;
  const angle = progress * Math.PI * 2 * wiggles;

  return Math.sin(angle) * amplitude * decayFactor;
}

/**
 * GSAP Custom Bounce Simulation
 * Simulates gravitational bounce with kinetic energy dissipation.
 */
export function customBounce({
  progress,
  bounces = 4,
  decay = 0.5,
}: {
  progress: number; // 0 to 1
  bounces?: number;
  decay?: number;
}): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  // Approximate parabolic bounces
  const t = progress;
  if (t < 0.3636) {
    return 7.5625 * t * t;
  } else if (t < 0.7272) {
    const t2 = t - 0.5454;
    return 7.5625 * t2 * t2 + 0.75;
  } else if (t < 0.909) {
    const t3 = t - 0.8182;
    return 7.5625 * t3 * t3 + 0.9375;
  } else {
    const t4 = t - 0.9545;
    return 7.5625 * t4 * t4 + 0.984375;
  }
}
