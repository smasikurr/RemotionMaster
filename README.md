# 🚀 Remotion Master — All-in-One Autonomous Motion Graphics Engine & Starter Kit

<p align="center">
  <strong>The Ultimate All-in-One Programmatic Video Producer for Remotion, Claude & Antigravity</strong><br>
  <em>Combines 221+ After Effects Scene Primitives, Calibrated Spring Physics, Cinetic Motion Laws, and 4 Pre-installed AI Skills.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Remotion-4.0+-blue?style=for-the-badge&logo=react" alt="Remotion 4.0+" />
  <img src="https://img.shields.io/badge/4K_UHD-60_FPS-critical?style=for-the-badge" alt="4K 60FPS" />
  <img src="https://img.shields.io/badge/AE_Scenes-221+-success?style=for-the-badge" alt="221+ AE Scenes" />
  <img src="https://img.shields.io/badge/AI_Skills-4_Pre--installed-purple?style=for-the-badge&logo=anthropic" alt="4 AI Skills" />
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge" alt="License MIT" />
</p>

---

## 🌟 Overview

**Remotion Master** is the world's most comprehensive, production-ready motion graphics repository and AI video starter kit. It bridges the gap between pure programmatic video code and high-end After Effects motion design.

With **Remotion Master**, you don't start from an empty timeline. You get **221+ ready-to-use After Effects scene primitives**, mathematically calibrated spring physics, 4 pre-installed Claude & Antigravity skills, copy-paste prompts, and 10 pre-built 4K commercial stock footage presets.

---

## ⚡ 4 Pre-Installed AI Skills (`.agents/skills/`)

When you clone this repo, four powerful skills are pre-installed in `.agents/skills/` and automatically discovered by **Claude Code, Claude Desktop, Antigravity, and Cursor**:

| Skill | Folder | Capabilities |
| :--- | :--- | :--- |
| **remotion-master** | [`.agents/skills/remotion-master`](./.agents/skills/remotion-master) | The all-in-one autonomous motion engine combining Cinetic laws, Spring physics, and prompt-to-video pipelines. |
| **remotion-best-practices** | [`.agents/skills/remotion-best-practices`](./.agents/skills/remotion-best-practices) | The official Remotion skill featuring 30+ rules for animations, transitions, 3D Three.js, audio, and captions. |
| **ui-ux-pro-max** | [`.agents/skills/ui-ux-pro-max`](./.agents/skills/ui-ux-pro-max) | 50+ design styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart architectures. |
| **copywriting** | [`.agents/skills/copywriting`](./.agents/skills/copywriting) | Conversion copywriting frameworks, viral hooks, and high-impact micro-copy for promotional motion videos. |

---

## 🎬 221+ After Effects Scene Library (`src/scenes/`)

Every scene is a standalone React component ready to sequence, loop, or composite:

