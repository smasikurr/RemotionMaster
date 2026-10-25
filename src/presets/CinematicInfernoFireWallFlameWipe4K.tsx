import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CinematicInfernoFireWallCanvas } from '../craft/CinematicInfernoFireWallCanvas';

export const CinematicInfernoFireWallFlameWipe4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <CinematicInfernoFireWallCanvas seed={57} />
    </AbsoluteFill>
  );
};
