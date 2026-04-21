import Fastify from "fastify";

import type { AppConfig } from "../config/loadConfig.js";
import { registerSettingsRoutes } from "./routes/settingsRoutes.js";

export function buildApp(config: AppConfig) {
  const app = Fastify();

  app.get("/health", async () => ({
    status: "ok",
    service: "telegram-profit-copilot",
    marketPollMs: config.marketPollMs,
    reminderPollMs: config.reminderPollMs,
  }));

  app.register(registerSettingsRoutes);

  return app;
}
