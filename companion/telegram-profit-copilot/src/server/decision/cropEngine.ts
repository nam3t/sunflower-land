import { GAME_DATA } from "../../shared/gameData.js";

export function scoreCropLoop(name: string, plots: number) {
  const crop = GAME_DATA.crops[name];

  if (!crop) {
    return 0;
  }

  const totalProfit = crop.sellPrice * plots;
  const profitPerHour = totalProfit / (crop.harvestSeconds / 3600);

  return Number(profitPerHour.toFixed(4));
}
