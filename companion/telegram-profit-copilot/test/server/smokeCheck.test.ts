import { buildApp } from "../../src/server/http/buildApp.js";

describe("smoke check", () => {
  it("exposes health, dashboard settings, and telegram webhook routes", async () => {
    const app = buildApp({
      port: 4318,
      databasePath: ":memory:",
      telegramBotToken: "bot-token",
      telegramChatId: "12345",
      sflApiUrl: "https://api.sunflower-land.com",
      marketPollMs: 60000,
      reminderPollMs: 30000,
    });

    const [health, settings, webhook] = await Promise.all([
      app.inject({ method: "GET", url: "/health" }),
      app.inject({ method: "GET", url: "/api/settings" }),
      app.inject({
        method: "POST",
        url: "/webhooks/telegram",
        payload: {
          message: {
            chat: { id: 1 },
            text: "/checkin",
          },
        },
      }),
    ]);

    expect(health.statusCode).toBe(200);
    expect(settings.statusCode).toBe(200);
    expect(webhook.statusCode).toBe(200);
  });
});
