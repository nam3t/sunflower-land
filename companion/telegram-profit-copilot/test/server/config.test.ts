import { loadConfig } from "../../src/server/config/loadConfig";

describe("loadConfig", () => {
  it("throws when the Telegram token is missing", () => {
    expect(() =>
      loadConfig({
        PORT: "4318",
        DATABASE_PATH: "/tmp/copilot.db",
        TELEGRAM_CHAT_ID: "12345",
        SFL_API_URL: "https://api.sunflower-land.com",
      } as NodeJS.ProcessEnv),
    ).toThrow(/TELEGRAM_BOT_TOKEN/i);
  });

  it("returns parsed defaults for the happy path", () => {
    expect(
      loadConfig({
        PORT: "4318",
        DATABASE_PATH: "/tmp/copilot.db",
        TELEGRAM_BOT_TOKEN: "bot-token",
        TELEGRAM_CHAT_ID: "12345",
        SFL_API_URL: "https://api.sunflower-land.com",
      } as NodeJS.ProcessEnv),
    ).toMatchObject({
      port: 4318,
      databasePath: "/tmp/copilot.db",
      telegramChatId: "12345",
    });
  });
});
