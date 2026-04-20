import { z } from "zod";

const configSchema = z.object({
  DATABASE_PATH: z.string().min(1),
  MARKET_POLL_MS: z.coerce.number().int().positive().default(60000),
  PORT: z.coerce.number().int().positive().default(4318),
  REMINDER_POLL_MS: z.coerce.number().int().positive().default(30000),
  SFL_API_URL: z.string().url(),
  SFL_MARKET_RAW_TOKEN: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.string().min(1),
});

export interface AppConfig {
  port: number;
  databasePath: string;
  telegramBotToken: string;
  telegramChatId: string;
  sflApiUrl: string;
  marketPollMs: number;
  reminderPollMs: number;
  sflMarketRawToken?: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = configSchema.parse(env);

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
