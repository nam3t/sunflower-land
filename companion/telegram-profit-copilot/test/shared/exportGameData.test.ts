describe("buildGameData", () => {
  it("normalizes crop, fruit, and animal data into runtime-safe JSON", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    jest.resetModules();

    const { buildGameData } = require("../../../../_scripts/exportProfitCopilotGameData");
    const { GAME_DATA } = require("../../src/shared/gameData");

    try {
      const data = await buildGameData();

      expect(data.crops.Sunflower).toMatchObject({
        sellPrice: 0.02,
        harvestSeconds: 60,
      });
      expect(data.fruits.Tomato).toMatchObject({
        sellPrice: 2,
        plantSeconds: 7200,
      });
      expect(data.animals.Chicken.feedOptions["Kernel Blend"]).toMatchObject({
        preferredAtLevels: [0, 1, 2],
      });
      expect(GAME_DATA).toEqual(data);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});
