import { loadConfig } from "./config/loadConfig.js";
import { buildApp } from "./http/buildApp.js";
import { openDatabase } from "./db/openDatabase.js";
import { runMigrations } from "./db/runMigrations.js";

async function main() {
  const config = loadConfig(process.env);
  const db = openDatabase(config.databasePath);
  runMigrations(db);
  const app = buildApp(config);

  await app.listen({
    host: "0.0.0.0",
    port: config.port,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
