/* eslint-disable no-console */
import * as fs from "node:fs";
import { writeFile } from "node:fs/promises";
import * as path from "node:path";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_FOODS,
  ANIMALS,
} from "../src/features/game/types/animals";
import { CROPS } from "../src/features/game/types/crops";
import {
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
} from "../src/features/game/types/fruits";

import type { ProfitCopilotGameData } from "../companion/telegram-profit-copilot/src/shared/types/gameData";

export type { ProfitCopilotGameData } from "../companion/telegram-profit-copilot/src/shared/types/gameData";

function toNumber(value: number | { toNumber: () => number }) {
  return typeof value === "number" ? value : value.toNumber();
}

function getPreferredAtLevels(
  animalFoodExperience: Record<string, Record<string, number>>,
  foodName: string,
) {
  const preferredAtLevels: number[] = [];

  for (const [level, experiences] of Object.entries(animalFoodExperience)) {
    const maxExperience = Math.max(...Object.values(experiences));
    if (experiences[foodName] === maxExperience) {
      preferredAtLevels.push(Number(level));
    }
  }

  return preferredAtLevels;
}

export async function buildGameData(): Promise<ProfitCopilotGameData> {
  process.env.NODE_ENV = "metadata";

  const crops = Object.fromEntries(
    Object.entries(CROPS).map(([cropName, crop]) => [
      cropName,
      {
        sellPrice: crop.sellPrice,
        harvestSeconds: crop.harvestSeconds,
      },
    ]),
  );

  const fruits = Object.fromEntries(
    Object.entries(PATCH_FRUIT).map(([fruitName, fruit]) => [
      fruitName,
      {
        sellPrice: fruit.sellPrice,
        plantSeconds: PATCH_FRUIT_SEEDS[fruit.seed].plantSeconds,
      },
    ]),
  );

  const animals = Object.fromEntries(
    Object.entries(ANIMALS).map(([animalName, animal]) => [
      animalName,
      {
        purchaseCoins: animal.coins,
        feedOptions: Object.fromEntries(
          Object.entries(ANIMAL_FOODS)
            .filter(([foodName]) => foodName !== "Barn Delight")
            .map(([foodName, food]) => [
              foodName,
              {
                ingredients: Object.fromEntries(
                  Object.entries(food.ingredients).map(([ingredient, amount]) => [
                    ingredient,
                    toNumber(amount),
                  ]),
                ),
                preferredAtLevels: getPreferredAtLevels(
                  ANIMAL_FOOD_EXPERIENCE[
                    animalName as keyof typeof ANIMAL_FOOD_EXPERIENCE
                  ],
                  foodName,
                ),
              },
            ]),
        ),
      },
    ]),
  );

  return {
    crops,
    fruits,
    animals,
  };
}

async function run() {
  const gameData = await buildGameData();
  const outputPath = path.resolve(
    process.cwd(),
    "companion/telegram-profit-copilot/src/shared/generated/gameData.json",
  );

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(gameData, null, 2)}\n`);
}

if (process.argv[1]?.includes("exportProfitCopilotGameData.ts")) {
  void run();
}
