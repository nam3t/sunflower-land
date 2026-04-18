# Sunflower Land Telegram Profit Copilot Design

Date: 2026-04-18
Status: Approved for planning
Owner: User + Codex

## Summary

Build a single-user companion app for Sunflower Land that runs on a VPS, uses Telegram as the primary daily interface, and helps the user maximize profit from crop/fruit loops, animal loops, and marketplace opportunities. The system does not integrate into the existing game client and does not auto-play the game. It estimates farm state from short Telegram check-ins, watches market data, schedules reminders, and recommends the next best action with a short explanation.

## Goals

- Maximize profit as the primary optimization target.
- Tell the user the best action to take now and the next best time to re-enter the game.
- Reduce missed high-value timers for crop/fruit and animal loops.
- Surface market opportunities worth acting on, using live or near-real-time marketplace data when available.
- Keep daily operation lightweight through Telegram-first workflows with a small supporting dashboard.

## Non-Goals

- No in-game UI integration into the Sunflower Land client.
- No full game-state synchronization with the official client.
- No auto-play or automatic execution of gameplay actions.
- No automatic marketplace listing or selling in v1.
- No multi-user or multi-farm support in v1.
- No mobile app in v1.

## Constraints And Assumptions

- The system serves exactly one user and one farm/account.
- The app runs on cloud or VPS infrastructure 24/7.
- Telegram is the primary interaction channel.
- The user can enter the game at any time when reminded.
- The user checks in a few times per day instead of logging every action.
- Each check-in includes a short summary of crop/fruit status, animal status, coin/SFL balance, and selected important items.
- Marketplace recommendations use fetched market data but require manual confirmation before any action is taken in-game.

## Existing Project Context

The current Sunflower Land repo already contains useful source-of-truth data and patterns that the companion app can reuse conceptually:

- crop and fruit timing/value definitions such as `sellPrice` and `harvestSeconds`
- animal definitions, feed inputs, and progression-related data
- marketplace models including floor price, last sale price, listings, offers, and sale history
- existing timer and cooldown concepts

This means the companion app can align with real game concepts instead of inventing its own resource model from scratch.

## Product Overview

The recommended product shape is a Telegram-first copilot with a small operational dashboard:

- Telegram bot for check-ins, reminders, timers, and "what now?" decisions
- backend service for scheduling, state estimation, decision-making, and market watching
- database for user config, estimated farm state, reminder jobs, market snapshots, and logs
- web dashboard for visibility, configuration, state correction, and audit trails

Telegram is the default daily workflow. The dashboard exists to inspect and tune the system, not to replace Telegram as the main interface.

## Architecture

### Components

1. Telegram Interface
   - Receives structured check-ins.
   - Answers commands such as current plan, active timers, and market signals.
   - Sends reminders and high-value market alerts.

2. Backend API And Worker Layer
   - Exposes backend routes for dashboard and Telegram webhook handling.
   - Runs background jobs for reminder scheduling and market polling.
   - Hosts the decision engine and state estimator.

3. Decision Engine
   - Combines gameplay presets, estimated farm state, and market signals.
   - Produces ranked actions such as "harvest now", "feed next", "hold inventory", or "watch item".

4. State Estimator
   - Maintains a reduced operational model of the farm.
   - Recomputes expected ready times after each check-in.
   - Tracks confidence in its own estimates.

5. Market Watcher
   - Polls marketplace endpoints on a fixed schedule.
   - Stores snapshots and derives signals from floor price, last sale, history, and liquidity indicators.

6. Scheduler
   - Persists reminder jobs in the database.
   - De-duplicates overlapping alerts.
   - Rebuilds jobs after restart.

7. Dashboard
   - Shows best action now, timers, market watchlist, configuration, and state confidence.
   - Allows manual correction when estimated state drifts.

8. Database
   - Stores configuration, estimated state, reminders, market snapshots, and decision logs.

### High-Level Boundaries

- Telegram owns the fast input/output loop.
- The dashboard owns inspection, correction, and configuration.
- The backend owns all decision logic.
- The database owns persistence for recovery and auditability.

## Data Model

The system should not try to mirror the full game state. It only needs a reduced decision model.

### Static Profile

- `farm_profile`
  - farm identifier
  - wallet/account reference
  - timezone
  - relevant island progression and unlocks
  - counts of plots, fruit patches, and animal buildings used by the strategy

