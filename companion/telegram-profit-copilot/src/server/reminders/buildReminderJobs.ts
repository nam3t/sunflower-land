export function buildReminderJobs(input: {
  activeLoops: Array<{ kind: string; name: string; expectedReadyAt?: string }>;
}) {
  return input.activeLoops
    .filter((loop) => loop.expectedReadyAt)
    .map((loop) => ({
      dedupeKey: `${loop.kind}:${loop.name}:${loop.expectedReadyAt}`,
      dueAt: loop.expectedReadyAt!,
      kind: "loop-ready",
      payload: {
        text: `${loop.name} is ready. This is the next high-value action window.`,
      },
    }));
}