| Category | Scenes | Description & Highlights |
| :--- | :---: | :--- |
| [BackgroundAnimations](./src/scenes/BackgroundAnimations) | 10 | Aurora, Nebula, Cyberpunk Grid, Flowing Gradients, Particle Mesh |
| [LiquidAnimations](./src/scenes/LiquidAnimations) | 10 | Fluid Waves, Metaballs, Ink Splash, Marble Swirls, Paint Drips |
| [ParticleAnimations](./src/scenes/ParticleAnimations) | 10 | Confetti, Cosmic Dust, Galaxy Orbit, Fireworks, Lightning Sparks |
| [CinematicAnimations](./src/scenes/CinematicAnimations) | 10 | Sci-Fi Telemetry, Epic Titles, Light Leaks, Film Burn Overlays |
| [TextAnimations](./src/scenes/TextAnimations) | 12 | Kinetic Typography, Glitch Text, 3D Neon, Typewriter, Mask Reveal |
| [ThemeAnimations](./src/scenes/ThemeAnimations) | 33 | 3D Glass, Art Deco, Cyberpunk, Neobrutalism, Y2K, Bauhaus, Luxury |
| [TransitionAnimations](./src/scenes/TransitionAnimations) | 10 | Liquid Morph, Shutter Wipe, Zoom Blur, Circular Reveal, Glitch Slice |
| [UIAnimations](./src/scenes/UIAnimations) | 10 | Interactive Buttons, Cards, Modals, Dynamic Toasts, Navigation Bars |
| [ShapeAnimations](./src/scenes/ShapeAnimations) | 10 | Mandalas, 3D Cubes, DNA Helix, Hexagonal Tech Grids, Sound Ripples |
| [DataAnimations](./src/scenes/DataAnimations) | 8 | Animated Bar Charts, Line Graphs, Circular Gauges, Financial Cards |
| [EffectAnimations](./src/scenes/EffectAnimations) | 10 | Retro VHS Tracking, Film Grain, Scanlines, Chromatic Aberration |
| [LogoAnimations](./src/scenes/LogoAnimations) | 10 | 3D Logo Spin, Metallic Edge Sweep, Particle Disintegration |
| [RollerAnimations](./src/scenes/RollerAnimations) | 22 | Split-Flap Displays, Slot Machines, 3D Carousels, Digital Countdowns |
| [LayoutAnimations](./src/scenes/LayoutAnimations) | 12 | Asymmetric Split, Picture-in-Picture, Dynamic Multi-Panel Grids |
| [DemoAnimations](./src/scenes/DemoAnimations) | 12 | Realistic Mouse Cursors, Page Scrolling, Interactive App Walkthroughs |
| [ListAnimations](./src/scenes/ListAnimations) | 12 | Staggered Feature Cards, Numbered Roadmaps, Pricing Tables |

---

## 🏎️ Calibrated Spring Physics (`src/physics/springs.ts`)

Never use rigid linear motion. Remotion Master provides 5 mathematically calibrated spring physics presets:

```tsx
import { SPRING_PRESETS } from "./physics/springs";

// 1. Snappy (UI buttons, tags, badges) -> { damping: 20, stiffness: 200, mass: 1 }
// 2. Bouncy (Playful reveals, celebratory tags) -> { damping: 8, stiffness: 100, mass: 1 }
// 3. Smooth (Luxury typography, subtle camera drifts) -> { damping: 200, stiffness: 100, mass: 1 }
// 4. Heavy (3D hardware, heavy doors, stamps) -> { damping: 15, stiffness: 80, mass: 2 }
// 5. Elastic (Cartoon pops, energetic bursts) -> { damping: 6, stiffness: 150, mass: 0.8 }
```

---

## 🎥 10 Pre-Built 4K Commercial Stock Presets (`src/presets/`)

Pre-configured 4K UHD 60FPS compositions ready to render for Adobe Stock, Shutterstock, and Pond5:

1. `CyberpunkSciFiHud4K` — Futuristic telemetry radar & hexadecimal data screens.
2. `LuxuryGoldenParticleWaves4K` — Elegant undulating gold sin-wave ribbons with depth blur.
3. `AnimeEnergyBursts4K` — High-octane Japanese anime speed lines and action bursts.
4. `RetroGlitchCrtVhs4K` — Authentic 80s/90s analog CRT monitor distortion overlay.
5. `FloatingModernLaptop4K` — Photorealistic floating 3D laptop with chroma screen placeholder.
6. `DynamicCircularAudioVisualizer4K` — Reactive 360-degree EDM audio frequency ring.
7. `LiquidInkSpreadLumaMatte4K` — Organic watercolor/ink bloom transition matte.
8. `CorporatePlexusDataNetwork4K` — Connected global nodes & AI neural plexus grid.
9. `MegaSaleBannerConfetti4K` — E-commerce promotional retail banner with confetti physics.
10. `AmbientOpticalLensFlares4K` — Anamorphic cinema light leaks and bokeh streaks.

---

## 📁 Repository Structure

