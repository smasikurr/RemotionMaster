import React, { useMemo } from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const HackerMatrixGlitchProgressBar4K: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Progress fills from Frame 30 to 480
  const progress = interpolate(frame, [30, 480], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const percent = Math.floor(progress * 100);

  // Periodic chromatic glitch spikes
  const isGlitch = (frame >= 80 && frame <= 95) || (frame >= 220 && frame <= 235) || (frame >= 370 && frame <= 385);
  const shakeX = isGlitch ? Math.sin(frame * 3) * 15 : 0;

  // Master fade loop
  const masterFade = interpolate(frame, [0, 15, 540, 600], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Synthesize 40 vertical matrix code rain columns
  const matrixCols = useMemo(() => {
    const cols = [];
    const charPool = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";
    const numCols = 40;
    const colSpacing = width / numCols;

    for (let c = 0; c < numCols; c++) {
      const seed = Math.sin(c * 19.345 + 12.345) * 43758.5453;
      const r = seed - Math.floor(seed);
      const speed = 4 + r * 6;
      const length = 8 + Math.floor(r * 12);
      const startOffset = Math.floor(r * 100);

      const chars = [];
      for (let j = 0; j < length; j++) {
        const charIdx = (Math.floor(r * 100) + j) % charPool.length;
        chars.push(charPool[charIdx]);
      }

      cols.push({
        x: c * colSpacing + colSpacing / 2,
        speed,
        startOffset,
        chars,
        opacity: 0.15 + r * 0.25,
      });
    }
    return cols;
  }, [width]);

  const barW = 2200;
  const barH = 74;

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
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* Background Matrix Digital Rain */}
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
          <filter id="matrixGreenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {matrixCols.map((col, idx) => {
          const currentY = ((frame * col.speed + col.startOffset * 20) % (height + 400)) - 200;
          return (
            <g key={`col-${idx}`} opacity={col.opacity}>
              {col.chars.map((char, cIdx) => (
                <text
                  key={`ch-${idx}-${cIdx}`}
                  x={col.x}
                  y={currentY - cIdx * 28}
                  fill={cIdx === 0 ? "#FFFFFF" : "#00FF66"}
                  fontSize="22"
                  fontWeight="bold"
                  textAnchor="middle"
                  filter={cIdx === 0 ? "url(#matrixGreenGlow)" : undefined}
                >
                  {char}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Main Hacker Console Container */}
      <div
        style={{
          width: barW,
          backgroundColor: "rgba(0, 18, 6, 0.9)",
          border: "2px solid #00FF66",
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(0, 255, 102, 0.35)",
          padding: "50px 60px",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${shakeX}px)`,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 30,
            borderBottom: "2px solid rgba(0, 255, 102, 0.3)",
            paddingBottom: 22,
          }}
        >
          <div>
            <div style={{ color: "#00FF66", fontSize: 28, fontWeight: 900, letterSpacing: 5 }}>
              HACKER MATRIX PROGRESS LOADER
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 18, marginTop: 6, letterSpacing: 3 }}>
              CYBER INTRUSION PROTOCOL // SECURE TERMINAL
            </div>
          </div>
          <div
            style={{
              color: "#00FF66",
              fontSize: 70,
              fontWeight: 900,
              textShadow: "0 0 24px #00FF66",
            }}
          >
            {percent}%
          </div>
        </div>

        {/* Progress Track */}
        <div
          style={{
            width: "100%",
            height: barH,
            backgroundColor: "rgba(0, 35, 12, 0.7)",
            border: "2px solid #00FF66",
            borderRadius: 14,
            padding: 8,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 35px rgba(0, 255, 102, 0.3)",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#00FF66",
              borderRadius: 8,
              boxShadow: "0 0 24px #00FF66",
            }}
          />
        </div>

        {/* Footer Status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 26,
            color: "rgba(0, 255, 102, 0.6)",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>ROOT@MAINFRAME:~$ DECRYPT_KEYS</span>
          <span>CIPHER: 4096-BIT RSA</span>
          <span>STATUS: IN PROGRESS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
