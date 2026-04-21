export function createTelegramNotifier({
  botToken,
  chatId,
  fetchImpl = fetch,
}: {
  botToken: string;
  chatId: string;
  fetchImpl?: typeof fetch;
}) {
  return async function sendMessage(text: string) {
    const response = await fetchImpl(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Telegram send failed: ${response.status}`);
    }
  };
}
