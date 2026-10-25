import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CinematicRainOnGlassBokehCanvas } from '../craft/CinematicRainOnGlassBokehCanvas';

export const CinematicRainOnGlassNightBokeh4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <CinematicRainOnGlassBokehCanvas seed={58} />
    </AbsoluteFill>
  );
};
