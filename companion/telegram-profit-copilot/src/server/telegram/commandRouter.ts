import { startCheckInSession } from "./checkInFlow.js";
import { renderPrompt } from "./renderers.js";

export function createCommandRouter() {
  return {
    routeMessage(chatId: string, text: string) {
      if (text === "/checkin") {
        const session = startCheckInSession(chatId);

        return {
          ok: true,
          ...session,
          message: renderPrompt(session.state),
        };
      }

      if (text === "/whatnow") {
        return {
          ok: true,
          message: "No recommendation yet. Complete a check-in first.",
        };
      }

      return {
        ok: true,
        message: "Use /checkin, /whatnow, /timers, or /market.",
      };
    },
  };
}
