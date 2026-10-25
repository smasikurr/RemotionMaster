import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface MinimalistWhiteAudioSpectrumBarsCanvasProps {
  barCount?: number;
  bpm?: number;
}

export const MinimalistWhiteAudioSpectrumBarsCanvas: React.FC<
  MinimalistWhiteAudioSpectrumBarsCanvasProps
> = ({ barCount = 79, bpm = 124 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const time = frame / fps;
  const beatSec = 60.0 / bpm;

  // Precompute static spatial parameters
  const barMetrics = useMemo(() => {
    // Total span ~ 3089px across 3840px (80.4%)
    const spanWidth = width * 0.804;
    const step = spanWidth / (barCount - 1);
    const startX = (width - spanWidth) / 2;
    const barWidth = 18.5;

    return Array.from({ length: barCount }, (_, i) => {
      const x = startX + i * step;
      const normIdx = (i - (barCount - 1) / 2) / ((barCount - 1) / 2); // -1 to +1
      const distFromCenter = Math.abs(normIdx);
      
      // Multi-layer gaussian profile for natural audio decay envelope
      const envMain = Math.exp(-Math.pow(distFromCenter / 0.58, 2.0));
      const envPeak = Math.exp(-Math.pow(distFromCenter / 0.18, 2.2));
      const envWide = Math.exp(-Math.pow(distFromCenter / 0.95, 1.8));

      return {
        x,
        normIdx,
        distFromCenter,
        envMain,
        envPeak,
        envWide,
      };
    });
  }, [barCount, width]);

  // Compute dynamic heights for each bar at the current frame
  const bars = barMetrics.map((b, i) => {
    // Musical timing: 124 BPM rhythm
    const beatPhase = (time % beatSec) / beatSec;
    // Sharp attack, exponential decay for kick/percussion transient
    const kick = Math.pow(Math.max(0, 1.0 - beatPhase * 2.8), 2.2);
    
    // Snare / clap on off-beats
    const snarePhase = ((time + beatSec * 0.5) % beatSec) / beatSec;
    const snare = Math.pow(Math.max(0, 1.0 - snarePhase * 3.0), 2.0);

    // Dynamic speech / vocal envelope modulation over time
    const vocalP1 = 0.5 + 0.5 * Math.sin(time * 3.14);
    const vocalP2 = 0.5 + 0.5 * Math.cos(time * 4.8);

    // Multi-transient peak structure matching reference
    // Center twin spikes: index 38 and 40
    const isCenterTwin = i === 38 || i === 40;
    const isCenterSide = i === 37 || i === 39 || i === 41;
    const isInnerPeak = i === 33 || i === 45 || i === 29 || i === 49;
    const isMidPeak = i === 24 || i === 54 || i === 19 || i === 59;

    // Harmonic wave oscillations across bars
    const wave1 = Math.sin(time * 18.0 + i * 0.42);
    const wave2 = Math.cos(time * 26.0 - i * 0.65);

    // Bar base height envelope (tiny dots at ends, slightly taller towards center)
    const baseFloor = 8.0 + 12.0 * b.envWide;

    // Amplitude computation
    let dynamicH = 0.0;

    if (isCenterTwin) {
      // Tallest twin spikes in the visualizer
      const twinDrive = (0.55 + 0.45 * vocalP1) * (0.4 + 0.6 * kick) + 0.35 * Math.abs(wave1);
      dynamicH = 450.0 + twinDrive * 950.0;
    } else if (isCenterSide) {
      dynamicH = 180.0 + (0.5 * kick + 0.5 * vocalP1) * 350.0;
    } else if (isInnerPeak) {
      const peakDrive = 0.4 * snare + 0.35 * vocalP2 + 0.25 * Math.abs(wave2);
      dynamicH = 120.0 + peakDrive * 400.0 * b.envMain;
    } else if (isMidPeak) {
      dynamicH = 60.0 + (0.5 * snare + 0.5 * Math.abs(wave1)) * 260.0 * b.envMain;
    } else {
      // Intermediate fill bars: lower level jitter with subtle rhythm
      const fillAmp = 0.15 + 0.25 * Math.max(0, wave1) + 0.15 * Math.max(0, wave2);
      dynamicH = fillAmp * 160.0 * b.envMain;
    }

    // Outer tail decay
    const finalHeight = Math.max(baseFloor, dynamicH * b.envWide);

    return {
      x: b.x,
      y: (height - finalHeight) / 2,
      width: 18.5,
      height: finalHeight,
      rx: 3.5, // Sleek rounded cap
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x - bar.width / 2}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            rx={bar.rx}
            ry={bar.rx}
            fill="#ffffff"
          />
        ))}
      </svg>
    </div>
  );
};
