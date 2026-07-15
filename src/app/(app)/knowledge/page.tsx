'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader, Meter } from '@/components/ui/misc'
import { KB_DOCS, KB_GAPS } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import type { KbStatus } from '@/lib/types'
import { toast } from '@/lib/toast'
import { FileText, PenLine, AlertCircle } from 'lucide-react'

const STATUS: Record<KbStatus, { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  covered: { tone: 'success', label: 'Covered' },
  stale: { tone: 'warning', label: 'Stale' },
  gap: { tone: 'danger', label: 'Gap' },
}

export default function KnowledgePage() {
  const { tenant } = useApp()
  const docs = KB_DOCS.filter((d) => d.tenant === tenant)
  const gaps = [...KB_GAPS].sort((a, b) => b.askedCount - a.askedCount)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        subtitle="RAG source documents plus a detector for questions your agents can’t confidently answer."
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.info('Add a knowledge source', 'Connect Drive/Notion or upload a document to index.')}
        >
          + Add source
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* documents */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {docs.map((d) => {
              const s = STATUS[d.status]
              return (
                <div
                  key={d.id}
                  className="flex items-center gap-3 rounded-sm border border-border bg-surface-raised px-3 py-2.5 lift-on-hover"
                >
                  <FileText className="h-4 w-4 shrink-0 text-ink-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{d.title}</p>
                    <p className="text-xs text-ink-muted">
                      {d.source} · {d.chunks} chunks · updated {format(d.updatedAt, 'dd MMM')}
                    </p>
                  </div>
                  <Badge tone={s.tone}>{s.label}</Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Gap detector §5.5 */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <CardTitle>Knowledge gaps this week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gaps.map((g) => (
              <div key={g.id} className="rounded-sm border border-border bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="neutral">{g.topic}</Badge>
                  <span className="tabular text-xs text-ink-muted">asked {g.askedCount}×</span>
                </div>
                <p className="mt-1.5 text-sm text-ink">{g.question}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-ink-muted">agent confidence</span>
                  <Meter value={g.confidence} tone="danger" className="w-16" />
                  <span className="tabular text-[11px] text-ink-muted">{(g.confidence * 100).toFixed(0)}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-7"
                    onClick={() =>
                      toast.success('Draft started', `An article for “${g.topic}” was drafted for review.`)
                    }
                  >
                    <PenLine className="h-3.5 w-3.5" /> Draft article
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
