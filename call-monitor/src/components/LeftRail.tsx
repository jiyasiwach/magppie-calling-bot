"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

/* The whole left rail: the Magppie logo at the top, then two controls under
   it — the knowledge box (slides its panel out beside the rail), and Zoho
   CRM leads, which opens the /crm screen: the full lead book. A small brass
   dot appears on the knowledge control when a kb.hit lands while its panel
   is closed (one signal, not two — the icon itself doesn't recolour). */

export function LeftRail({
  kbOpen,
  unseenHit,
  onToggleKb,
}: {
  kbOpen: boolean;
  unseenHit: boolean;
  onToggleKb: () => void;
}) {
  return (
    <div className="glass flex h-full w-16 flex-col items-center rounded-2xl py-4">
      <Logo />

      <div className="mt-6 h-px w-7 hairline border-t" />

      <div className="mt-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={onToggleKb}
          aria-pressed={kbOpen}
          aria-label="Knowledge base"
          title="Knowledge base"
          className={railButtonClass(kbOpen)}
        >
          <RailIcon>
            {/* numbered-pages / knowledge icon */}
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v13.5" />
            <path d="M4 5.5v12A2.5 2.5 0 0 0 6.5 20H20" />
            <path d="M8 8.5h7M8 12h7" />
          </RailIcon>

          {unseenHit && !kbOpen && (
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brass ring-2 ring-cast"
              aria-hidden="true"
            />
          )}
        </button>

        <Link
          href="/crm"
          aria-label="Zoho CRM leads"
          title="Zoho CRM leads — open the lead book"
          className={railButtonClass(false)}
        >
          <RailIcon>
            {/* person-with-card / lead record icon */}
            <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
            <path d="M16.5 8.5H21M16.5 12H21M16.5 15.5H21" />
          </RailIcon>
        </Link>
      </div>
    </div>
  );
}

function railButtonClass(active: boolean): string {
  return `relative grid h-11 w-11 place-items-center rounded-xl border transition ${
    active
      ? "border-brass/60 bg-brass/10 text-bone"
      : "hairline border text-sand hover:text-bone"
  }`;
}

function RailIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
