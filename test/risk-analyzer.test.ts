import { describe, expect, it } from "vitest";
import { analyzeRisk } from "../src/modules/risk/risk-analyzer.js";

describe("analyzeRisk", () => {
  it("calculates a long position correctly", () => {
    const result = analyzeRisk({
      asset: "ETH",
      position: "long",
      entryPrice: 3200,
      currentPrice: 2850,
      leverage: 5,
      collateral: 1000
    });

    expect(result).toBeDefined();

    expect(result?.exposure).toBe(5000);
    expect(result?.priceChangePercent).toBeCloseTo(-10.9375, 4);
    expect(result?.pnl).toBeCloseTo(-546.875, 4);
    expect(result?.equity).toBeCloseTo(453.125, 4);
    expect(result?.collateralLossPercent).toBeCloseTo(54.6875, 4);
    expect(result?.estimatedLiquidationPrice).toBe(2560);
    expect(result?.riskLevel).toBe("high");
  });

  it("calculates a short position correctly", () => {
    const result = analyzeRisk({
      asset: "ETH",
      position: "short",
      entryPrice: 3200,
      currentPrice: 2850,
      leverage: 5,
      collateral: 1000
    });

    expect(result).toBeDefined();

    expect(result?.exposure).toBe(5000);
    expect(result?.priceChangePercent).toBeCloseTo(10.9375, 4);
    expect(result?.pnl).toBeCloseTo(546.875, 4);
    expect(result?.equity).toBeCloseTo(1546.875, 4);
    expect(result?.riskLevel).toBe("low");
  });

  it("returns critical risk when equity reaches zero", () => {
    const result = analyzeRisk({
      asset: "ETH",
      position: "long",
      entryPrice: 1000,
      currentPrice: 800,
      leverage: 5,
      collateral: 1000
    });

    expect(result).toBeDefined();
    expect(result?.equity).toBe(0);
    expect(result?.riskLevel).toBe("critical");
  });

  it("returns medium risk when collateral loss reaches 25%", () => {
    const result = analyzeRisk({
      asset: "ETH",
      position: "long",
      entryPrice: 1000,
      currentPrice: 950,
      leverage: 5,
      collateral: 1000
    });

    expect(result).toBeDefined();
    expect(result?.collateralLossPercent).toBeCloseTo(25, 4);
    expect(result?.riskLevel).toBe("medium");
  });

  it("rejects invalid input", () => {
    const result = analyzeRisk({
      asset: "ETH",
      position: "long",
      entryPrice: 3200,
      currentPrice: 2850,
      leverage: 0,
      collateral: 1000
    });

    expect(result).toBeUndefined();
  });
});
