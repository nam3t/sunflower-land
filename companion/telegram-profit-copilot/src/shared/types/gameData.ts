export type NormalizedCrop = {
  sellPrice: number;
  harvestSeconds: number;
};

export type NormalizedFruit = {
  sellPrice: number;
  plantSeconds: number;
};

export type NormalizedAnimalFeed = {
  ingredients: Record<string, number>;
  preferredAtLevels: number[];
};

export type NormalizedAnimal = {
  purchaseCoins: number;
  feedOptions: Record<string, NormalizedAnimalFeed>;
};

export type ProfitCopilotGameData = {
  crops: Record<string, NormalizedCrop>;
  fruits: Record<string, NormalizedFruit>;
  animals: Record<string, NormalizedAnimal>;
};
