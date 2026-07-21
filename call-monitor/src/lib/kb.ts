import type { KbFile } from "@/lib/types";

/* Placeholder knowledge base, shaped like our real numbered-markdown KB:
   persona, pricing, stores, FAQ, objections, escalation. The only thing
   that has to match reality is each chunk's `id` — that's what ties a
   `kb.hit` to a card. Swap the bodies for the real KB when it lands;
   keep the ids stable, or update them in lockstep with the backend. */

export const KB: KbFile[] = [
  {
    file: "01-persona.md",
    title: "Persona",
    chunks: [
      {
        id: "persona-01",
        heading: "Who Pooja is",
        body: "Pooja is Magppie's kitchen consultant on the phone — warm, unhurried, never pushy. She speaks for a luxury modular-kitchen brand and answers only from this knowledge base. If she doesn't know, she offers a store visit or a callback from a human designer.",
      },
    ],
  },
  {
    file: "02-pricing.md",
    title: "Pricing",
    chunks: [
      {
        id: "pricing-01",
        heading: "How kitchens are priced",
        body: "Magppie kitchens are made to measure, so pricing is per project, not per unit. A typical modular kitchen starts around ₹3.5 lakh and moves with layout, core material, finish, and hardware. We quote only after a measured site visit.",
      },
      {
        id: "pricing-02",
        heading: "Why we cost more than a local carpenter",
        body: "The premium buys BWP marine-ply cores, German hardware with lifetime hinges and channels, factory-finished shutters, and a five-year warranty. A local carpenter can't match the finish tolerance or the after-sales cover — that's the difference the customer is paying for.",
      },
    ],
  },
  {
    file: "03-stores.md",
    title: "Stores",
    chunks: [
      {
        id: "stores-01",
        heading: "Experience centres",
        body: "We have experience centres in Delhi (Kirti Nagar), Gurugram (Golf Course Road), and Noida (Sector 63). Walk-ins welcome; a booked slot gets a dedicated designer and a live quote on your own floor plan.",
      },
    ],
  },
  {
    file: "04-faq.md",
    title: "FAQ",
    chunks: [
      {
        id: "faq-01",
        heading: "Timelines & installation",
        body: "From approved design to installed kitchen is typically 4–6 weeks. Installation is done by Magppie's own crew, not a subcontractor, and usually takes two to three days on site.",
      },
    ],
  },
  {
    file: "05-objections.md",
    title: "Objections",
    chunks: [
      {
        id: "objections-01",
        heading: "\"It's too expensive\"",
        body: "Acknowledge the number, don't discount reflexively. Reframe to cost-over-life: a Magppie kitchen is a 15-year fitting with a warranty, not a 3-year refit. Offer a no-obligation store visit so the customer can feel the finish before deciding.",
      },
    ],
  },
  {
    file: "06-escalation.md",
    title: "Escalation",
    chunks: [
      {
        id: "escalation-01",
        heading: "When to hand to a human",
        body: "Escalate to a human designer for bespoke layouts, bulk or builder orders, complaints, or any pricing commitment beyond the standard range. Book the callback, capture the Zoho lead, and set expectations on when they'll hear back.",
      },
    ],
  },
];

/** Flat lookup so a kb.hit can find its chunk without walking files. */
export const KB_INDEX = new Map(
  KB.flatMap((f) => f.chunks.map((c) => [c.id, { ...c, file: f.file }] as const)),
);