- `strategy_profile`
  - primary objective: max profit
  - relative weighting for crop/fruit, animal, and trading priorities
  - minimum alert thresholds for market signals
  - preferred reminder sensitivity

- `presets`
  - crop/fruit loops the user wants the app to consider
  - animal loops and feeding patterns
  - trading watchlist and thresholds

### Estimated Operational State

- `active_loops`
  - loop type
  - started time
  - expected ready time
  - resources consumed
  - expected output

- `animal_state`
  - active animal groups
  - current feed cycle
  - expected next output timing
  - last confirmed check-in time

- `inventory_checkpoint`
  - coin balance
  - SFL/FLOWER balance
  - a small set of important tracked items

- `state_confidence`
  - confidence score
  - reason codes for low confidence
  - last fully trusted check-in timestamp

### Market State

- `watchlist_items`
- `market_snapshots`
- `trade_signals`

Each trade signal should record the underlying evidence so recommendations remain explainable.

### Output State

- `recommendations`
- `reminder_jobs`
- `decision_log`

## State Estimation Strategy

Because the user does not log every action, the system estimates state between check-ins:

1. The user submits a short check-in.
2. The backend normalizes the input and merges it with the latest estimated state.
3. The estimator recalculates loop timing and expected outputs.
4. The confidence score is updated.
5. The decision engine recomputes the ranked next actions.
6. Reminder jobs are re-created from the new estimate.

If the input is incomplete or contradictory, the system lowers confidence and asks for targeted clarification instead of pretending the estimate is precise.

## Daily Data Flow

### First Check-In Or Any Manual Check-In

The user submits a short status update through Telegram:

- crop/fruit status
- animal status
- coin/SFL balance
- selected tracked inventory items

The backend then:

- updates the estimated state
- recalculates all high-value timers
- refreshes the best action ranking
- schedules the next reminders
- returns a short action summary

### Decision Cycle

For each decision pass:

1. Normalize check-in data.
2. Merge it with strategy presets.
3. Recompute `ready_at` values for crop/fruit and animal loops.
4. Evaluate profit opportunities.
5. Blend in market watcher signals.
6. Rank actions and select the best immediate recommendation.

### Reminder Cycle

Reminders should only be scheduled for economically meaningful moments:

- high-value harvest or loop completion
- valuable animal loop milestones
- market opportunities that exceed configured thresholds
- stale-state reminders when the estimate is no longer trustworthy

If multiple events cluster together, the scheduler should consolidate them into a single reminder rather than sending several near-identical alerts.

### Market Watcher Cycle

The market watcher polls marketplace APIs on a fixed interval, persists snapshots, and derives signals such as:

- `sell_now`
- `watch`
- `hold`
- `ignore`

Signals become Telegram alerts only when expected net profit meaningfully exceeds the user-configured threshold.

## Profit Optimization Logic

The system uses three specialized engines plus one unified ranking layer.

### Crop/Fruit Profit Engine

Inputs:

- growth time
- expected output
- seed or input cost
- baseline sell value
- market sell value when relevant

Outputs:

- profit per cycle
- profit per hour
- profit adjusted for likely availability
- ranked loop options

### Animal Profit Engine

Inputs:

- feed cost
- output value
- cadence or cooldown
- explicit progression effects only when they can be translated into concrete later profit, yield, or cadence gains; otherwise ignore progression in v1
- opportunity cost of feed ingredients

Outputs:

- best animal loops to maintain
- preferred feed choices at the current state
- hold-versus-sell recommendations for animal outputs

### Trading Signal Engine

Inputs:

- floor price
- last sale price
- short-term history
- volume and liquidity hints
- listing or offer pressure when available
- marketplace tax/fees

Outputs:

- `sell_now`
- `watch`
- `hold`
- `ignore`

The trading engine should stay rule-based in v1. Recommendations must remain explainable and tunable.

### Unified Action Ranking

All candidate actions are scored against:

- expected profit
- time sensitivity
- market opportunity decay
- state confidence
- manual effort

The system then chooses:

- best action now
- next recommended re-entry time
- items worth monitoring or selling

## Telegram UX

The Telegram bot should optimize for speed and repeatability, not long-form conversation.

### Primary Flows

- `Check-in`
  - guided short form for crop/fruit, animal, balance, and tracked inventory

- `What now?`
  - short answer with immediate action, next session timing, and market note

