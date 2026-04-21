import { GAME_DATA } from "../../shared/gameData.js";

export function scoreAnimalFeed(
  animalName: string,
  feedName: string,
  quantity: number,
) {
  const animal = GAME_DATA.animals[animalName];
  const feed = animal?.feedOptions[feedName];

  if (!animal || !feed) {
    return 0;
  }

  const ingredientCost = Object.values(feed.ingredients).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  return Math.max(0, animal.purchaseCoins / 10 - ingredientCost) * quantity;
}
