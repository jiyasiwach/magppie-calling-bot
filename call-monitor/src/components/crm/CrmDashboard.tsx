"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KitchenBackdrop } from "@/components/KitchenBackdrop";
import { Logo } from "@/components/Logo";
import {
  LEADS_SNAPSHOT,
  STATS_SNAPSHOT,
  statusTone,
  type Lead,
  type LeadStats,
} from "@/lib/leads";

/* The CRM screen. One click from the monitor's rail lands here: the whole
   Magppie lead book — pipeline totals, where leads come from, and the table
   of what the team is actually working, freshest first.

   Same room, same glass. The monitor watches one call; this screen watches
   the nineteen thousand conversations around it. */

const TONE_TEXT: Record<string, string> = {
  good: "text-brass",
  warm: "text-brass/85",
  cool: "text-sand",
  dead: "text-ember/85",
};
const TONE_CHIP: Record<string, string> = {
  good: "border-brass/50 bg-brass/10 text-brass",
  warm: "border-brass/35 bg-brass/[0.06] text-brass/90",
  cool: "hairline border bg-cast/40 text-sand",
  dead: "border-ember/30 bg-ember/[0.06] text-ember/85",
};

function timeAgo(iso: string): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return "—";
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

const fmt = (n: number) => n.toLocaleString("en-IN");

