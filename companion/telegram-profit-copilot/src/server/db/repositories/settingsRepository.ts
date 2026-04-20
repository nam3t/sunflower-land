import type Database from "better-sqlite3";

const MARKET_TOKEN_KEY = "market_token";

export function createSettingsRepository(db: Database.Database) {
  const upsertMarketTokenStatement = db.prepare(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);

  const getMarketTokenStatement = db.prepare(`
    SELECT value
    FROM settings
    WHERE key = ?
  `);

  return {
    upsertMarketToken(token: string) {
      upsertMarketTokenStatement.run(MARKET_TOKEN_KEY, token);
    },
    getMarketToken() {
      const row = getMarketTokenStatement.get(MARKET_TOKEN_KEY) as
        | { value: string }
        | undefined;

      return row?.value ?? null;
    },
  };
}
