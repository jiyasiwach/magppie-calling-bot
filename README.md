# Magppie Voice — AI Calling Bot Console

The control-center frontend for Magppie's AI automated calling bot (inbound/outbound
voice). Built with the **Warm Console** design system — warm parchment, deep pine +
aged brass, serif display type — deliberately the opposite of the dark-SaaS look of
competitors like timepay.ai.

Everything renders from a mock data layer today; the backend (Ozonetel + NestJS +
Postgres/pgvector + RAG) is being built separately.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v3.4, tokens wired in `tailwind.config.ts` + `src/app/globals.css`
- shadcn/ui-style primitives on Radix, restyled to Warm Console
- Recharts (charts), Framer-free CSS/Canvas motion, Zustand (client state)
- cmdk (⌘K global search)

## Run

```bash
npm install
npm run dev      # http://localhost:3030
```

> On Windows, launch Next with the app dir as an argument (see the repo-root
> `.claude/launch.json` → `magppie-calling-bot`). The Tailwind `content` glob is an
> absolute path for the same reason — a CWD-relative glob silently yields no styles.

## Where the data lives / going live

- **All fixtures + accessors:** `src/lib/mock-data.ts`. No component imports fixtures
  directly — they call `getKpis()`, `getToolReliability()`, `CONVERSATIONS`, etc.
- **Real-time simulation:** `src/lib/use-live.ts` (waveform volume, live-call timers,
  KPI count-up). Swap the interval bodies for a WebSocket subscription.
- **Types:** `src/lib/types.ts` — these mirror the expected backend response shapes,
  so going live means turning each `getX()` into an async fetch that returns the same
  shape. Blast radius: `mock-data.ts` + `use-live.ts`.

## Routes

`/` Command Center · `/live` Live Calls (waveform) · `/agents` Builder & Simulator ·
`/campaigns` · `/conversations` · `/knowledge` · `/analytics` · `/compliance` ·
`/integrations` · `/team` · `/settings`

## Design tokens (§ "Warm Console")

Defined once as RGB triplets in `globals.css` and mapped in `tailwind.config.ts`:
`bg #F5EFE3 · surface #FBF8F1 · ink #2A2620 · accent-primary #3F5A46 (pine) ·
accent-secondary #B08D57 (brass)`. Fonts: Fraunces (display), Public Sans (UI),
Space Grotesk (numerals, via `.tabular`).
