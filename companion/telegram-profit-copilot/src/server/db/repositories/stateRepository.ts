import type Database from "better-sqlite3";

type EstimatedStateInput = {
  confidence: number;
  reasons: string[];
  flowerBalance: number;
  activeLoops: string[];
};

export function createStateRepository(db: Database.Database) {
  const saveLatestStatement = db.prepare(`
    INSERT INTO estimated_states (confidence, reasons, flower_balance, active_loops)
    VALUES (?, ?, ?, ?)
  `);

  const getLatestStatement = db.prepare(`
    SELECT confidence, reasons, flower_balance, active_loops
    FROM estimated_states
    ORDER BY id DESC
    LIMIT 1
  `);

  return {
    saveLatest(state: EstimatedStateInput) {
      saveLatestStatement.run(
        state.confidence,
        JSON.stringify(state.reasons),
        state.flowerBalance,
        JSON.stringify(state.activeLoops),
      );
    },
    getLatest() {
      const row = getLatestStatement.get() as
        | {
            confidence: number;
            reasons: string;
            flower_balance: number;
            active_loops: string;
          }
        | undefined;

      if (!row) {
        return null;
      }

      return {
        confidence: row.confidence,
        reasons: JSON.parse(row.reasons) as string[],
        flowerBalance: row.flower_balance,
        activeLoops: JSON.parse(row.active_loops) as string[],
      };
    },
  };
}
