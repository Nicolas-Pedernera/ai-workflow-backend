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
