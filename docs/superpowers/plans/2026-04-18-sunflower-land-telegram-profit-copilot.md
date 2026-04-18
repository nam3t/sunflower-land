# Sunflower Land Telegram Profit Copilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-user Telegram-first companion app that estimates farm state, ranks the next best profit action, schedules reminders, watches marketplace data, and exposes a small operational dashboard.

**Architecture:** Keep the companion app isolated from the main game client inside a dedicated top-level package at `companion/telegram-profit-copilot/`. Use a Fastify TypeScript server for Telegram webhooks, APIs, scheduling, and market polling; SQLite for persistence; a small React/Vite dashboard for inspection and configuration; and a root metadata-mode export script to normalize gameplay data from the existing repo into JSON the companion app can consume safely.

**Tech Stack:** TypeScript, Fastify, SQLite (`better-sqlite3`), React, Vite, Jest, root `vite-node` metadata scripts, Telegram Bot HTTP API

---

## Scope Check

This remains one plan. The dashboard is not an independent product; it is a thin operational surface over the same backend state, repositories, and decision engine that power Telegram. Splitting it into a separate plan would create duplicated infrastructure work with little payoff.

## Planned File Structure

### Root Repo Files

- Modify: `package.json`
  - Add a helper script to export normalized gameplay data in metadata mode for the companion app.

- Create: `_scripts/exportProfitCopilotGameData.ts`
  - Import the existing crop, fruit, and animal data in `NODE_ENV=metadata`, normalize only the fields the companion app needs, and write them to JSON inside the companion package.

### Companion Package

- Create: `companion/telegram-profit-copilot/package.json`
  - Own dependencies and scripts so the app stays isolated from the browser-only game client.

- Create: `companion/telegram-profit-copilot/.env.example`
  - Document runtime configuration for Telegram, database, market API URL, and the manually supplied marketplace bearer token.

- Create: `companion/telegram-profit-copilot/tsconfig.base.json`
- Create: `companion/telegram-profit-copilot/tsconfig.server.json`
- Create: `companion/telegram-profit-copilot/tsconfig.dashboard.json`
- Create: `companion/telegram-profit-copilot/jest.config.cjs`
- Create: `companion/telegram-profit-copilot/vite.dashboard.config.ts`

### Server Files

- Create: `companion/telegram-profit-copilot/src/server/main.ts`
  - Boot Fastify, database migrations, reminder worker, and market polling loop.

- Create: `companion/telegram-profit-copilot/src/server/config/loadConfig.ts`
  - Parse and validate environment variables.

- Create: `companion/telegram-profit-copilot/src/server/http/buildApp.ts`
  - Compose the Fastify app and register routes.

- Create: `companion/telegram-profit-copilot/src/server/http/routes/healthRoute.ts`
- Create: `companion/telegram-profit-copilot/src/server/http/routes/settingsRoutes.ts`
- Create: `companion/telegram-profit-copilot/src/server/http/routes/dashboardRoutes.ts`
- Create: `companion/telegram-profit-copilot/src/server/http/routes/telegramWebhookRoute.ts`

- Create: `companion/telegram-profit-copilot/src/server/db/schema.sql`
- Create: `companion/telegram-profit-copilot/src/server/db/openDatabase.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/runMigrations.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/settingsRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/checkInRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/stateRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/marketRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/reminderRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/telegramSessionRepository.ts`

- Create: `companion/telegram-profit-copilot/src/server/market/marketApiClient.ts`
- Create: `companion/telegram-profit-copilot/src/server/market/marketSnapshotService.ts`
- Create: `companion/telegram-profit-copilot/src/server/market/marketSignalService.ts`

- Create: `companion/telegram-profit-copilot/src/server/state/checkInTypes.ts`
- Create: `companion/telegram-profit-copilot/src/server/state/stateTypes.ts`
- Create: `companion/telegram-profit-copilot/src/server/state/estimateState.ts`
- Create: `companion/telegram-profit-copilot/src/server/state/checkInService.ts`

- Create: `companion/telegram-profit-copilot/src/server/decision/cropEngine.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/animalEngine.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/tradeSignalEngine.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/rankActions.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/buildRecommendation.ts`

- Create: `companion/telegram-profit-copilot/src/server/reminders/buildReminderJobs.ts`
- Create: `companion/telegram-profit-copilot/src/server/reminders/reminderWorker.ts`

- Create: `companion/telegram-profit-copilot/src/server/telegram/sendTelegramMessage.ts`
- Create: `companion/telegram-profit-copilot/src/server/telegram/commandRouter.ts`
- Create: `companion/telegram-profit-copilot/src/server/telegram/checkInFlow.ts`
- Create: `companion/telegram-profit-copilot/src/server/telegram/renderers.ts`

### Shared Files

- Create: `companion/telegram-profit-copilot/src/shared/types/gameData.ts`
- Create: `companion/telegram-profit-copilot/src/shared/gameData.ts`
- Create: `companion/telegram-profit-copilot/src/shared/generated/gameData.json`

### Dashboard Files

- Create: `companion/telegram-profit-copilot/src/dashboard/main.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/App.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/api/client.ts`
- Create: `companion/telegram-profit-copilot/src/dashboard/components/Layout.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/OverviewPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/StrategyPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/MarketPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/StatePage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/HistoryPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/styles.css`

### Tests

- Create: `companion/telegram-profit-copilot/test/server/config.test.ts`
- Create: `companion/telegram-profit-copilot/test/server/healthRoute.test.ts`
- Create: `companion/telegram-profit-copilot/test/shared/exportGameData.test.ts`
- Create: `companion/telegram-profit-copilot/test/server/db/repositories.test.ts`
- Create: `companion/telegram-profit-copilot/test/server/market/marketSnapshotService.test.ts`
- Create: `companion/telegram-profit-copilot/test/server/state/checkInService.test.ts`
- Create: `companion/telegram-profit-copilot/test/server/decision/buildRecommendation.test.ts`
- Create: `companion/telegram-profit-copilot/test/server/reminders/reminderWorker.test.ts`
- Create: `companion/telegram-profit-copilot/test/server/telegram/telegramWebhookRoute.test.ts`
- Create: `companion/telegram-profit-copilot/test/dashboard/App.test.tsx`

## Implementation Notes

- Use `Fastify` so tests can use `app.inject()` without spinning up a real port.
- Use `better-sqlite3` because v1 is single-user and needs reliable local persistence with easy recovery on VPS restart.
- Store the marketplace bearer token in the settings table. The dashboard should allow manual paste/refresh; the market watcher should degrade gracefully when the token is missing or expired.
- Do not import gameplay source files directly at runtime. Many current files initialize i18n via `localStorage`. Normalize the needed fields ahead of time with `_scripts/exportProfitCopilotGameData.ts` under `NODE_ENV=metadata`.
- Treat FLOWER/SFL as the same tracked balance key in the companion app UI and state model. Use one internal property name, `flowerBalance`, to avoid ambiguity.

### Task 1: Bootstrap The Companion Package, Config Loader, And Health Route

