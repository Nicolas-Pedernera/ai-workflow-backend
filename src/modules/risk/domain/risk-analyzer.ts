import type { RiskAnalysis, RiskLevel } from "./risk.types.js";

function isPositiveFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function analyzeRisk(
  input: Record<string, unknown>
): RiskAnalysis | undefined {
  const { asset, position, entryPrice, currentPrice, leverage, collateral } =
    input;

  if (
    typeof asset !== "string" ||
    (position !== "long" && position !== "short") ||
    !isPositiveFiniteNumber(entryPrice) ||
    !isPositiveFiniteNumber(currentPrice) ||
    !isPositiveFiniteNumber(leverage) ||
    !isPositiveFiniteNumber(collateral) ||
    leverage < 1
  ) {
    return undefined;
  }

  const exposure = collateral * leverage;

  const rawPriceChange =
    position === "long"
      ? (currentPrice - entryPrice) / entryPrice
      : (entryPrice - currentPrice) / entryPrice;

  const priceChangePercent = rawPriceChange * 100;
  const pnl = exposure * rawPriceChange;
  const equity = collateral + pnl;

  const collateralLossPercent = ((collateral - equity) / collateral) * 100;

  const estimatedLiquidationPrice =
    position === "long"
      ? entryPrice * (1 - 1 / leverage)
      : entryPrice * (1 + 1 / leverage);

  let riskLevel: RiskLevel = "low";

  if (equity <= 0) {
    riskLevel = "critical";
  } else if (collateralLossPercent >= 50) {
    riskLevel = "high";
  } else if (collateralLossPercent >= 25) {
    riskLevel = "medium";
  }

  return {
    asset,
    position,
    entryPrice,
    currentPrice,
    leverage,
    collateral,
    exposure,
    priceChangePercent,
    pnl,
    equity,
    collateralLossPercent,
    estimatedLiquidationPrice,
    riskLevel,
    methodology:
      "Simplified educational model. Excludes maintenance margin, fees, funding, slippage and other exchange-specific liquidation rules."
  };
}
