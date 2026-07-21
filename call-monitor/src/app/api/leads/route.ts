import { NextResponse } from "next/server";
import {
  LEADS_SNAPSHOT,
  STATS_SNAPSHOT,
  OWNERS,
  maskMobile,
  maskEmail,
  type Lead,
  type LeadStats,
} from "@/lib/leads";

/* GET /api/leads — read by the rail panel and the /crm dashboard.

   With Zoho credentials in the environment it queries the real Magppie CRM.
   Without them it serves the committed snapshot of that same org, so the
   screens work on a laptop with no secrets on it.

   Magppie's org is on the .in data centre (its phonebridge recordings are
   phonebridge.zoho.in), so the hosts below default to .in. Override with
   ZOHO_ACCOUNTS_HOST / ZOHO_API_HOST if that ever changes.

   .env.local:
     ZOHO_CLIENT_ID=...
     ZOHO_CLIENT_SECRET=...
     ZOHO_REFRESH_TOKEN=...
*/

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ACCOUNTS = process.env.ZOHO_ACCOUNTS_HOST ?? "https://accounts.zoho.in";
const API = process.env.ZOHO_API_HOST ?? "https://www.zohoapis.in";

/* COQL needs a WHERE clause on every query — "where id is not null" is the
   idiom for "all rows". Aggregates support GROUP BY but not ORDER BY on the
   count, so the sorting happens here. */
const Q_LEADS = `select id, Full_Name, Mobile, Email, Lead_Status, Lead_Source,
  City, Created_Time, Modified_Time, Owner from Leads
  where Lead_Status is not null order by Modified_Time desc limit 200`;
const Q_BY_STATUS = `select Lead_Status, COUNT(id) from Leads
  where id is not null group by Lead_Status limit 30`;
const Q_BY_SOURCE = `select Lead_Source, COUNT(id) from Leads
  where id is not null group by Lead_Source limit 40`;

/** Zoho access tokens last an hour; keep one in module memory rather than
 *  minting a fresh one on every page load. */
let cached: { token: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string | null> {
  const client_id = process.env.ZOHO_CLIENT_ID;
  const client_secret = process.env.ZOHO_CLIENT_SECRET;
  const refresh_token = process.env.ZOHO_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) return null;

  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const url =
    `${ACCOUNTS}/oauth/v2/token?refresh_token=${encodeURIComponent(refresh_token)}` +
    `&client_id=${encodeURIComponent(client_id)}` +
    `&client_secret=${encodeURIComponent(client_secret)}` +
    `&grant_type=refresh_token`;

  const res = await fetch(url, { method: "POST", cache: "no-store" });
  if (!res.ok) throw new Error(`Zoho token ${res.status}`);
  const j = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!j.access_token) throw new Error("Zoho token: no access_token in response");

  cached = {
    token: j.access_token,
    expiresAt: Date.now() + (j.expires_in ?? 3600) * 1000,
  };
  return cached.token;
}

async function coql<T>(token: string, select_query: string): Promise<T[]> {
  const res = await fetch(`${API}/crm/v6/coql`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ select_query }),
    cache: "no-store",
  });
  if (res.status === 204) return []; // ran fine, matched nothing
  if (!res.ok) throw new Error(`Zoho COQL ${res.status}`);
  const j = (await res.json()) as { data?: T[] };
  return j.data ?? [];
}

interface ZohoLeadRow {
  id: string;
  Full_Name?: string | null;
  Mobile?: string | null;
  Email?: string | null;
  Lead_Status?: string | null;
  Lead_Source?: string | null;
  City?: string | null;
  Created_Time?: string | null;
  Modified_Time?: string | null;
  Owner?: { name?: string | null; id?: string | null } | null;
}
type AggRow = Record<string, string | number | null>;

function toLead(r: ZohoLeadRow): Lead {
  // COQL returns Owner.name as null — resolve the id against the users map
  const ownerId = r.Owner?.id ?? "";
  return {
    id: r.id,
    name: r.Full_Name ?? "—",
    status: r.Lead_Status ?? "Not Contacted Yet",
    source: r.Lead_Source ?? "(not set)",
    city: r.City ?? "—",
    email: maskEmail(r.Email), // never let raw PII reach the screen
    mobile: maskMobile(r.Mobile),
    owner: r.Owner?.name ?? OWNERS[ownerId] ?? "Unassigned",
    createdAt: r.Created_Time ?? "",
    modifiedAt: r.Modified_Time ?? r.Created_Time ?? "",
  };
}

/** { Lead_Status: "x", "COUNT(id)": 12 } → { label, count }, biggest first. */
function toBuckets(rows: AggRow[], key: string) {
  return rows
    .map((r) => ({
      label: (r[key] as string) ?? "(not set)",
      count: Number(r["COUNT(id)"] ?? 0),
    }))
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count);
}

export async function GET() {
  try {
    const token = await accessToken();

    // no credentials on this machine — serve the committed snapshot
    if (!token) {
      return NextResponse.json({
        source: "snapshot",
        leads: LEADS_SNAPSHOT,
        stats: STATS_SNAPSHOT,
      });
    }

    const [leadRows, statusRows, sourceRows] = await Promise.all([
      coql<ZohoLeadRow>(token, Q_LEADS),
      coql<AggRow>(token, Q_BY_STATUS),
      coql<AggRow>(token, Q_BY_SOURCE),
    ]);

    const byStatus = toBuckets(statusRows, "Lead_Status");
    const stats: LeadStats = {
      total: byStatus.reduce((n, b) => n + b.count, 0),
      byStatus,
      bySource: toBuckets(sourceRows, "Lead_Source"),
    };

    return NextResponse.json({
      source: "zoho",
      leads: leadRows.map(toLead),
      stats,
    });
  } catch (err) {
    // Never blank the screen because Zoho hiccuped mid-call — fall back and
    // say so, so nobody mistakes stale rows for live ones.
    return NextResponse.json({
      source: "snapshot",
      error: err instanceof Error ? err.message : "Zoho unreachable",
      leads: LEADS_SNAPSHOT,
      stats: STATS_SNAPSHOT,
    });
  }
}
