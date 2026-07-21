# Magppie · Call Monitor

One screen. Someone at Magppie watches it on a laptop while our AI agent
**Pooja** is on a live outbound call with a customer. It shows, at a
glance, whether the call is going well; what she's answering from; and it
lets a director take the line if it goes wrong.

This screen never touches telephony. It opens one websocket, listens, and
paints. The only messages it ever sends back are `takeover.request` and
`takeover.release`.

## Run it

```bash
npm install
npm run dev          # http://localhost:3050
```

With no `NEXT_PUBLIC_WS_URL` set, it runs a **scripted demo call**
(`src/lib/demoCall.ts`) — a real conversation (kitchen enquiry → price
pushback → store booking) that emits exactly the events the backend will,
in the same order. Delete that file and the demo branch in
`src/lib/useSocket.ts` once the FastAPI socket is live.

## The contract

`src/lib/types.ts` is the spec — hand it to the backend team. Everything
arrives over one websocket as JSON discriminated by `type`.

Inbound (server → screen): `call.started`, `agent.state`, `turn.partial`,
`turn.final`, `kb.hit`, `takeover.granted`, `takeover.denied`.
Outbound (screen → server): `takeover.request`, `takeover.release`.

**Ordering rule:** send `kb.hit` *before* the `turn.*` text it fed, so the
knowledge panel lights up while Pooja is still talking.

## Assets

Pulled from magppie.com and committed to `public/`:

- `magppie-mark.png` — the brand's square **M** monogram (their favicon),
  used in the rail. It's a black glyph on transparent, so `Logo.tsx`
  paints it via a CSS mask in bone rather than an `<img>` — otherwise it
  would vanish into the dark glass. Falls back to a text wordmark if the
  file goes missing.
- `magppie-logo.png` — the full **MAGPPIE** wordmark (180×36). Not used in
  the rail (a 5:1 wordmark doesn't fit 64px); kept for wider surfaces.
- `kitchen-loop.mp4` — a Magppie kitchen from the site's own footage,
  re-encoded as a **palindrome** (forward + reverse) so it loops with no
  jump cut. 1600×966, ~1MB, silent. Played at ⅓ speed → a ~47s ambient
  loop. Graded down in CSS (`KitchenBackdrop.tsx`), not baked in, so the
  grade stays tunable.
- `kitchen-poster.jpg` — first-frame still, shown under reduced motion.

**Both logos are raster.** If you have vector originals, drop in an SVG and
point `Logo.tsx` at it — the mark is only 32×32 native, so it's sharp at
its 32px slot but would be crisper on retina as a vector.

**Knowledge base** is still placeholder → real numbered-markdown KB goes in
`src/lib/kb.ts`; only the chunk `id`s must match what `kb.hit` sends.

## Stack

Next.js 15 (App Router) · Tailwind v4 (`@theme` in `globals.css`, no
config file) · Zustand · Framer Motion. Desktop only.
