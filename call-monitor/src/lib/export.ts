import type { CallInfo, Turn } from "@/store/callStore";

/* Export does one thing: puts this conversation on disk. Markdown for
   reading and forwarding, JSON for anything downstream. */

const SPEAKER_LABEL: Record<Turn["speaker"], string> = {
  agent: "Pooja",
  customer: "Caller",
  human: "Magppie (human)",
};

function stamp(iso: string): string {
  // HH:MM:SS in the viewer's locale, stable enough for a transcript.
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function slug(s: string): string {
  return s.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "call";
}

/** magppie-call_Rohan-Mehta_2026-07-17 — date + who it was with. */
export function exportBasename(call: CallInfo): string {
  const who = slug(call.leadName ?? call.leadId);
  const date = new Date(call.startedAt).toISOString().slice(0, 10);
  return `magppie-call_${who}_${date}`;
}

export function buildMarkdown(call: CallInfo, turns: Turn[]): string {
  const lines: string[] = [
    "# Magppie call transcript",
    "",
    `- **Lead:** ${call.leadName ?? "—"} (${call.leadId})`,
    `- **Number:** ${call.maskedNumber}`,
    `- **Started:** ${new Date(call.startedAt).toLocaleString()}`,
    "",
    "---",
    "",
  ];
  for (const t of turns) {
    const lat =
      t.speaker === "agent" && t.latencyMs != null
        ? `  _(${t.latencyMs} ms)_`
        : "";
    lines.push(`**${SPEAKER_LABEL[t.speaker]}** · ${stamp(t.at)}${lat}`);
    lines.push("");
    lines.push(t.text);
    lines.push("");
  }
  return lines.join("\n");
}

export function buildJson(call: CallInfo, turns: Turn[]): string {
  return JSON.stringify(
    {
      call,
      exportedAt: new Date().toISOString(),
      turns: turns.map((t) => ({
        turnId: t.turnId,
        speaker: t.speaker,
        text: t.text,
        latencyMs: t.latencyMs ?? null,
        at: t.at,
      })),
    },
    null,
    2,
  );
}

function download(filename: string, mime: string, contents: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(call: CallInfo, turns: Turn[]) {
  download(
    `${exportBasename(call)}.md`,
    "text/markdown;charset=utf-8",
    buildMarkdown(call, turns),
  );
}

export function exportJson(call: CallInfo, turns: Turn[]) {
  download(
    `${exportBasename(call)}.json`,
    "application/json;charset=utf-8",
    buildJson(call, turns),
  );
}
