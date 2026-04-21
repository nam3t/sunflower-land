import { GAME_DATA } from "../../shared/gameData.js";
import type { CheckInInput } from "./checkInTypes.js";
import type { EstimatedState } from "./stateTypes.js";

export function estimateState(input: CheckInInput): EstimatedState {
  const reasons: string[] = [];

  if (input.animals.length === 0) {
    reasons.push("missing-animal-checkin");
  }

  const activeLoops = input.crops.map((crop) => {
    const cropData = GAME_DATA.crops[crop.name];
    const expectedReadyAt = cropData
      ? new Date(
          new Date(crop.startedAt).getTime() + cropData.harvestSeconds * 1000,
        ).toISOString()
      : undefined;

    return {
      kind: "crop" as const,
      name: crop.name,
      quantity: crop.plots,
      startedAt: crop.startedAt,
      expectedReadyAt,
    };
  });

  return {
    recordedAt: input.recordedAt,
    flowerBalance: input.flowerBalance,
    confidence: reasons.length === 0 ? 1 : 0.75,
    reasons,
    trackedItems: input.trackedItems,
    activeLoops,
  };
}
