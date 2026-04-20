import Database from "better-sqlite3";

export function openDatabase(databasePath: string) {
  return new Database(databasePath);
}
