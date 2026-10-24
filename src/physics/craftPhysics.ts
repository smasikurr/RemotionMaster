import { interpolate, spring, SpringConfig } from "remotion";
import { SPRING_PRESETS, SpringPresetName } from "./springs";

/**
 * Advanced Craft Physics Engine
 * Implements core Disney & After Effects principles in pure Remotion TypeScript.
 */

export interface CoupledEntranceResult {
  scale: number;
  translateY: number;
  rotate: number;
  opacity: number;
}

/**
 * 1. Anticipation Spring
 * Pulls backward slightly for a few frames before explosively releasing forward.
 */
export function anticipationSpring(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    anticipationFrames?: number;
    anticipationDepth?: number;
    springConfig?: Partial<SpringConfig>;
  } = {}
): number {
  const {
    delay = 0,
    anticipationFrames = 7,
    anticipationDepth = 0.08,
    springConfig = { damping: 11, stiffness: 180, mass: 0.8 },
  } = options;

  const f = Math.max(0, frame - delay);

  // Phase 1: Pre-pull anticipation
  if (f < anticipationFrames) {
    return interpolate(
      f,
      [0, anticipationFrames],
      [0, -anticipationDepth],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  // Phase 2: Explosive snappy release with spring damping
  const spr = spring({
    frame: f - anticipationFrames,
    fps,
    config: springConfig,
  });

  return interpolate(
    spr,
    [0, 1],
    [-anticipationDepth, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

/**
 * 2. Squash & Stretch Deformation
 * Calculates realistic volume-preserving 2D squash and stretch based on velocity.
 */
export function squashAndStretch(
  currentVal: number,
  prevVal: number,
  intensity = 0.6
): { scaleX: number; scaleY: number } {
  const velocity = Math.abs(currentVal - prevVal);
  const stretch = Math.min(0.4, velocity * intensity);

  // Volume preservation: scaleX * scaleY ~= 1.0
  const scaleY = 1.0 + stretch;
  const scaleX = 1.0 / scaleY;

  return { scaleX, scaleY };
}

/**
 * 3. Harmonic Idle Breathing Motion
 * Dual-frequency trigonometric oscillation to keep objects alive indefinitely without static holds.
 */
export function harmonicIdleMotion(
  frame: number,
  options: {
    speed?: number;
    amplitudeY?: number;
    tiltDegrees?: number;
    phaseOffset?: number;
  } = {}
): { idleY: number; idleRotate: number; idleScale: number } {
  const {
    speed = 0.05,
    amplitudeY = 10,
    tiltDegrees = 3,
    phaseOffset = 0,
  } = options;

  const t = frame * speed + phaseOffset;
  const idleY = Math.sin(t) * amplitudeY;
  const idleRotate = Math.sin(t * 0.7) * Math.cos(t * 0.3) * tiltDegrees;
  const idleScale = 1.0 + Math.sin(t * 1.3) * 0.02;

  return { idleY, idleRotate, idleScale };
}

/**
 * 4. Multi-Property Coupled Entrance
 * Concurrently animates scale, position, rotation, and opacity to eliminate flat single-property reveals.
 */
export function coupledEntrance(
  frame: number,
  fps: number,
  options: {
    delay?: number;
    startY?: number;
    startScale?: number;
    startRotate?: number;
    preset?: SpringPresetName;
  } = {}
): CoupledEntranceResult {
  const {
    delay = 0,
    startY = 140,
    startScale = 0.35,
    startRotate = -6,
    preset = "snappy",
  } = options;

  const spr = spring({
    frame: frame - delay,
    fps,
    config: SPRING_PRESETS[preset],
  });

  const scale = interpolate(spr, [0, 1], [startScale, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(spr, [0, 1], [startY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(spr, [0, 1], [startRotate, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { scale, translateY, rotate, opacity };
}

/**
 * 5. Pendulum Oscillations with Damped Gravity Decay
 */
export function pendulumSwing(
  frame: number,
  options: {
    frequency?: number;
    initialAngle?: number;
    damping?: number;
  } = {}
): number {
  const { frequency = 0.08, initialAngle = 25, damping = 0.985 } = options;
  const decay = Math.pow(damping, frame);
  return Math.sin(frame * frequency) * initialAngle * decay;
}
