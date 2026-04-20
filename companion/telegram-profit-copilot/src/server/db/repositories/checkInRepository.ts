import type Database from "better-sqlite3";

type CheckInInput = {
  recordedAt: string;
  [key: string]: unknown;
};

export function createCheckInRepository(db: Database.Database) {
  const saveStatement = db.prepare(`
    INSERT INTO check_ins (recorded_at, payload_json)
    VALUES (?, ?)
  `);

  return {
    save(input: CheckInInput) {
      saveStatement.run(input.recordedAt, JSON.stringify(input));
    },
  };
}
