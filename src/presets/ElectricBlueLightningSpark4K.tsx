import React from 'react';
import { ElectricBlueLightningSparkCanvas } from '../craft/ElectricBlueLightningSparkCanvas';

export const ElectricBlueLightningSpark4K: React.FC = () => {
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
      <ElectricBlueLightningSparkCanvas seed={51} />
    </div>
  );
};
