import React from 'react';
import { AnimeActionSpeedLinesCanvas } from '../craft/AnimeActionSpeedLinesCanvas';

export const AnimeActionSpeedLines4K: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#00FF00',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimeActionSpeedLinesCanvas greenColor="#00FF00" seed={50} />
    </div>
  );
};
