import type Database from "better-sqlite3";
import type { CheckInInput } from "../../state/checkInTypes.js";

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
