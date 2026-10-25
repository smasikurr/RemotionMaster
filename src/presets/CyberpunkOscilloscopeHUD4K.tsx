import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CyberpunkOscilloscopeHUDScene } from '../craft/CyberpunkOscilloscopeHUDScene';

export const CyberpunkOscilloscopeHUD4K: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <CyberpunkOscilloscopeHUDScene seed={60} />
    </AbsoluteFill>
  );
};
