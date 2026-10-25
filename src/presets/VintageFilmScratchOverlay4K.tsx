import React from 'react';
import { VintageFilmScratchOverlayCanvas } from '../craft/VintageFilmScratchOverlayCanvas';

export const VintageFilmScratchOverlay4K: React.FC = () => {
  return (
    <VintageFilmScratchOverlayCanvas
      width={3840}
      height={2160}
      seed="vintage_film_master_unique"
      dustCount={42}
    />
  );
};
