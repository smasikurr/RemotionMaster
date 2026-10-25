import React from 'react';
import { AbsoluteFill } from 'remotion';
import { MinimalistRedAudioSpectrumBellCurve } from '../craft/MinimalistRedAudioSpectrumBellCurve';

export const MinimalistRedAudioSpectrumBellCurve4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <MinimalistRedAudioSpectrumBellCurve barCount={64} color="#ff1e2d" glow={true} />
    </AbsoluteFill>
  );
};
