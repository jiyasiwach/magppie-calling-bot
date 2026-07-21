import type { ServerEvent } from "@/lib/types";

/* A scripted demo call so `npm run dev` shows the whole screen working
   before the FastAPI socket exists. It emits exactly the events the
   backend will, in the same order — crucially, `kb.hit` lands BEFORE the
   turn text it fed, so the knowledge panel lights up while Pooja talks.

   This whole file is meant to be deleted once the real socket is wired.
   Nothing else imports it except the socket hook's fallback branch. */

interface Step {
  /** ms to wait after the previous step before emitting */
  wait: number;
  event: ServerEvent;
}

/* A real lead out of the Magppie CRM, so the leads panel can pin the
   "on this call" card to an actual record rather than a made-up id. */
const LEAD = {
  maskedNumber: "+91 98•••••608",
  leadId: "1032257000023939485",
  leadName: "Ranjeeth Reddy",
};

export const DEMO_SCRIPT: Step[] = [
  { wait: 700, event: { type: "call.started", ...LEAD } },

  // Pooja opens
  { wait: 500, event: { type: "kb.hit", chunkId: "persona-01", turnId: "t1" } },
  { wait: 250, event: { type: "agent.state", state: "speaking" } },
  {
    wait: 300,
    event: {
      type: "turn.partial",
      turnId: "t1",
      speaker: "agent",
      text: "Hi, this is Pooja from Magppie —",
    },
  },
  {
    wait: 1100,
    event: {
      type: "turn.final",
      turnId: "t1",
      speaker: "agent",
      text: "Hi, this is Pooja from Magppie. Thanks for your interest in a modular kitchen — is now a good time for a couple of minutes?",
      latencyMs: 640,
    },
  },

  // Customer: what does a kitchen actually cost
  { wait: 500, event: { type: "agent.state", state: "listening" } },
  {
    wait: 900,
    event: {
      type: "turn.partial",
      turnId: "t2",
      speaker: "customer",
      text: "Yeah sure. I'm mainly trying to figure out",
    },
  },
  {
    wait: 1400,
    event: {
      type: "turn.final",
      turnId: "t2",
      speaker: "customer",
      text: "Yeah, sure. I'm mainly trying to figure out roughly what one of your kitchens would cost me.",
    },
  },

  // Pooja retrieves pricing, answers
  { wait: 400, event: { type: "agent.state", state: "thinking" } },
  { wait: 700, event: { type: "kb.hit", chunkId: "pricing-01", turnId: "t3" } },
  { wait: 300, event: { type: "agent.state", state: "speaking" } },
  {
    wait: 400,
    event: {
      type: "turn.partial",
      turnId: "t3",
      speaker: "agent",
      text: "Because every kitchen is made to measure,",
    },
  },
  {
    wait: 1600,
    event: {
      type: "turn.final",
      turnId: "t3",
      speaker: "agent",
      text: "Because every kitchen is made to measure, we price per project rather than per unit. Most work out from around ₹3.5 lakh, moving with your layout, materials and finish — we'd quote exactly after a site visit.",
      latencyMs: 720,
    },
  },

  // Customer pushes back on price
  { wait: 500, event: { type: "agent.state", state: "listening" } },
  {
    wait: 900,
    event: {
      type: "turn.partial",
      turnId: "t4",
      speaker: "customer",
      text: "Honestly that's a lot — my carpenter quoted",
    },
  },
  {
    wait: 1500,
    event: {
      type: "turn.final",
      turnId: "t4",
      speaker: "customer",
      text: "Honestly, that's quite a lot. My local carpenter quoted me less than half of that for the same thing.",
    },
  },

  // Pooja handles the objection — two chunks, and a slow turn (ember latency)
  { wait: 400, event: { type: "agent.state", state: "thinking" } },
  { wait: 600, event: { type: "kb.hit", chunkId: "pricing-02", turnId: "t5" } },
  {
    wait: 500,
    event: { type: "kb.hit", chunkId: "objections-01", turnId: "t5" },
  },
  { wait: 350, event: { type: "agent.state", state: "speaking" } },
  {
    wait: 500,
    event: {
      type: "turn.partial",
      turnId: "t5",
      speaker: "agent",
      text: "That's fair, and it's the right question to ask.",
    },
  },
  {
    wait: 1900,
    event: {
      type: "turn.final",
      turnId: "t5",
      speaker: "agent",
      text: "That's a fair question. The difference is what's inside — marine-ply cores, German hardware with lifetime hinges, factory-finished shutters and a five-year warranty. It's a 15-year fitting, not a 3-year refit. Best way to feel that is to see one in person.",
      latencyMs: 1180,
    },
  },

  // Customer warms up, asks to see it
  { wait: 500, event: { type: "agent.state", state: "listening" } },
  {
    wait: 1200,
    event: {
      type: "turn.final",
      turnId: "t6",
      speaker: "customer",
      text: "Okay, that's fair. Where can I actually come and look at one?",
    },
  },

  // Pooja offers the store
  { wait: 400, event: { type: "agent.state", state: "thinking" } },
  { wait: 650, event: { type: "kb.hit", chunkId: "stores-01", turnId: "t7" } },
  { wait: 300, event: { type: "agent.state", state: "speaking" } },
  {
    wait: 1500,
    event: {
      type: "turn.final",
      turnId: "t7",
      speaker: "agent",
      text: "We've experience centres in Kirti Nagar, Golf Course Road Gurugram, and Sector 63 Noida. If I book you a slot, you get a dedicated designer and a live quote on your own floor plan. Which is easiest for you?",
      latencyMs: 690,
    },
  },

  // Customer books
  { wait: 500, event: { type: "agent.state", state: "listening" } },
  {
    wait: 1300,
    event: {
      type: "turn.final",
      turnId: "t8",
      speaker: "customer",
      text: "Gurugram works. Saturday morning if you have something.",
    },
  },

  // Pooja confirms + captures the lead
  { wait: 400, event: { type: "agent.state", state: "thinking" } },
  {
    wait: 650,
    event: { type: "kb.hit", chunkId: "escalation-01", turnId: "t9" },
  },
  { wait: 300, event: { type: "agent.state", state: "speaking" } },
  {
    wait: 1500,
    event: {
      type: "turn.final",
      turnId: "t9",
      speaker: "agent",
      text: "Lovely — I've noted Golf Course Road for Saturday morning and a designer will confirm the exact time by SMS. Anything specific you'd like them to have ready?",
      latencyMs: 700,
    },
  },

  // settle back to idle
  { wait: 900, event: { type: "agent.state", state: "idle" } },
];

/** Play the script through a sink (the store's ingest). Returns a cancel
 *  fn that clears any pending timers. */
export function playDemo(
  emit: (e: ServerEvent) => void,
  onConnected?: () => void,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  onConnected?.();

  let elapsed = 0;
  for (const step of DEMO_SCRIPT) {
    elapsed += step.wait;
    const t = setTimeout(() => {
      if (!cancelled) emit(step.event);
    }, elapsed);
    timers.push(t);
  }

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
  };
}
