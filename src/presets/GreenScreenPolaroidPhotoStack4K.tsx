import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GreenScreenPolaroidPhotoStack } from '../craft/GreenScreenPolaroidPhotoStack';

export const GreenScreenPolaroidPhotoStack4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#00ff00' }}>
      <GreenScreenPolaroidPhotoStack seed={61} />
    </AbsoluteFill>
  );
};
