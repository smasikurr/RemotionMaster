---
name: remotion-master
description: Create and edit professional motion graphics videos, 4K commercial stock footage, and promotional animations with Remotion. Use this skill EVERY time the user wants to create a video, animate something, render 4K motion graphics, build an e-commerce sale tag, Cyberpunk HUD, particle wave, logo reveal, or mentions Remotion, After Effects animation, stock video rendering, or "make this video look professional/commercial grade". Combines 221+ After Effects scene primitives, calibrated spring physics, and autonomous verification loops. Always read this skill BEFORE writing any Remotion code.
---

# Remotion Master (Autonomous Motion Graphics Engine)

Remotion renders React components frame-by-frame into broadcast-quality video. Code quality is not the bottleneck — **motion design craft, spring physics, and visual Polish are**. 
Untrained generation produces linear easing, opacity-only fades, simultaneous entrances, flat colors, and static holds. That is the "generic AI video" look. This skill exists to ensure every output looks like an elite After Effects commercial template.

---

## 🏛️ 10 Non-Negotiable Rules (Apply to EVERY Composition)

1. **NEVER use linear interpolation.** Every `interpolate()` gets an easing curve; every entrance prefers calibrated `spring()`. Always set `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }`.
2. **Entrances animate 2–3 properties together** (`opacity` + `translateY` + `scale`). A lone fade is strictly forbidden.
3. **Stagger everything.** Lists, characters, rays, particles: 2–5 frame offsets. Nothing enters simultaneously.
4. **Exits exist and are faster than entrances** (~10 frames vs ~25 frames).
5. **Idle elements must breathe**: anything on screen >2 seconds gets subtle trigonometric sine-wave micro-motion (`Math.sin(frame * 0.05) * 6`).
6. **Calibrated Spring Physics**: Use the 5 calibrated spring presets (`snappy`, `bouncy`, `smooth`, `heavy`, `elastic`) from `src/physics/springs.ts` or `assets/theme.ts`.
7. **Clean Microstock Screen Backgrounds**:
   - For alpha keying: Pure solid Chroma Key Green (`#00FF00`) with zero gradient.
   - For Screen/Add overlay: Pure solid Black (`#000000`).
8. **Mathematical Seamless Loops**: Stock loops must satisfy $frame_0 == frame_{end}$ through modulo trigonometry ($2\pi \cdot frame / period$).
9. **Single Theme Object**: Always import or declare colors, spring configs, and font families at the top of the file. Never inline arbitrary hex codes across components.
10. **Render, Extract Frames, LOOK at them, Fix, Deliver**: Never deliver an unverified render. Extract keyframes with `npx remotion still` and visually inspect before delivering.

---

## 🚀 5-Step Autonomous Workflow

### Step 1 — Scope & Anatomy
Determine:
- **Resolution & FPS**: Default to **4K UHD (3840×2160) @ 60 FPS** for commercial stock footage.
- **Duration**: 10.00 seconds (600 frames @ 60 FPS) standard seamless loop.
- **Background Mode**: Chroma Green `#00FF00` or Pure Black `#000000`.
- **Focal Hero Element**: Define the primary focal point (e.g., Hanging Price Tag, 3D Typography, HUD Reticle).

### Step 2 — Theme & Setup
Reference `assets/theme.ts` for calibrated spring physics and color palettes:
- `theme.spring.snappy` (Cards, buttons, tags)
- `theme.spring.bouncy` (Playful reveals, celebratory elements)
- `theme.spring.smooth` (Luxury titles, smooth drifts)
- `theme.spring.elastic` (Cartoon bursts)

### Step 3 — Build with 221+ Scene Primitives
Read `references/motion-patterns.md` and browse `src/scenes/` for reusable components across 16 categories:
- Backgrounds: Aurora, Nebula, Cyberpunk Grid
- Liquid: Fluid Waves, Metaballs, Ink Splash
- Particles: Confetti, Cosmic Dust, Galaxy Orbit
- Typography: Wave-Jumping Letters, Kinetic Glitch, Neon Glow
- Transitions: Liquid Morph, Shutter Wipe, Zoom Blur

Scene rhythm: **HIT** (fast spring entrance in first 15 frames) ➔ **HOLD & BREATHE** (living idle wave) ➔ **LOOP**.

### Step 4 — Autonomous Verification (MANDATORY)
Before delivering, extract key frames at 10%, 25%, and 50% of the timeline to visually inspect geometry, contrast, and alignment:
```bash
npx remotion still src/index.ts <CompositionId> out/check_frame.png --frame 80 --overwrite
```
Checklist:
- [ ] Is content strictly centered and within safe margins?
- [ ] Is the green screen background pure `#00FF00` with zero bleed?
- [ ] Are typography elements crisp, high-contrast, and readable?
- [ ] Do swinging elements follow authentic pendulum trigonometry?

### Step 5 — 4K Broadcast Render
Render with visually lossless CRF 17 using 4x concurrency:
```bash
npx remotion render src/index.ts <CompositionId> out/video_4k.mp4 --codec h264 --crf 17 --concurrency 4
```

---

## 🛠️ Common Pitfalls & How to Avoid Them

1. **Missing Clamp**: Omitting `{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }` causes elements to fly off into infinity before frame 0.
2. **Local Coordinate Clip-Path Bug**: When applying `<clipPath>` to a translated `<g>` element in SVG, coordinate origins shift to `(0, 0)` of the group. Always use relative coordinates inside `<clipPath>`.
3. **Hard-coded Frame Numbers**: Always derive timing from `useVideoConfig().fps`.
4. **Linear Sliders**: Replace linear value shifts with damped spring physics for realistic organic inertia.
