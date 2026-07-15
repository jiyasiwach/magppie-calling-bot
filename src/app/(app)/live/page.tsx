'use client'

import { useMemo, useState } from 'react'
import { Waveform } from '@/components/live/waveform'
import { CallPanel } from '@/components/live/call-panel'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SentimentTag, PageHeader, EmptyState } from '@/components/ui/misc'
import { useLiveCalls } from '@/lib/use-live'
import { useApp } from '@/lib/store'
import { AGENTS } from '@/lib/mock-data'
import { LANGUAGE_LABEL, type LiveCall, type Sentiment } from '@/lib/types'
import { maskPhone, duration, cn } from '@/lib/utils'
import { RadioTower, PhoneIncoming, PhoneOutgoing } from 'lucide-react'

type Filter = { agent: string; sentiment: string; direction: string }

export default function LivePage() {
  const { tenant } = useApp()
  const calls = useLiveCalls(tenant)
  const [selected, setSelected] = useState<LiveCall | null>(null)
  const [filter, setFilter] = useState<Filter>({ agent: 'all', sentiment: 'all', direction: 'all' })

  const agents = AGENTS.filter((a) => a.tenant === tenant)

  const filtered = useMemo(
    () =>
      calls.filter(
        (c) =>
          (filter.agent === 'all' || c.agentId === filter.agent) &&
          (filter.sentiment === 'all' || c.sentiment === filter.sentiment) &&
          (filter.direction === 'all' || c.direction === filter.direction),
      ),
    [calls, filter],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Calls"
        subtitle="Every active conversation in real time. Click a call to monitor and coach."
      >
        <Badge tone="brass">
          <RadioTower className="h-3.5 w-3.5" /> {calls.length} active
        </Badge>
      </PageHeader>

      <Waveform concurrent={calls.length} />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          value={filter.agent}
          onChange={(agent) => setFilter((f) => ({ ...f, agent }))}
          options={[{ value: 'all', label: 'All agents' }, ...agents.map((a) => ({ value: a.id, label: a.name }))]}
        />
        <FilterSelect
          value={filter.sentiment}
          onChange={(sentiment) => setFilter((f) => ({ ...f, sentiment }))}
          options={[
            { value: 'all', label: 'All sentiment' },
            { value: 'calm', label: 'Calm' },
            { value: 'positive', label: 'Positive' },
            { value: 'frustrated', label: 'Frustrated' },
            { value: 'urgent', label: 'Urgent' },
          ]}
        />
        <FilterSelect
          value={filter.direction}
          onChange={(direction) => setFilter((f) => ({ ...f, direction }))}
          options={[
            { value: 'all', label: 'All directions' },
            { value: 'inbound', label: 'Inbound' },
            { value: 'outbound', label: 'Outbound' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<RadioTower className="h-8 w-8" />}
          title="No calls match these filters"
          hint="Try clearing a filter to see active conversations."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((call) => (
            <CallCard key={call.id} call={call} onClick={() => setSelected(call)} />
          ))}
        </div>
      )}

      <CallPanel call={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function CallCard({ call, onClick }: { call: LiveCall; onClick: () => void }) {
  const Dir = call.direction === 'inbound' ? PhoneIncoming : PhoneOutgoing
  const border =
    call.sentiment === 'urgent'
      ? 'border-l-danger'
      : call.sentiment === 'frustrated'
        ? 'border-l-warning'
        : 'border-l-accent-primary'
  return (
    <button onClick={onClick} className="text-left">
      <Card hover className={cn('border-l-[3px] p-4', border)}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
            <Dir className="h-3.5 w-3.5 text-ink-muted" />
            {maskPhone(call.customerPhone)}
          </span>
          <span className="tabular text-sm text-ink-muted">{duration(call.durationSec)}</span>
        </div>
        <p className="mt-2 truncate text-xs text-ink-muted">{call.agentName}</p>
        <p className="mt-1 truncate text-sm text-ink">{call.intent}</p>
        <div className="mt-3 flex items-center justify-between">
          <SentimentTag sentiment={call.sentiment as Sentiment} />
          <Badge tone="neutral">{LANGUAGE_LABEL[call.language]}</Badge>
        </div>
      </Card>
    </button>
  )
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-sm border border-border bg-surface-raised px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