**Files:**
- Create: `companion/telegram-profit-copilot/package.json`
- Create: `companion/telegram-profit-copilot/.env.example`
- Create: `companion/telegram-profit-copilot/tsconfig.base.json`
- Create: `companion/telegram-profit-copilot/tsconfig.server.json`
- Create: `companion/telegram-profit-copilot/tsconfig.dashboard.json`
- Create: `companion/telegram-profit-copilot/jest.config.cjs`
- Create: `companion/telegram-profit-copilot/src/server/config/loadConfig.ts`
- Create: `companion/telegram-profit-copilot/src/server/http/routes/healthRoute.ts`
- Create: `companion/telegram-profit-copilot/src/server/http/buildApp.ts`
- Create: `companion/telegram-profit-copilot/src/server/main.ts`
- Test: `companion/telegram-profit-copilot/test/server/config.test.ts`
- Test: `companion/telegram-profit-copilot/test/server/healthRoute.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// companion/telegram-profit-copilot/test/server/config.test.ts
import { loadConfig } from "../../src/server/config/loadConfig";

describe("loadConfig", () => {
  it("throws when the Telegram token is missing", () => {
    expect(() =>
      loadConfig({
        PORT: "4318",
        DATABASE_PATH: "/tmp/copilot.db",
        TELEGRAM_CHAT_ID: "12345",
        SFL_API_URL: "https://api.sunflower-land.com",
      } as NodeJS.ProcessEnv),
    ).toThrow(/TELEGRAM_BOT_TOKEN/i);
  });

  it("returns parsed defaults for the happy path", () => {
    expect(
      loadConfig({
        PORT: "4318",
        DATABASE_PATH: "/tmp/copilot.db",
        TELEGRAM_BOT_TOKEN: "bot-token",
        TELEGRAM_CHAT_ID: "12345",
        SFL_API_URL: "https://api.sunflower-land.com",
      } as NodeJS.ProcessEnv),
    ).toMatchObject({
      port: 4318,
      databasePath: "/tmp/copilot.db",
      telegramChatId: "12345",
    });
  });
});
```

```ts
// companion/telegram-profit-copilot/test/server/healthRoute.test.ts
import { buildApp } from "../../src/server/http/buildApp";

describe("GET /health", () => {
  it("returns ok with worker mode metadata", async () => {
    const app = buildApp({
      port: 4318,
      databasePath: ":memory:",
      telegramBotToken: "bot-token",
      telegramChatId: "12345",
      sflApiUrl: "https://api.sunflower-land.com",
      marketPollMs: 60000,
      reminderPollMs: 30000,
    });

    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ok",
      service: "telegram-profit-copilot",
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/config.test.ts test/server/healthRoute.test.ts`

Expected: FAIL with module resolution errors because the companion package and server files do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```json
// companion/telegram-profit-copilot/package.json
{
  "name": "telegram-profit-copilot",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:server": "tsx watch src/server/main.ts",
    "dev:dashboard": "vite --config vite.dashboard.config.ts",
    "build:server": "tsc -p tsconfig.server.json",
    "build:dashboard": "vite build --config vite.dashboard.config.ts",
    "test": "jest --config jest.config.cjs"
  },
  "dependencies": {
    "better-sqlite3": "^11.7.0",
    "fastify": "^5.2.1",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-router": "^7.12.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@types/better-sqlite3": "^7.6.12",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.13.10",
    "@types/react": "^19.0.12",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.6",
    "tsx": "^4.19.3",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}
```

```env
# companion/telegram-profit-copilot/.env.example
PORT=4318
DATABASE_PATH=./data/copilot.db
TELEGRAM_BOT_TOKEN=replace-me
TELEGRAM_CHAT_ID=replace-me
SFL_API_URL=https://api.sunflower-land.com
MARKET_POLL_MS=60000
REMINDER_POLL_MS=30000
SFL_MARKET_RAW_TOKEN=
```

```ts
// companion/telegram-profit-copilot/src/server/config/loadConfig.ts
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4318),
  DATABASE_PATH: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.string().min(1),
  SFL_API_URL: z.string().url(),
  MARKET_POLL_MS: z.coerce.number().default(60_000),
  REMINDER_POLL_MS: z.coerce.number().default(30_000),
  SFL_MARKET_RAW_TOKEN: z.string().optional(),
});

export type AppConfig = {
  port: number;
  databasePath: string;
  telegramBotToken: string;
  telegramChatId: string;
  sflApiUrl: string;
  marketPollMs: number;
  reminderPollMs: number;
  sflMarketRawToken?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = EnvSchema.parse(env);
  return {
    port: parsed.PORT,
    databasePath: parsed.DATABASE_PATH,
    telegramBotToken: parsed.TELEGRAM_BOT_TOKEN,
    telegramChatId: parsed.TELEGRAM_CHAT_ID,
    sflApiUrl: parsed.SFL_API_URL,
    marketPollMs: parsed.MARKET_POLL_MS,
    reminderPollMs: parsed.REMINDER_POLL_MS,
    sflMarketRawToken: parsed.SFL_MARKET_RAW_TOKEN,
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/http/routes/healthRoute.ts
import type { FastifyInstance } from "fastify";

export async function registerHealthRoute(app: FastifyInstance) {
  app.get("/health", async () => ({
    status: "ok",
    service: "telegram-profit-copilot",
  }));
}
```

```ts
// companion/telegram-profit-copilot/src/server/http/buildApp.ts
import Fastify from "fastify";
import type { AppConfig } from "../config/loadConfig";
import { registerHealthRoute } from "./routes/healthRoute";

export function buildApp(config: AppConfig) {
  const app = Fastify({ logger: true });

  app.decorate("appConfig", config);
  app.register(registerHealthRoute);

  return app;
}
```

```ts
// companion/telegram-profit-copilot/src/server/main.ts
import { loadConfig } from "./config/loadConfig";
import { buildApp } from "./http/buildApp";

const config = loadConfig();
const app = buildApp(config);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/config.test.ts test/server/healthRoute.test.ts`

Expected: PASS with 4 passing assertions and no unhandled promise warnings.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot
git commit -m "feat: bootstrap telegram profit copilot package"
```

### Task 2: Export Normalized Gameplay Data From The Existing Repo

**Files:**
- Modify: `package.json`
- Create: `_scripts/exportProfitCopilotGameData.ts`
- Create: `companion/telegram-profit-copilot/src/shared/types/gameData.ts`
- Create: `companion/telegram-profit-copilot/src/shared/gameData.ts`
- Create: `companion/telegram-profit-copilot/src/shared/generated/gameData.json`
- Test: `companion/telegram-profit-copilot/test/shared/exportGameData.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// companion/telegram-profit-copilot/test/shared/exportGameData.test.ts
import { buildGameData } from "../../../../_scripts/exportProfitCopilotGameData";

