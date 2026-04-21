export type TradeableSnapshot = {
  floor: number;
  lastSalePrice: number;
  history: {
    totalSales: number;
    totalVolume: number;
    dates: Record<string, unknown>;
  };
  listings: Array<{ id: string; sfl: number; quantity: number }>;
  offers: Array<{ tradeId: string; sfl: number; quantity: number }>;
};

export function createMarketApiClient({
  apiUrl,
  token,
  fetchImpl = fetch,
}: {
  apiUrl: string;
  token: string;
  fetchImpl?: typeof fetch;
}) {
  return {
    async fetchTradeable(collection: string, id: number): Promise<TradeableSnapshot> {
      const url = new URL(`${apiUrl}/collection/${collection}/${id}`);
      url.searchParams.set("type", collection);

      const response = await fetchImpl(url, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      return (await response.json()) as TradeableSnapshot;
    },
  };
}
