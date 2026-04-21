export function renderPrompt(
  state: "awaiting-crops" | "awaiting-animals" | "awaiting-balance",
) {
  switch (state) {
    case "awaiting-crops":
      return "Which crop or fruit loops are active?";
    case "awaiting-animals":
      return "Which animal loops are active?";
    case "awaiting-balance":
      return "What is your current FLOWER balance and tracked inventory?";
  }
}
