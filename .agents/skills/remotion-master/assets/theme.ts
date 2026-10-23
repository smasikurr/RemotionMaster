import { Easing } from "remotion";

/**
 * Remotion Master - Core Theme Specification
 * Single source of truth for colors, spring physics, easings, styles, and typography.
 * Synthesizing 221+ AE Scenes, OpenMontage Playbooks, Motion Canvas vectors, and GSAP curves.
 */
export const theme = {
  // Commercial Color Palettes
  colors: {
    // Luxury Gold
    gold: {
      primary: "#FFD700",
      secondary: "#F5B041",
      accent: "#FFF275",
      dark: "#0B0804",
    },
    // Cyberpunk Neon
    cyberpunk: {
      cyan: "#00F0FF",
      magenta: "#FF007F",
      blue: "#0066FF",
      yellow: "#FFE600",
      dark: "#05050A",
    },
    // Commercial Sale / Retail
    sale: {
      red: "#E3062A",
      deepRed: "#B3021C",
      white: "#FFFFFF",
      dark: "#111111",
      chromaGreen: "#00FF00",
    },
    // Neutral Base
    pureBlack: "#000000",
    chromaGreen: "#00FF00",
  },

  // OpenMontage Style Profiles (Aesthetic Playbooks)
  styles: {
    premiumMinimalist: {
      background: "#F9FAFB",
      text: "#111827",
      muted: "#6B7280",
      accent: "#2563EB",
      fontHead: "'Inter', sans-serif",
      pace: "deliberate",
    },
    cleanProfessional: {
      background: "#0A0F1D",
      text: "#FFFFFF",
      muted: "#94A3B8",
      accent: "#38BDF8",
      fontHead: "'Montserrat', sans-serif",
      pace: "dynamic",
    },
    flatMotion: {
      background: "#FFFDF7",
      text: "#1E293B",
      muted: "#64748B",
      accent: "#F43F5E",
      fontHead: "'Poppins', sans-serif",
      pace: "snappy",
    },
    animeGhibli: {
      background: "#1C1917",
      text: "#FEF3C7",
      muted: "#D97706",
      accent: "#F59E0B",
      fontHead: "'Cinzel', serif",
      pace: "cinematic",
    },
  },

  // Calibrated Spring Physics Presets
  spring: {
    snappy: { damping: 20, stiffness: 200, mass: 1 },
    bouncy: { damping: 8, stiffness: 100, mass: 1 },
    smooth: { damping: 200, stiffness: 100, mass: 1 },
    heavy: { damping: 15, stiffness: 80, mass: 2 },
    elastic: { damping: 6, stiffness: 150, mass: 0.8 },
  },

  // GSAP-Calibrated Easing Curves
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    anticipate: Easing.bezier(0.36, 0, 0.66, -0.56),
    overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
    power2Out: Easing.bezier(0.215, 0.61, 0.355, 1),
    power3Out: Easing.bezier(0.165, 0.84, 0.44, 1),
    power4Out: Easing.bezier(0.23, 1, 0.32, 1),
    backOut: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  },

  // Typography Pairings
  fonts: {
    slab: "'Rockwell', 'Playfair Display', 'Georgia', serif",
    script: "'Pacifico', 'Brush Script MT', 'Dancing Script', cursive",
    sans: "'Montserrat', 'Inter', 'Helvetica Neue', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
} as const;
