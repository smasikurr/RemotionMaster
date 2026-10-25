import React from 'react';
import { AbsoluteFill } from 'remotion';
import { VolumetricWhiteSmokeCloudBurstCanvas } from '../craft/VolumetricWhiteSmokeCloudBurstCanvas';

export const VolumetricWhiteSmokeCloudBurst4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <VolumetricWhiteSmokeCloudBurstCanvas seed={55} />
    </AbsoluteFill>
  );
};
