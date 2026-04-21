import type { FastifyInstance } from "fastify";

export async function registerSettingsRoutes(app: FastifyInstance) {
  app.get("/api/settings", async () => ({
    marketTokenConfigured: false,
  }));

  app.post("/api/settings/market-token", async (_request, reply) => {
    reply.code(204).send();
  });
}
