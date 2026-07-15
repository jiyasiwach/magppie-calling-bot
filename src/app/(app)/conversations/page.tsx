'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader, SentimentTag, Meter, EmptyState } from '@/components/ui/misc'
import { HandoffVisualizer } from '@/components/shared/handoff-visualizer'
import { Customer360 } from '@/components/shared/customer-360'
import { AudioScrubber } from '@/components/shared/audio-scrubber'
import { CONVERSATIONS, HANDOFF_SAMPLE, CUSTOMER_360 } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import { LANGUAGE_LABEL, TOOL_ACTION_LABEL, type Conversation, type CallOutcome } from '@/lib/types'
import { maskPhone, duration, cn } from '@/lib/utils'
import { downloadTranscript, downloadAllTranscripts, downloadCallIndexCsv } from '@/lib/download'
import { toast } from '@/lib/toast'
import {
  ChevronDown,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  Wrench,
  Route,
  Clock,
  Download,
  FileText,
} from 'lucide-react'

const OUTCOME_TONE: Record<CallOutcome, 'success' | 'warning' | 'danger' | 'pine' | 'brass' | 'neutral'> = {
  resolved: 'success',
  appointment: 'pine',
  lead: 'brass',
  escalated: 'warning',
  callback: 'neutral',
  'no-answer': 'neutral',
  dropped: 'danger',
}

export default function ConversationsPage() {
  const { tenant } = useApp()
  const [q, setQ] = useState('')
  const [outcome, setOutcome] = useState('all')
  const [open, setOpen] = useState<string | null>(null)

  const rows = useMemo(
    () =>
      CONVERSATIONS.filter((c) => c.tenant === tenant)
        .filter((c) => (outcome === 'all' ? true : c.outcome === outcome))
        .filter((c) =>
          q
            ? c.customerName.toLowerCase().includes(q.toLowerCase()) ||
              c.customerPhone.includes(q) ||
              c.summary.toLowerCase().includes(q.toLowerCase())
            : true,
        ),
    [tenant, q, outcome],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversations"
        subtitle="Searchable call log with transcripts, structured extraction and explainability."
      >
        <Button
          variant="outline"
          size="sm"
          disabled={rows.length === 0}
          onClick={() => {
            downloadCallIndexCsv(rows)
            toast.success('CSV exported', `${rows.length} call(s) in magppie-voice-calls.csv`)
          }}
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={rows.length === 0}
          onClick={() => {
            downloadAllTranscripts(rows)
            toast.success('Transcripts exported', `${rows.length} call(s) in one file`)
          }}
        >
          <FileText className="h-4 w-4" /> Export transcripts
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, number, summary…"
            className="h-9 w-full rounded-sm border border-border bg-surface-raised pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
          />
        </div>
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="h-9 rounded-sm border border-border bg-surface-raised px-3 text-sm text-ink focus-visible:outline-none"
        >
          <option value="all">All outcomes</option>
          <option value="resolved">Resolved</option>
          <option value="appointment">Appointment</option>
          <option value="lead">Lead</option>
          <option value="escalated">Escalated</option>
          <option value="callback">Callback</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No conversations found" hint="Adjust your search or outcome filter." />
      ) : (
        <div className="space-y-2">
          {rows.map((c) => (
            <ConversationRow
              key={c.id}
              c={c}
              open={open === c.id}
              onToggle={() => setOpen(open === c.id ? null : c.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ConversationRow({
  c,
  open,
  onToggle,
}: {
  c: Conversation
  open: boolean
  onToggle: () => void
}) {
  return (
    <Card className={cn('overflow-hidden transition-shadow', open && 'shadow-lift')}>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-ink/[0.02]"
      >
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            {c.customerName}
            <span className="text-xs font-normal text-ink-muted">{maskPhone(c.customerPhone)}</span>
          </p>
          <p className="truncate text-xs text-ink-muted">{c.summary}</p>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <SentimentTag sentiment={c.sentiment} />
          <Badge tone="neutral">{LANGUAGE_LABEL[c.language]}</Badge>
          <Badge tone={OUTCOME_TONE[c.outcome]}>{c.outcome}</Badge>
          <span className="tabular w-24 text-right text-xs text-ink-muted">
            {format(c.startedAt, 'dd MMM, HH:mm')}
          </span>
        </div>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-ink-muted transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="border-t border-border bg-surface/50 p-4">
          {/* recording player + downloads */}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <AudioScrubber durationSec={c.durationSec} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  downloadTranscript(c)
                  toast.success('Transcript downloaded', `${c.id}-${c.customerName.replace(/\s+/g, '-')}.txt`)
                }}
              >
                <FileText className="h-4 w-4" /> Transcript
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  toast.info(
                    'Preparing recording',
                    'Audio (MP3) download will be enabled once recordings are wired to storage.',
                  )
                }
              >
                <Download className="h-4 w-4" /> Recording
              </Button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* left: transcript */}
            <div>
              <SectionLabel>Transcript</SectionLabel>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {c.transcript.map((t, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                      {t.role}
                    </span>
                    <p className={cn(t.role === 'system' ? 'text-ink-muted' : 'text-ink')}>{t.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* right: extraction + explain + handoff + 360 */}
            <div className="space-y-5">
              <div>
                <SectionLabel>Structured extraction</SectionLabel>
                <p className="mb-2 text-sm text-ink">{c.summary}</p>
                <ul className="mb-3 space-y-1">
                  {c.actionItems.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-ink-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {a}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-muted">Sentiment score</span>
                  <Meter value={c.sentimentScore / 100} tone={c.sentimentScore > 55 ? 'success' : 'danger'} className="w-24" />
                  <span className="tabular text-xs font-medium text-ink">{c.sentimentScore}</span>
                </div>
              </div>

              <div>
                <SectionLabel><Wrench className="h-3.5 w-3.5" /> Tools called</SectionLabel>
                <div className="space-y-1">
                  {c.toolCalls.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {t.status === 'success' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-danger" />
                      )}
                      <span className="font-medium text-ink">{TOOL_ACTION_LABEL[t.action]}</span>
                      <span className="text-ink-muted">— {t.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explainability trace §5.3 */}
              <div>
                <SectionLabel><Sparkles className="h-3.5 w-3.5" /> Why the agent did this</SectionLabel>
                <div className="space-y-2">
                  {c.explain.map((e, i) => (
                    <div key={i} className="rounded-sm border border-border bg-surface-raised p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-ink">{e.label}</span>
                        {e.confidence != null && (
                          <Badge tone={e.confidence > 0.85 ? 'success' : e.confidence > 0.5 ? 'warning' : 'danger'}>
                            {(e.confidence * 100).toFixed(0)}% conf.
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-ink-muted">{e.detail}</p>
                      {e.kbSnippet && (
                        <p className="mt-1 border-l-2 border-accent-secondary/40 pl-2 text-xs italic text-ink-muted">
                          “{e.kbSnippet}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {c.outcome === 'escalated' && (
                <div>
                  <SectionLabel><Route className="h-3.5 w-3.5" /> Handoff path</SectionLabel>
                  <HandoffVisualizer hops={HANDOFF_SAMPLE} />
                </div>
              )}

              <div>
                <SectionLabel><Clock className="h-3.5 w-3.5" /> Customer 360</SectionLabel>
                <Customer360 name={c.customerName} events={CUSTOMER_360} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/80">
      {children}
    </p>
  )
}
