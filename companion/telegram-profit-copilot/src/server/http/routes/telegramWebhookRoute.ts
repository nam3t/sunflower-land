import type { FastifyInstance } from "fastify";

import { createCommandRouter } from "../../telegram/commandRouter.js";

export async function registerTelegramWebhookRoute(app: FastifyInstance) {
  const router = createCommandRouter();

  app.post("/webhooks/telegram", async (request) => {
    const payload = request.body as {
      message?: {
        chat?: { id?: number };
        text?: string;
      };
    };
    const text = payload.message?.text ?? "";
    const chatId = String(payload.message?.chat?.id ?? "");

    return router.routeMessage(chatId, text);
  });
}