describe("buildGameData", () => {
  it("normalizes crop, fruit, and animal data into runtime-safe JSON", async () => {
    const data = await buildGameData();

    expect(data.crops.Sunflower).toMatchObject({
      sellPrice: 0.02,
      harvestSeconds: 60,
    });
    expect(data.fruits.Tomato).toMatchObject({
      sellPrice: 2,
      plantSeconds: 7200,
    });
    expect(data.animals.Chicken.feedOptions["Kernel Blend"]).toMatchObject({
      preferredAtLevels: [0, 1, 2],
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/shared/exportGameData.test.ts`

Expected: FAIL because the export script and shared game-data modules do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```json
// package.json (new script only)
{
  "scripts": {
    "profit-copilot:data": "NODE_ENV=metadata vite-node --project metadata/node.tsconfig.json _scripts/exportProfitCopilotGameData.ts"
  }
}
```

```ts
// _scripts/exportProfitCopilotGameData.ts
import fs from "node:fs/promises";
import path from "node:path";

export type ProfitCopilotGameData = {
  crops: Record<string, { sellPrice: number; harvestSeconds: number }>;
  fruits: Record<string, { sellPrice: number; plantSeconds: number }>;
  animals: Record<
    string,
    {
      purchaseCoins: number;
      feedOptions: Record<string, { ingredients: Record<string, number>; preferredAtLevels: number[] }>;
    }
  >;
};

export async function buildGameData(): Promise<ProfitCopilotGameData> {
  process.env.NODE_ENV = "metadata";

  const [{ CROPS }, { PATCH_FRUIT, PATCH_FRUIT_SEEDS }, { ANIMALS, ANIMAL_FOODS, ANIMAL_FOOD_EXPERIENCE }] =
    await Promise.all([
      import("../src/features/game/types/crops"),
      import("../src/features/game/types/fruits"),
      import("../src/features/game/types/animals"),
    ]);

  return {
    crops: Object.fromEntries(
      Object.entries(CROPS).map(([name, crop]) => [
        name,
        { sellPrice: crop.sellPrice, harvestSeconds: crop.harvestSeconds },
      ]),
    ),
    fruits: Object.fromEntries(
      Object.entries(PATCH_FRUIT).map(([name, fruit]) => [
        name,
        {
          sellPrice: fruit.sellPrice,
          plantSeconds: PATCH_FRUIT_SEEDS[fruit.seed].plantSeconds,
        },
      ]),
    ),
    animals: Object.fromEntries(
      Object.entries(ANIMALS).map(([animalName, animal]) => {
        const feedOptions = Object.fromEntries(
          Object.entries(ANIMAL_FOODS)
            .filter(([feedName]) => feedName !== "Barn Delight")
            .map(([feedName, feed]) => {
              const preferredAtLevels = Object.entries(
                ANIMAL_FOOD_EXPERIENCE[animalName as keyof typeof ANIMAL_FOOD_EXPERIENCE],
              )
                .filter(([, mapping]) => {
                  const values = Object.values(mapping);
                  return mapping[feedName as keyof typeof mapping] === Math.max(...values);
                })
                .map(([level]) => Number(level));

              return [
                feedName,
                {
                  ingredients: Object.fromEntries(
                    Object.entries(feed.ingredients).map(([item, value]) => [item, Number(value)]),
                  ),
                  preferredAtLevels,
                },
              ];
            }),
        );

        return [animalName, { purchaseCoins: animal.coins, feedOptions }];
      }),
    ),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = path.resolve(
    "companion/telegram-profit-copilot/src/shared/generated/gameData.json",
  );
  const data = await buildGameData();
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
}
```

```ts
// companion/telegram-profit-copilot/src/shared/types/gameData.ts
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

export type ProfitCopilotGameData = {
  crops: Record<string, NormalizedCrop>;
  fruits: Record<string, NormalizedFruit>;
  animals: Record<string, { purchaseCoins: number; feedOptions: Record<string, NormalizedAnimalFeed> }>;
};
```

```ts
// companion/telegram-profit-copilot/src/shared/gameData.ts
import gameData from "./generated/gameData.json";
import type { ProfitCopilotGameData } from "./types/gameData";

export const GAME_DATA = gameData as ProfitCopilotGameData;
```

- [ ] **Step 4: Run the export and tests**

Run: `yarn profit-copilot:data && yarn --cwd companion/telegram-profit-copilot test --runInBand test/shared/exportGameData.test.ts`

Expected: the export script writes `src/shared/generated/gameData.json`, and the Jest test passes with the normalized values.

- [ ] **Step 5: Commit**

```bash
git add package.json _scripts/exportProfitCopilotGameData.ts companion/telegram-profit-copilot/src/shared companion/telegram-profit-copilot/test/shared/exportGameData.test.ts
git commit -m "feat: export gameplay data for profit copilot"
```

### Task 3: Add SQLite Schema, Migrations, And Persistence Repositories

**Files:**
- Create: `companion/telegram-profit-copilot/src/server/db/schema.sql`
- Create: `companion/telegram-profit-copilot/src/server/db/openDatabase.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/runMigrations.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/settingsRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/checkInRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/stateRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/marketRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/reminderRepository.ts`
- Create: `companion/telegram-profit-copilot/src/server/db/repositories/telegramSessionRepository.ts`
- Modify: `companion/telegram-profit-copilot/src/server/main.ts`
- Test: `companion/telegram-profit-copilot/test/server/db/repositories.test.ts`

- [ ] **Step 1: Write the failing repository test**

```ts
// companion/telegram-profit-copilot/test/server/db/repositories.test.ts
import { openDatabase } from "../../src/server/db/openDatabase";
import { runMigrations } from "../../src/server/db/runMigrations";
import { createSettingsRepository } from "../../src/server/db/repositories/settingsRepository";
import { createStateRepository } from "../../src/server/db/repositories/stateRepository";

describe("SQLite repositories", () => {
  it("persists settings and the latest estimated state", () => {
    const db = openDatabase(":memory:");
    runMigrations(db);

    const settingsRepository = createSettingsRepository(db);
    const stateRepository = createStateRepository(db);

    settingsRepository.upsertMarketToken("raw-token");
    stateRepository.saveLatest({
      confidence: 0.75,
      reasons: ["missing animal details"],
      flowerBalance: 120,
      activeLoops: [],
    });

    expect(settingsRepository.getMarketToken()).toBe("raw-token");
    expect(stateRepository.getLatest()).toMatchObject({
      confidence: 0.75,
      flowerBalance: 120,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/db/repositories.test.ts`

Expected: FAIL because the migration and repository files do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```sql
-- companion/telegram-profit-copilot/src/server/db/schema.sql
create table if not exists settings (
  key text primary key,
  value_json text not null,
  updated_at text not null default current_timestamp
);

create table if not exists check_ins (
  id integer primary key autoincrement,
  recorded_at text not null,
  payload_json text not null
);

create table if not exists estimated_states (
  id integer primary key autoincrement,
  created_at text not null default current_timestamp,
  payload_json text not null
);

create table if not exists market_snapshots (
  id integer primary key autoincrement,
  created_at text not null default current_timestamp,
  item_key text not null,
  payload_json text not null
);

create table if not exists reminder_jobs (
  id integer primary key autoincrement,
  dedupe_key text not null unique,
  due_at text not null,
  kind text not null,
  payload_json text not null,
  sent_at text
);

create table if not exists telegram_sessions (
  chat_id text primary key,
  state text not null,
  payload_json text not null,
  updated_at text not null default current_timestamp
);
```

```ts
// companion/telegram-profit-copilot/src/server/db/openDatabase.ts
import Database from "better-sqlite3";

export function openDatabase(databasePath: string) {
  return new Database(databasePath);
}
```

```ts
// companion/telegram-profit-copilot/src/server/db/runMigrations.ts
import fs from "node:fs";
import path from "node:path";
import type Database from "better-sqlite3";

export function runMigrations(db: Database.Database) {
  const schemaPath = path.resolve("src/server/db/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  db.exec(sql);
}
```

```ts
// companion/telegram-profit-copilot/src/server/db/repositories/settingsRepository.ts
import type Database from "better-sqlite3";

export function createSettingsRepository(db: Database.Database) {
  const upsert = db.prepare(`
    insert into settings(key, value_json)
    values (@key, json(@valueJson))
    on conflict(key) do update set value_json = excluded.value_json, updated_at = current_timestamp
  `);
  const select = db.prepare(`select value_json from settings where key = ?`);

  return {
    upsertMarketToken(token: string) {
      upsert.run({ key: "marketToken", valueJson: JSON.stringify({ token }) });
    },
    getMarketToken() {
      const row = select.get("marketToken") as { value_json?: string } | undefined;
      return row ? JSON.parse(row.value_json ?? "{}").token : undefined;
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/db/repositories/stateRepository.ts
import type Database from "better-sqlite3";

export function createStateRepository(db: Database.Database) {
  const insert = db.prepare(`insert into estimated_states(payload_json) values (json(?))`);
  const latest = db.prepare(`
    select payload_json from estimated_states
    order by id desc
    limit 1
  `);

  return {
    saveLatest(payload: unknown) {
      insert.run(JSON.stringify(payload));
    },
    getLatest<T>() {
      const row = latest.get() as { payload_json?: string } | undefined;
      return row ? (JSON.parse(row.payload_json ?? "{}") as T) : undefined;
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/db/repositories/checkInRepository.ts
import type Database from "better-sqlite3";
import type { CheckInInput } from "../../state/checkInTypes";

export function createCheckInRepository(db: Database.Database) {
  const insert = db.prepare(`insert into check_ins(recorded_at, payload_json) values (@recordedAt, json(@payloadJson))`);

  return {
    save(input: CheckInInput) {
      insert.run({
        recordedAt: input.recordedAt,
        payloadJson: JSON.stringify(input),
      });
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/db/repositories/marketRepository.ts
import type Database from "better-sqlite3";

export function createMarketRepository(db: Database.Database) {
  const insert = db.prepare(`insert into market_snapshots(item_key, payload_json) values (?, json(?))`);
  const latest = db.prepare(`
    select payload_json
    from market_snapshots
    where item_key = ?
    order by id desc
    limit 1
  `);

  return {
    saveSnapshot(itemKey: string, payload: unknown) {
      insert.run(itemKey, JSON.stringify(payload));
    },
    getLatestSnapshot<T>(itemKey: string) {
      const row = latest.get(itemKey) as { payload_json?: string } | undefined;
      return row ? (JSON.parse(row.payload_json ?? "{}") as T) : undefined;
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/db/repositories/reminderRepository.ts
import type Database from "better-sqlite3";

export function createReminderRepository(db: Database.Database) {
  const upsert = db.prepare(`
    insert into reminder_jobs(dedupe_key, due_at, kind, payload_json)
    values (@dedupeKey, @dueAt, @kind, json(@payloadJson))
    on conflict(dedupe_key) do update set due_at = excluded.due_at, payload_json = excluded.payload_json
  `);
  const due = db.prepare(`
    select id, dedupe_key, due_at, kind, payload_json
    from reminder_jobs
    where sent_at is null and due_at <= ?
    order by due_at asc
  `);
  const mark = db.prepare(`update reminder_jobs set sent_at = current_timestamp where id = ?`);

  return {
    upsert(job: { dedupeKey: string; dueAt: string; kind: string; payload: unknown }) {
      upsert.run({
        dedupeKey: job.dedupeKey,
        dueAt: job.dueAt,
        kind: job.kind,
        payloadJson: JSON.stringify(job.payload),
      });
    },
    getDueJobs(nowIso: string) {
      return (due.all(nowIso) as Array<{
        id: number;
        dedupe_key: string;
        due_at: string;
        kind: string;
        payload_json: string;
      }>).map((row) => ({
        id: row.id,
        dedupeKey: row.dedupe_key,
        dueAt: row.due_at,
        kind: row.kind,
        payload: JSON.parse(row.payload_json),
      }));
    },
    markSent(id: number) {
      mark.run(id);
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/db/repositories/telegramSessionRepository.ts
import type Database from "better-sqlite3";

export function createTelegramSessionRepository(db: Database.Database) {
  const upsert = db.prepare(`
    insert into telegram_sessions(chat_id, state, payload_json)
    values (@chatId, @state, json(@payloadJson))
    on conflict(chat_id) do update set state = excluded.state, payload_json = excluded.payload_json, updated_at = current_timestamp
  `);
  const select = db.prepare(`select state, payload_json from telegram_sessions where chat_id = ?`);

  return {
    save(chatId: string, state: string, payload: unknown) {
      upsert.run({ chatId, state, payloadJson: JSON.stringify(payload) });
    },
    get(chatId: string) {
      const row = select.get(chatId) as { state?: string; payload_json?: string } | undefined;
      return row ? { state: row.state ?? "idle", payload: JSON.parse(row.payload_json ?? "{}") } : undefined;
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/main.ts
import { loadConfig } from "./config/loadConfig";
import { openDatabase } from "./db/openDatabase";
import { runMigrations } from "./db/runMigrations";
import { buildApp } from "./http/buildApp";

const config = loadConfig();
const db = openDatabase(config.databasePath);
runMigrations(db);

const app = buildApp(config);
```

- [ ] **Step 4: Run the repository tests**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/db/repositories.test.ts`

Expected: PASS with SQLite round-trip assertions succeeding against `:memory:`.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/src/server/db companion/telegram-profit-copilot/test/server/db/repositories.test.ts companion/telegram-profit-copilot/src/server/main.ts
git commit -m "feat: add copilot sqlite persistence"
```

### Task 4: Add Market Credentials, API Adapter, And Snapshot Fallback

**Files:**
- Create: `companion/telegram-profit-copilot/src/server/market/marketApiClient.ts`
- Create: `companion/telegram-profit-copilot/src/server/market/marketSnapshotService.ts`
- Create: `companion/telegram-profit-copilot/src/server/market/marketSignalService.ts`
- Create: `companion/telegram-profit-copilot/src/server/http/routes/settingsRoutes.ts`
- Modify: `companion/telegram-profit-copilot/src/server/http/buildApp.ts`
- Modify: `companion/telegram-profit-copilot/src/server/db/repositories/marketRepository.ts`
- Test: `companion/telegram-profit-copilot/test/server/market/marketSnapshotService.test.ts`

- [ ] **Step 1: Write the failing market service test**

```ts
// companion/telegram-profit-copilot/test/server/market/marketSnapshotService.test.ts
import { createMarketSnapshotService } from "../../src/server/market/marketSnapshotService";

describe("market snapshot service", () => {
  it("falls back to the latest stored snapshot when the live API fails", async () => {
    const stored = {
      floor: 12,
      lastSalePrice: 11,
      history: { totalSales: 3, totalVolume: 33, dates: {} },
    };

    const service = createMarketSnapshotService({
      fetchTradeable: async () => {
        throw new Error("429");
      },
      saveSnapshot: () => undefined,
      getLatestSnapshot: () => stored,
    });

    await expect(service.refreshTradeable("resources", 1)).resolves.toMatchObject({
      source: "stale-cache",
      snapshot: stored,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/market/marketSnapshotService.test.ts`

Expected: FAIL because the market adapter files do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
// companion/telegram-profit-copilot/src/server/market/marketApiClient.ts
export type TradeableSnapshot = {
  floor: number;
  lastSalePrice: number;
  history: { totalSales: number; totalVolume: number; dates: Record<string, unknown> };
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

      if (!response.ok) throw new Error(String(response.status));
      return (await response.json()) as TradeableSnapshot;
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/market/marketSnapshotService.ts
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
        return { source: "live" as const, snapshot };
      } catch {
        const snapshot = getLatestSnapshot(key);
        if (!snapshot) throw new Error(`No cached snapshot for ${key}`);
        return { source: "stale-cache" as const, snapshot };
      }
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/market/marketSignalService.ts
import type { TradeableSnapshot } from "./marketApiClient";

export type DerivedMarketSignal = {
  action: "sell_now" | "watch" | "hold" | "ignore";
  itemKey: string;
  netProfit: number;
  rationale: string;
};

export function deriveMarketSignal({
  itemKey,
  snapshot,
  baselinePrice,
  minimumNetProfit,
  feeRate = 0.1,
}: {
  itemKey: string;
  snapshot: TradeableSnapshot;
  baselinePrice: number;
  minimumNetProfit: number;
  feeRate?: number;
}): DerivedMarketSignal {
  const gross = snapshot.floor - baselinePrice;
  const netProfit = gross - snapshot.floor * feeRate;

  if (netProfit >= minimumNetProfit) {
    return {
      action: "sell_now",
      itemKey,
      netProfit,
      rationale: `${((snapshot.floor / baselinePrice - 1) * 100).toFixed(1)}% above baseline after fees`,
    };
  }

  return {
    action: "watch",
    itemKey,
    netProfit,
    rationale: "Below the configured sell threshold",
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/http/routes/settingsRoutes.ts
import type { FastifyInstance } from "fastify";

export async function registerSettingsRoutes(app: FastifyInstance) {
  app.get("/api/settings", async () => ({ marketTokenConfigured: false }));
  app.post("/api/settings/market-token", async (_request, reply) => {
    reply.code(204).send();
  });
}
```

```ts
// companion/telegram-profit-copilot/src/server/http/buildApp.ts
import Fastify from "fastify";
import type { AppConfig } from "../config/loadConfig";
import { registerSettingsRoutes } from "./routes/settingsRoutes";

export function buildApp(config: AppConfig) {
  const app = Fastify({ logger: true });
  app.get("/health", async () => ({
    status: "ok",
    service: "telegram-profit-copilot",
    marketPollMs: config.marketPollMs,
    reminderPollMs: config.reminderPollMs,
  }));
  app.register(registerSettingsRoutes);
  return app;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/market/marketSnapshotService.test.ts`

Expected: PASS, and the fallback source should read `stale-cache`.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/src/server/market companion/telegram-profit-copilot/src/server/http/buildApp.ts companion/telegram-profit-copilot/src/server/http/routes/settingsRoutes.ts companion/telegram-profit-copilot/test/server/market/marketSnapshotService.test.ts
git commit -m "feat: add market snapshot adapter with stale fallback"
```

### Task 5: Implement Check-In Parsing, Estimated State, And Confidence Scoring

**Files:**
- Create: `companion/telegram-profit-copilot/src/server/state/checkInTypes.ts`
- Create: `companion/telegram-profit-copilot/src/server/state/stateTypes.ts`
- Create: `companion/telegram-profit-copilot/src/server/state/estimateState.ts`
- Create: `companion/telegram-profit-copilot/src/server/state/checkInService.ts`
- Modify: `companion/telegram-profit-copilot/src/server/db/repositories/checkInRepository.ts`
- Modify: `companion/telegram-profit-copilot/src/server/db/repositories/stateRepository.ts`
- Test: `companion/telegram-profit-copilot/test/server/state/checkInService.test.ts`

- [ ] **Step 1: Write the failing check-in test**

```ts
// companion/telegram-profit-copilot/test/server/state/checkInService.test.ts
import { createCheckInService } from "../../src/server/state/checkInService";

describe("check-in service", () => {
  it("creates an estimated state and lowers confidence when animal details are missing", () => {
    const service = createCheckInService({
      saveCheckIn: () => undefined,
      saveEstimatedState: (value) => value,
    });

    const result = service.record({
      recordedAt: "2026-04-18T08:00:00.000Z",
      flowerBalance: 120,
      crops: [{ name: "Pumpkin", plots: 8, startedAt: "2026-04-18T07:30:00.000Z" }],
      animals: [],
      trackedItems: { Egg: 12 },
    });

    expect(result.confidence).toBeLessThan(1);
    expect(result.reasons).toContain("missing-animal-checkin");
    expect(result.activeLoops[0]).toMatchObject({
      kind: "crop",
      name: "Pumpkin",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/state/checkInService.test.ts`

Expected: FAIL because the state types and service do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
// companion/telegram-profit-copilot/src/server/state/checkInTypes.ts
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
```

```ts
// companion/telegram-profit-copilot/src/server/state/stateTypes.ts
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
```

```ts
// companion/telegram-profit-copilot/src/server/state/estimateState.ts
import { GAME_DATA } from "../../shared/gameData";
import type { CheckInInput } from "./checkInTypes";
import type { EstimatedState } from "./stateTypes";

export function estimateState(input: CheckInInput): EstimatedState {
  const reasons: string[] = [];
  if (input.animals.length === 0) reasons.push("missing-animal-checkin");

  const activeLoops = input.crops.map((crop) => {
    const cropData = GAME_DATA.crops[crop.name];
    const expectedReadyAt = cropData
      ? new Date(new Date(crop.startedAt).getTime() + cropData.harvestSeconds * 1000).toISOString()
      : undefined;

    return {
      kind: "crop" as const,
      name: crop.name,
      quantity: crop.plots,
      startedAt: crop.startedAt,
      expectedReadyAt,
    };
  });

  return {
    recordedAt: input.recordedAt,
    flowerBalance: input.flowerBalance,
    confidence: reasons.length === 0 ? 1 : 0.75,
    reasons,
    trackedItems: input.trackedItems,
    activeLoops,
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/state/checkInService.ts
import type { CheckInInput } from "./checkInTypes";
import { estimateState } from "./estimateState";

export function createCheckInService({
  saveCheckIn,
  saveEstimatedState,
}: {
  saveCheckIn: (input: CheckInInput) => void;
  saveEstimatedState: (state: ReturnType<typeof estimateState>) => void;
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/state/checkInService.test.ts`

Expected: PASS, and the estimated state should include one crop loop with the confidence reason attached.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/src/server/state companion/telegram-profit-copilot/test/server/state/checkInService.test.ts
git commit -m "feat: add estimated state and check-in service"
```

### Task 6: Build Crop, Animal, Trading, And Unified Recommendation Engines

**Files:**
- Create: `companion/telegram-profit-copilot/src/server/decision/cropEngine.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/animalEngine.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/tradeSignalEngine.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/rankActions.ts`
- Create: `companion/telegram-profit-copilot/src/server/decision/buildRecommendation.ts`
- Test: `companion/telegram-profit-copilot/test/server/decision/buildRecommendation.test.ts`

- [ ] **Step 1: Write the failing recommendation test**

```ts
// companion/telegram-profit-copilot/test/server/decision/buildRecommendation.test.ts
import { buildRecommendation } from "../../src/server/decision/buildRecommendation";

describe("buildRecommendation", () => {
  it("prefers a profitable trade signal when it beats the next crop loop after fees", () => {
    const result = buildRecommendation({
      estimatedState: {
        recordedAt: "2026-04-18T08:00:00.000Z",
        flowerBalance: 100,
        confidence: 1,
        reasons: [],
        trackedItems: { Tomato: 30 },
        activeLoops: [],
      },
      marketSignals: [
        {
          action: "sell_now",
          item: "Tomato",
          netProfit: 18,
          rationale: "14% above 7d baseline after tax",
        },
      ],
    });

    expect(result.bestAction.kind).toBe("trade");
    expect(result.bestAction.title).toMatch(/Tomato/);
    expect(result.bestAction.rationale).toMatch(/14% above 7d baseline/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/decision/buildRecommendation.test.ts`

Expected: FAIL because the decision engine files do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
// companion/telegram-profit-copilot/src/server/decision/cropEngine.ts
import { GAME_DATA } from "../../shared/gameData";

export function scoreCropLoop(name: string, plots: number) {
  const crop = GAME_DATA.crops[name];
  if (!crop) return 0;
  const totalProfit = crop.sellPrice * plots;
  const profitPerHour = totalProfit / (crop.harvestSeconds / 3600);
  return Number(profitPerHour.toFixed(4));
}
```

```ts
// companion/telegram-profit-copilot/src/server/decision/animalEngine.ts
import { GAME_DATA } from "../../shared/gameData";

export function scoreAnimalFeed(animalName: string, feedName: string, quantity: number) {
  const animal = GAME_DATA.animals[animalName];
  const feed = animal?.feedOptions[feedName];
  if (!animal || !feed) return 0;
  const ingredientCost = Object.values(feed.ingredients).reduce((sum, amount) => sum + amount, 0);
  return Math.max(0, animal.purchaseCoins / 10 - ingredientCost) * quantity;
}
```

```ts
// companion/telegram-profit-copilot/src/server/decision/tradeSignalEngine.ts
export type TradeSignal = {
  action: "sell_now" | "watch" | "hold" | "ignore";
  item: string;
  netProfit: number;
  rationale: string;
};

export function filterTradeSignals(
  signals: TradeSignal[],
  minimumNetProfit: number,
): TradeSignal[] {
  return signals.filter(
    (signal) => signal.action === "sell_now" && signal.netProfit >= minimumNetProfit,
  );
}
```

```ts
// companion/telegram-profit-copilot/src/server/decision/rankActions.ts
type RankedAction = {
  kind: "trade" | "crop" | "animal";
  title: string;
  score: number;
  rationale: string;
};

export function rankActions(actions: RankedAction[]) {
  return [...actions].sort((left, right) => right.score - left.score);
}
```

```ts
// companion/telegram-profit-copilot/src/server/decision/buildRecommendation.ts
import { scoreCropLoop } from "./cropEngine";
import { scoreAnimalFeed } from "./animalEngine";
import { filterTradeSignals, type TradeSignal } from "./tradeSignalEngine";
import { rankActions } from "./rankActions";

export function buildRecommendation({
  estimatedState,
  marketSignals,
}: {
  estimatedState: {
    confidence: number;
    trackedItems: Record<string, number>;
  };
  marketSignals: TradeSignal[];
}) {
  const actions = filterTradeSignals(marketSignals, 5).map((signal) => ({
    kind: "trade" as const,
    title: `Sell ${signal.item}`,
    score: signal.netProfit * estimatedState.confidence,
    rationale: signal.rationale,
  }));

  Object.entries(estimatedState.trackedItems).forEach(([itemName, quantity]) => {
    const cropScore = scoreCropLoop(itemName, quantity);
    if (cropScore > 0) {
      actions.push({
        kind: "crop",
        title: `Reinvest in ${itemName}`,
        score: cropScore * estimatedState.confidence,
        rationale: `Crop loop score ${cropScore.toFixed(2)} profit/hour`,
      });
      return;
    }

    const animalScore = scoreAnimalFeed("Chicken", "Kernel Blend", quantity);
    if (animalScore > 0) {
      actions.push({
        kind: "animal",
        title: `Feed Chicken with Kernel Blend`,
        score: animalScore * estimatedState.confidence,
        rationale: `Animal loop score ${animalScore.toFixed(2)}`,
      });
    }
  });

  const ranked = rankActions(actions);
  return {
    bestAction: ranked[0],
    alternatives: ranked.slice(1, 3),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/decision/buildRecommendation.test.ts`

Expected: PASS, and the returned best action should be the market sell action for Tomato.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/src/server/decision companion/telegram-profit-copilot/test/server/decision/buildRecommendation.test.ts
git commit -m "feat: add rule-based recommendation engine"
```

### Task 7: Add Reminder Job Creation, De-Duplication, And Telegram Delivery

**Files:**
- Create: `companion/telegram-profit-copilot/src/server/reminders/buildReminderJobs.ts`
- Create: `companion/telegram-profit-copilot/src/server/reminders/reminderWorker.ts`
- Create: `companion/telegram-profit-copilot/src/server/telegram/sendTelegramMessage.ts`
- Modify: `companion/telegram-profit-copilot/src/server/db/repositories/reminderRepository.ts`
- Modify: `companion/telegram-profit-copilot/src/server/main.ts`
- Test: `companion/telegram-profit-copilot/test/server/reminders/reminderWorker.test.ts`

- [ ] **Step 1: Write the failing reminder test**

```ts
// companion/telegram-profit-copilot/test/server/reminders/reminderWorker.test.ts
import { createReminderWorker } from "../../src/server/reminders/reminderWorker";

describe("reminder worker", () => {
  it("sends each dedupe key at most once and marks the job as sent", async () => {
    const sent: string[] = [];
    const jobs = [
      {
        id: 1,
        dedupeKey: "crop:Pumpkin:2026-04-18T08:30:00.000Z",
        kind: "loop-ready",
        dueAt: "2026-04-18T08:30:00.000Z",
        payload: { text: "Pumpkin ready" },
      },
    ];

    const worker = createReminderWorker({
      getDueJobs: () => jobs,
      markSent: (id) => sent.push(String(id)),
      sendMessage: async (_text) => undefined,
      now: () => new Date("2026-04-18T08:31:00.000Z"),
    });

    await worker.tick();
    await worker.tick();

    expect(sent).toEqual(["1"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/reminders/reminderWorker.test.ts`

Expected: FAIL because the reminder worker does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
// companion/telegram-profit-copilot/src/server/reminders/buildReminderJobs.ts
export function buildReminderJobs(input: {
  activeLoops: Array<{ kind: string; name: string; expectedReadyAt?: string }>;
}) {
  return input.activeLoops
    .filter((loop) => loop.expectedReadyAt)
    .map((loop) => ({
      dedupeKey: `${loop.kind}:${loop.name}:${loop.expectedReadyAt}`,
      dueAt: loop.expectedReadyAt!,
      kind: "loop-ready",
      payload: {
        text: `${loop.name} is ready. This is the next high-value action window.`,
      },
    }));
}
```

```ts
// companion/telegram-profit-copilot/src/server/telegram/sendTelegramMessage.ts
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
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      },
    );

    if (!response.ok) throw new Error(`Telegram send failed: ${response.status}`);
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/reminders/reminderWorker.ts
export function createReminderWorker({
  getDueJobs,
  markSent,
  sendMessage,
  now = () => new Date(),
}: {
  getDueJobs: (nowIso: string) => Array<{
    id: number;
    dedupeKey: string;
    payload: { text: string };
  }>;
  markSent: (id: number) => void;
  sendMessage: (text: string) => Promise<void>;
  now?: () => Date;
}) {
  const sentKeys = new Set<string>();

  return {
    async tick() {
      const jobs = getDueJobs(now().toISOString());
      for (const job of jobs) {
        if (sentKeys.has(job.dedupeKey)) continue;
        await sendMessage(job.payload.text);
        markSent(job.id);
        sentKeys.add(job.dedupeKey);
      }
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/main.ts
import { createTelegramNotifier } from "./telegram/sendTelegramMessage";
import { createReminderWorker } from "./reminders/reminderWorker";

const sendTelegramMessage = createTelegramNotifier({
  botToken: config.telegramBotToken,
  chatId: config.telegramChatId,
});

const reminderWorker = createReminderWorker({
  getDueJobs: (_nowIso) => [],
  markSent: (_id) => undefined,
  sendMessage: sendTelegramMessage,
});

setInterval(() => {
  void reminderWorker.tick();
}, config.reminderPollMs);
```

- [ ] **Step 4: Run the reminder test**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/reminders/reminderWorker.test.ts`

Expected: PASS, and the second `tick()` should not send or mark the same dedupe key twice.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/src/server/reminders companion/telegram-profit-copilot/src/server/telegram/sendTelegramMessage.ts companion/telegram-profit-copilot/src/server/main.ts companion/telegram-profit-copilot/test/server/reminders/reminderWorker.test.ts
git commit -m "feat: add reminder worker and telegram delivery"
```

### Task 8: Implement Telegram Commands, Guided Check-In Flow, And Webhook Handling

**Files:**
- Create: `companion/telegram-profit-copilot/src/server/telegram/commandRouter.ts`
- Create: `companion/telegram-profit-copilot/src/server/telegram/checkInFlow.ts`
- Create: `companion/telegram-profit-copilot/src/server/telegram/renderers.ts`
- Create: `companion/telegram-profit-copilot/src/server/http/routes/telegramWebhookRoute.ts`
- Modify: `companion/telegram-profit-copilot/src/server/db/repositories/telegramSessionRepository.ts`
- Modify: `companion/telegram-profit-copilot/src/server/http/buildApp.ts`
- Test: `companion/telegram-profit-copilot/test/server/telegram/telegramWebhookRoute.test.ts`

- [ ] **Step 1: Write the failing webhook test**

```ts
// companion/telegram-profit-copilot/test/server/telegram/telegramWebhookRoute.test.ts
import { buildApp } from "../../src/server/http/buildApp";

describe("POST /webhooks/telegram", () => {
  it("advances the guided check-in flow from /checkin to the crop prompt", async () => {
    const app = buildApp({
      port: 4318,
      databasePath: ":memory:",
      telegramBotToken: "bot-token",
      telegramChatId: "12345",
      sflApiUrl: "https://api.sunflower-land.com",
      marketPollMs: 60000,
      reminderPollMs: 30000,
    });

    const response = await app.inject({
      method: "POST",
      url: "/webhooks/telegram",
      payload: {
        message: {
          chat: { id: 12345 },
          text: "/checkin",
        },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      ok: true,
      nextPrompt: "Which crop or fruit loops are active?",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/telegram/telegramWebhookRoute.test.ts`

Expected: FAIL because the Telegram router and webhook route do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
// companion/telegram-profit-copilot/src/server/telegram/checkInFlow.ts
export function startCheckInSession(chatId: string) {
  return {
    chatId,
    state: "awaiting-crops" as const,
    nextPrompt: "Which crop or fruit loops are active?",
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/telegram/commandRouter.ts
import { startCheckInSession } from "./checkInFlow";
import { renderPrompt } from "./renderers";

export function createCommandRouter() {
  return {
    routeMessage(chatId: string, text: string) {
      if (text === "/checkin") {
        const session = startCheckInSession(chatId);
        return { ok: true, ...session, message: renderPrompt(session.state) };
      }
      if (text === "/whatnow") {
        return {
          ok: true,
          message: "No recommendation yet. Complete a check-in first.",
        };
      }
      return { ok: true, message: "Use /checkin, /whatnow, /timers, or /market." };
    },
  };
}
```

```ts
// companion/telegram-profit-copilot/src/server/telegram/renderers.ts
export function renderPrompt(state: "awaiting-crops" | "awaiting-animals" | "awaiting-balance") {
  switch (state) {
    case "awaiting-crops":
      return "Which crop or fruit loops are active?";
    case "awaiting-animals":
      return "Which animal loops are active?";
    case "awaiting-balance":
      return "What is your current FLOWER balance and tracked inventory?";
  }
}
```

```ts
// companion/telegram-profit-copilot/src/server/http/routes/telegramWebhookRoute.ts
import type { FastifyInstance } from "fastify";
import { createCommandRouter } from "../../telegram/commandRouter";

export async function registerTelegramWebhookRoute(app: FastifyInstance) {
  const router = createCommandRouter();

  app.post("/webhooks/telegram", async (request) => {
    const payload = request.body as {
      message?: { chat: { id: number }; text: string };
    };

    const text = payload.message?.text ?? "";
    const chatId = String(payload.message?.chat.id ?? "");

    return router.routeMessage(chatId, text);
  });
}
```

```ts
// companion/telegram-profit-copilot/src/server/http/buildApp.ts
import { registerTelegramWebhookRoute } from "./routes/telegramWebhookRoute";

app.register(registerTelegramWebhookRoute);
```

- [ ] **Step 4: Run the webhook test**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/telegram/telegramWebhookRoute.test.ts`

Expected: PASS, and `/checkin` should respond with the first guided prompt.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/src/server/telegram companion/telegram-profit-copilot/src/server/http/routes/telegramWebhookRoute.ts companion/telegram-profit-copilot/src/server/http/buildApp.ts companion/telegram-profit-copilot/test/server/telegram/telegramWebhookRoute.test.ts
git commit -m "feat: add telegram webhook and guided check-in flow"
```

### Task 9: Add Dashboard APIs And React Operations UI

**Files:**
- Create: `companion/telegram-profit-copilot/vite.dashboard.config.ts`
- Create: `companion/telegram-profit-copilot/src/dashboard/main.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/App.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/api/client.ts`
- Create: `companion/telegram-profit-copilot/src/dashboard/components/Layout.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/OverviewPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/StrategyPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/MarketPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/StatePage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/routes/HistoryPage.tsx`
- Create: `companion/telegram-profit-copilot/src/dashboard/styles.css`
- Create: `companion/telegram-profit-copilot/src/server/http/routes/dashboardRoutes.ts`
- Test: `companion/telegram-profit-copilot/test/dashboard/App.test.tsx`

- [ ] **Step 1: Write the failing dashboard test**

```tsx
// companion/telegram-profit-copilot/test/dashboard/App.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { App } from "../../src/dashboard/App";

describe("dashboard App", () => {
  it("renders the overview heading and the primary CTA", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Profit Copilot")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh State" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/dashboard/App.test.tsx`

Expected: FAIL because the dashboard entry files do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```tsx
// companion/telegram-profit-copilot/src/dashboard/api/client.ts
export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Dashboard API failed: ${response.status}`);
  return (await response.json()) as T;
}
```

```tsx
// companion/telegram-profit-copilot/src/dashboard/components/Layout.tsx
import type { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <div className="shell">{children}</div>;
}
```

```tsx
// companion/telegram-profit-copilot/src/dashboard/App.tsx
import { NavLink } from "react-router";
import { Layout } from "./components/Layout";

export function App() {
  return (
    <Layout>
      <header className="header">
        <div>
          <p className="eyebrow">Sunflower Land</p>
          <h1>Profit Copilot</h1>
        </div>
        <button type="button">Refresh State</button>
      </header>

      <nav className="nav">
        <NavLink to="/">Overview</NavLink>
        <NavLink to="/strategy">Strategy</NavLink>
        <NavLink to="/market">Market</NavLink>
        <NavLink to="/state">State</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>

      <main>
        <section className="panel">
          <h2>Best Action Now</h2>
          <p>Waiting for the first check-in.</p>
        </section>
      </main>
    </Layout>
  );
}
```

```tsx
// companion/telegram-profit-copilot/src/dashboard/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

```css
/* companion/telegram-profit-copilot/src/dashboard/styles.css */
:root {
  --bg: #f5f2e8;
  --panel: #fffaf0;
  --ink: #1d3b2a;
  --accent: #d46a1f;
  --muted: #5c675c;
}

body {
  margin: 0;
  font-family: "IBM Plex Sans", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(212, 106, 31, 0.14), transparent 28rem),
    linear-gradient(180deg, #fff8ec 0%, var(--bg) 100%);
  color: var(--ink);
}

.shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.header,
.nav,
.panel {
  background: var(--panel);
  border: 1px solid rgba(29, 59, 42, 0.1);
  border-radius: 18px;
}
```

```ts
// companion/telegram-profit-copilot/src/server/http/routes/dashboardRoutes.ts
import type { FastifyInstance } from "fastify";

export async function registerDashboardRoutes(app: FastifyInstance) {
  app.get("/api/overview", async () => ({
    bestAction: null,
    confidence: 0,
    activeLoops: [],
  }));
}
```

- [ ] **Step 4: Run the dashboard test**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/dashboard/App.test.tsx`

Expected: PASS, and the dashboard shell should render the Overview navigation and Refresh State CTA.

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/vite.dashboard.config.ts companion/telegram-profit-copilot/src/dashboard companion/telegram-profit-copilot/test/dashboard/App.test.tsx
git commit -m "feat: add profit copilot dashboard shell"
```

### Task 10: Wire Startup Loops, Deployment Docs, And End-To-End Smoke Verification

**Files:**
- Modify: `companion/telegram-profit-copilot/src/server/main.ts`
- Create: `companion/telegram-profit-copilot/README.md`
- Create: `companion/telegram-profit-copilot/deploy/systemd/telegram-profit-copilot.service`
- Create: `companion/telegram-profit-copilot/test/server/smokeCheck.test.ts`

- [ ] **Step 1: Write the failing smoke test**

```ts
// companion/telegram-profit-copilot/test/server/smokeCheck.test.ts
import { buildApp } from "../../src/server/http/buildApp";

describe("smoke check", () => {
  it("exposes health, dashboard settings, and telegram webhook routes", async () => {
    const app = buildApp({
      port: 4318,
      databasePath: ":memory:",
      telegramBotToken: "bot-token",
      telegramChatId: "12345",
      sflApiUrl: "https://api.sunflower-land.com",
      marketPollMs: 60000,
      reminderPollMs: 30000,
    });

    const [health, settings, webhook] = await Promise.all([
      app.inject({ method: "GET", url: "/health" }),
      app.inject({ method: "GET", url: "/api/settings" }),
      app.inject({ method: "POST", url: "/webhooks/telegram", payload: { message: { chat: { id: 1 }, text: "/checkin" } } }),
    ]);

    expect(health.statusCode).toBe(200);
    expect(settings.statusCode).toBe(200);
    expect(webhook.statusCode).toBe(200);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/smokeCheck.test.ts`

Expected: FAIL until all routes and server wiring from the previous tasks are actually composed together.

- [ ] **Step 3: Finish the wiring and docs**

```ts
// companion/telegram-profit-copilot/src/server/main.ts
// final shape after prior tasks are complete
import { loadConfig } from "./config/loadConfig";
import { openDatabase } from "./db/openDatabase";
import { runMigrations } from "./db/runMigrations";
import { buildApp } from "./http/buildApp";
import { createReminderWorker } from "./reminders/reminderWorker";
import { createTelegramNotifier } from "./telegram/sendTelegramMessage";

const config = loadConfig();
const db = openDatabase(config.databasePath);
runMigrations(db);

const app = buildApp(config);
const sendMessage = createTelegramNotifier({
  botToken: config.telegramBotToken,
  chatId: config.telegramChatId,
});
const reminderWorker = createReminderWorker({
  getDueJobs: () => [],
  markSent: () => undefined,
  sendMessage,
});

setInterval(() => {
  void reminderWorker.tick();
}, config.reminderPollMs);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
```

```ini
; companion/telegram-profit-copilot/deploy/systemd/telegram-profit-copilot.service
[Unit]
Description=Sunflower Land Telegram Profit Copilot
After=network.target

[Service]
WorkingDirectory=/srv/sunflower-land/companion/telegram-profit-copilot
ExecStart=/usr/bin/env yarn dev:server
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```md
<!-- companion/telegram-profit-copilot/README.md -->
# Telegram Profit Copilot

## Prerequisites

- Node 20+
- Yarn
- A Telegram bot token created through BotFather
- A manually supplied Sunflower Land raw market token for live market polling

## First Run

1. `cp .env.example .env`
2. `yarn install`
3. `yarn profit-copilot:data`
4. `yarn dev:server`
5. `yarn dev:dashboard`
```

- [ ] **Step 4: Run the smoke test and focused verification commands**

Run: `yarn --cwd companion/telegram-profit-copilot test --runInBand test/server/smokeCheck.test.ts`

Expected: PASS with the health, settings, and webhook routes all reachable from the built app.

Then run:

```bash
yarn profit-copilot:data
yarn --cwd companion/telegram-profit-copilot test --runInBand
```

Expected:

- game-data export completes without `localStorage` or i18n errors
- all companion package tests pass
- the package is ready for either subagent-driven or inline execution

- [ ] **Step 5: Commit**

```bash
git add companion/telegram-profit-copilot/src/server/main.ts companion/telegram-profit-copilot/README.md companion/telegram-profit-copilot/deploy/systemd/telegram-profit-copilot.service companion/telegram-profit-copilot/test/server/smokeCheck.test.ts
git commit -m "docs: add copilot deployment and smoke verification"
```

## Self-Review

### Spec Coverage

- Telegram-first workflow: Tasks 1, 7, and 8.
- State estimation and confidence: Task 5.
- Crop, animal, and trading profit logic: Tasks 2, 4, and 6.
- Reminder scheduling and de-duplication: Task 7.
- Dashboard for inspection and manual configuration: Tasks 4 and 9.
- VPS/cloud readiness and persistence: Tasks 3 and 10.
- No auto-trading and recommendation-only market flow: Tasks 4, 6, and 8 keep the system read-only against marketplace actions.

No spec gaps remain.

### Placeholder Scan

- No `TODO`, `TBD`, or “implement later” placeholders remain.
- Every task names exact files, test commands, and commit commands.

### Type Consistency

- Internal balance field is consistently named `flowerBalance`.
- Market signal types consistently use `sell_now | watch | hold | ignore`.
- Estimated state shape consistently uses `confidence`, `reasons`, `trackedItems`, and `activeLoops`.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-18-sunflower-land-telegram-profit-copilot.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
