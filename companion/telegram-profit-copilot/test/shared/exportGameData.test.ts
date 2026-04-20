describe("buildGameData", () => {
  it("normalizes crop, fruit, and animal data into runtime-safe JSON", async () => {
    process.env.NODE_ENV = "metadata";

    const { buildGameData } = await import(
      "../../../../_scripts/exportProfitCopilotGameData"
    );
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
  });
});
