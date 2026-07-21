import { create } from "zustand";
import type {
  AgentState,
  ClientEvent,
  ServerEvent,
  Speaker,
} from "@/lib/types";

/** A finalised transcript line the screen keeps. */
export interface Turn {
  turnId: string;
  speaker: Speaker;
  text: string;
  latencyMs?: number;
  at: string; // ISO
}

/** A live, not-yet-final turn. */
export interface PartialTurn {
  turnId: string;
  speaker: Speaker;
  text: string;
}

export interface CallInfo {
  maskedNumber: string;
  leadId: string;
  leadName?: string;
  startedAt: string; // ISO
}

export type Connection = "connecting" | "open" | "reconnecting" | "closed";

interface CallState {
  connection: Connection;
  call: CallInfo | null;
  agentState: AgentState;

  turns: Turn[];
  partial: PartialTurn | null;

  /** chunkId → last-hit epoch ms; drives brass highlight + scroll. */
  kbHits: Record<string, number>;
  activeChunkId: string | null;
  /** monotonically bumped each hit so the panel can react even to a
   *  repeat hit on the same chunk. */
  kbHitSeq: number;

  /** true once a request is sent and we're awaiting granted/denied. */
  takeoverPending: boolean;
  /** last denial reason, shown verbatim; cleared on next request. */
  takeoverDenied: string | null;

  // actions
  setConnection: (c: Connection) => void;
  ingest: (e: ServerEvent) => void;
  /** registered by the socket hook; the store stays telephony-agnostic. */
  bindSender: (send: (e: ClientEvent) => void) => void;
  /** the orb's single job: flip who holds the mic. */
  toggleTakeover: () => void;
  reset: () => void;
}

/** Screen-side clock. Kept behind a helper so it's the only spot that
 *  reads wall time — everything else takes ISO strings. */
const nowIso = () => new Date().toISOString();

let sender: ((e: ClientEvent) => void) | null = null;

const initial = {
  connection: "connecting" as Connection,
  call: null as CallInfo | null,
  agentState: "idle" as AgentState,
  turns: [] as Turn[],
  partial: null as PartialTurn | null,
  kbHits: {} as Record<string, number>,
  activeChunkId: null as string | null,
  kbHitSeq: 0,
  takeoverPending: false,
  takeoverDenied: null as string | null,
};

export const useCallStore = create<CallState>((set, get) => ({
  ...initial,

  setConnection: (connection) => set({ connection }),

  bindSender: (send) => {
    sender = send;
  },

  ingest: (e) =>
    set((s) => {
      switch (e.type) {
        case "call.started":
          return {
            call: {
              maskedNumber: e.maskedNumber,
              leadId: e.leadId,
              leadName: e.leadName,
              startedAt: e.startedAt ?? nowIso(),
            },
            // a fresh call clears the previous one's residue
            turns: [],
            partial: null,
            kbHits: {},
            activeChunkId: null,
            agentState: "idle",
            takeoverPending: false,
            takeoverDenied: null,
          };

        case "agent.state":
          return { agentState: e.state };

        case "turn.partial":
          return {
            partial: {
              turnId: e.turnId,
              speaker: e.speaker,
              text: e.text,
            },
          };

        case "turn.final": {
          const turn: Turn = {
            turnId: e.turnId,
            speaker: e.speaker,
            text: e.text,
            latencyMs: e.latencyMs,
            at: e.at ?? nowIso(),
          };
          // supersede any partial for the same turn; append/replace final
          const existing = s.turns.findIndex((t) => t.turnId === e.turnId);
          const turns =
            existing >= 0
              ? s.turns.map((t, i) => (i === existing ? turn : t))
              : [...s.turns, turn];
          const partial =
            s.partial && s.partial.turnId === e.turnId ? null : s.partial;
          return { turns, partial };
        }

        case "kb.hit":
          return {
            kbHits: { ...s.kbHits, [e.chunkId]: Date.now() },
            activeChunkId: e.chunkId,
            kbHitSeq: s.kbHitSeq + 1,
          };

        case "takeover.granted":
          return { takeoverPending: false, takeoverDenied: null };

        case "takeover.denied":
          return { takeoverPending: false, takeoverDenied: e.reason };

        default:
          return {};
      }
    }),

  toggleTakeover: () => {
    const { agentState, takeoverPending } = get();
    const human = agentState === "human";
    if (human) {
      sender?.({ type: "takeover.release" });
      // the backend confirms by moving agent.state off "human"
      return;
    }
    if (takeoverPending) return; // already asked; wait for the answer
    set({ takeoverPending: true, takeoverDenied: null });
    sender?.({ type: "takeover.request" });
  },

  reset: () => set({ ...initial }),
}));

/** Words for the state, because colour alone shouldn't carry it. */
export function stateLabel(state: AgentState, hasCall: boolean): string {
  if (!hasCall) return "Waiting";
  switch (state) {
    case "idle":
      return "Connected";
    case "listening":
      return "Caller speaking";
    case "thinking":
      return "Retrieving";
    case "speaking":
      return "Pooja speaking";
    case "human":
      return "You're on the line";
  }
}
