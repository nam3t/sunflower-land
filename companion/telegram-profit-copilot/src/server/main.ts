import { loadConfig } from "./config/loadConfig.js";
import { buildApp } from "./http/buildApp.js";
import { openDatabase } from "./db/openDatabase.js";
import { runMigrations } from "./db/runMigrations.js";
import { createReminderWorker } from "./reminders/reminderWorker.js";
import { createTelegramNotifier } from "./telegram/sendTelegramMessage.js";

async function main() {
  const config = loadConfig();
  const db = openDatabase(config.databasePath);
  runMigrations(db);
  const app = buildApp(config);
  const sendTelegramMessage = createTelegramNotifier({
    botToken: config.telegramBotToken,
    chatId: config.telegramChatId,
  });
  const reminderWorker = createReminderWorker({
    getDueJobs: (_nowIso) => [],
    markSent: (_id) => undefined,
    sendMessage: sendTelegramMessage,
  });

  setInterval(() => {
    void reminderWorker.tick();
  }, config.reminderPollMs);

  await app.listen({
    host: "0.0.0.0",
    port: config.port,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
