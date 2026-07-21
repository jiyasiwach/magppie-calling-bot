"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCallStore, type Turn, type PartialTurn } from "@/store/callStore";
import { exportJson, exportMarkdown } from "@/lib/export";

/* The transcript. Newsreader sets it, because this column is two people
   talking and should feel like something you read, not log output.

   It follows to the bottom automatically, but stops following the moment
   someone scrolls up to read something. Export sits in the top corner and
   is disabled until there's something to export. */

const SPEAKER: Record<Turn["speaker"], { name: string; className: string }> = {
  agent: { name: "Pooja", className: "text-brass" },
  customer: { name: "Caller", className: "text-sand" },
  human: { name: "You", className: "text-ember" },
};

function Latency({ ms }: { ms: number }) {
  // ember above 1000ms — our p95 target is 950ms
  const hot = ms > 1000;
  return (
    <span
      className={`font-mono text-[10px] tabular-nums ${
        hot ? "text-ember" : "text-sand/70"
      }`}
      title={hot ? "Above the 950ms p95 target — worth pulling traces on" : undefined}
    >
      {ms}ms
    </span>
  );
}

function TurnRow({ turn }: { turn: Turn }) {
  const s = SPEAKER[turn.speaker];
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${s.className}`}
        >
          {s.name}
        </span>
        {turn.speaker === "agent" && turn.latencyMs != null && (
          <Latency ms={turn.latencyMs} />
        )}
      </div>
      <p className="font-read text-[15px] leading-relaxed text-bone/95">
        {turn.text}
      </p>
    </div>
  );
}

function PartialRow({ partial }: { partial: PartialTurn }) {
  const s = SPEAKER[partial.speaker];
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${s.className} opacity-70`}
        >
          {s.name}
        </span>
      </div>
      {/* greyed, with a cursor, so nobody mistakes half a sentence for a
          finished one */}
      <p className="font-read text-[15px] leading-relaxed text-sand/70">
        {partial.text}
        <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-sand/70 align-middle motion-safe:animate-pulse" />
      </p>
    </div>
  );
}

export function Transcript() {
  const turns = useCallStore((s) => s.turns);
  const partial = useCallStore((s) => s.partial);
  const call = useCallStore((s) => s.call);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [following, setFollowing] = useState(true);
  const followingRef = useRef(true);
  followingRef.current = following;

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    setFollowing(atBottom);
  };

  // keep pinned to the bottom while following
  useLayoutEffect(() => {
    if (!followingRef.current) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, partial]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const canExport = call !== null && turns.length > 0;

  return (
    <div className="glass flex h-full w-[380px] flex-col rounded-2xl">
      <header className="flex items-center justify-between px-4 pb-3 pt-4">
        <h2 className="font-sans text-[13px] font-semibold tracking-wide text-bone">
          Transcript
        </h2>
        <div className="flex items-center gap-1">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-sand/60">
            export
          </span>
          <button
            type="button"
            disabled={!canExport}
            onClick={() => call && exportMarkdown(call, turns)}
            className="rounded-md border hairline px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-sand transition enabled:hover:text-bone disabled:opacity-40"
          >
            md
          </button>
          <button
            type="button"
            disabled={!canExport}
            onClick={() => call && exportJson(call, turns)}
            className="rounded-md border hairline px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-sand transition enabled:hover:text-bone disabled:opacity-40"
          >
            json
          </button>
        </div>
      </header>

      <div className="mx-4 h-px hairline border-t" />

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="panel-scroll relative flex-1 overflow-y-auto px-4 py-4"
      >
        {mounted && turns.length === 0 && !partial && (
          <p className="mt-8 text-center font-read text-[14px] italic text-sand/60">
            The conversation will appear here as it happens.
          </p>
        )}

        {turns.map((t) => (
          <TurnRow key={t.turnId} turn={t} />
        ))}
        {partial && <PartialRow partial={partial} />}
      </div>

      {/* a quiet affordance to re-pin when the reader has scrolled up */}
      {!following && (
        <button
          type="button"
          onClick={() => {
            setFollowing(true);
            const el = scrollRef.current;
            if (el) el.scrollTop = el.scrollHeight;
          }}
          className="mx-4 mb-3 rounded-lg border border-brass/50 bg-brass/10 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone transition hover:bg-brass/20"
        >
          Jump to live
        </button>
      )}
    </div>
  );
}
