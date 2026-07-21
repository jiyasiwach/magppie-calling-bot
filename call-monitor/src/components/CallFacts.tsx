"use client";

import { useEffect, useState } from "react";
import { useCallStore } from "@/store/callStore";

/* One line of call facts under the orb: a live dot, the masked number, a
   running timer, and the Zoho lead id. Measurements are set in mono. */

function useElapsed(startedAt: string | undefined, running: boolean): string {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!startedAt) return "00:00";
  const secs = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const hh = Math.floor(secs / 3600);
  return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function CallFacts() {
  const call = useCallStore((s) => s.call);
  const elapsed = useElapsed(call?.startedAt, call !== null);

  if (!call) {
    return (
      <p className="font-mono text-[12px] tracking-wide text-sand/60">
        No active call
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[12px] text-sand">
      <span className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember/70 [animation-duration:1.8s] motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
        </span>
        <span className="text-bone/90">Live</span>
      </span>

      {call.leadName && <span className="text-bone/90">{call.leadName}</span>}

      <span className="tabular-nums">{call.maskedNumber}</span>

      <span className="tabular-nums text-bone/90">{elapsed}</span>

      <span className="text-sand/70">
        lead <span className="text-sand">{call.leadId}</span>
      </span>
    </div>
  );
}
