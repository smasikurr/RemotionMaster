import React, { useMemo } from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { makeStar } from '@remotion/shapes';
import { drawTrimPath } from '../utils/proceduralMaster';

export interface TicketLineIconCanvasProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
}

export const TicketLineIconCanvas: React.FC<TicketLineIconCanvasProps> = ({
  width = 3840,
  height = 2160,
  strokeColor = '#141414',
  strokeWidth = 14,
  backgroundColor = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();

  const cx = width / 2;
  const cy = height / 2;

  // Geometry dimensions in 4K space
  const ticketWidth = 1420;
  const ticketHeight = 820;
  const x0 = cx - ticketWidth / 2;
  const x1 = cx + ticketWidth / 2;
  const y0 = cy - ticketHeight / 2;
  const y1 = cy + ticketHeight / 2;

  const cornerRadius = 28;
  const notchRadius = 46;
  const notchSpacing = 180;
  const notchYPositions = [cy - notchSpacing, cy, cy + notchSpacing];

  // 1. Build Scalloped Ticket Border SVG Path
  // Starts at top-left corner, goes down left side (with 3 inward notches), across bottom, up right side, closes along top.
  const dTicket = useMemo(() => {
    let d = `M ${x0 + cornerRadius} ${y0} `;
    // Top-left corner
    d += `A ${cornerRadius} ${cornerRadius} 0 0 0 ${x0} ${y0 + cornerRadius} `;
    // Left edge with 3 inward semicircular notches
    for (const ny of notchYPositions) {
      d += `L ${x0} ${ny - notchRadius} `;
      d += `A ${notchRadius} ${notchRadius} 0 0 1 ${x0} ${ny + notchRadius} `;
    }
    d += `L ${x0} ${y1 - cornerRadius} `;
    // Bottom-left corner
    d += `A ${cornerRadius} ${cornerRadius} 0 0 0 ${x0 + cornerRadius} ${y1} `;
    // Bottom horizontal edge
    d += `L ${x1 - cornerRadius} ${y1} `;
    // Bottom-right corner
    d += `A ${cornerRadius} ${cornerRadius} 0 0 0 ${x1} ${y1 - cornerRadius} `;
    // Right edge with 3 inward semicircular notches (going upwards)
    for (const ny of [...notchYPositions].reverse()) {
      d += `L ${x1} ${ny + notchRadius} `;
      d += `A ${notchRadius} ${notchRadius} 0 0 1 ${x1} ${ny - notchRadius} `;
    }
    d += `L ${x1} ${y0 + cornerRadius} `;
    // Top-right corner
    d += `A ${cornerRadius} ${cornerRadius} 0 0 0 ${x1 - cornerRadius} ${y0} `;
    // Close path along top edge
    d += `Z`;
    return d;
  }, [x0, x1, y0, y1, cornerRadius, notchRadius, notchYPositions]);

  // 2. Center 8-pointed Star Emblem Path
  const starData = useMemo(() => {
    return makeStar({
      points: 8,
      innerRadius: 108,
      outerRadius: 148,
    });
  }, []);

  // 3. Top and Bottom Hollow Pill Bars (Rounded Rectangles matching reference)
  const barWidth = 760;
  const barHeight = 32;
  const barRadius = 16;
  const barHalfW = barWidth / 2;
  const topBarY = cy - 240;
  const botBarY = cy + 240;

  const createPillPath = (barCenterY: number) => {
    const bx0 = cx - barHalfW;
    const bx1 = cx + barHalfW;
    const by0 = barCenterY - barHeight / 2;
    const by1 = barCenterY + barHeight / 2;
    let d = `M ${bx0 + barRadius} ${by0} `;
    d += `L ${bx1 - barRadius} ${by0} `;
    d += `A ${barRadius} ${barRadius} 0 0 1 ${bx1} ${barCenterY} `;
    d += `A ${barRadius} ${barRadius} 0 0 1 ${bx1 - barRadius} ${by1} `;
    d += `L ${bx0 + barRadius} ${by1} `;
    d += `A ${barRadius} ${barRadius} 0 0 1 ${bx0} ${barCenterY} `;
    d += `A ${barRadius} ${barRadius} 0 0 1 ${bx0 + barRadius} ${by0} `;
    d += `Z`;
    return d;
  };

  const dTopBar = useMemo(() => createPillPath(topBarY), [cx, topBarY]);
  const dBotBar = useMemo(() => createPillPath(botBarY), [cx, botBarY]);

  // 4. Symmetrical Side Circles Paths
  const circleRadius = 44;
  const leftCircleX = cx - 325;
  const rightCircleX = cx + 325;
  const dLeftCircle = useMemo(() => {
    return `M ${leftCircleX} ${cy - circleRadius} A ${circleRadius} ${circleRadius} 0 1 1 ${leftCircleX - 0.01} ${cy - circleRadius} Z`;
  }, [leftCircleX, cy, circleRadius]);
  const dRightCircle = useMemo(() => {
    return `M ${rightCircleX} ${cy - circleRadius} A ${circleRadius} ${circleRadius} 0 1 1 ${rightCircleX - 0.01} ${cy - circleRadius} Z`;
  }, [rightCircleX, cy, circleRadius]);

  // ==========================================
  // PHASE 1: DUAL CONCENTRIC SWIRL ARCS (0 - 110)
  // Sweeping clockwise from top-right down through bottom to top-left
  // ==========================================
  const swirlActive = frame >= 0 && frame <= 110;
  const swirl1 = useMemo(() => {
    if (!swirlActive) return null;
    const r = 420;
    // Sweeps clockwise around center
    const rot = interpolate(frame, [0, 110], [-40, 270], {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });
    const lenDeg = interpolate(frame, [0, 45, 90, 110], [20, 140, 40, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });
    const opacity = interpolate(frame, [85, 110], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    if (lenDeg <= 1 || opacity <= 0.01) return null;

    const a1 = (rot * Math.PI) / 180;
    const a2 = ((rot + lenDeg) * Math.PI) / 180;
    const xStart = cx + r * Math.cos(a1);
    const yStart = cy + r * Math.sin(a1);
    const xEnd = cx + r * Math.cos(a2);
    const yEnd = cy + r * Math.sin(a2);
    const largeArc = lenDeg > 180 ? 1 : 0;
    const d = `M ${xStart.toFixed(1)} ${yStart.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${xEnd.toFixed(1)} ${yEnd.toFixed(1)}`;
    return { d, opacity };
  }, [frame, swirlActive, cx, cy]);

  const swirl2 = useMemo(() => {
    if (!swirlActive || frame < 12) return null;
    const r = 330;
    const rot = interpolate(frame, [12, 110], [-20, 280], {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });
    const lenDeg = interpolate(frame, [12, 55, 95, 110], [15, 110, 30, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });
    const opacity = interpolate(frame, [85, 110], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    if (lenDeg <= 1 || opacity <= 0.01) return null;

    const a1 = (rot * Math.PI) / 180;
    const a2 = ((rot + lenDeg) * Math.PI) / 180;
    const xStart = cx + r * Math.cos(a1);
    const yStart = cy + r * Math.sin(a1);
    const xEnd = cx + r * Math.cos(a2);
    const yEnd = cy + r * Math.sin(a2);
    const largeArc = lenDeg > 180 ? 1 : 0;
    const d = `M ${xStart.toFixed(1)} ${yStart.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${xEnd.toFixed(1)} ${yEnd.toFixed(1)}`;
    return { d, opacity };
  }, [frame, swirlActive, cx, cy]);

  // ==========================================
  // PHASE 2 & 4: TICKET OUTER BORDER TRIM PATH
  // In: frames 105 -> 200, Out: frames 580 -> 690
  // ==========================================
  const ticketTrim = useMemo(() => {
    if (frame < 105) return null;
    if (frame < 575) {
      return drawTrimPath(dTicket, 105, 200, frame, false);
    }
    return drawTrimPath(dTicket, 580, 690, frame, true);
  }, [frame, dTicket]);

  // ==========================================
  // PHASE 3 & 4: INNER ELEMENTS TRIM PATHS
  // Star Emblem: In 175 -> 245, Out 570 -> 650
  // Top Bar: In 195 -> 255, Out 575 -> 660
  // Bot Bar: In 205 -> 265, Out 575 -> 660
  // Left Circle: In 220 -> 265, Out 570 -> 640
  // Right Circle: In 225 -> 270, Out 570 -> 640
  // ==========================================
  const starTrim = useMemo(() => {
    if (frame < 175) return null;
    if (frame < 570) {
      return drawTrimPath(starData.path, 175, 245, frame, false);
    }
    return drawTrimPath(starData.path, 570, 650, frame, true);
  }, [frame, starData.path]);

  const topBarTrim = useMemo(() => {
    if (frame < 195) return null;
    if (frame < 575) {
      return drawTrimPath(dTopBar, 195, 255, frame, false);
    }
    return drawTrimPath(dTopBar, 575, 660, frame, true);
  }, [frame, dTopBar]);

  const botBarTrim = useMemo(() => {
    if (frame < 205) return null;
    if (frame < 575) {
      return drawTrimPath(dBotBar, 205, 265, frame, false);
    }
    return drawTrimPath(dBotBar, 575, 660, frame, true);
  }, [frame, dBotBar]);

  const leftCircleTrim = useMemo(() => {
    if (frame < 220) return null;
    if (frame < 570) {
      return drawTrimPath(dLeftCircle, 220, 265, frame, false);
    }
    return drawTrimPath(dLeftCircle, 570, 640, frame, true);
  }, [frame, dLeftCircle]);

  const rightCircleTrim = useMemo(() => {
    if (frame < 225) return null;
    if (frame < 570) {
      return drawTrimPath(dRightCircle, 225, 270, frame, false);
    }
    return drawTrimPath(dRightCircle, 570, 640, frame, true);
  }, [frame, dRightCircle]);

  // Subtle breathing pulse during hold (frames 270 -> 570)
  const breathingScale = useMemo(() => {
    if (frame < 270 || frame > 570) return 1.0;
    const progress = (frame - 270) / 300;
    // Classy subtle 1.5-cycle pulse (1.0 -> 1.018 -> 1.0)
    return 1.0 + 0.016 * Math.sin(progress * Math.PI * 2 * 1.5);
  }, [frame]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      >
        {/* PHASE 1: Swirl Arcs */}
        {swirl1 && (
          <path
            d={swirl1.d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={swirl1.opacity}
          />
        )}
        {swirl2 && (
          <path
            d={swirl2.d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={swirl2.opacity}
          />
        )}

        {/* TICKET ICON MAIN GROUP with subtle breathing scale */}
        <g
          transform={`translate(${cx}, ${cy}) scale(${breathingScale}) translate(${-cx}, ${-cy})`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Ticket Outer Scalloped Border */}
          {ticketTrim && ticketTrim.progress > 0 && (
            <path
              d={dTicket}
              strokeDasharray={ticketTrim.strokeDasharray}
              strokeDashoffset={ticketTrim.strokeDashoffset}
            />
          )}

          {/* Top Pill Bar */}
          {topBarTrim && topBarTrim.progress > 0 && (
            <path
              d={dTopBar}
              strokeDasharray={topBarTrim.strokeDasharray}
              strokeDashoffset={topBarTrim.strokeDashoffset}
            />
          )}

          {/* Bottom Pill Bar */}
          {botBarTrim && botBarTrim.progress > 0 && (
            <path
              d={dBotBar}
              strokeDasharray={botBarTrim.strokeDasharray}
              strokeDashoffset={botBarTrim.strokeDashoffset}
            />
          )}

          {/* Center 8-pointed Star Emblem (Rotated 22.5deg so top point faces vertical 12 o'clock) */}
          {starTrim && starTrim.progress > 0 && (
            <g transform={`translate(${cx}, ${cy}) rotate(22.5) translate(${-starData.width / 2}, ${-starData.height / 2})`}>
              <path
                d={starData.path}
                strokeDasharray={starTrim.strokeDasharray}
                strokeDashoffset={starTrim.strokeDashoffset}
              />
            </g>
          )}

          {/* Left Circle */}
          {leftCircleTrim && leftCircleTrim.progress > 0 && (
            <path
              d={dLeftCircle}
              strokeDasharray={leftCircleTrim.strokeDasharray}
              strokeDashoffset={leftCircleTrim.strokeDashoffset}
            />
          )}

          {/* Right Circle */}
          {rightCircleTrim && rightCircleTrim.progress > 0 && (
            <path
              d={dRightCircle}
              strokeDasharray={rightCircleTrim.strokeDasharray}
              strokeDashoffset={rightCircleTrim.strokeDashoffset}
            />
          )}
        </g>
      </svg>
    </div>
  );
};
