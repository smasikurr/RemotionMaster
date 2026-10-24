import React from 'react';
import { Composition } from 'remotion';
import { CinematicFilmBurnTransitionsCanvas } from '../craft/CinematicFilmBurnTransitionsCanvas';

export const CinematicFilmBurnTransitions4K: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#000000',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CinematicFilmBurnTransitionsCanvas seed={49} />
    </div>
  );
};
