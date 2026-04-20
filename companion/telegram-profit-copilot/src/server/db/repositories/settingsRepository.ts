import type Database from "better-sqlite3";

const MARKET_TOKEN_KEY = "market_token";

export function createSettingsRepository(db: Database.Database) {
  const upsertMarketTokenStatement = db.prepare(`
    INSERT INTO settings (key, value_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value_json = excluded.value_json,
      updated_at = CURRENT_TIMESTAMP
  `);

  const getMarketTokenStatement = db.prepare(`
    SELECT value_json
    FROM settings
    WHERE key = ?
  `);

  return {
    upsertMarketToken(token: string) {
      upsertMarketTokenStatement.run(MARKET_TOKEN_KEY, JSON.stringify(token));
    },
    getMarketToken() {
      const row = getMarketTokenStatement.get(MARKET_TOKEN_KEY) as
        | { value_json: string }
        | undefined;

      return row ? (JSON.parse(row.value_json) as string) : null;
    },
  };
}
