import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * CartoonGoldCoinStacksGrowthCanvas
 * 1:1 Exact Authentic Re-creation of Reference istockphoto-2152111346-640_adpp_is.mp4 (10.01s)
 *
 * Calibrated Characteristics:
 * - Canvas: 3840x2160 UHD on Pure Chroma Green Screen (#00E500).
 * - Perfectly centered composition (baseY at ~64% height).
 * - 5 Ascending stacks of individual 2.5D isometric gold coins (4, 7, 10, 14, 18 coins).
 * - Bold red platform base (#FF3322) with rounded pill ends directly supporting the coins.
 * - Bold royal blue (#2563EB) zig-zag growth trend line with sharp miter joints and diagonal blunt end.
 * - Dynamic spring pop-in sequencing.
 */
interface Props {
  width: number;
  height: number;
}

export const CartoonGoldCoinStacksGrowthCanvas: React.FC<Props> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Pure Chroma Green Background (#00E500)
    ctx.fillStyle = "#00e500";
    ctx.fillRect(0, 0, width, height);

    const time = frame / fps;

    // Centered coordinates
    const centerX = width * 0.5;
    const baseY = height * 0.64; // Perfectly matches reference vertical centering

    // Baseline growth
    const baseProgress = spring({
      frame,
      fps,
      config: { damping: 14, stiffness: 100 },
    });

    // -------------------------------------------------------------------------
    // 2. RED BASELINE PLATFORM
    // -------------------------------------------------------------------------
    const platformW = 1560 * baseProgress;
    const platformH = 46;

    ctx.save();
    ctx.fillStyle = "#ff3322";
    ctx.beginPath();
    ctx.roundRect(
      centerX - platformW * 0.5,
      baseY - platformH * 0.5,
      platformW,
      platformH,
      23
    );
    ctx.fill();
    ctx.restore();

    // -------------------------------------------------------------------------
    // 3. 5 ASCENDING 2.5D ISOMETRIC COIN STACKS
    // -------------------------------------------------------------------------
    // Exact coin counts: 4, 7, 10, 14, 18
    const stackCounts = [4, 7, 10, 14, 18];
    const coinPitchX = 265;
    const coinW = 236;
    const coinH = 62;
    const coinStep = 25;

    const startX = centerX - (stackCounts.length - 1) * coinPitchX * 0.5;

    stackCounts.forEach((targetCount, stackIdx) => {
      const stackX = startX + stackIdx * coinPitchX;
      const stackStartFrame = 10 + stackIdx * 12;
      const stackProgress = spring({
        frame: frame - stackStartFrame,
        fps,
        config: { damping: 12, stiffness: 120 },
      });

      const currentCoins = Math.min(targetCount, Math.floor(stackProgress * (targetCount + 0.99)));
      const bounce = stackProgress > 0.8 ? Math.sin((frame - stackStartFrame) * 0.25) * 3 * (1 - stackProgress) : 0;

      for (let c = 0; c < currentCoins; c++) {
        const coinY = baseY - platformH * 0.5 - 14 - c * coinStep + bounce;
        const isTopCoin = c === currentCoins - 1;

        ctx.save();

        // 1. Dark warm orange bottom shadow seam
        ctx.fillStyle = "#9a3412";
        ctx.beginPath();
        ctx.ellipse(stackX, coinY + 14, coinW * 0.5, coinH * 0.5, 0, 0, Math.PI);
        ctx.fill();

        // 2. 3D Coin Edge Cylinder
        const edgeGrad = ctx.createLinearGradient(
          stackX - coinW * 0.5,
          coinY,
          stackX + coinW * 0.5,
          coinY
        );
        edgeGrad.addColorStop(0.0, "#ea580c");
        edgeGrad.addColorStop(0.2, "#f59e0b");
        edgeGrad.addColorStop(0.5, "#fbbf24");
        edgeGrad.addColorStop(0.8, "#d97706");
        edgeGrad.addColorStop(1.0, "#b45309");

        ctx.fillStyle = edgeGrad;
        ctx.beginPath();
        ctx.ellipse(stackX, coinY + 14, coinW * 0.5, coinH * 0.5, 0, 0, Math.PI);
        ctx.lineTo(stackX - coinW * 0.5, coinY);
        ctx.ellipse(stackX, coinY, coinW * 0.5, coinH * 0.5, 0, Math.PI, 0, true);
        ctx.lineTo(stackX + coinW * 0.5, coinY + 14);
        ctx.closePath();
        ctx.fill();

        // Edge reeded lines
        ctx.strokeStyle = "rgba(180, 83, 9, 0.4)";
        ctx.lineWidth = 2.0;
        for (let r = -4; r <= 4; r++) {
          const rx = stackX + r * 24;
          ctx.beginPath();
          ctx.moveTo(rx, coinY + 8);
          ctx.lineTo(rx, coinY + 20);
          ctx.stroke();
        }

        // 3. Coin Top Face Ellipse
        const topGrad = ctx.createLinearGradient(
          stackX,
          coinY - coinH * 0.5,
          stackX,
          coinY + coinH * 0.5
        );
        topGrad.addColorStop(0.0, "#fef08a");
        topGrad.addColorStop(0.4, "#fde047");
        topGrad.addColorStop(0.8, "#facc15");
        topGrad.addColorStop(1.0, "#eab308");

        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.ellipse(stackX, coinY, coinW * 0.5, coinH * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Inner Ring Border
        ctx.strokeStyle = "#ca8a04";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.ellipse(stackX, coinY, coinW * 0.42, coinH * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 5. Embossed '$' Symbol on the Top-most Coin
        if (isTopCoin) {
          ctx.fillStyle = "#a16207";
          ctx.font = "bold 36px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.save();
          ctx.translate(stackX, coinY);
          ctx.scale(1.0, 0.48);
          ctx.fillText("$", 0, 0);
          ctx.restore();
        }

        ctx.restore();
      }
    });

    // -------------------------------------------------------------------------
    // 4. ROYAL BLUE ZIG-ZAG GROWTH TREND LINE (EXACT REFERENCE GEOMETRY)
    // -------------------------------------------------------------------------
    const trendPoints = [
      { x: startX - 165, y: baseY - 240 },
      { x: startX + 45,  y: baseY - 460 },
      { x: startX + 160, y: baseY - 350 },
      { x: startX + 440, y: baseY - 620 },
      { x: startX + 570, y: baseY - 520 },
      { x: startX + 850, y: baseY - 740 },
    ];

    const arrowProgress = interpolate(frame, [50, 115], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    if (arrowProgress > 0) {
      ctx.save();
      ctx.strokeStyle = "#2563eb";
      ctx.fillStyle = "#2563eb";
      ctx.lineWidth = 36;
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      ctx.miterLimit = 4;

      let totalLen = 0;
      const segLens: number[] = [];
      for (let i = 0; i < trendPoints.length - 1; i++) {
        const dx = trendPoints[i + 1].x - trendPoints[i].x;
        const dy = trendPoints[i + 1].y - trendPoints[i].y;
        const len = Math.hypot(dx, dy);
        segLens.push(len);
        totalLen += len;
      }

      const targetLen = totalLen * arrowProgress;
      let drawnLen = 0;

      ctx.beginPath();
      ctx.moveTo(trendPoints[0].x, trendPoints[0].y);

      for (let i = 0; i < segLens.length; i++) {
        const pA = trendPoints[i];
        const pB = trendPoints[i + 1];
        const seg = segLens[i];

        if (drawnLen + seg <= targetLen) {
          ctx.lineTo(pB.x, pB.y);
          drawnLen += seg;
        } else {
          const remain = targetLen - drawnLen;
          const frac = remain / seg;
          ctx.lineTo(pA.x + (pB.x - pA.x) * frac, pA.y + (pB.y - pA.y) * frac);
          break;
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [frame, fps, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        backgroundColor: "#00e500",
      }}
    />
  );
};
