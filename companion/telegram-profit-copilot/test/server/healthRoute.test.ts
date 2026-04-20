import { buildApp } from "../../src/server/http/buildApp";

describe("GET /health", () => {
  it("returns ok with worker mode metadata", async () => {
    const app = buildApp({
      port: 4318,
      databasePath: ":memory:",
      telegramBotToken: "bot-token",
      telegramChatId: "12345",
      sflApiUrl: "https://api.sunflower-land.com",
      marketPollMs: 60000,
      reminderPollMs: 30000,
    });

    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ok",
      service: "telegram-profit-copilot",
    });
  });
});
