import type Database from "better-sqlite3";

export type ReminderJobInput = {
  id: string;
  runAt: number;
  payload: unknown;
};

export function createReminderRepository(db: Database.Database) {
  const upsertStatement = db.prepare(`
    INSERT INTO reminder_jobs (id, run_at, payload, sent_at)
    VALUES (?, ?, ?, NULL)
    ON CONFLICT(id) DO UPDATE SET
      run_at = excluded.run_at,
      payload = excluded.payload,
      sent_at = NULL
  `);

  const getDueJobsStatement = db.prepare(`
    SELECT id, run_at, payload
    FROM reminder_jobs
    WHERE sent_at IS NULL AND run_at <= ?
    ORDER BY run_at ASC, id ASC
  `);

  const markSentStatement = db.prepare(`
    UPDATE reminder_jobs
    SET sent_at = ?
    WHERE id = ?
  `);

  return {
    upsert(job: ReminderJobInput) {
      upsertStatement.run(job.id, job.runAt, JSON.stringify(job.payload));
    },
    getDueJobs(now = Date.now()) {
      const rows = getDueJobsStatement.all(now) as Array<{
        id: string;
        run_at: number;
        payload: string;
      }>;

      return rows.map((row) => ({
        id: row.id,
        runAt: row.run_at,
        payload: JSON.parse(row.payload) as unknown,
      }));
    },
    markSent(id: string, sentAt = Date.now()) {
      markSentStatement.run(sentAt, id);
    },
  };
}
