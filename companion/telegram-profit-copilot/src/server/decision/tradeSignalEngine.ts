export type TradeSignal = {
  action: "sell_now" | "watch" | "hold" | "ignore";
  item: string;
  netProfit: number;
  rationale: string;
};

export function filterTradeSignals(
  signals: TradeSignal[],
  minimumNetProfit: number,
) {
  return signals.filter(
    (signal) => signal.action === "sell_now" && signal.netProfit >= minimumNetProfit,
  );
}
