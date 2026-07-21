"use client";

import { useCallStore, stateLabel } from "@/store/callStore";
import type { AgentState } from "@/lib/types";

/* The centre circle is a hob — a burner ring, the most characteristic
   circle in a kitchen. Concentric hairline rings: a fixed rim, two dashed
   "port" rings that drift, one state ring that ticks/breathes, an inner
   disc for the words, and a faint radial glow that reads as heat.

   It is also the only control on the screen. Tapping it puts you on the
   call; tapping again hands it back to Pooja. */

const TONE: Record<AgentState, string> = {
  idle: "#C9BDA8", // sand — connected, quiet
  listening: "#EDE7DD", // bone — sound arriving from elsewhere
  thinking: "#A8834B", // brass — brain working
  speaking: "#A8834B", // brass — Pooja talking
  human: "#B4462F", // ember — a person has the line
};

export function HobOrb() {
  const agentState = useCallStore((s) => s.agentState);
  const hasCall = useCallStore((s) => s.call !== null);
  const takeoverPending = useCallStore((s) => s.takeoverPending);
  const takeoverDenied = useCallStore((s) => s.takeoverDenied);
  const toggleTakeover = useCallStore((s) => s.toggleTakeover);

  const human = agentState === "human";
  const tone = hasCall ? TONE[agentState] : "#C9BDA8";

  // The rim/rings only run when the burner is lit.
  const live = hasCall;

  const actionLabel = !hasCall
    ? "Waiting for a call"
    : takeoverPending
      ? "Requesting the line…"
      : human
        ? "Hand back to Pooja"
        : "Tap to speak";

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* words for the state — colour alone shouldn't carry it */}
      <span
        className="font-mono text-[11px] uppercase tracking-[0.28em] text-sand/80"
        aria-live="polite"
      >
        {stateLabel(agentState, hasCall)}
      </span>

      <button
        type="button"
        onClick={toggleTakeover}
        disabled={!hasCall}
        aria-label={actionLabel}
        aria-pressed={human}
        className="group relative grid place-items-center rounded-full transition disabled:cursor-not-allowed"
        style={{ width: "min(46vh, 420px)", height: "min(46vh, 420px)" }}
      >
        {/* heat */}
        <div
          className="orb-glow absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 52%, color-mix(in srgb, ${tone} 34%, transparent), transparent 68%)`,
            opacity: live ? 0.7 : 0.25,
            transition: "opacity 600ms ease, background 600ms ease",
          }}
        />

        <svg
          viewBox="0 0 200 200"
          className="orb relative h-full w-full overflow-visible"
          data-live={live ? "true" : "false"}
          data-state={hasCall ? agentState : "cold"}
          style={{
            color: tone,
            opacity: hasCall ? 1 : 0.55,
            transition: "opacity 600ms ease, color 600ms ease",
          }}
        >
          {/* caller talking: rings ripple inward from outside the rim */}
          <circle
            className="orb-ripple orb-spin"
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0"
          />
          <circle
            className="orb-ripple orb-ripple-2 orb-spin"
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0"
          />
          <circle
            className="orb-ripple orb-ripple-3 orb-spin"
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0"
          />

          {/* fixed outer rim */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.45"
          />

          {/* two dashed port rings, drifting opposite directions */}
          <circle
            className="orb-port-a orb-spin"
            cx="100"
            cy="100"
            r="77"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1.5 9"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle
            className="orb-port-b orb-spin"
            cx="100"
            cy="100"
            r="68"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1 13"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* the ring that carries the state */}
          <circle
            className="orb-state-ring orb-spin"
            cx="100"
            cy="100"
            r="83"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="46 475"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* inner disc the words sit on */}
          <circle
            cx="100"
            cy="100"
            r="58"
            fill="color-mix(in srgb, #0B0A08 78%, transparent)"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.92"
          />
        </svg>

        {/* the words on the disc */}
        <span className="absolute inset-0 grid place-items-center px-10 text-center">
          <span
            className={`font-sans text-[15px] leading-snug transition-colors ${
              human ? "text-ember" : "text-bone"
            } ${!hasCall ? "text-sand/70" : ""}`}
          >
            {actionLabel}
          </span>
        </span>
      </button>

      {/* a denial is shown verbatim — a director is reading it */}
      {takeoverDenied && (
        <p
          role="alert"
          className="max-w-[22rem] text-center font-sans text-[13px] text-ember"
        >
          {takeoverDenied}
        </p>
      )}
    </div>
  );
}
