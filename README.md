# 🎬 Remotion Master

> **The Ultimate All-in-One Autonomous Motion Graphics Engine & Microstock Production Suite**  
> Powered by [Remotion](https://remotion.dev), React 19, Three.js, Spring Physics, and Cinetic Motion Design Laws.

[![Remotion](https://img.shields.io/badge/Remotion-4.0+-blue.svg)](https://remotion.dev)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Quality](https://img.shields.io/badge/Resolution-4K%20UHD%2060FPS-brightgreen.svg)]()

---

## 🌟 What is Remotion Master?

**Remotion Master** is a unified, production-ready motion graphics repository designed for creators, studios, and AI coding agents. It merges multiple world-class motion graphics repositories and frameworks into a single, cohesive engine:

1. **201+ Production-Ready After Effects Scene Library:**
   - 16 diverse categories: Backgrounds, Liquid Morphing, Particles, Kinetic Typography, Rollers, Transitions, Cyberpunk/Luxury Themes, and UI Interactions.
2. **Organic Spring Physics Engine (`src/physics/`):**
   - Calibrated damping, stiffness, and mass presets (`snappy`, `bouncy`, `smooth`, `heavy`, `elastic`) replacing stiff linear interpolations.
3. **Cinetic Film Motion Laws (`src/cinetic/`):**
   - 60 FPS standard, 16th-note beat-locked timing grids, living camera drift, and professional typography hierarchy.
4. **10 Pre-Configured 4K Stock Footage Presets (`src/presets/`):**
   - Cyberpunk Sci-Fi HUD, 24K Liquid Gold Particle Waves, 2D Hand-drawn Anime Energy, Retro VHS Glitch, 3D Laptop Mockup, Audio Equalizers, and Anamorphic Lens Flares.
5. **Built-in AI Agent Skill (`.agents/skills/remotion-master/`):**
   - Native integration with **Antigravity**, **Claude Code**, Cursor, and agentic workflows for autonomous prompt-to-video production.

---

## 📁 Repository Structure

```
RemotionMaster/
├── .agents/
│   └── skills/
│       └── remotion-master/      # Unified AI Agent Skill Definition
├── src/
│   ├── index.ts                  # Remotion root entry
│   ├── Root.tsx                  # Master Composition & Folder Registry
│   ├── common/                   # Core animation utils, colors, fonts, and easings
│   ├── physics/
│   │   └── springs.ts            # Calibrated Spring Physics Presets
│   ├── cinetic/
│   │   └── motionLaws.ts         # Timing grid math and camera drift utilities
│   ├── presets/                  # 10 Ready-to-Render Commercial 4K Presets
│   │   ├── CyberpunkSciFiHud4K.tsx
│   │   ├── LuxuryGoldenParticleWaves4K.tsx
│   │   ├── AnimeEnergyBursts4K.tsx
│   │   ├── RetroGlitchCrtVhs4K.tsx
│   │   ├── FloatingModernLaptop4K.tsx
│   │   ├── DynamicCircularAudioVisualizer4K.tsx
│   │   ├── LiquidInkSpreadLumaMatte4K.tsx
│   │   ├── CorporatePlexusDataNetwork4K.tsx
│   │   ├── MegaSaleBannerConfetti4K.tsx
│   │   └── AmbientOpticalLensFlares4K.tsx
│   └── scenes/                   # 201+ Production-Ready After Effects Scenes
│       ├── BackgroundAnimations/ (10 scenes)
│       ├── CinematicAnimations/  (10 scenes)
│       ├── DataAnimations/       (8 scenes)
│       ├── DemoAnimations/       (12 scenes)
│       ├── EffectAnimations/     (10 scenes)
│       ├── LayoutAnimations/     (12 scenes)
│       ├── LiquidAnimations/     (10 scenes)
│       ├── ListAnimations/       (12 scenes)
│       ├── LogoAnimations/       (10 scenes)
│       ├── ParticleAnimations/   (10 scenes)
│       ├── RollerAnimations/     (22 scenes)
│       ├── ShapeAnimations/      (10 scenes)
│       ├── TextAnimations/       (12 scenes)
│       ├── ThemeAnimations/      (33 scenes)
│       ├── TransitionAnimations/ (10 scenes)
│       └── UIAnimations/         (10 scenes)
├── remotion.config.ts            # 4K UHD 60FPS Render Optimization & Concurrency
├── tsconfig.json                 # Modern TypeScript Config
├── package.json                  # Clean, up-to-date dependencies
└── README.md
```

---

## ⚡ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/smasikurr/RemotionMaster.git
cd RemotionMaster
npm install
```

### 2. Launch Interactive Remotion Studio
Preview, inspect, and scrub through all compositions in real-time:
```bash
npm run studio
# Or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Render 4K UHD 60FPS Video
Render any composition directly to high-bitrate MP4:
```bash
npx remotion render src/index.ts CyberpunkSciFiHud4K out/cyberpunk_hud_4k.mp4 --codec h264 --crf 17
```

### 4. Capture 4K High-Res Preview Screenshot
```bash
npx remotion still src/index.ts CyberpunkSciFiHud4K out/preview.png --frame 120
```

---

## 🤖 Using with AI Agents (Antigravity / Claude Code)

This repository includes a pre-packaged agent skill. Just instruct your agent:
> *"Using Remotion Master, create a 4K 60FPS seamless liquid gold ribbon wave background with soft bokeh particles."*

Your agent will:
1. Load `remotion-master` skill rules and spring physics.
2. Pick and assemble primitives from `src/scenes/` and `src/physics/`.
3. Auto-compile, test for zero TypeScript errors, and render high-converting video footage with 35+ SEO tags.

---

## 🛡️ Microstock Commercial Compliance
All presets and compositions in this repository are strictly designed for **Adobe Stock**, **Shutterstock**, and **Pond5**:
- **100% IP & Trademark Free:** Zero brand logos, unbranded hardware mockups, custom math shaders.
- **Pure Blend Modes:** Rendered on solid Black (`#000000`) for `Screen`/`Add` overlays or solid Chroma Green (`#00FF00`) for 1-click keying.
- **Mathematical Seamless Loops:** Mathematically closed periods ensure zero jump-cuts or pops.

---

## 👤 Author & Repository
- **Author:** [Md. Asikur Rahman](https://github.com/smasikurr)
- **Repository:** [https://github.com/smasikurr/RemotionMaster.git](https://github.com/smasikurr/RemotionMaster.git)
- **License:** MIT License
