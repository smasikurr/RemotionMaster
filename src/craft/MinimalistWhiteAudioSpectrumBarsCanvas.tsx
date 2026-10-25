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
    const isInnerPeak1 = i === 33 || i === 45;
    const isInnerPeak2 = i === 28 || i === 50;
    const isMidPeak1 = i === 23 || i === 55;
    const isMidPeak2 = i === 18 || i === 60;

    // Harmonic wave oscillations across bars
    const wave1 = Math.sin(time * 16.0 + i * 0.38);
    const wave2 = Math.cos(time * 22.0 - i * 0.55);
    const wave3 = Math.sin(time * 9.5 + i * 0.22);

    // Bar base height envelope (tiny dots at ends, smoothly rising towards center)
    const baseFloor = 10.0 + 16.0 * b.envWide;

    // Active musical body fill
    const bodyWave = (0.35 + 0.35 * Math.abs(wave1) + 0.30 * Math.abs(wave2)) * b.envMain * 130.0;

    // Amplitude computation
    let dynamicH = bodyWave;

    if (isCenterTwin) {
      // Tallest twin spikes in the visualizer
      const twinDrive = (0.55 + 0.45 * vocalP1) * (0.35 + 0.65 * kick) + 0.35 * Math.abs(wave1);
      dynamicH = 500.0 + twinDrive * 920.0;
    } else if (isCenterSide) {
      dynamicH = 180.0 + (0.5 * kick + 0.5 * vocalP1) * 320.0;
    } else if (isInnerPeak1) {
      dynamicH = 220.0 + (0.45 * snare + 0.35 * vocalP2 + 0.2 * Math.abs(wave2)) * 380.0;
    } else if (isInnerPeak2) {
      dynamicH = 160.0 + (0.40 * kick + 0.35 * Math.abs(wave1) + 0.25 * vocalP1) * 320.0;
    } else if (isMidPeak1) {
      dynamicH = 110.0 + (0.45 * snare + 0.35 * Math.abs(wave3)) * 240.0;
    } else if (isMidPeak2) {
      dynamicH = 60.0 + (0.5 * Math.abs(wave1) + 0.5 * Math.abs(wave2)) * 160.0;
    }

    // Outer tail decay
    const finalHeight = Math.max(baseFloor, dynamicH);

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
