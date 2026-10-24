import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface CyberpunkGlitchLoadingBar4KProps {
  primaryColor?: string;
  accentColor?: string;
  glitchIntensity?: number;
}

/**
 * CyberpunkGlitchLoadingBar4K
 * 4K UHD (3840x2160) @ 60 FPS, 12.00s seamless loop (720 frames).
 * High-end Sci-Fi / Cyberpunk HUD Loading & Uploading Progress Bar with:
 * - Segmented glowing laser progress cells & chamfered HUD casing
 * - Horizontal scanline slice tearing & chromatic aberration (RGB channel split)
 * - Dynamic percentage readout (0% -> 100%) & corrupt glyph matrix
 * - Micro telemetry ticks, oscilloscope waveform & cybernetic reticles
 * - 100% compliant with Adobe Stock, Vecteezy & Shutterstock commercial standards.
 */
export const CyberpunkGlitchLoadingBar4K: React.FC<CyberpunkGlitchLoadingBar4KProps> = ({
  primaryColor = "#00F0FF",
  accentColor = "#FF0055",
  glitchIntensity = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = width;   // 3840
    const H = height;  // 2160
    const CX = W / 2;
    const CY = H / 2;
    const TOTAL_FRAMES = 720; // 12.00s @ 60fps
    const normT = (frame % TOTAL_FRAMES) / TOTAL_FRAMES; // 0.0 to 1.0

    // Deterministic pseudo-random generator for repeatable glitch patterns
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    // 1. Progress Curve (Organic Cyberpunk Upload Pacing)
    // 0s-11.1s: Progress from 0% to 100% with tech bursts & stutters
    // 11.2s-12.0s: 100% complete flash burst and glitch wipe back to loop start
    let progress = 0;
    const loadPhaseEnd = 672; // frame 672 = 11.2s
    if (frame < loadPhaseEnd) {
      const u = frame / loadPhaseEnd;
      // Stuttering multi-stage cyber progression
      const stage1 = Math.min(1, u * 2.2); // fast initial leap to 35%
      const stage2 = Math.min(1, Math.max(0, (u - 0.25) * 1.8)); // climb to 70%
      const stage3 = Math.min(1, Math.max(0, (u - 0.65) * 2.85)); // final surge to 100%
      const microStutter = (Math.sin(u * 80) * 0.015 + Math.sin(u * 190) * 0.008) * (1 - u);
      progress = Math.min(1, Math.max(0, stage1 * 0.35 + stage2 * 0.40 + stage3 * 0.25 + microStutter));
    } else {
      progress = 1.0;
    }

    const percent = Math.min(100, Math.floor(progress * 100));
    const percentDec = (progress * 100).toFixed(1);

    // 2. Glitch Spike Windows (Deterministic Frame Clusters)
    const isGlitchSpike1 = frame >= 85 && frame <= 98;    // ~1.5s
    const isGlitchSpike2 = frame >= 210 && frame <= 228;  // ~3.5s
    const isGlitchSpike3 = frame >= 340 && frame <= 356;  // ~5.7s
    const isGlitchSpike4 = frame >= 470 && frame <= 488;  // ~7.9s
    const isGlitchSpike5 = frame >= 590 && frame <= 606;  // ~9.9s
    const isLoopGlitch = frame >= 680 && frame <= 719;    // 11.3s - 12.0s loop transition

    const isMajorGlitch = (isGlitchSpike1 || isGlitchSpike2 || isGlitchSpike3 || isGlitchSpike4 || isGlitchSpike5 || isLoopGlitch) && glitchIntensity > 0;
    const isMicroGlitch = (frame % 47 < 3 || frame % 83 < 2) && glitchIntensity > 0;
    const glitchActive = isMajorGlitch || isMicroGlitch;

    // 3. Clear Canvas with Pure Black Base
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    // 4. Background Cyberpunk HUD Grid & Coordinate Markings
    ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
    ctx.lineWidth = 1.5;
    const gridSpacing = 120;
    ctx.beginPath();
    for (let x = 0; x <= W; x += gridSpacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = 0; y <= H; y += gridSpacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();

    // 5. Corner Sci-Fi Target Brackets & Telemetry Labels
    const cornerMargin = 140;
    const bracketSize = 70;
    ctx.strokeStyle = "rgba(0, 240, 255, 0.45)";
    ctx.lineWidth = 3;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(cornerMargin, cornerMargin + bracketSize);
    ctx.lineTo(cornerMargin, cornerMargin);
    ctx.lineTo(cornerMargin + bracketSize, cornerMargin);
    // Top-Right
    ctx.moveTo(W - cornerMargin - bracketSize, cornerMargin);
    ctx.lineTo(W - cornerMargin, cornerMargin);
    ctx.lineTo(W - cornerMargin, cornerMargin + bracketSize);
    // Bottom-Left
    ctx.moveTo(cornerMargin, H - cornerMargin - bracketSize);
    ctx.lineTo(cornerMargin, H - cornerMargin);
    ctx.lineTo(cornerMargin + bracketSize, H - cornerMargin);
    // Bottom-Right
    ctx.moveTo(W - cornerMargin - bracketSize, H - cornerMargin);
    ctx.lineTo(W - cornerMargin, H - cornerMargin);
    ctx.lineTo(W - cornerMargin, H - cornerMargin - bracketSize);
    ctx.stroke();

    // Corner Telemetry Text
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillStyle = "rgba(0, 240, 255, 0.65)";
    ctx.textAlign = "left";
    ctx.fillText("REC [●] 60.0 FPS // CFR", cornerMargin + 10, cornerMargin - 20);
    ctx.fillText("SYS_ARCH: NEURAL_CORE_V9", cornerMargin + 10, H - cornerMargin + 45);

    ctx.textAlign = "right";
    ctx.fillText("BUFFER: AES-512-Q // VERIFIED", W - cornerMargin - 10, cornerMargin - 20);
    const hexHash = ((frame * 2654435761) >>> 0).toString(16).toUpperCase().padStart(8, "0");
    ctx.fillText(`HASH: 0x${hexHash} // MEM_OK`, W - cornerMargin - 10, H - cornerMargin + 45);

    // 6. Central HUD Loading Assembly Geometry
    const barWidth = 2500;
    const barHeight = 160;
    const barX = CX - barWidth / 2;
    const barY = CY - barHeight / 2;

    // Apply intermittent glitch jitter to main container
    let jitterX = 0;
    let jitterY = 0;
    if (glitchActive) {
      jitterX = (pseudoRandom(frame * 31.7) - 0.5) * 36 * glitchIntensity;
      jitterY = (pseudoRandom(frame * 67.3) - 0.5) * 16 * glitchIntensity;
    }

    ctx.save();
    ctx.translate(jitterX, jitterY);

    // 7. Top Header Typography & Percentage Readout
    const headerY = barY - 60;
    ctx.font = "bold 40px 'Courier New', monospace";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";

    // Animated Status Blinker
    const blinkAlpha = Math.sin(frame * 0.15) > 0 ? 1.0 : 0.25;
    ctx.fillStyle = `rgba(0, 240, 255, ${blinkAlpha})`;
    ctx.fillRect(barX, headerY - 32, 22, 22);

    ctx.fillStyle = "#00F0FF";
    ctx.fillText("INITIALIZING DATA STREAM // SYS_EXEC", barX + 38, headerY - 12);

    // Centered "LOADING..." Label with Glitch Character Corruptions
    ctx.textAlign = "center";
    ctx.font = "bold 48px 'Courier New', monospace";
    let loadingText = "L O A D I N G . . .";
    if (isMajorGlitch) {
      const corruptGlyphs = ["L 0 A D ! N G . .", "L # A D 1 N G ?", "L O A D _ _ _", "1 0 A D I N G !", "[ SYSTEM REBOOT ]"];
      loadingText = corruptGlyphs[Math.floor(pseudoRandom(frame * 4.1) * corruptGlyphs.length)];
      ctx.fillStyle = "#FF0055";
    } else {
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.fillText(loadingText, CX, headerY - 12);

    // Right Percentage Display
    ctx.textAlign = "right";
    ctx.font = "bold 52px 'Courier New', monospace";
    ctx.fillStyle = isMajorGlitch ? "#FFE600" : "#00F0FF";
    let displayPercent = `${percentDec}%`;
    if (progress >= 1.0) {
      displayPercent = "100.0% [READY]";
    } else if (isMajorGlitch && pseudoRandom(frame * 9.2) > 0.6) {
      displayPercent = "ERR:0x7F%";
    }
    ctx.fillText(displayPercent, barX + barWidth, headerY - 12);

    // 8. Outer Chamfered Cyberpunk Frame
    const chamfer = 28;
    const drawChamferedRect = (x: number, y: number, w: number, h: number, c: number) => {
      ctx.beginPath();
      ctx.moveTo(x + c, y);
      ctx.lineTo(x + w - c, y);
      ctx.lineTo(x + w, y + c);
      ctx.lineTo(x + w, y + h - c);
      ctx.lineTo(x + w - c, y + h);
      ctx.lineTo(x + c, y + h);
      ctx.lineTo(x, y + h - c);
      ctx.lineTo(x, y + c);
      ctx.closePath();
    };

    // Dark Grooved Track Background
    drawChamferedRect(barX, barY, barWidth, barHeight, chamfer);
    ctx.fillStyle = "rgba(4, 18, 30, 0.85)";
    ctx.fill();

    // Subtle Diagonal Danger Stripes inside uncompleted track
    ctx.save();
    drawChamferedRect(barX, barY, barWidth, barHeight, chamfer);
    ctx.clip();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.06)";
    ctx.lineWidth = 14;
    const stripeOffset = (frame * 2.5) % 80;
    for (let sx = barX - barHeight - stripeOffset; sx < barX + barWidth + barHeight; sx += 40) {
      ctx.beginPath();
      ctx.moveTo(sx, barY + barHeight);
      ctx.lineTo(sx + barHeight, barY);
      ctx.stroke();
    }
    ctx.restore();

    // Chamfered Outer Frame Stroke
    ctx.lineWidth = 4;
    ctx.strokeStyle = isMajorGlitch ? "#FF0055" : "rgba(0, 240, 255, 0.7)";
    drawChamferedRect(barX, barY, barWidth, barHeight, chamfer);
    ctx.stroke();

    // Corner Decorative Screws & Wings
    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(barX - 16, barY + barHeight / 2 - 25, 8, 50);
    ctx.fillRect(barX + barWidth + 8, barY + barHeight / 2 - 25, 8, 50);

    // 9. Segmented Glowing Progress Fill
    const innerPadX = 22;
    const innerPadY = 20;
    const fillX = barX + innerPadX;
    const fillY = barY + innerPadY;
    const fillW = barWidth - innerPadX * 2;
    const fillH = barHeight - innerPadY * 2;

    const totalSegments = 64;
    const segGap = 6;
    const segWidth = (fillW - (totalSegments - 1) * segGap) / totalSegments;
    const activeSegments = Math.floor(progress * totalSegments);

    for (let s = 0; s < totalSegments; s++) {
      const sx = fillX + s * (segWidth + segGap);
      const isFilled = s < activeSegments;
      const isLeading = s === activeSegments - 1;

      if (isFilled) {
        // High-end glowing cyberpunk gradient
        const segGrad = ctx.createLinearGradient(sx, fillY, sx, fillY + fillH);
        if (isLeading) {
          // Bright leading head burst
          segGrad.addColorStop(0, "#FFFFFF");
          segGrad.addColorStop(0.5, "#D8FFFF");
          segGrad.addColorStop(1, "#00F0FF");
        } else {
          // Cyan to vibrant electric teal/blue body
          segGrad.addColorStop(0, "#E0FFFF");
          segGrad.addColorStop(0.4, "#00F0FF");
          segGrad.addColorStop(1, "#0088CC");
        }

        ctx.fillStyle = segGrad;
        ctx.fillRect(sx, fillY, segWidth, fillH);

        // Leading Edge Energy Sparkle
        if (isLeading) {
          ctx.save();
          ctx.shadowColor = "#00F0FF";
          ctx.shadowBlur = 35;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(sx - 2, fillY - 4, segWidth + 4, fillH + 8);
          ctx.restore();
        }
      } else {
        // Inactive ghost segment
        ctx.fillStyle = "rgba(0, 240, 255, 0.08)";
        ctx.fillRect(sx, fillY, segWidth, fillH);
      }
    }

    // 10. Bottom Micro-Ticks Track (As Seen in Reference Video)
    const tickTrackY = barY + barHeight + 35;
    const totalTicks = 140;
    const tickSpacing = barWidth / totalTicks;
    ctx.lineWidth = 2.5;

    for (let i = 0; i < totalTicks; i++) {
      const tx = barX + i * tickSpacing;
      const isMajorTick = i % 10 === 0;
      const tickH = isMajorTick ? 24 : 12;
      const isTickPassed = i / totalTicks <= progress;

      if (isTickPassed) {
        ctx.strokeStyle = isMajorTick ? "#FFFFFF" : "#00F0FF";
      } else {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
      }

      ctx.beginPath();
      ctx.moveTo(tx, tickTrackY);
      ctx.lineTo(tx, tickTrackY + tickH);
      ctx.stroke();

      if (isMajorTick && isTickPassed) {
        ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
        ctx.font = "bold 16px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${i * 10}`, tx, tickTrackY + tickH + 20);
      }
    }

    // 11. Oscilloscope / Real-Time Data Frequency Waveform (Elevated Effect)
    const waveY = tickTrackY + 75;
    ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const waveSteps = 120;
    for (let w = 0; w <= waveSteps; w++) {
      const wx = barX + (w / waveSteps) * barWidth;
      const freq1 = Math.sin(w * 0.25 + frame * 0.2);
      const freq2 = Math.cos(w * 0.55 - frame * 0.15);
      const waveAmp = (w / waveSteps <= progress ? 18 : 3) * (isMajorGlitch ? 2.5 : 1.0);
      const wy = waveY + (freq1 + freq2) * waveAmp * 0.5;
      if (w === 0) ctx.moveTo(wx, wy);
      else ctx.lineTo(wx, wy);
    }
    ctx.stroke();

    // 12. Bottom Telemetry Data Readouts
    const metaY = waveY + 55;
    ctx.font = "bold 28px 'Courier New', monospace";
    ctx.fillStyle = "rgba(0, 240, 255, 0.85)";
    ctx.textAlign = "left";
    const currentMB = (progress * 8192).toFixed(0);
    ctx.fillText(`TRANSFERRED: ${currentMB} MB / 8192 MB`, barX, metaY);

    ctx.textAlign = "center";
    const uploadRate = isMajorGlitch ? "9.99 GB/s [BURST]" : `${(1.24 + Math.sin(frame * 0.1) * 0.18).toFixed(2)} GB/s`;
    ctx.fillText(`TRANSFER SPEED: ${uploadRate}`, CX, metaY);

    ctx.textAlign = "right";
    const etaSecs = Math.max(0, (1 - progress) * 12).toFixed(1);
    ctx.fillText(`EST TIME: 00:0${etaSecs}s // PORT: 8080`, barX + barWidth, metaY);

    ctx.restore(); // Restore jitter translation

    // 13. High-End Post-Process Glitch Engine:
    // A. Chromatic Aberration & Horizontal Scanline Tearing
    if (glitchActive) {
      const sliceCount = isMajorGlitch ? 14 : 5;
      for (let s = 0; s < sliceCount; s++) {
        const sliceY = Math.floor(pseudoRandom(frame * 17.1 + s * 13.3) * (H - 200)) + 100;
        const sliceH = Math.floor(pseudoRandom(frame * 37.7 + s * 19.1) * (isMajorGlitch ? 90 : 35)) + 8;
        const shiftX = (pseudoRandom(frame * 53.3 + s * 7.7) - 0.5) * (isMajorGlitch ? 140 : 45) * glitchIntensity;

        // Grab slice and displace
        const sliceData = ctx.getImageData(0, sliceY, W, sliceH);

        // Draw Magenta & Cyan Color Aberration Fringes
        ctx.fillStyle = "rgba(255, 0, 85, 0.45)";
        ctx.fillRect(shiftX - 15, sliceY, W, sliceH);

        ctx.fillStyle = "rgba(0, 240, 255, 0.45)";
        ctx.fillRect(shiftX + 15, sliceY, W, sliceH);

        // Put displaced slice
        ctx.putImageData(sliceData, shiftX, sliceY);
      }

      // Random Glitch Digital Block Dropouts
      const blockCount = isMajorGlitch ? 8 : 2;
      for (let b = 0; b < blockCount; b++) {
        const bx = Math.floor(pseudoRandom(frame * 71.9 + b * 23.1) * (W - 300));
        const by = Math.floor(pseudoRandom(frame * 89.3 + b * 31.7) * (H - 120));
        const bw = Math.floor(pseudoRandom(frame * 11.3 + b * 41.5) * 280) + 40;
        const bh = Math.floor(pseudoRandom(frame * 43.1 + b * 17.9) * 45) + 10;

        ctx.fillStyle = pseudoRandom(frame + b) > 0.5 ? "rgba(255, 0, 85, 0.75)" : "rgba(255, 230, 0, 0.8)";
        ctx.fillRect(bx, by, bw, bh);
      }
    }

    // B. CRT Cathode Scanlines & Dark Vignette
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 1.5);
    }

    // C. Loop Reset Flash Wipe (frame 680 to 719)
    if (isLoopGlitch) {
      const wipeT = (frame - 680) / 39; // 0 to 1
      if (wipeT < 0.35) {
        // Brilliant white/cyan flash burst
        const flashAlpha = (1 - wipeT / 0.35) * 0.85;
        ctx.fillStyle = `rgba(0, 240, 255, ${flashAlpha * 0.5})`;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.75})`;
        ctx.fillRect(0, 0, W, H);

        ctx.font = "bold 90px 'Courier New', monospace";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("[ SYSTEM UPGRADE COMPLETE ]", CX, CY - 180);
      } else {
        // Digital glitch blocks dissolving cleanly back into 0% initial state
        const fadeAlpha = (1 - wipeT);
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - fadeAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

  }, [frame, width, height, primaryColor, accentColor, glitchIntensity]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#000000", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
};
