import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { ProfitCopilotGameData } from "./types/gameData.js";

function resolveGameDataPath() {
  const candidates = [
    resolve(process.cwd(), "dist/server/shared/generated/gameData.json"),
    resolve(process.cwd(), "src/shared/generated/gameData.json"),
  ];

  const match = candidates.find((candidate) => existsSync(candidate));

  if (!match) {
    throw new Error("Unable to locate generated gameData.json");
  }

  return match;
}

const gameData = JSON.parse(
  readFileSync(resolveGameDataPath(), "utf8"),
) as ProfitCopilotGameData;

export const GAME_DATA = gameData as ProfitCopilotGameData;
