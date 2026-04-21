export type ActiveLoop = {
  kind: "crop" | "animal";
  name: string;
  quantity: number;
  startedAt: string;
  expectedReadyAt?: string;
};

export type EstimatedState = {
  recordedAt: string;
  flowerBalance: number;
  confidence: number;
  reasons: string[];
  trackedItems: Record<string, number>;
  activeLoops: ActiveLoop[];
};
