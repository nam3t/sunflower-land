import type Database from "better-sqlite3";

export type ReminderJobInput = {
  dedupeKey: string;
  dueAt: string;
  kind: string;
  payload: unknown;
};

export function createReminderRepository(db: Database.Database) {
  const upsertStatement = db.prepare(`
    INSERT INTO reminder_jobs (dedupe_key, due_at, kind, payload_json, sent_at)
    VALUES (?, ?, ?, ?, NULL)
    ON CONFLICT(dedupe_key) DO UPDATE SET
      due_at = excluded.due_at,
      kind = excluded.kind,
      payload_json = excluded.payload_json,
      sent_at = NULL
  `);

  const getDueJobsStatement = db.prepare(`
    SELECT id, dedupe_key, due_at, kind, payload_json
    FROM reminder_jobs
    WHERE sent_at IS NULL AND due_at <= ?
    ORDER BY due_at ASC, id ASC
  `);

  const markSentStatement = db.prepare(`
    UPDATE reminder_jobs
    SET sent_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  return {
    upsert(job: ReminderJobInput) {
      upsertStatement.run(
        job.dedupeKey,
        job.dueAt,
        job.kind,
        JSON.stringify(job.payload),
      );
    },
    getDueJobs(nowIso: string) {
      const rows = getDueJobsStatement.all(nowIso) as Array<{
        id: string;
        dedupe_key: string;
        due_at: string;
        kind: string;
        payload_json: string;
      }>;

      return rows.map((row) => ({
        id: row.id,
        dedupeKey: row.dedupe_key,
        dueAt: row.due_at,
        kind: row.kind,
        payload: JSON.parse(row.payload_json) as unknown,
      }));
    },
    markSent(id: string) {
      markSentStatement.run(id);
    },
  };
}