export function CrmDashboard() {
  const [leads, setLeads] = useState<Lead[]>(LEADS_SNAPSHOT);
  const [stats, setStats] = useState<LeadStats>(STATS_SNAPSHOT);
  const [source, setSource] = useState<"zoho" | "snapshot">("snapshot");
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // real-time: fetch on mount, then poll every 60s. With Zoho credentials
  // each poll re-queries the live CRM; without them it's a cheap no-op
  // against the snapshot. Paused while the tab is hidden.
  useEffect(() => {
    let stop = false;
    const load = () =>
      fetch("/api/leads")
        .then((r) => r.json())
        .then((j: { leads?: Lead[]; stats?: LeadStats; source?: string }) => {
          if (stop) return;
          if (Array.isArray(j.leads) && j.leads.length) setLeads(j.leads);
          if (j.stats) setStats(j.stats);
          setSource(j.source === "zoho" ? "zoho" : "snapshot");
          setUpdatedAt(new Date());
        })
        .catch(() => {})
        .finally(() => !stop && setLoading(false));

    load();
    const every = setInterval(() => {
      if (!document.hidden) load();
    }, 60_000);
    return () => {
      stop = true;
      clearInterval(every);
    };
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.owner.toLowerCase().includes(q) ||
        l.source.toLowerCase().includes(q)
      );
    });
  }, [leads, query, statusFilter]);

  const count = (label: string) =>
    stats.byStatus.find((b) => b.label === label)?.count ?? 0;
  const workedToday = useMemo(() => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return leads.filter((l) => new Date(l.modifiedAt) >= midnight).length;
  }, [leads]);

  const maxStatus = Math.max(...stats.byStatus.map((b) => b.count), 1);
  const topSources = stats.bySource.slice(0, 8);
  const maxSource = Math.max(...topSources.map((b) => b.count), 1);

  return (
    <main className="fixed inset-0 overflow-y-auto">
      <KitchenBackdrop />

      <div className="mx-auto flex min-h-full max-w-6xl flex-col gap-3 p-3">
        {/* header bar */}
        <header className="glass flex items-center gap-4 rounded-2xl px-5 py-3">
          <Logo className="h-7 w-7" />
          <div>
            <h1 className="font-sans text-[15px] font-semibold text-bone">
              Zoho CRM · Leads
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand/70">
              {loading
                ? "loading"
                : source === "zoho"
                  ? "live from zoho · refreshes every 60s"
                  : "snapshot of the real org · refreshes every 60s"}
              {updatedAt && (
                <span className="ml-2 text-sand/50">
                  updated{" "}
                  {updatedAt.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>

          <Link
            href="/"
            className="ml-auto rounded-lg border hairline px-3 py-1.5 font-sans text-[12px] text-sand transition hover:text-bone"
          >
            ← Call monitor
          </Link>
        </header>

        {/* stat tiles — the four numbers a director actually asks for */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Pipeline totals">
          <Stat label="All leads" value={fmt(stats.total)} />
          <Stat
            label="Qualified / drawings"
            value={fmt(count("Qualified/ Drawings Awiated"))}
            tone="text-brass"
          />
          <Stat
            label="Under follow up"
            value={fmt(count("Under Follow Up"))}
            tone="text-brass/85"
          />
          <Stat
            label="Worked today"
            value={fmt(workedToday)}
            hint={`of the ${fmt(leads.length)} freshest`}
          />
        </section>

        {/* distributions */}
        <section className="grid gap-3 md:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <PanelHead title="Pipeline by status" sub="whole CRM" />
            <ul className="mt-3 space-y-2">
              {stats.byStatus.slice(0, 7).map((b) => {
                const tone = statusTone(b.label);
                const active = statusFilter === b.label;
                return (
                  <li key={b.label}>
                    <button
                      type="button"
                      onClick={() => setStatusFilter(active ? null : b.label)}
                      aria-pressed={active}
                      className={`group w-full rounded-lg px-1 py-0.5 text-left transition ${
                        active ? "bg-brass/10" : "hover:bg-bone/[0.04]"
                      }`}
                      title={active ? "Clear filter" : `Filter table to ${b.label}`}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={`font-sans text-[12px] ${TONE_TEXT[tone]}`}>
                          {b.label}
                        </span>
                        <span className="font-mono text-[11px] text-sand">
                          {fmt(b.count)}
                        </span>
                      </span>
                      <span className="mt-1 block h-1 overflow-hidden rounded-full bg-bone/[0.07]">
                        <span
                          className={`block h-full rounded-full ${
                            tone === "dead" ? "bg-sand/40" : "bg-brass/70"
                          }`}
                          style={{ width: `${(b.count / maxStatus) * 100}%` }}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="glass rounded-2xl p-5">
            <PanelHead title="Where leads come from" sub="top sources" />
            <ul className="mt-3 space-y-2">
              {topSources.map((b) => (
                <li key={b.label} className="px-1 py-0.5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-sans text-[12px] text-sand">{b.label}</span>
                    <span className="font-mono text-[11px] text-sand">{fmt(b.count)}</span>
                  </span>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-bone/[0.07]">
                    <span
                      className="block h-full rounded-full bg-sand/50"
                      style={{ width: `${(b.count / maxSource) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* the lead table */}
        <section className="glass flex min-h-0 flex-1 flex-col rounded-2xl">
          <div className="flex flex-wrap items-center gap-3 px-5 pb-3 pt-4">
            <PanelHead
              title="Freshest activity"
              sub={`${fmt(shown.length)} of ${fmt(leads.length)} loaded`}
            />
            {statusFilter && (
              <button
                type="button"
                onClick={() => setStatusFilter(null)}
                className="rounded-full border border-brass/50 bg-brass/10 px-2.5 py-0.5 font-mono text-[10px] text-brass transition hover:bg-brass/20"
              >
                {statusFilter} ✕
              </button>
            )}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, city, owner, source…"
              aria-label="Search leads"
              className="ml-auto w-64 max-w-full rounded-lg border hairline bg-cast/40 px-3 py-1.5 font-sans text-[12px] text-bone placeholder:text-sand/50 focus:border-brass/60 focus:outline-none"
            />
          </div>

          <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {["Lead", "Status", "Source", "City", "Owner", "Phone", "Touched"].map((h) => (
                    <th
                      key={h}
                      className="sticky top-0 z-10 bg-cast/80 px-3 pb-2 pt-1 text-left font-mono text-[9.5px] uppercase tracking-[0.16em] text-sand/60 backdrop-blur"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => {
                  const tone = statusTone(l.status);
                  return (
                    <tr key={l.id} className="group">
                      <td className="border-t hairline px-3 py-2.5">
                        <div className="font-sans text-[13px] font-medium text-bone/90">
                          {l.name}
                        </div>
                        <div className="font-mono text-[9.5px] text-sand/50">{l.email}</div>
                      </td>
                      <td className="border-t hairline px-3 py-2.5">
                        <span
                          className={`inline-block whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[9.5px] ${TONE_CHIP[tone]}`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="border-t hairline px-3 py-2.5 font-sans text-[12px] text-sand">
                        {l.source}
                      </td>
                      <td className="border-t hairline px-3 py-2.5 font-sans text-[12px] text-sand">
                        {l.city}
                      </td>
                      <td className="border-t hairline px-3 py-2.5 font-sans text-[12px] text-sand">
                        {l.owner}
                      </td>
                      <td className="border-t hairline px-3 py-2.5 font-mono text-[11px] text-sand">
                        {l.mobile}
                      </td>
                      <td className="border-t hairline px-3 py-2.5 text-right font-mono text-[11px] text-sand/70">
                        {timeAgo(l.modifiedAt)}
                      </td>
                    </tr>
                  );
                })}
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center font-sans text-[13px] text-sand/60">
                      Nothing matches{query ? ` “${query}”` : ""} — clear the search or the filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="pb-2 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-sand/50">
          numbers and emails masked · city is free-text in this CRM — treat it as a hint, not a fact
        </p>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  tone = "text-bone",
  hint,
}: {
  label: string;
  value: string;
  tone?: string;
  hint?: string;
}) {
  return (
    <div className="glass rounded-2xl px-5 py-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand/70">
        {label}
      </div>
      <div className={`mt-1 font-mono text-[26px] leading-none ${tone}`}>{value}</div>
      {hint && <div className="mt-1 font-sans text-[10.5px] text-sand/60">{hint}</div>}
    </div>
  );
}

function PanelHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <h2 className="font-sans text-[13px] font-semibold tracking-wide text-bone">{title}</h2>
      {sub && (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sand/60">
          {sub}
        </span>
      )}
    </div>
  );
}
