import type Database from "better-sqlite3";

export function createMarketRepository(db: Database.Database) {
  const saveSnapshotStatement = db.prepare(`
    INSERT INTO market_snapshots (payload)
    VALUES (?)
  `);

  const getLatestSnapshotStatement = db.prepare(`
    SELECT payload
    FROM market_snapshots
    ORDER BY id DESC
    LIMIT 1
  `);

  return {
    saveSnapshot(snapshot: unknown) {
      saveSnapshotStatement.run(JSON.stringify(snapshot));
    },
    getLatestSnapshot() {
      const row = getLatestSnapshotStatement.get() as
        | { payload: string }
        | undefined;

      return row ? (JSON.parse(row.payload) as unknown) : null;
    },
  };
}
