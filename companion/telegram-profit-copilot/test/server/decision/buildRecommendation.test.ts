import { buildRecommendation } from "../../../src/server/decision/buildRecommendation.js";

describe("buildRecommendation", () => {
  it("prefers a profitable trade signal when it beats the next crop loop after fees", () => {
    const result = buildRecommendation({
      estimatedState: {
        recordedAt: "2026-04-18T08:00:00.000Z",
        flowerBalance: 100,
        confidence: 1,
        reasons: [],
        trackedItems: { Tomato: 30 },
        activeLoops: [],
      },
      marketSignals: [
        {
          action: "sell_now",
          item: "Tomato",
          netProfit: 18,
          rationale: "14% above 7d baseline after tax",
        },
      ],
    });

    expect(result.bestAction.kind).toBe("trade");
    expect(result.bestAction.title).toMatch(/Tomato/);
    expect(result.bestAction.rationale).toMatch(/14% above 7d baseline/);
  });
});
