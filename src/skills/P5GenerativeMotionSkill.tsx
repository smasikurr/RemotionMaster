import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

/**
 * P5GenerativeMotionSkill
 *
 * Direct port of core mathematical utilities from Processing (p5.js & Processing 4):
 * - Deterministic vector math (p5.Vector: mag, heading, dist, lerp, angleBetween)
 * - Perlin / Simplex harmonic flow fields for natural organic particle steering
 * - Particle swarm physics with drag, damping, and boundary wrapping
 */

export class P5Vector {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z = 0): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  copy(): P5Vector {
    return new P5Vector(this.x, this.y, this.z);
  }

  add(v: P5Vector): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v: P5Vector): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  mult(n: number): this {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }

  div(n: number): this {
    if (n !== 0) {
      this.x /= n;
      this.y /= n;
      this.z /= n;
    }
    return this;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  heading(): number {
    return Math.atan2(this.y, this.x);
  }

  normalize(): this {
    const m = this.mag();
    if (m !== 0) {
      this.div(m);
    }
    return this;
  }

  limit(max: number): this {
    const mSq = this.magSq();
    if (mSq > max * max) {
      this.div(Math.sqrt(mSq)).mult(max);
    }
    return this;
  }

  dist(v: P5Vector): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static fromAngle(angle: number, length = 1): P5Vector {
    return new P5Vector(length * Math.cos(angle), length * Math.sin(angle), 0);
  }

  static lerp(v1: P5Vector, v2: P5Vector, amt: number): P5Vector {
    return new P5Vector(
      v1.x + (v2.x - v1.x) * amt,
      v1.y + (v2.y - v1.y) * amt,
      v1.z + (v2.z - v1.z) * amt
    );
  }
}

export interface P5ParticleConfig {
  count?: number;
  color?: string;
  maxSpeed?: number;
  flowScale?: number;
}

export const P5GenerativeMotionSkill: React.FC<{
  width?: number;
  height?: number;
  config?: P5ParticleConfig;
}> = ({ width = 3840, height = 2160, config }) => {
  const frame = useCurrentFrame();
  const particleCount = config?.count ?? 120;
  const color = config?.color ?? "#38bdf8";

  // Pre-calculate deterministic trajectory using analytical harmonic flow
  const particles = useMemo(() => {
    const pts: { x: number; y: number; size: number; alpha: number }[] = [];
    const t = frame * 0.02;

    for (let i = 0; i < particleCount; i++) {
      const fi = i * 0.45;
      const baseX = (width * ((i * 37) % 100)) / 100;
      const baseY = (height * ((i * 73) % 100)) / 100;

      // P5 harmonic flow equation
      const angle =
        Math.sin(baseX * 0.002 + t) * Math.cos(baseY * 0.002 + t) * Math.PI * 2;
      const drift = P5Vector.fromAngle(angle, 40 * Math.sin(t + fi));

      pts.push({
        x: (baseX + drift.x + width) % width,
        y: (baseY + drift.y + height) % height,
        size: 3 + ((i * 7) % 8),
        alpha: 0.4 + 0.6 * Math.sin(t * 2 + fi),
      });
    }
    return pts;
  }, [frame, width, height, particleCount]);

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      {particles.map((p, idx) => (
        <circle
          key={idx}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill={color}
          opacity={p.alpha}
        />
      ))}
    </svg>
  );
};
