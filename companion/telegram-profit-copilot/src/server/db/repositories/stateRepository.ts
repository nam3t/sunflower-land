import type Database from "better-sqlite3";
import type { EstimatedState } from "../../state/stateTypes.js";

export function createStateRepository(db: Database.Database) {
  const saveLatestStatement = db.prepare(`
    INSERT INTO estimated_states (payload_json)
    VALUES (?)
  `);

  const getLatestStatement = db.prepare(`
    SELECT payload_json
    FROM estimated_states
    ORDER BY id DESC
    LIMIT 1
  `);

  return {
    saveLatest(state: EstimatedState) {
      saveLatestStatement.run(JSON.stringify(state));
    },
    getLatest() {
      const row = getLatestStatement.get() as
        | { payload_json: string }
        | undefined;

      if (!row) {
        return null;
      }

      return JSON.parse(row.payload_json) as EstimatedState;
    },
  };
}
