export function startCheckInSession(chatId: string) {
  return {
    chatId,
    state: "awaiting-crops" as const,
    nextPrompt: "Which crop or fruit loops are active?",
  };
}
