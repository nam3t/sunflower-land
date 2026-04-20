import type Database from "better-sqlite3";

export function createTelegramSessionRepository(db: Database.Database) {
  const saveStatement = db.prepare(`
    INSERT INTO telegram_sessions (chat_id, state, payload_json, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(chat_id) DO UPDATE SET
      state = excluded.state,
      payload_json = excluded.payload_json,
      updated_at = CURRENT_TIMESTAMP
  `);

  const getStatement = db.prepare(`
    SELECT state, payload_json
    FROM telegram_sessions
    WHERE chat_id = ?
  `);

  return {
    save(chatId: string, state: string, payload: unknown) {
      saveStatement.run(chatId, state, JSON.stringify(payload));
    },
    get(chatId: string) {
      const row = getStatement.get(chatId) as
        | { state: string; payload_json: string }
        | undefined;

      return row
        ? {
            state: row.state,
            payload: JSON.parse(row.payload_json) as unknown,
          }
        : null;
    },
  };
}
