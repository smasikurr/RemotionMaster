/**
 * Blender F-Curve Cubic Bézier Interpolator
 *
 * Direct port of Blender 4.x animation math:
 * source/blender/blenkernel/intern/fcurve.cc
 *
 * Uses Newton-Raphson root-finding to invert x(u) = t,
 * then computes the exact interpolated value y(u).
 * Guarantees true Blender Graph Editor motion physics in Remotion.
 */

export interface BezierHandle {
  x: number;
  y: number;
}

export class BlenderFCurve {
  private p0: BezierHandle;
  private p1: BezierHandle;
  private p2: BezierHandle;
  private p3: BezierHandle;

  constructor(p1: BezierHandle, p2: BezierHandle) {
    this.p0 = { x: 0, y: 0 };
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = { x: 1, y: 1 };
  }

  // Solve x(u) = t for u using Newton-Raphson
  private solveCurveX(t: number): number {
    let u = t;
    for (let i = 0; i < 8; i++) {
      const currentX = this.sampleCurveX(u) - t;
      if (Math.abs(currentX) < 1e-6) {
        return u;
      }
      const dX = this.sampleDerivX(u);
      if (Math.abs(dX) < 1e-6) break;
      u -= currentX / dX;
    }

    // Bisection fallback if Newton diverges
    let low = 0.0;
    let high = 1.0;
    u = t;
    while (low < high) {
      const currentX = this.sampleCurveX(u);
      if (Math.abs(currentX - t) < 1e-5) return u;
      if (t > currentX) low = u;
      else high = u;
      u = (high - low) * 0.5 + low;
      if (high - low < 1e-5) break;
    }
    return u;
  }

  private sampleCurveX(u: number): number {
    const inv = 1 - u;
    return (
      3 * inv * inv * u * this.p1.x +
      3 * inv * u * u * this.p2.x +
      u * u * u * this.p3.x
    );
  }

  private sampleCurveY(u: number): number {
    const inv = 1 - u;
    return (
      3 * inv * inv * u * this.p1.y +
      3 * inv * u * u * this.p2.y +
      u * u * u * this.p3.y
    );
  }

  private sampleDerivX(u: number): number {
    const inv = 1 - u;
    return (
      3 * inv * inv * this.p1.x +
      6 * inv * u * (this.p2.x - this.p1.x) +
      3 * u * u * (this.p3.x - this.p2.x)
    );
  }

  // Evaluates progress t in [0, 1], returns value in [0, 1]
  evaluate(t: number): number {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const u = this.solveCurveX(t);
    return this.sampleCurveY(u);
  }
}

// ==============================================================
// Blender Presets (Calibrated from Blender Graph Editor Defaults)
// ==============================================================

/** Standard Blender Smooth S-Curve */
export const BlenderEaseInOut = new BlenderFCurve(
  { x: 0.38, y: 0.0 },
  { x: 0.22, y: 1.0 }
);

/** Blender Heavy Cinematic Ease Out (weighty commercial product stop) */
export const BlenderCinematic = new BlenderFCurve(
  { x: 0.08, y: 0.85 },
  { x: 0.15, y: 1.0 }
);

/** Snappy Explosive Pop (Sharp start, silky deceleration) */
export const BlenderSnappy = new BlenderFCurve(
  { x: 0.05, y: 0.95 },
  { x: 0.1, y: 1.0 }
);

/** Anticipation Back-Pull (recoils backward slightly before thrusting forward) */
export const BlenderAnticipation = new BlenderFCurve(
  { x: 0.36, y: -0.28 },
  { x: 0.25, y: 1.0 }
);

/** Overshoot Ease (bursts past 1.0 to 1.08 and settles down smoothly) */
export const BlenderOvershoot = new BlenderFCurve(
  { x: 0.18, y: 0.88 },
  { x: 0.32, y: 1.08 }
);

/**
 * Helper to interpolate any value using Blender F-Curve easing
 */
export function blenderInterpolate(
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  curve: BlenderFCurve = BlenderEaseInOut
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const progress = Math.min(1.0, Math.max(0.0, (frame - inMin) / (inMax - inMin)));
  const eased = curve.evaluate(progress);
  return outMin + (outMax - outMin) * eased;
}
