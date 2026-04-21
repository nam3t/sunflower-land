import type { FastifyInstance } from "fastify";

export async function registerDashboardRoutes(app: FastifyInstance) {
  app.get("/api/overview", async () => ({
    bestAction: null,
    confidence: 0,
    activeLoops: [],
  }));
}
