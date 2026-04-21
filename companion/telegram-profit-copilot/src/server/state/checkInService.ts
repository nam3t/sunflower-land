import type { CheckInInput } from "./checkInTypes.js";
import { estimateState } from "./estimateState.js";
import type { EstimatedState } from "./stateTypes.js";

export function createCheckInService({
  saveCheckIn,
  saveEstimatedState,
}: {
  saveCheckIn: (input: CheckInInput) => void;
  saveEstimatedState: (state: EstimatedState) => void;
}) {
  return {
    record(input: CheckInInput) {
      saveCheckIn(input);

      const estimated = estimateState(input);
      saveEstimatedState(estimated);

      return estimated;
    },
  };
}
