import { createCheckInService } from "../../../src/server/state/checkInService.js";

describe("check-in service", () => {
  it("creates an estimated state and lowers confidence when animal details are missing", () => {
    const service = createCheckInService({
      saveCheckIn: () => undefined,
      saveEstimatedState: (value) => value,
    });

    const result = service.record({
      recordedAt: "2026-04-18T08:00:00.000Z",
      flowerBalance: 120,
      crops: [
        {
          name: "Pumpkin",
          plots: 8,
          startedAt: "2026-04-18T07:30:00.000Z",
        },
      ],
      animals: [],
      trackedItems: { Egg: 12 },
    });

    expect(result.confidence).toBeLessThan(1);
    expect(result.reasons).toContain("missing-animal-checkin");
    expect(result.activeLoops[0]).toMatchObject({
      kind: "crop",
      name: "Pumpkin",
    });
  });
});
