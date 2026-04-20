import type Database from "better-sqlite3";

export function createMarketRepository(db: Database.Database) {
  const saveSnapshotStatement = db.prepare(`
    INSERT INTO market_snapshots (item_key, payload_json)
    VALUES (?, ?)
  `);

  const getLatestSnapshotStatement = db.prepare(`
    SELECT payload_json
    FROM market_snapshots
    WHERE item_key = ?
    ORDER BY id DESC
    LIMIT 1
  `);

  return {
    saveSnapshot(itemKey: string, snapshot: unknown) {
      saveSnapshotStatement.run(itemKey, JSON.stringify(snapshot));
    },
    getLatestSnapshot(itemKey: string) {
      const row = getLatestSnapshotStatement.get(itemKey) as
        | { payload_json: string }
        | undefined;

      if (!row) {
        return null;
      }

      return JSON.parse(row.payload_json) as unknown;
    },
  };
}
