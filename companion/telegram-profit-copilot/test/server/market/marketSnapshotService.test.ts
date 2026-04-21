import { createMarketSnapshotService } from "../../../src/server/market/marketSnapshotService.js";

describe("market snapshot service", () => {
  it("falls back to the latest stored snapshot when the live API fails", async () => {
    const stored = {
      floor: 12,
      lastSalePrice: 11,
      history: { totalSales: 3, totalVolume: 33, dates: {} },
    };

    const service = createMarketSnapshotService({
      fetchTradeable: async () => {
        throw new Error("429");
      },
      saveSnapshot: () => undefined,
      getLatestSnapshot: () => stored,
    });

    await expect(service.refreshTradeable("resources", 1)).resolves.toMatchObject({
      source: "stale-cache",
      snapshot: stored,
    });
  });
});
