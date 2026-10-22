import { Easing } from "remotion";

/**
 * Remotion Master - Core Theme Specification
 * Single source of truth for colors, spring physics, easings, and typography.
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

  // Calibrated Spring Physics Presets
  spring: {
    snappy: { damping: 20, stiffness: 200, mass: 1 },
    bouncy: { damping: 8, stiffness: 100, mass: 1 },
    smooth: { damping: 200, stiffness: 100, mass: 1 },
    heavy: { damping: 15, stiffness: 80, mass: 2 },
    elastic: { damping: 6, stiffness: 150, mass: 0.8 },
  },

  // Easing Curves (Always clamp both sides)
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    anticipate: Easing.bezier(0.36, 0, 0.66, -0.56),
    overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
  },

  // Typography Pairings
  fonts: {
    slab: "'Rockwell', 'Playfair Display', 'Georgia', serif",
    script: "'Pacifico', 'Brush Script MT', 'Dancing Script', cursive",
    sans: "'Montserrat', 'Inter', 'Helvetica Neue', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
} as const;
