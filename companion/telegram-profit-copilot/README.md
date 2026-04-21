# Telegram Profit Copilot

Telegram-first companion app for reminding game entry windows, tracking estimated farm state, and surfacing profit-oriented actions for Sunflower Land.

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

## Environment

The server reads these variables:

- `DATABASE_PATH`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `SFL_API_URL`
- `SFL_MARKET_RAW_TOKEN` (optional)
- `MARKET_POLL_MS` (optional)
- `REMINDER_POLL_MS` (optional)
- `PORT` (optional)
