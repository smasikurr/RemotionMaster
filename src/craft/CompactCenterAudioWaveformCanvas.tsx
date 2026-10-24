import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface CompactCenterAudioWaveformCanvasProps {
  barCount?: number;
  barWidth?: number;
  barSpacing?: number;
  maxHeight?: number;
  minHeight?: number;
  color?: string;
  backgroundColor?: string;
  seed?: number;
}

export const CompactCenterAudioWaveformCanvas: React.FC<CompactCenterAudioWaveformCanvasProps> = ({
  barCount = 21,
  barWidth = 26,
  barSpacing = 88,
  maxHeight = 920,
  minHeight = 0,
  color = '#FFFFFF',
  backgroundColor = '#000000',
  seed = 46,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pre-calculate audio amplitudes across frames up to current frame for realistic damping & speech cadence
  const getAmplitudesForFrame = (f: number): number[] => {
    const t = f / fps; // time in seconds

    const amps: number[] = new Array(barCount).fill(0);

    for (let i = 0; i < barCount; i++) {
      const normIdx = i / (barCount - 1); // 0.0 to 1.0
      // Left-center voice formant emphasis (around index 7-9)
      const centerDist = Math.abs(normIdx - 0.45) * 2.1;
      const voiceBell = Math.exp(-centerDist * centerDist * 1.6);

      // Syllable rhythmic pulses
      const syllable = Math.max(0, Math.sin(t * 8.8 + i * 0.18) * Math.cos(t * 4.4));
      const rapidConsonant = Math.sin(t * 18.0 + i * 0.35) > 0.35 ? 0.4 : 0;
      
      // Dynamic speech sentences
      const sentence1 = Math.sin(t * 1.8) * 0.5 + 0.5;
      const sentence2 = Math.cos(t * 3.2 - i * 0.22) * 0.45 + 0.45;

      let rawAmp = (sentence1 * 0.42 + sentence2 * 0.38 + syllable * 0.5 + rapidConsonant) * voiceBell;

      // Frame 120-210 (t ~ 2.0 to 3.5) silence on high frequencies (right side bars 13-20)
      if (t >= 1.8 && t <= 3.6) {
        if (i >= 13) {
          rawAmp *= Math.max(0, 1.0 - (t - 1.8) * 2.2);
        }
      }

      // Add harmonic flutter
      const flutter = Math.sin(t * 30.0 + i * 1.6) * 0.08;
      rawAmp = Math.max(0, Math.min(1.0, rawAmp + flutter));

      // Global fade at start/end
      const fadeIn = Math.min(1, f / 12);
      const fadeOut = Math.min(1, (600 - f) / 12);

      amps[i] = rawAmp * fadeIn * fadeOut;
    }

    return amps;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const currentRaw = getAmplitudesForFrame(frame);
    
    // Center positions
    const centerX = width / 2;
    const centerY = height / 2;
    const totalSpan = (barCount - 1) * barSpacing;
    const startX = centerX - totalSpan / 2;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = barWidth;
    ctx.lineCap = 'round';

    for (let i = 0; i < barCount; i++) {
      const x = startX + i * barSpacing;
      const amp = currentRaw[i];
      const barHeight = minHeight + amp * (maxHeight - minHeight);

      if (barHeight <= 1.0) {
        // Pure circular resting dot
        ctx.beginPath();
        ctx.arc(x, centerY, barWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Symmetric vertical capsule
        const halfH = barHeight / 2;
        ctx.beginPath();
        ctx.moveTo(x, centerY - halfH);
        ctx.lineTo(x, centerY + halfH);
        ctx.stroke();
      }
    }
  }, [frame, width, height, barCount, barWidth, barSpacing, maxHeight, minHeight, color, backgroundColor, seed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};
