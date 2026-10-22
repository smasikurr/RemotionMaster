---
name: remotion-master
description: The ultimate all-in-one autonomous Remotion motion graphics engine, 4K video producer, and component suite. Combines 201+ After Effects-style scene primitives, Cinetic cinematic motion laws, Remotion official APIs, Spring physics presets, and automated prompt-to-video production workflows for Adobe Stock, Shutterstock, social media, and SaaS promo films.
version: 1.0.0
author: Md. Asikur Rahman <https://github.com/smasikurr/RemotionMaster>
---

# Remotion Master (The Unified All-in-One Motion Engine)

`Remotion Master` is the comprehensive, unified production framework combining the best of Remotion 4+, After Effects motion primitives, Cinetic motion laws, and autonomous prompt-to-video pipelines.

---

## 🏛️ Core Architectural Pillars

### 1. Remotion Core & Mathematical Determinism
- **Frame-Driven Rendering:** Everything is a pure mathematical function of `useCurrentFrame()` and `useVideoConfig()`.
- **Absolute 60 FPS Standard:** Ensures buttery-smooth motion with zero micro-stutters or frame skips.
- **Seamless Mathematical Loops:** Looping animations use modular trigonometric functions ($t \in [0, 2\pi]$) or modulo periods ($frame \pmod{period}$) so frame 0 matches frame $N$ seamlessly without pop.

### 2. Spring Physics (Prefer `spring()` over `interpolate()`)
- Never use rigid linear interpolation for UI or organic elements.
- Available Spring Presets in `src/physics/springs.ts`:
  - `snappy`: `{ damping: 20, stiffness: 200, mass: 1 }` (Snappy UI cards, buttons, badges)
  - `bouncy`: `{ damping: 8, stiffness: 100, mass: 1 }` (Playful reveals, celebratory elements)
  - `smooth`: `{ damping: 200, stiffness: 100, mass: 1 }` (Luxury typography, subtle camera drifts)
  - `heavy`: `{ damping: 15, stiffness: 80, mass: 2 }` (Heavy objects, 3D hardware)
  - `elastic`: `{ damping: 6, stiffness: 150, mass: 0.8 }` (Comic/cartoon bursts)

### 3. Cinetic Film Direction & Motion Laws
- **One Primary Focal Point:** In every shot, one hero element commands attention.
- **Beat-Locked Timing Grid:** All cuts, reveals, and motion peaks sit on 16th-note subdivisions derived from the timeline BPM.
- **Restraint Over Decoration:** Eliminate clutter. No generic floating icons, sparkles without meaning, or unmotivated elements.
- **Living Camera Drift:** Slow, imperceptible camera motion (0.3 to 1.5 px/f) keeps holds feeling organic.

### 4. 201+ Production-Ready After Effects Scene Library (`src/scenes/`)
Directly importable scene components across 16 categories:
1. `BackgroundAnimations` (10 scenes: Aurora, Bokeh, FlowingGradient, Grid, Waves, Mesh...)
2. `CinematicAnimations` (10 scenes: SciFi, Epic, Noir, Anime, Vintage, Action...)
3. `DataAnimations` (8 scenes: BarChart, LineChart, Gauge, StatsCards, Timeline...)
4. `DemoAnimations` (12 scenes: CursorClick, SearchFilter, ZoomFocus, PageTransition...)
5. `EffectAnimations` (10 scenes: VHS, FilmGrain, LightLeak, Glow, Matrix, Chromatic...)
6. `LayoutAnimations` (12 scenes: SplitContrast, FrameInFrame, OffGrid...)
7. `LiquidAnimations` (10 scenes: CalligraphyInk, FluidWave, InkSplash, PaintDrip...)
8. `ListAnimations` (12 scenes: Staggered, HeroWithList, NumberedVertical...)
9. `LogoAnimations` (10 scenes: 3DRotate, Glitch, LightTrail, MaskReveal...)
10. `ParticleAnimations` (10 scenes: Fireworks, Lightning, Sparks, Smoke, Snow, Confetti...)
11. `RollerAnimations` (22 scenes: SplitFlap, SlotMachine, 3DCarousel, Countdown...)
12. `ShapeAnimations` (10 scenes: 3DCube, Mandala, Helix, HexGrid, Ripples...)
13. `TextAnimations` (12 scenes: Kinetic, Glitch, Neon, Typewriter, MaskReveal...)
14. `ThemeAnimations` (33 aesthetic styles: Cyberpunk, Luxury, Neobrutalism, Y2K, Bauhaus...)
15. `TransitionAnimations` (10 scenes: LiquidMorph, ZoomBlur, CircleWipe, LineSweep...)
16. `UIAnimations` (10 scenes: Button, Card, Dropdown, Modal, Navigation, Toggle...)

---

## 🚀 Autonomous Production Workflow (4 Steps)

Whenever instructed to create, research, or produce stock motion graphics:

### Step 1: Market Research & Visual Anatomy
- Identify trending, high-demand topics on Adobe Stock, Shutterstock, or social feeds.
- Define the **Visual Anatomy**, **Color Palette (Hex)**, **Blend Mode / Keying Screen**, and **Target Buyer Use Case**.

### Step 2: Composition Scripting & Architecture
- Choose or combine primitives from `src/scenes/` and `src/presets/`.
- Ensure platform compliance:
  - 100% trademark-free (zero brand logos, generic UI icons).
  - 4K UHD (3840×2160) @ 60 FPS standard (or 1080p / 9:16 vertical when requested).
  - Pure black (`#000000`) for `Screen`/`Add` blend modes or pure chroma green (`#00FF00`) for keying.

### Step 3: Compilation & Autonomous Validation
- Register the composition in `src/Root.tsx`.
- Test bundle using `npx remotion compositions src/index.ts`.
- If any TypeScript error occurs, read the log and auto-fix immediately.

### Step 4: Deterministic Rendering & Delivery
- Render using:
  ```bash
  npx remotion render src/index.ts <CompositionId> out/<filename>.mp4 --codec h264 --crf 17 --concurrency 4
  ```
- Generate 35+ high-performing commercial SEO tags, titles, and descriptions.

---

## 🛠️ CLI Quick Reference

```bash
# Start Interactive Studio
npm run studio

# Render a specific composition to 4K MP4
npx remotion render src/index.ts <CompositionName> out/video.mp4 --crf 17

# Render a high-resolution preview screenshot
npx remotion still src/index.ts <CompositionName> out/preview.png --frame 120

# Check TypeScript integrity
npm run check
```
