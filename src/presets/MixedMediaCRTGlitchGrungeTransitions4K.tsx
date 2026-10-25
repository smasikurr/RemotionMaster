import React from 'react';
import { AbsoluteFill } from 'remotion';
import { MixedMediaCRTGlitchGrungeCanvas } from '../craft/MixedMediaCRTGlitchGrungeCanvas';

export const MixedMediaCRTGlitchGrungeTransitions4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <MixedMediaCRTGlitchGrungeCanvas seed={56} />
    </AbsoluteFill>
  );
};
