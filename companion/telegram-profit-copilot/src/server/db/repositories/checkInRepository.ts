import type Database from "better-sqlite3";

export function createCheckInRepository(db: Database.Database) {
  const saveStatement = db.prepare(`
    INSERT INTO check_ins (payload)
    VALUES (?)
  `);

  return {
    save(input: unknown) {
      saveStatement.run(JSON.stringify(input));
    },
  };
}
