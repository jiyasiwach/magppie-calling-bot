/* ==================================================================== *
 * Magppie Call Monitor — websocket contract.
 *
 * This file IS the spec. The FastAPI service and this screen must agree
 * on exactly these shapes. Everything the screen paints arrives over one
 * websocket as JSON objects discriminated by `type`. The only thing this
 * screen ever sends back is a request to take the call over (and to hand
 * it back). It never touches telephony.
 *
 * Ordering note the backend must honour: send `kb.hit` BEFORE the
 * matching `turn.*` text, so the knowledge chunk lights up while Pooja is
 * still talking, not after she has finished.
 * ==================================================================== */

/** Who is speaking on a given turn. `human` = a Magppie person who has
 *  taken the line from Pooja. */
export type Speaker = "agent" | "customer" | "human";

/** Drives the orb. One value at a time.
 *  - idle      : call connected, nobody talking
 *  - listening : the caller is talking
 *  - thinking  : the brain is retrieving / composing
 *  - speaking  : Pooja is talking
 *  - human     : a person has taken the line */
export type AgentState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "human";

/* ----------------------------- inbound ----------------------------- */
/* server → screen */

/** A call connected. The backend masks the number; this screen never
 *  sees the full one. */
export interface CallStartedEvent {
  type: "call.started";
  /** already masked by the backend, e.g. "+91 98••• ••231" */
  maskedNumber: string;
  /** Zoho CRM lead id this call is tied to */
  leadId: string;
  /** the lead's name, if we have it */
  leadName?: string;
  /** ISO 8601. Optional — the screen stamps receipt time if absent. */
  startedAt?: string;
}

export interface AgentStateEvent {
  type: "agent.state";
  state: AgentState;
}

/** Words still arriving from speech-to-text. Rendered greyed with a
 *  cursor so nobody mistakes half a sentence for a finished one. A
 *  `turn.final` with the same turnId supersedes it. */
export interface TurnPartialEvent {
  type: "turn.partial";
  turnId: string;
  speaker: Speaker;
  text: string;
}

/** The finished turn. Agent turns carry a latency. */
export interface TurnFinalEvent {
  type: "turn.final";
  turnId: string;
  speaker: Speaker;
  text: string;
  /** round-trip latency in ms — agent turns only. Turns ember above
   *  1000ms (p95 target is 950ms). */
  latencyMs?: number;
  /** ISO 8601 — when the turn finalised. Screen stamps if absent. */
  at?: string;
}

/** The knowledge chunk the brain retrieved for a turn. `chunkId` ties
 *  the hit to a card in the knowledge panel. Send before the turn text. */
export interface KbHitEvent {
  type: "kb.hit";
  chunkId: string;
  /** the turn this retrieval fed, if known */
  turnId?: string;
}

/** The backend granted a takeover request — the person is now on the
 *  line. Usually followed by an `agent.state: "human"`. */
export interface TakeoverGrantedEvent {
  type: "takeover.granted";
}

/** The backend refused. The reason is shown on screen verbatim — a
 *  director is reading it. */
export interface TakeoverDeniedEvent {
  type: "takeover.denied";
  reason: string;
}

export type ServerEvent =
  | CallStartedEvent
  | AgentStateEvent
  | TurnPartialEvent
  | TurnFinalEvent
  | KbHitEvent
  | TakeoverGrantedEvent
  | TakeoverDeniedEvent;

/* ----------------------------- outbound ---------------------------- */
/* screen → server. Only two, ever. */

export interface TakeoverRequestEvent {
  type: "takeover.request";
}

export interface TakeoverReleaseEvent {
  type: "takeover.release";
}

export type ClientEvent = TakeoverRequestEvent | TakeoverReleaseEvent;

/* ------------------------- knowledge base -------------------------- */
/* Not a wire type — the shape of our numbered markdown KB as this screen
 * renders it. The only field that must match reality is the chunk `id`,
 * since that is what a `kb.hit` points at. */

export interface KbChunk {
  /** stable id referenced by kb.hit, e.g. "pricing-02" */
  id: string;
  heading: string;
  body: string;
}

export interface KbFile {
  /** the numbered markdown file, e.g. "02-pricing.md" */
  file: string;
  title: string;
  chunks: KbChunk[];
}
