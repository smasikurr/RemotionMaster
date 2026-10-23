import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CodeSyntaxMorpherProps {
  language?: string;
  filename?: string;
  backgroundColor?: string;
}

interface CodeLine {
  number: number;
  tokens: { text: string; color: string; bold?: boolean }[];
}

const SAMPLE_CODE: CodeLine[] = [
  {
    number: 1,
    tokens: [
      { text: "import", color: "#C084FC", bold: true },
      { text: " { ", color: "#94A3B8" },
      { text: "spring", color: "#38BDF8" },
      { text: ", ", color: "#94A3B8" },
      { text: "interpolate", color: "#38BDF8" },
      { text: " } ", color: "#94A3B8" },
      { text: "from", color: "#C084FC", bold: true },
      { text: ' "remotion"', color: "#4ADE80" },
      { text: ";", color: "#94A3B8" },
    ],
  },
  {
    number: 2,
    tokens: [
      { text: "import", color: "#C084FC", bold: true },
      { text: " { ", color: "#94A3B8" },
      { text: "GSAP_EASINGS", color: "#F59E0B" },
      { text: " } ", color: "#94A3B8" },
      { text: "from", color: "#C084FC", bold: true },
      { text: ' "./physics/gsapPhysics"', color: "#4ADE80" },
      { text: ";", color: "#94A3B8" },
    ],
  },
  {
    number: 3,
    tokens: [],
  },
  {
    number: 4,
    tokens: [
      { text: "export", color: "#C084FC", bold: true },
      { text: " const ", color: "#38BDF8", bold: true },
      { text: "KineticHero", color: "#FCD34D" },
      { text: " = () => {", color: "#94A3B8" },
    ],
  },
  {
    number: 5,
    tokens: [
      { text: "  const ", color: "#38BDF8" },
      { text: "progress", color: "#E2E8F0" },
      { text: " = ", color: "#94A3B8" },
      { text: "spring", color: "#38BDF8" },
      { text: "({ ", color: "#94A3B8" },
      { text: "damping", color: "#F472B6" },
      { text: ": ", color: "#94A3B8" },
      { text: "12", color: "#FB923C" },
      { text: ", ", color: "#94A3B8" },
      { text: "stiffness", color: "#F472B6" },
      { text: ": ", color: "#94A3B8" },
      { text: "120", color: "#FB923C" },
      { text: " });", color: "#94A3B8" },
    ],
  },
  {
    number: 6,
    tokens: [
      { text: "  return ", color: "#C084FC", bold: true },
      { text: "(", color: "#94A3B8" },
      { text: "<", color: "#38BDF8" },
      { text: "MotionCanvas", color: "#4ADE80", bold: true },
      { text: " scale", color: "#F472B6" },
      { text: "={", color: "#94A3B8" },
      { text: "progress", color: "#E2E8F0" },
      { text: "} />", color: "#38BDF8" },
      { text: ");", color: "#94A3B8" },
    ],
  },
  {
    number: 7,
    tokens: [
      { text: "};", color: "#94A3B8" },
    ],
  },
];

export const CodeSyntaxMorpher: React.FC<CodeSyntaxMorpherProps> = ({
  language = "TypeScript",
  filename = "MasterCinematic.tsx",
  backgroundColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      }}
    >
      <div
        style={{
          width: "75%",
          maxWidth: 1400,
          background: "#090D16",
          borderRadius: 20,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 30px 100px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.15)",
          overflow: "hidden",
          opacity: cardScale,
          transform: `scale(${interpolate(cardScale, [0, 1], [0.93, 1])})`,
        }}
      >
        {/* Editor Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
            background: "#111827",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          </div>

          <div
            style={{
              marginLeft: 12,
              padding: "4px 14px",
              background: "#1F2937",
              borderRadius: 8,
              fontSize: 14,
              color: "#E2E8F0",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#38BDF8" }}>⚛</span> {filename}
          </div>

          <span style={{ marginLeft: "auto", fontSize: 13, color: "#64748B", fontWeight: 700 }}>
            {language}
          </span>
        </div>

        {/* Code Content */}
        <div style={{ padding: "30px 36px", display: "flex", flexDirection: "column", gap: 10 }}>
          {SAMPLE_CODE.map((line, idx) => {
            const lineSpring = spring({
              frame: frame - idx * 6,
              fps,
              config: { damping: 16, stiffness: 140 },
            });

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  fontSize: 22,
                  lineHeight: 1.5,
                  opacity: interpolate(lineSpring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(lineSpring, [0, 1], [-20, 0])}px)`,
                }}
              >
                {/* Line Number */}
                <span
                  style={{
                    width: 30,
                    textAlign: "right",
                    color: "#475569",
                    fontSize: 18,
                    userSelect: "none",
                  }}
                >
                  {line.number}
                </span>

                {/* Tokens */}
                <div>
                  {line.tokens.map((tok, ti) => (
                    <span
                      key={ti}
                      style={{
                        color: tok.color,
                        fontWeight: tok.bold ? 700 : 400,
                      }}
                    >
                      {tok.text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
