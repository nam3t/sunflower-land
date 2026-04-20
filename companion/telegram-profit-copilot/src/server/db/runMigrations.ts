import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type Database from "better-sqlite3";

function resolveCurrentModuleDir() {
  const originalPrepareStackTrace = Error.prepareStackTrace;

  try {
    Error.prepareStackTrace = (_, stack) => stack;

    const stack = new Error().stack as unknown as Array<{
      getFileName(): string | null;
    }>;

    for (const frame of stack) {
      const fileName = frame.getFileName();

      if (fileName) {
        return dirname(fileName);
      }
    }
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }

  throw new Error("Unable to resolve schema.sql path");
}

export function runMigrations(db: Database.Database) {
  const schemaPath = resolve(resolveCurrentModuleDir(), "schema.sql");
  const schema = readFileSync(schemaPath, "utf8");

  db.exec(schema);
}
