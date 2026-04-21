import { scoreAnimalFeed } from "./animalEngine.js";
import { scoreCropLoop } from "./cropEngine.js";
import { rankActions, type RankedAction } from "./rankActions.js";
import { filterTradeSignals, type TradeSignal } from "./tradeSignalEngine.js";
import type { EstimatedState } from "../state/stateTypes.js";

export function buildRecommendation({
  estimatedState,
  marketSignals,
}: {
  estimatedState: EstimatedState;
  marketSignals: TradeSignal[];
}) {
  const actions: RankedAction[] = filterTradeSignals(marketSignals, 5).map(
    (signal) => ({
      kind: "trade",
      title: `Sell ${signal.item}`,
      score: signal.netProfit * estimatedState.confidence,
      rationale: signal.rationale,
    }),
  );

  Object.entries(estimatedState.trackedItems).forEach(([itemName, quantity]) => {
    const cropScore = scoreCropLoop(itemName, quantity);

    if (cropScore > 0) {
      actions.push({
        kind: "crop" as const,
        title: `Reinvest in ${itemName}`,
        score: cropScore * estimatedState.confidence,
        rationale: `Crop loop score ${cropScore.toFixed(2)} profit/hour`,
      });
      return;
    }

    const animalScore = scoreAnimalFeed("Chicken", "Kernel Blend", 1);

    if (animalScore > 0) {
      actions.push({
        kind: "animal" as const,
        title: "Feed Chicken with Kernel Blend",
        score: animalScore * estimatedState.confidence,
        rationale: `Animal loop score ${animalScore.toFixed(2)}`,
      });
    }
  });

  const ranked = rankActions(actions);

  return {
    bestAction: ranked[0],
    alternatives: ranked.slice(1, 3),
  };
}
