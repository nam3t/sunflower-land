import type { TradeableSnapshot } from "./marketApiClient.js";

export type DerivedMarketSignal = {
  action: "sell_now" | "watch" | "hold" | "ignore";
  itemKey: string;
  netProfit: number;
  rationale: string;
};

export function deriveMarketSignal({
  itemKey,
  snapshot,
  baselinePrice,
  minimumNetProfit,
  feeRate = 0.1,
}: {
  itemKey: string;
  snapshot: TradeableSnapshot;
  baselinePrice: number;
  minimumNetProfit: number;
  feeRate?: number;
}): DerivedMarketSignal {
  const gross = snapshot.floor - baselinePrice;
  const netProfit = gross - snapshot.floor * feeRate;

  if (netProfit >= minimumNetProfit) {
    return {
      action: "sell_now",
      itemKey,
      netProfit,
      rationale: `${((snapshot.floor / baselinePrice - 1) * 100).toFixed(1)}% above baseline after fees`,
    };
  }

  return {
    action: "watch",
    itemKey,
    netProfit,
    rationale: "Below the configured sell threshold",
  };
}
