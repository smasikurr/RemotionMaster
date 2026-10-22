/**
 * Cinetic Motion Laws & Timing Grid
 * Mathematical grid-locked motion system ensuring organic mass and timing.
 */

export interface TimingGrid {
  bpm: number;
  fps: number;
  beat: number; // frames per beat
  bar: number;  // frames per 4-beat bar
}

export function createTimingGrid(bpm = 100, fps = 60): TimingGrid {
  const beat = Math.round((60 / bpm) * fps);
  const bar = beat * 4;
  return { bpm, fps, beat, bar };
}

/**
 * Compute frame number on a 16th-note subgrid
 */
export function getGridFrame(
  grid: TimingGrid,
  barNumber: number,
  beatNumber = 0,
  subSixteenth = 0
): number {
  return Math.round(
    ((barNumber - 1) * 4 + beatNumber) * grid.beat +
      subSixteenth * (grid.beat / 4)
  );
}

/**
 * Harmonic camera drift utility for cinematic living camera feeling
 */
export function getCameraDrift(
  frame: number,
  totalFrames: number,
  ampX = 30,
  ampY = 15
): { x: number; y: number } {
  const t = (frame % totalFrames) / totalFrames;
  const twoPi = Math.PI * 2;
  return {
    x: Math.sin(t * twoPi) * ampX,
    y: Math.cos(t * twoPi * 2) * ampY,
  };
}
