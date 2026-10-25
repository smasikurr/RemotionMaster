import React from 'react';
import { AbsoluteFill } from 'remotion';
import { VintagePhotocopierXeroxScanCanvas } from '../craft/VintagePhotocopierXeroxScanCanvas';

export const VintagePhotocopierXeroxScanTexture4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <VintagePhotocopierXeroxScanCanvas seed={54} />
    </AbsoluteFill>
  );
};
