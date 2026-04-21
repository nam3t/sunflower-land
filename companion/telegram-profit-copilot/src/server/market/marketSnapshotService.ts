export function createMarketSnapshotService({
  fetchTradeable,
  saveSnapshot,
  getLatestSnapshot,
}: {
  fetchTradeable: (collection: string, id: number) => Promise<unknown>;
  saveSnapshot: (key: string, snapshot: unknown) => void;
  getLatestSnapshot: (key: string) => unknown;
}) {
  return {
    async refreshTradeable(collection: string, id: number) {
      const key = `${collection}:${id}`;

      try {
        const snapshot = await fetchTradeable(collection, id);
        saveSnapshot(key, snapshot);

        return {
          source: "live" as const,
          snapshot,
        };
      } catch {
        const snapshot = getLatestSnapshot(key);

        if (!snapshot) {
          throw new Error(`No cached snapshot for ${key}`);
        }

        return {
          source: "stale-cache" as const,
          snapshot,
        };
      }
    },
  };
}
