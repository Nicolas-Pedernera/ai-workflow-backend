export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskAnalysisInput {
  asset: string;
  position: "long" | "short";
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  collateral: number;
}

export interface RiskAnalysis {
  asset: string;
  position: "long" | "short";
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  collateral: number;
  exposure: number;
  priceChangePercent: number;
  pnl: number;
  equity: number;
  collateralLossPercent: number;
  estimatedLiquidationPrice: number;
  riskLevel: RiskLevel;
  methodology: string;
}

function isPositiveFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function analyzeRisk(
  input: Record<string, unknown>
): RiskAnalysis | undefined {
  const {
    asset,
    position,
    entryPrice,
    currentPrice,
    leverage,
    collateral
  } = input;

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

  const collateralLossPercent =
    ((collateral - equity) / collateral) * 100;

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
