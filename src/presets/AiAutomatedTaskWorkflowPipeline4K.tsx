import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const AiAutomatedTaskWorkflowPipeline4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4 Execution Pipeline Tasks
  const tasks = [
    {
      id: 1,
      title: "PROMPT INGESTION & INTENT",
      desc: "Deconstruct natural language query & route",
      tag: "STEP 01",
      startFrame: 20,
      completeFrame: 120,
      color: "#00E5FF",
    },
    {
      id: 2,
      title: "RAG VECTOR RETRIEVAL",
      desc: "Query high-dimensional semantic index",
      tag: "STEP 02",
      startFrame: 100,
      completeFrame: 220,
      color: "#2979FF",
    },
    {
      id: 3,
      title: "TOOL & API EXECUTION",
      desc: "Run background scripts & web synthesis",
      tag: "STEP 03",
      startFrame: 200,
      completeFrame: 340,
      color: "#7C4DFF",
    },
    {
      id: 4,
      title: "ARTIFACT VERIFICATION",
      desc: "Compile compliant 4K deliverable package",
      tag: "STEP 04",
      startFrame: 320,
      completeFrame: 460,
      color: "#00E676",
    },
  ];

  // Pipeline Spline Connection Progress (Frames 30 to 360)
  const pipeProgress = interpolate(frame, [30, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Moving energy pulse on the horizontal pipeline spine
  const pulseX = interpolate(frame % 120, [0, 120], [600, 3240]);

  // Idle floating breathing
  const idleHover = Math.sin(frame * 0.08) * 8;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000", // Pure solid black base, zero gradient
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: masterFade,
        fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="taskGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Subtle Tech Grid */}
        <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`ag-h-${i}`} x1="0" y1={i * 120} x2={width} y2={i * 120} strokeDasharray="4 20" />
          ))}
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={`ag-v-${i}`} x1={i * 120} y1="0" x2={i * 120} y2={height} strokeDasharray="4 20" />
          ))}
        </g>

        {/* Pipeline Backbone Bus Line */}
        <line
          x1="500"
          y1="1080"
          x2="3340"
          y2="1080"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="6"
        />
        <line
          x1="500"
          y1="1080"
          x2={500 + (3340 - 500) * pipeProgress}
          y2="1080"
          stroke="#00E5FF"
          strokeWidth="6"
          strokeDasharray="16 12"
          filter="url(#taskGlow)"
        />

        {/* Traveling Pipeline Signal Pulse */}
        {pipeProgress > 0.1 && (
          <circle
            cx={pulseX}
            cy="1080"
            r="12"
            fill="#FFFFFF"
            filter="url(#taskGlow)"
          />
        )}
      </svg>

      {/* Top Header Telemetry */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 180,
          right: 180,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: 30,
        }}
      >
        <div>
          <div style={{ color: "#00E5FF", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>
            AI TASK AUTOMATION PIPELINE
          </div>
          <div style={{ color: "#FFFFFF", fontSize: 44, fontWeight: 800, marginTop: 8 }}>
            Autonomous Multi-Agent Workflow
          </div>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 18, letterSpacing: 2 }}>
              CYCLE STATUS
            </div>
            <div style={{ color: "#00E676", fontSize: 26, fontWeight: 700, marginTop: 4 }}>
              ONLINE / ACTIVE
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 18, letterSpacing: 2 }}>
              THROUGHPUT
            </div>
            <div style={{ color: "#00E5FF", fontSize: 26, fontWeight: 700, marginTop: 4 }}>
              60 FPS CFR
            </div>
          </div>
        </div>
      </div>

      {/* 4 Floating Task Execution Cards */}
      <div
        style={{
          display: "flex",
          gap: 60,
          width: 3200,
          justifyContent: "center",
          transform: `translateY(${idleHover}px)`,
        }}
      >
        {tasks.map((task, idx) => {
          const cardSpring = spring({
            frame: frame - task.startFrame,
            fps,
            config: { damping: 11, stiffness: 150, mass: 0.85 },
          });

          const scale = interpolate(cardSpring, [0, 1], [0.5, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(cardSpring, [0, 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Task Completion Status
          const isDone = frame >= task.completeFrame;
          const isRunning = frame >= task.startFrame && frame < task.completeFrame;
          const taskProgress = interpolate(
            frame,
            [task.startFrame, task.completeFrame],
            [0, 100],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={task.id}
              style={{
                width: 700,
                backgroundColor: "rgba(12, 16, 26, 0.85)",
                border: `2px solid ${isDone ? task.color : isRunning ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.12)"}`,
                borderRadius: 24,
                padding: "48px 44px",
                transform: `scale(${scale})`,
                opacity,
                boxShadow: isDone
                  ? `0 20px 60px ${task.color}33`
                  : "0 20px 40px rgba(0,0,0,0.6)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    backgroundColor: `${task.color}22`,
                    color: task.color,
                    padding: "6px 16px",
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: 2,
                    border: `1px solid ${task.color}44`,
                  }}
                >
                  {task.tag}
                </span>

                <span
                  style={{
                    color: isDone ? "#00E676" : isRunning ? "#FFD600" : "rgba(255, 255, 255, 0.4)",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  {isDone ? "COMPLETE" : isRunning ? "PROCESSING" : "STANDBY"}
                </span>
              </div>

              {/* Card Title & Desc */}
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1.25,
                  marginBottom: 16,
                }}
              >
                {task.title}
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.65)",
                  fontSize: 20,
                  lineHeight: 1.4,
                  marginBottom: 40,
                  minHeight: 56,
                }}
              >
                {task.desc}
              </div>

              {/* Progress Bar Container */}
              <div
                style={{
                  width: "100%",
                  height: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: 6,
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: `${taskProgress}%`,
                    height: "100%",
                    backgroundColor: task.color,
                    borderRadius: 6,
                    boxShadow: `0 0 16px ${task.color}`,
                  }}
                />
              </div>

              {/* Progress Percentage */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                <span>EXECUTION PROGRESS</span>
                <span style={{ color: task.color, fontWeight: 800 }}>
                  {Math.floor(taskProgress)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
