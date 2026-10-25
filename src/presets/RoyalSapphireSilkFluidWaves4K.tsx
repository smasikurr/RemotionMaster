import React from 'react';
import { RoyalSapphireSilkFluidWavesCanvas } from '../craft/RoyalSapphireSilkFluidWavesCanvas';

export const RoyalSapphireSilkFluidWaves4K: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#02071E',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <RoyalSapphireSilkFluidWavesCanvas seed={53} />
    </div>
  );
};
