import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CinematicDeepSpaceTwinklingStarsCanvas } from '../craft/CinematicDeepSpaceTwinklingStarsCanvas';

export const CinematicDeepSpaceTwinklingStars4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <CinematicDeepSpaceTwinklingStarsCanvas seed={62} />
    </AbsoluteFill>
  );
};
