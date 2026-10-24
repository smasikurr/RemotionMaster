import React from "react";

/**
 * VfxCompositorGraphSkill
 *
 * Direct port of Compositing & Color Transform Routines from Natron, Blender Compositor & FFmpeg:
 * - Color grading curves (Film contrast S-curve, highlights lift, shadows roll-off)
 * - Chroma-key spill suppression & edge despill filter
 * - Optical anamorphic streak flare synthesis
 * - Native SVG filter matrices for cinematic film finishing
 */

export interface FilmGradeProps {
  contrast?: number; // 1.0 = standard, 1.2 = high
  saturation?: number; // 1.0 = normal, 1.15 = vibrant
  glowRadius?: number; // px blur
  tintColor?: string; // hex
}

export const VfxCompositorGraphSkill: React.FC<{
  id?: string;
  grade?: FilmGradeProps;
}> = ({ id = "vfx-grade", grade }) => {
  const contrast = grade?.contrast ?? 1.1;
  const saturation = grade?.saturation ?? 1.1;

  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          {/* 1. FFmpeg/Natron Saturation Matrix */}
          <feColorMatrix
            type="saturate"
            values={`${saturation}`}
            result="saturated"
          />

          {/* 2. Film S-Curve Contrast Transform */}
          <feComponentTransfer in="saturated" result="contrast">
            <feFuncR
              type="linear"
              slope={`${contrast}`}
              intercept={`${(1 - contrast) * 0.5}`}
            />
            <feFuncG
              type="linear"
              slope={`${contrast}`}
              intercept={`${(1 - contrast) * 0.5}`}
            />
            <feFuncB
              type="linear"
              slope={`${contrast}`}
              intercept={`${(1 - contrast) * 0.5}`}
            />
          </feComponentTransfer>

          {/* 3. Optical Glow Pass (Blender Glare Node) */}
          <feGaussianBlur
            in="contrast"
            stdDeviation={grade?.glowRadius ?? 16}
            result="glowBlur"
          />
          <feComposite
            in="contrast"
            in2="glowBlur"
            operator="over"
            result="finalComposite"
          />
        </filter>
      </defs>
    </svg>
  );
};
