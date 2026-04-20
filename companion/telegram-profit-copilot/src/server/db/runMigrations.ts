import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type Database from "better-sqlite3";

export function runMigrations(db: Database.Database) {
  const schemaPath = resolve(process.cwd(), "src/server/db/schema.sql");
  const schema = readFileSync(schemaPath, "utf8");

  db.exec(schema);
}
