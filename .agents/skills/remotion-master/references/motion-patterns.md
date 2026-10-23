# Remotion Master — Motion Patterns & Component Library

Tested, high-performance implementations calibrated for 4K UHD 60FPS commercial motion design.
Import `theme` from `theme.ts` or `src/common/colors.ts`.

---

## 1. Premium Entrance (Fade + TranslateY + Scale)
Never animate a single property. Combine 3 properties with spring physics:
```tsx
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Entrance: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 120, mass: 1 },
  });

  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
      }}
    >
      {children}
    </div>
  );
};
```

---

## 2. Phase-Shifted Wave-Jumping Typography
Each character reacts individually along a mathematical sine wave:
```tsx
const letters = "BLACK".split("");
const speed = 0.085;

letters.map((char, i) => {
  const wavePhase = frame * speed - i * 0.65;
  const bounceY = Math.sin(wavePhase) * 26;
  const squashStretch = Math.cos(wavePhase) * 0.08;
  const tiltDeg = Math.cos(wavePhase) * 3.2;

  return (
    <div
      key={i}
      style={{
        transform: `translateY(${bounceY}px) rotate(${tiltDeg}deg) scale(${1 - squashStretch * 0.6}, ${1 + squashStretch})`,
      }}
    >
      {char}
    </div>
  );
});
```

---

## 3. Pendulum Physics for Hanging Badges & Tags
Exact harmonic pendulum equation with centrifugal orientation:
```tsx
const period = 200; // Exact 3.33s cycle (3 full cycles in 600 frames for seamless loop)
const swingPhase = (frame / period) * Math.PI * 2;
const maxAngleDeg = 15;
const angleDeg = Math.sin(swingPhase) * maxAngleDeg;
const angleRad = (angleDeg * Math.PI) / 180;

const cordLength = 540;
const badgeX = pivotX + cordLength * Math.sin(angleRad);
const badgeY = pivotY + cordLength * Math.cos(angleRad);

// Badge rotation matches string pull angle:
// transform: translate(${badgeX}px, ${badgeY}px) rotate(${angleDeg}deg)
```

---

## 4. Seamless Mathematical Looping
For stock footage loops, use trigonometric modulo periods:
```tsx
const loopFrames = 600; // 10s @ 60 FPS
const progress = (frame % loopFrames) / loopFrames;
const cycle = progress * Math.PI * 2;

// Value at frame 0 exactly equals value at frame 600:
const pulse = Math.sin(cycle);
const rotation = progress * 360;
```

---

## 5. Idle Breathing (Living Motion)
Any hero element visible >2s must breathe to prevent static death:
```tsx
const breathing = Math.sin(frame * 0.05) * 6; // ±6px subtle vertical drift
const scalePulse = 1 + Math.sin(frame * 0.06) * 0.015; // ±1.5% micro scale
```

---

## 6. Procedural Film Grain & Noise (Zero External Asset)
Adds tactile cinema texture to 4K renders:
```tsx
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const shiftX = (frame * 17) % 40;
  const shiftY = (frame * 23) % 40;

  return (
    <div
      style={{
        position: "absolute",
        inset: -40,
        opacity,
        pointerEvents: "none",
        backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)`,
        backgroundSize: "6px 6px",
        transform: `translate(${shiftX}px, ${shiftY}px)`,
        mixBlendMode: "overlay",
      }}
    />
  );
};
```


---

## 7. Synthetic Terminal Animation (OpenMontage Pattern)
Simulate command execution with character typing, status pills, and macOS top bar without screen recording:
```tsx
import { SyntheticTerminalScene } from "../src/scenes/DemoAnimations/SyntheticTerminalScene";

<SyntheticTerminalScene
  title="Autonomous Production Studio"
  steps={[
    { kind: "cmd", text: "npm install && npm run studio" },
    { kind: "out", text: "✓ 221+ AE Scenes Compiled", color: "#38BDF8" },
    { kind: "pill", text: "Verified 🚀", color: "#10B981" },
  ]}
  backgroundColor="#000000"
/>
```

---

## 8. Mathematical Coordinate Plane (Manim Pattern)
Animate coordinate axes and parametric damped oscillator curves:
```tsx
import { MathCoordinatePlane } from "../src/scenes/ShapeAnimations/MathCoordinatePlane";

<MathCoordinatePlane
  functionTitle="f(x) = 2.4 · sin(2π · t + φ) · e^(-0.15t)"
  curveColor="#00F0FF"
  backgroundColor="#000000"
/>
```

---

## 9. Code Syntax Morpher (Motion Canvas Pattern)
Syntax highlighted code animation with line-by-line staggered spring reveal and active tokens:
```tsx
import { CodeSyntaxMorpher } from "../src/scenes/TextAnimations/CodeSyntaxMorpher";

<CodeSyntaxMorpher
  filename="MasterVideoEngine.tsx"
  language="TypeScript"
  backgroundColor="#000000"
/>
```

---

## 10. GSAP Custom Wiggle & Bounce Physics (GreenSock Pattern)
High-precision kinetic wiggles, camera shakes, and decayed gravitational bounce:
```tsx
import { customWiggle, customBounce, GSAP_EASINGS } from "../src/physics/gsapPhysics";

// Organic camera jitter or hit reaction
const shakeX = customWiggle({ frame, fps: 60, durationInSeconds: 0.8, amplitude: 14 });

// Gravitational bounce progress (0 to 1)
const bounceY = customBounce({ progress: frame / 60, bounces: 3 });
```
