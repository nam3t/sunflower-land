import type Database from "better-sqlite3";

export function createTelegramSessionRepository(db: Database.Database) {
  const saveStatement = db.prepare(`
    INSERT INTO telegram_sessions (chat_id, payload, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(chat_id) DO UPDATE SET
      payload = excluded.payload,
      updated_at = CURRENT_TIMESTAMP
  `);

  const getStatement = db.prepare(`
    SELECT payload
    FROM telegram_sessions
    WHERE chat_id = ?
  `);

  return {
    save(session: { chatId: string } & Record<string, unknown>) {
      saveStatement.run(session.chatId, JSON.stringify(session));
    },
    get(chatId: string) {
      const row = getStatement.get(chatId) as
        | { payload: string }
        | undefined;

      return row ? (JSON.parse(row.payload) as Record<string, unknown>) : null;
    },
  };
}
