import React from 'react';
import { HalftoneCloudMatrixCanvas } from '../craft/HalftoneCloudMatrixCanvas';

export const HalftoneCloudMatrix: React.FC = () => {
  return (
    <HalftoneCloudMatrixCanvas
      spacing={36}
      dotColor="#2C2E33"
      backgroundColor="#FFFFFF"
      maxRadius={17.5}
      minRadius={1.8}
      clearingThreshold={0.22}
      loopDurationSeconds={12.0}
    />
  );
};
