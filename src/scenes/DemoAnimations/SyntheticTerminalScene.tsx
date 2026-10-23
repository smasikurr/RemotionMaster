import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type TerminalStep =
  | { kind: "cmd"; text: string; typeSpeed?: number; holdSeconds?: number }
  | { kind: "out"; text: string; color?: string; holdSeconds?: number }
  | { kind: "pause"; seconds: number }
  | { kind: "pill"; text: string; color?: string; durationSeconds?: number };

export interface SyntheticTerminalSceneProps {
  title?: string;
  steps?: TerminalStep[];
  prompt?: string;
  accentColor?: string;
  backgroundColor?: string;
}

interface RenderedLine {
  text: string;
  isCmd: boolean;
  color?: string;
  startFrame: number;
  endFrame: number;
}

interface RenderedPill {
  text: string;
  color: string;
  startFrame: number;
  endFrame: number;
}

const DEFAULT_STEPS: TerminalStep[] = [
  { kind: "cmd", text: "git clone https://github.com/smasikurr/RemotionMaster.git" },
  { kind: "out", text: "Cloning into 'RemotionMaster'...", color: "#94A3B8" },
  { kind: "out", text: "remote: Enumerating objects: 221, done.", color: "#64748B" },
  { kind: "out", text: "remote: Compressing objects: 100% (180/180), done.", color: "#64748B" },
  { kind: "pill", text: "Repository Verified", color: "#10B981" },
  { kind: "cmd", text: "npm install && npm run studio" },
  { kind: "out", text: "✓ 221+ After Effects Scenes compiled", color: "#38BDF8" },
  { kind: "out", text: "✓ 13 AI Video Skills loaded", color: "#A855F7" },
  { kind: "out", text: "✓ 4K UHD 60FPS Broadcaster ready on http://localhost:3000", color: "#4ADE80" },
  { kind: "pill", text: "Production Ready 🚀", color: "#F59E0B" },
];

export const SyntheticTerminalScene: React.FC<SyntheticTerminalSceneProps> = ({
  title = "Remotion Master — Developer Console",
  steps = DEFAULT_STEPS,
  prompt = "$",
  accentColor = "#00F0FF",
  backgroundColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines: RenderedLine[] = [];
  const pills: RenderedPill[] = [];
  let cursorFrame = 10;

  for (const step of steps) {
    if (step.kind === "cmd") {
      const speed = step.typeSpeed ?? 0.035;
      const typeFrames = Math.ceil(step.text.length * speed * fps);
      const hold = Math.ceil((step.holdSeconds ?? 0.4) * fps);
      lines.push({
        text: step.text,
        isCmd: true,
        startFrame: cursorFrame,
        endFrame: cursorFrame + typeFrames,
      });
      cursorFrame += typeFrames + hold;
    } else if (step.kind === "out") {
      const revealFrames = Math.max(2, Math.ceil(0.08 * fps));
      const hold = Math.ceil((step.holdSeconds ?? 0.2) * fps);
      lines.push({
        text: step.text,
        isCmd: false,
        color: step.color,
        startFrame: cursorFrame,
        endFrame: cursorFrame + revealFrames,
      });
      cursorFrame += revealFrames + hold;
    } else if (step.kind === "pause") {
      cursorFrame += Math.ceil(step.seconds * fps);
    } else if (step.kind === "pill") {
      const dur = Math.ceil((step.durationSeconds ?? 2.5) * fps);
      pills.push({
        text: step.text,
        color: step.color ?? accentColor,
        startFrame: cursorFrame,
        endFrame: cursorFrame + dur,
      });
    }
  }

  const visibleLines = lines.filter((l) => frame >= l.startFrame);
  const MAX_VISIBLE = 16;
  const scrollStart = Math.max(0, visibleLines.length - MAX_VISIBLE);
  const renderedLines = visibleLines.slice(scrollStart);

  const blinkPhase = Math.floor(frame / (fps * 0.4)) % 2 === 0;

  const windowScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 1 },
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
      {/* Terminal Window Card */}
      <div
        style={{
          width: "82%",
          maxWidth: 1680,
          height: "78%",
          opacity: interpolate(windowScale, [0, 1], [0, 1]),
          transform: `scale(${interpolate(windowScale, [0, 1], [0.94, 1])})`,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 40px 140px rgba(0,0,0,0.8), 0 0 40px rgba(0, 240, 255, 0.15)",
          background: "#0D111A",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "18px 24px",
            background: "#161B26",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF5F56" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#27C93F" }} />
          </div>

          <span
            style={{
              marginLeft: 14,
              fontSize: 16,
              fontWeight: 600,
              color: "#94A3B8",
              letterSpacing: "0.03em",
            }}
          >
            {title}
          </span>

          {/* Active Pills */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            {pills
              .filter((p) => frame >= p.startFrame && frame <= p.endFrame)
              .map((pill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: `${pill.color}22`,
                    color: pill.color,
                    border: `1px solid ${pill.color}66`,
                    boxShadow: `0 0 12px ${pill.color}44`,
                  }}
                >
                  {pill.text}
                </span>
              ))}
          </div>
        </div>

        {/* Console Body */}
        <div
          style={{
            flex: 1,
            padding: "28px 36px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 22,
            lineHeight: 1.6,
          }}
        >
          {renderedLines.map((line, idx) => {
            const isCurrentlyTyping = frame < line.endFrame;
            let displayText = line.text;

            if (line.isCmd && isCurrentlyTyping) {
              const progress = Math.min(
                1,
                Math.max(0, (frame - line.startFrame) / Math.max(1, line.endFrame - line.startFrame))
              );
              const charCount = Math.floor(progress * line.text.length);
              displayText = line.text.slice(0, charCount);
            }

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  color: line.color ?? (line.isCmd ? "#F8FAFC" : "#CBD5E1"),
                }}
              >
                {line.isCmd ? (
                  <span style={{ color: accentColor, fontWeight: 700 }}>{prompt}</span>
                ) : (
                  <span style={{ opacity: 0.35 }}>↳</span>
                )}
                <span>{displayText}</span>
                {line.isCmd && isCurrentlyTyping && blinkPhase && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 22,
                      background: accentColor,
                      marginLeft: 2,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
