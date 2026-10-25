import React from 'react';
import { CRTStaticVHSGlitchCanvas } from '../craft/CRTStaticVHSGlitchCanvas';

export const CRTStaticVHSGlitch4K: React.FC = () => {
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
      <CRTStaticVHSGlitchCanvas seed={52} />
    </div>
  );
};
