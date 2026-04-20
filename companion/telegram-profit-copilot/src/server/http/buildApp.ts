import Fastify from "fastify";

import type { AppConfig } from "../config/loadConfig.js";
import { healthRoute } from "./routes/healthRoute.js";

export function buildApp(_config: AppConfig) {
  const app = Fastify();

  app.register(healthRoute);

  return app;
}
