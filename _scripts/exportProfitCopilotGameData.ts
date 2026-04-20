/* eslint-disable no-console */
import * as fs from "node:fs";
import { writeFile } from "node:fs/promises";
import * as path from "node:path";
import { buildGameData } from "../companion/telegram-profit-copilot/src/shared/buildGameData";

async function run() {
  const gameData = await buildGameData();
  const outputPath = path.resolve(
    process.cwd(),
    "companion/telegram-profit-copilot/src/shared/generated/gameData.json",
  );

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(gameData, null, 2)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void run();
}
