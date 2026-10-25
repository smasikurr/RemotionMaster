import React from 'react';
import { HalftoneParticleDotWaveTerrainCanvas } from '../craft/HalftoneParticleDotWaveTerrainCanvas';

export const HalftoneParticleDotWaveTerrain4K: React.FC = () => {
  return (
    <HalftoneParticleDotWaveTerrainCanvas
      cols={160}
      rows={120}
      loopDurationSeconds={12.0}
    />
  );
};
