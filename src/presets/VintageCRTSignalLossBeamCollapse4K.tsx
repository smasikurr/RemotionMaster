import React from 'react';
import { AbsoluteFill } from 'remotion';
import { VintageCRTSignalLossBeamCollapseCanvas } from '../craft/VintageCRTSignalLossBeamCollapseCanvas';

export const VintageCRTSignalLossBeamCollapse4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <VintageCRTSignalLossBeamCollapseCanvas seed={63} />
    </AbsoluteFill>
  );
};
