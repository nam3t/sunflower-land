export function createReminderWorker({
  getDueJobs,
  markSent,
  sendMessage,
  now = () => new Date(),
}: {
  getDueJobs: (nowIso: string) => Array<{
    id: number;
    dedupeKey: string;
    payload: { text: string };
  }>;
  markSent: (id: number) => void;
  sendMessage: (text: string) => Promise<void>;
  now?: () => Date;
}) {
  const sentKeys = new Set<string>();

  return {
    async tick() {
      const jobs = getDueJobs(now().toISOString());

      for (const job of jobs) {
        if (sentKeys.has(job.dedupeKey)) {
          continue;
        }

        await sendMessage(job.payload.text);
        markSent(job.id);
        sentKeys.add(job.dedupeKey);
      }
    },
  };
}
