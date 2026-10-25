import React from "react";
import { useVideoConfig } from "remotion";
import { CartoonGoldCoinStacksGrowthCanvas } from "../craft/CartoonGoldCoinStacksGrowthCanvas";

/**
 * GreenScreen3DFinancialBarChartGrowth4K (Rebuilt as 1:1 Cartoon Gold Coin Stacks Growth)
 * Stock Motion Graphics Video 20/81
 * Reference: istockphoto-2152111346-640_adpp_is.mp4 (10.01s)
 *
 * 1:1 Authentic Re-creation:
 * - 2.5D Isometric cartoon gold coin stacks ascending in height (3, 6, 9, 12, 16 coins)
 * - Embossed '$' symbol on top face and reeded 3D cylinder edge shading
 * - Red baseline platform supporting the stacks
 * - Royal Blue upward zig-zag trend line with growth arrowhead
 * - 100% Pure Chroma Green Screen (#00E500) for instant keying in all NLEs
 */
export const GreenScreen3DFinancialBarChartGrowth4K: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#00e500",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CartoonGoldCoinStacksGrowthCanvas width={width} height={height} />
    </div>
  );
};
