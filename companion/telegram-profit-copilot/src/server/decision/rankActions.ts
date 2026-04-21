export type RankedAction = {
  kind: "trade" | "crop" | "animal";
  title: string;
  score: number;
  rationale: string;
};

export function rankActions(actions: RankedAction[]) {
  return [...actions].sort((left, right) => right.score - left.score);
}
