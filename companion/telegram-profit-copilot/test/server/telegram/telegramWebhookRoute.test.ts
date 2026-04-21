import { buildApp } from "../../../src/server/http/buildApp.js";

describe("POST /webhooks/telegram", () => {
  it("advances the guided check-in flow from /checkin to the crop prompt", async () => {
    const app = buildApp({
      port: 4318,
      databasePath: ":memory:",
      telegramBotToken: "bot-token",
      telegramChatId: "12345",
      sflApiUrl: "https://api.sunflower-land.com",
      marketPollMs: 60000,
      reminderPollMs: 30000,
    });

    const response = await app.inject({
      method: "POST",
      url: "/webhooks/telegram",
      payload: {
        message: {
          chat: { id: 12345 },
          text: "/checkin",
        },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      ok: true,
      nextPrompt: "Which crop or fruit loops are active?",
    });
  });
});
