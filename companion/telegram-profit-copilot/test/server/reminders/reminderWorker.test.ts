import { createReminderWorker } from "../../../src/server/reminders/reminderWorker.js";

describe("reminder worker", () => {
  it("sends each dedupe key at most once and marks the job as sent", async () => {
    const sent: string[] = [];
    const jobs = [
      {
        id: 1,
        dedupeKey: "crop:Pumpkin:2026-04-18T08:30:00.000Z",
        kind: "loop-ready",
        dueAt: "2026-04-18T08:30:00.000Z",
        payload: { text: "Pumpkin ready" },
      },
    ];

    const worker = createReminderWorker({
      getDueJobs: () => jobs,
      markSent: (id) => sent.push(String(id)),
      sendMessage: async (_text) => undefined,
      now: () => new Date("2026-04-18T08:31:00.000Z"),
    });

    await worker.tick();
    await worker.tick();

    expect(sent).toEqual(["1"]);
  });
});