```
RemotionMaster/
├── .agents/
│   └── skills/
│       ├── remotion-master/           # Unified All-in-One Motion Engine Skill
│       ├── remotion-best-practices/   # 30+ Official Remotion Best Practice Rules
│       ├── ui-ux-pro-max/             # 50+ Design Styles & Design Systems
│       └── copywriting/               # Conversion Copywriting Frameworks
├── assets/
│   ├── fonts/                         # Custom web fonts (.woff2, .ttf)
│   ├── images/                        # Backgrounds and texture maps
│   └── logos/                         # Vector brand marks and SVGs
├── src/
│   ├── cinetic/
│   │   └── motionLaws.ts              # 16th-beat timing grids & camera drift laws
│   ├── physics/
│   │   └── springs.ts                 # Calibrated spring physics presets
│   ├── common/
│   │   ├── colors.ts                  # Curated commercial color palettes
│   │   └── fonts.ts                   # Motion typography helpers
│   ├── presets/                       # 10 Pre-configured 4K UHD 60FPS stock compositions
│   ├── scenes/                        # 221+ After Effects scene primitives across 16 categories
│   ├── Root.tsx                       # Master composition registry & folders
│   └── index.ts                       # Remotion entry point
├── PROMPTS.md                         # Copy-paste prompts for Claude, Antigravity & Cursor
├── remotion.config.ts                 # 4K UHD 60FPS broadcast encoding (CRF 17, H.264, 4x)
├── tsconfig.json                      # Strict NodeNext TypeScript configuration
└── package.json                       # Remotion 4+, React 19, Three.js dependencies
```

---

## 🚀 Quick Start (Under 3 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/smasikurr/RemotionMaster.git
cd RemotionMaster
npm install
```

### 2. Launch Live Remotion Studio
```bash
npm run studio
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to visually preview and scrub through all 221+ scenes and 4K presets in real time!

### 3. Render 4K 60FPS Video
```bash
npm run render
# Or render a specific composition:
npx remotion render src/index.ts CyberpunkSciFiHud4K out/cyberpunk_4k.mp4 --codec h264 --crf 17
```

---

## 🤖 Using with Claude & AI Coding Agents

When working with **Claude Desktop, Claude Code, or Antigravity**, you can tell the agent:

```text
Using the remotion-master skill, create a 10-second 4K 60FPS motion graphic video:
- Topic: Luxury Gold Particle Waves
- Style: Cinematic, dark amber background (#0B0804)
- Animation: Undulating sin-wave particle ribbons with bouncy spring text reveal
```

The agent will automatically read `.agents/skills/`, combine components from `src/scenes/`, apply physics from `src/physics/springs.ts`, and render the video!

---

## 🇧🇩 বাংলা নির্দেশিকা (Bangla Quick Guide)

১. **ক্লোন ও সেটআপ:** টার্মিনালে `git clone https://github.com/smasikurr/RemotionMaster.git` দিয়ে ক্লোন করে `npm install` দিন।
২. **লাইভ স্টুডিও দেখা:** `npm run studio` দিলে ব্রাউজারে একটি ফুল ভিজ্যুয়াল প্লেয়ার ওপেন হবে, যেখানে ২২১টিরও বেশি সিন এবং ১০টি 4K প্রিসেট সরাসরি প্লে ও স্ক্রাব করে দেখতে পারবেন।
৩. **4K ভিডিও রেন্ডার:** `npm run render` দিলে যেকোনো কম্পোজিশন সাথে সাথে সর্বোচ্চ কোয়ালিটিতে 4K UHD ৬০FPS MP4 ফাইলে রেন্ডার হবে।
৪. **এআই স্কিলস:** এই প্রজেক্টের `.agents/skills/` ফোল্ডারে ৪টি বিশ্বমানের স্কিল বিল্ট-ইন রয়েছে, তাই ক্লড বা অন্য যেকোনো এআই এজেন্টকে বললেই সে নিজে নিজে মোশন ভিডিওর কোড লিখে রেন্ডার করে দিতে পারবে।

---

## 📄 License
MIT © [Md. Asikur Rahman](https://github.com/smasikurr)
