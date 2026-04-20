import { openDatabase } from "../../../src/server/db/openDatabase.js";
import { runMigrations } from "../../../src/server/db/runMigrations.js";
import { createSettingsRepository } from "../../../src/server/db/repositories/settingsRepository.js";
import { createStateRepository } from "../../../src/server/db/repositories/stateRepository.js";

describe("SQLite repositories", () => {
  it("persists settings and the latest estimated state", () => {
    const db = openDatabase(":memory:");
    runMigrations(db);

    const settingsRepository = createSettingsRepository(db);
    const stateRepository = createStateRepository(db);

    settingsRepository.upsertMarketToken("raw-token");
    stateRepository.saveLatest({
      confidence: 0.75,
      reasons: ["missing animal details"],
      flowerBalance: 120,
      activeLoops: [],
    });

    expect(settingsRepository.getMarketToken()).toBe("raw-token");
    expect(stateRepository.getLatest()).toMatchObject({
      confidence: 0.75,
      flowerBalance: 120,
    });
  });
});
