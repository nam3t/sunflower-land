import Fastify from "fastify";

import type { AppConfig } from "../config/loadConfig";
import { healthRoute } from "./routes/healthRoute";

export function buildApp(_config: AppConfig) {
  const app = Fastify();

  app.register(healthRoute);

  return app;
}
