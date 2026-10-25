import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GreenScreenPolaroidPhotoStackProps {
  seed?: number;
}

interface CardConfig {
  enterFrame: number;
  finalAngle: number;
  finalOffsetX: number;
  finalOffsetY: number;
}

export const GreenScreenPolaroidPhotoStack: React.FC<
  GreenScreenPolaroidPhotoStackProps
> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // 7 Photo cards falling sequentially onto stack
  const cardConfigs: CardConfig[] = [
    { enterFrame: 0, finalAngle: 0.0, finalOffsetX: 0, finalOffsetY: 0 },
    { enterFrame: 90, finalAngle: 4.5, finalOffsetX: 22, finalOffsetY: -10 },
    { enterFrame: 190, finalAngle: -6.8, finalOffsetX: -28, finalOffsetY: 14 },
    { enterFrame: 290, finalAngle: 3.8, finalOffsetX: 18, finalOffsetY: -8 },
    { enterFrame: 400, finalAngle: -5.4, finalOffsetX: -16, finalOffsetY: 10 },
    { enterFrame: 510, finalAngle: 2.8, finalOffsetX: 14, finalOffsetY: -6 },
    { enterFrame: 620, finalAngle: -4.8, finalOffsetX: -12, finalOffsetY: 6 },
  ];

  // Luma Matte transition starts at frame 740 (12.33s)
  const isLumaMatte = frame >= 740;

  // Exact Chroma Key Green from reference:
  // Background: rgb(63, 199, 0) (#3fc700)
  // Inner Photo: rgb(102, 209, 51) (#66d133)
  const bgColor = isLumaMatte ? '#000000' : '#3fc700';

  // Exact Polaroid Card Proportions in 4K UHD
  const cardW = 1165;
  const cardH = 1435;
  const borderSides = 90;
  const borderTop = 90;
  const photoW = cardW - borderSides * 2; // 985
  const photoH = 1085;

  const centerX = width / 2;
  const centerY = height / 2 - 15;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {cardConfigs.map((cfg, idx) => {
        if (frame < cfg.enterFrame) return null;

        const cardAge = frame - cfg.enterFrame;

        // Spring drop animation for cards falling in
        const dropSpring =
          cfg.enterFrame === 0
            ? 1
            : spring({
                frame: cardAge,
                fps,
                config: { damping: 13, stiffness: 85, mass: 1.1 },
              });

        // Falling from top offscreen (-1500px) down to baseline center
        const currentY =
          cfg.enterFrame === 0
            ? centerY + cfg.finalOffsetY
            : interpolate(dropSpring, [0, 1], [-1500, centerY + cfg.finalOffsetY]);

        const currentX =
          cfg.enterFrame === 0
            ? centerX + cfg.finalOffsetX
            : interpolate(
                dropSpring,
                [0, 1],
                [centerX + cfg.finalOffsetX + (idx % 2 === 0 ? -140 : 140), centerX + cfg.finalOffsetX]
              );

        // Rotation tilts into final settled angle with slight overshoot bounce
        const currentAngle =
          cfg.enterFrame === 0
            ? cfg.finalAngle
            : interpolate(
                dropSpring,
                [0, 0.75, 1],
                [cfg.finalAngle * 2.8, cfg.finalAngle * 0.9, cfg.finalAngle]
              );

        const currentScale =
          cfg.enterFrame === 0
            ? 1
            : interpolate(dropSpring, [0, 0.6, 1], [1.32, 1.02, 1.0]);

        const frameFill = '#ffffff';
        const photoFill = isLumaMatte ? '#000000' : '#66d133';
        const shadowStyle = isLumaMatte
          ? 'none'
          : '0 24px 55px rgba(0, 0, 0, 0.38), 0 8px 18px rgba(0, 0, 0, 0.20)';

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: cardW,
              height: cardH,
              left: currentX - cardW / 2,
              top: currentY - cardH / 2,
              backgroundColor: frameFill,
              borderRadius: 6,
              boxShadow: shadowStyle,
              transform: `rotate(${currentAngle}deg) scale(${currentScale})`,
              transformOrigin: 'center center',
              zIndex: idx + 1,
            }}
          >
            {/* Inner Photo Placeholder Window */}
            <div
              style={{
                position: 'absolute',
                left: borderSides,
                top: borderTop,
                width: photoW,
                height: photoH,
                backgroundColor: photoFill,
                borderRadius: 3,
                boxShadow: isLumaMatte ? 'none' : 'inset 0 1px 4px rgba(0, 0, 0, 0.18)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
