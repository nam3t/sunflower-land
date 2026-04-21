export type CropCheckIn = {
  name: string;
  plots: number;
  startedAt: string;
};

export type AnimalCheckIn = {
  name: string;
  quantity: number;
  lastFedAt?: string;
};

export type CheckInInput = {
  recordedAt: string;
  flowerBalance: number;
  crops: CropCheckIn[];
  animals: AnimalCheckIn[];
  trackedItems: Record<string, number>;
};
