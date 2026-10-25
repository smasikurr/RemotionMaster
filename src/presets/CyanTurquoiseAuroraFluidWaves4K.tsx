import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CyanTurquoiseAuroraFluidWavesCanvas } from '../craft/CyanTurquoiseAuroraFluidWavesCanvas';

export const CyanTurquoiseAuroraFluidWaves4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#16191d' }}>
      <CyanTurquoiseAuroraFluidWavesCanvas seed={64} />
    </AbsoluteFill>
  );
};
