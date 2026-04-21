import Fastify from "fastify";

import type { AppConfig } from "../config/loadConfig.js";
import { registerDashboardRoutes } from "./routes/dashboardRoutes.js";
import { registerSettingsRoutes } from "./routes/settingsRoutes.js";
import { registerTelegramWebhookRoute } from "./routes/telegramWebhookRoute.js";

export function buildApp(config: AppConfig) {
  const app = Fastify();

  app.get("/health", async () => ({
    status: "ok",
    service: "telegram-profit-copilot",
    marketPollMs: config.marketPollMs,
    reminderPollMs: config.reminderPollMs,
  }));

  app.register(registerSettingsRoutes);
  app.register(registerDashboardRoutes);
  app.register(registerTelegramWebhookRoute);

  return app;
}