- `Timers`
  - currently active high-value timers and next reminders

- `Market`
  - watchlist status and live opportunity summary

### Reply Style

Responses should stay short and decision-oriented:

- what to do now
- when to come back
- what is worth selling or watching
- why the recommendation is profitable

### Inline Actions

Useful Telegram buttons include:

- `Check-in again`
- `Done`
- `Snooze 30m`
- `Show timers`
- `Show market`
- `Fix state`

### Reminder Style

A reminder must include context, not just a timestamp. It should explain why the moment matters economically.

## Dashboard UX

The dashboard should remain deliberately small.

### Pages

- `Overview`
  - best action now
  - active timers
  - state confidence

- `Strategy`
  - crop/fruit presets
  - animal presets
  - thresholds and reminder settings

- `Market`
  - watchlist
  - current signals
  - recent market snapshots
  - net-profit view

- `State Editor`
  - manual correction of estimated state

- `History`
  - prior check-ins
  - reminders sent
  - decisions made
  - signal changes

The dashboard exists to audit and tune the system. It is not the primary daily workflow.

## Error Handling And Guardrails

### Key Risks

- state drift caused by sparse check-ins
- stale or missing market data
- noisy signals that create alert fatigue
- incorrect net-profit calculations
- duplicate reminder delivery
- worker or scheduler restarts on VPS
- Telegram delivery failures

### Guardrails

- `state confidence score`
  - recommendations become more cautious when confidence drops

- `stale-state detection`
  - the system asks for a refresh instead of continuing to infer deeply from old state

- `reminder deduplication`
  - prevents overlapping alerts for the same event

- `market threshold gating`
  - suppresses low-value noise

- `manual confirmation only`
  - all market actions remain user-confirmed in v1

- `explainable decisions`
  - every recommendation includes a short rationale

- `manual override`
  - the dashboard can correct estimated state at any time

### Failure Behavior

- If market APIs fail, fall back to the latest stored snapshot and label the resulting recommendation with stale-data context.
- If Telegram delivery fails, retry with backoff and log the failure state.
- If background workers restart, rebuild future jobs from persistent data.
- If input is contradictory, lower confidence and ask for clarification.

## Testing Strategy

### Unit Tests

- crop/fruit scoring
- animal scoring
- trading signal derivation
- action ranking
- stale-state detection
- reminder de-duplication

### Scenario Simulation Tests

Test realistic sequences such as:

- morning check-in followed by long inactivity
- market spike while production loops are active
- conflict between harvesting, feeding, and selling
- incomplete check-in with low-confidence fallback

### Integration Tests

- Telegram command handlers
- scheduler persistence and rebuild behavior
- marketplace API adapter behavior
- dashboard-to-backend configuration updates

### Dry-Run Verification

Before enabling full live reminders, run the system in an observe-only or low-noise mode for several days to confirm:

- reminders are not spammy
- ranked actions remain sensible
- state drift is detected quickly
- market alerts are rare but valuable

## Acceptance Criteria For v1

The design succeeds when all of the following are true:

- the user rarely misses important profit-relevant timers
- the user can see the best next action at each meaningful moment
- Telegram check-ins remain fast enough for repeated daily use
- recommendations are explainable and auditable
- market alerts are selective and economically meaningful
- the system does not silently continue operating on stale low-confidence state

## Explicit v1 Decisions

- Single-user only
- Single-farm only
- Telegram-first operation
- Small supporting web dashboard
- VPS/cloud deployment
- Profit maximization is the top objective
- Focus on crop/fruit, animals, and trading
- Trading stays recommendation-only in v1
- Market data should be fetched from the same marketplace API surfaces the current game client uses; if those endpoints are unavailable, the system should fall back to the latest stored snapshot and suppress fresh market-triggered alerts
- Decision logic stays rule-based and configurable in v1

## Out Of Scope For Later Phases

- automatic marketplace listing
- automatic trade execution
- mobile push app
- game-client integration
- full state sync from official APIs or on-chain data
- multi-user SaaS behavior
- predictive or machine-learning-based optimization

## Planning Notes

The implementation plan should prioritize:

1. a stable state model and confidence system
2. Telegram check-in and response workflows
3. reminder scheduling and persistence
4. crop/fruit and animal profit engines
5. market watcher and signal engine
6. dashboard inspection and manual correction flows

This ordering protects the main product value: clear next actions and reminders that the user can trust.
