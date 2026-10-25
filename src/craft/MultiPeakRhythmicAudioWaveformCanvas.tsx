import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface MultiPeakRhythmicAudioWaveformCanvasProps {
  barCount?: number;
  bpm?: number;
}

export const MultiPeakRhythmicAudioWaveformCanvas: React.FC<
  MultiPeakRhythmicAudioWaveformCanvasProps
> = ({ barCount = 79, bpm = 126 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const time = frame / fps;
  const beatSec = 60.0 / bpm;

  const barMetrics = useMemo(() => {
    const spanWidth = width * 0.804;
    const step = spanWidth / (barCount - 1);
    const startX = (width - spanWidth) / 2;

    return Array.from({ length: barCount }, (_, i) => {
      const x = startX + i * step;
      const normIdx = (i - (barCount - 1) / 2) / ((barCount - 1) / 2); // -1 to +1
      const distFromCenter = Math.abs(normIdx);

      const envMain = Math.exp(-Math.pow(distFromCenter / 0.65, 2.0));
      const envWide = Math.exp(-Math.pow(distFromCenter / 0.95, 1.8));

      return {
        x,
        normIdx,
        distFromCenter,
        envMain,
        envWide,
      };
    });
  }, [barCount, width]);

  const bars = barMetrics.map((b, i) => {
    // 4-beat bar timing
    const barDuration = beatSec * 4.0;
    const barProgress = (time % barDuration) / barDuration;
    const currentQuarter = Math.floor(barProgress * 4); // 0, 1, 2, 3

    const beatPhase = (time % beatSec) / beatSec;
    const kick = Math.pow(Math.max(0, 1.0 - beatPhase * 3.0), 2.4);
    const snarePhase = ((time + beatSec * 0.5) % beatSec) / beatSec;
    const snare = Math.pow(Math.max(0, 1.0 - snarePhase * 3.2), 2.2);

    // Multi-peak transient indices
    const isPeak1 = i === 18; // Left outer
    const isPeak2 = i === 29; // Left inner
    const isPeak3 = i === 39; // Center
    const isPeak4 = i === 49; // Right inner
    const isPeak5 = i === 60; // Right outer

    // Harmonic wave oscillations across spectrum
    const w1 = Math.sin(time * 19.5 + i * 0.44);
    const w2 = Math.cos(time * 25.0 - i * 0.58);
    const w3 = Math.sin(time * 11.2 + i * 0.28);

    // Dynamic peak activation based on beat step
    let peakTrigger = 0.0;
    if (isPeak3) {
      // Center fires on beats 0 and 2 strongly
      peakTrigger = (currentQuarter === 0 || currentQuarter === 2) ? kick * 1.5 : snare * 0.8;
    } else if (isPeak2 || isPeak4) {
      // Inner wings fire on offbeats and quarter 1 & 3
      peakTrigger = (currentQuarter === 1 || currentQuarter === 3) ? snare * 1.4 : kick * 0.7;
    } else if (isPeak1 || isPeak5) {
      // Outer wings pulse with bass resonance
      peakTrigger = kick * 1.2 * Math.abs(w1);
    }

    // Active intermediate audio body
    const bodyRipple = (0.35 + 0.35 * Math.abs(w1) + 0.30 * Math.abs(w2)) * b.envMain * 140.0;

    let dynamicH = bodyRipple;

    if (isPeak3) {
      dynamicH = 450.0 + peakTrigger * 950.0 + Math.abs(w1) * 200.0;
    } else if (isPeak2 || isPeak4) {
      dynamicH = 380.0 + peakTrigger * 820.0 + Math.abs(w2) * 180.0;
    } else if (isPeak1 || isPeak5) {
      dynamicH = 280.0 + peakTrigger * 680.0 + Math.abs(w3) * 140.0;
    } else if (Math.abs(i - 39) === 1 || Math.abs(i - 29) === 1 || Math.abs(i - 49) === 1) {
      // Flanking bars directly adjacent to major peaks
      dynamicH = 160.0 + (kick * 0.5 + snare * 0.5) * 260.0;
    }

    const baseFloor = 10.0 + 16.0 * b.envWide;
    const finalHeight = Math.max(baseFloor, dynamicH * b.envWide);

    return {
      x: b.x,
      y: (height - finalHeight) / 2,
      width: 18.5,
      height: finalHeight,
      rx: 3.5,
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
