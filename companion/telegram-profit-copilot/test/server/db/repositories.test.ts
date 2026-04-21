import { openDatabase } from "../../../src/server/db/openDatabase.js";
import { runMigrations } from "../../../src/server/db/runMigrations.js";
import { createCheckInRepository } from "../../../src/server/db/repositories/checkInRepository.js";
import { createMarketRepository } from "../../../src/server/db/repositories/marketRepository.js";
import { createReminderRepository } from "../../../src/server/db/repositories/reminderRepository.js";
import { createSettingsRepository } from "../../../src/server/db/repositories/settingsRepository.js";
import { createStateRepository } from "../../../src/server/db/repositories/stateRepository.js";
import { createTelegramSessionRepository } from "../../../src/server/db/repositories/telegramSessionRepository.js";

describe("SQLite repositories", () => {
  it("persists settings and the latest estimated state", () => {
    const db = openDatabase(":memory:");
    runMigrations(db);

    const settingsRepository = createSettingsRepository(db);
    const stateRepository = createStateRepository(db);
    const checkInRepository = createCheckInRepository(db);
    const marketRepository = createMarketRepository(db);
    const reminderRepository = createReminderRepository(db);
    const telegramSessionRepository = createTelegramSessionRepository(db);

    settingsRepository.upsertMarketToken("raw-token");
    stateRepository.saveLatest({
      recordedAt: "2026-04-20T00:30:00.000Z",
      confidence: 0.75,
      reasons: ["missing animal details"],
      flowerBalance: 120,
      trackedItems: { Egg: 12 },
      activeLoops: [],
    });
    checkInRepository.save({
      recordedAt: "2026-04-20T00:30:00.000Z",
      flowerBalance: 120,
      crops: [
        {
          name: "Pumpkin",
          plots: 8,
          startedAt: "2026-04-20T00:00:00.000Z",
        },
      ],
      animals: [],
      trackedItems: { Egg: 12 },
    });
    marketRepository.saveSnapshot("sunflower", {
      price: 2,
      observedAt: "2026-04-20T00:00:00.000Z",
    });
    marketRepository.saveSnapshot("sunflower", {
      price: 3,
      observedAt: "2026-04-20T01:00:00.000Z",
    });
    marketRepository.saveSnapshot("potato", {
      price: 10,
      observedAt: "2026-04-20T00:15:00.000Z",
    });
    marketRepository.saveSnapshot("potato", {
      price: 11,
      observedAt: "2026-04-20T01:15:00.000Z",
    });
    reminderRepository.upsert({
      dedupeKey: "reminder-1",
      dueAt: "2026-04-20T00:00:00.000Z",
      kind: "daily-check-in",
      payload: { chatId: "12345" },
    });
    telegramSessionRepository.save("12345", "active", {
      step: "waiting-for-confirmation",
    });

    expect(settingsRepository.getMarketToken()).toBe("raw-token");
    expect(stateRepository.getLatest()).toMatchObject({
      confidence: 0.75,
      flowerBalance: 120,
    });
    expect(
      db
        .prepare("SELECT recorded_at, payload_json FROM check_ins ORDER BY id DESC LIMIT 1")
        .get() as { recorded_at: string; payload_json: string },
    ).toMatchObject({
      recorded_at: "2026-04-20T00:30:00.000Z",
      payload_json: expect.stringContaining("\"Pumpkin\""),
    });
    expect(marketRepository.getLatestSnapshot("sunflower")).toMatchObject({
      price: 3,
      observedAt: "2026-04-20T01:00:00.000Z",
    });
    expect(marketRepository.getLatestSnapshot("potato")).toMatchObject({
      price: 11,
      observedAt: "2026-04-20T01:15:00.000Z",
    });
    expect(reminderRepository.getDueJobs("2026-04-20T00:00:00.000Z")).toHaveLength(
      1,
    );
    const dueJobs = reminderRepository.getDueJobs("2026-04-20T00:00:00.000Z");

    expect(dueJobs[0]).toMatchObject({
      dedupeKey: "reminder-1",
      kind: "daily-check-in",
    });
    expect(dueJobs[0].id).toEqual(expect.any(Number));
    reminderRepository.markSent(dueJobs[0].id);
    expect(reminderRepository.getDueJobs("2026-04-20T00:00:00.000Z")).toHaveLength(
      0,
    );
    expect(telegramSessionRepository.get("12345")).toMatchObject({
      state: "active",
      payload: {
        step: "waiting-for-confirmation",
      },
    });
  });
});
