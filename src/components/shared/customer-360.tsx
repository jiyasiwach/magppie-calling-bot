'use client'

// §4.2 / §5.6 — one customer's full history across voice, WhatsApp, SMS & CRM,
// chronological, collapsible by channel.

import { useState } from 'react'
import { Phone, MessageCircle, MessageSquare, Ticket, ChevronDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { CustomerEvent } from '@/lib/types'
import { cn } from '@/lib/utils'

const CH = {
  voice: { label: 'Voice', icon: Phone, tone: 'text-accent-primary' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, tone: 'text-success' },
  sms: { label: 'SMS', icon: MessageSquare, tone: 'text-chart-blue' },
  crm: { label: 'CRM', icon: Ticket, tone: 'text-accent-secondary' },
} as const

export function Customer360({
  name,
  events,
}: {
  name: string
  events: CustomerEvent[]
}) {
  const channels = Array.from(new Set(events.map((e) => e.channel)))
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const toggle = (c: string) =>
    setHidden((h) => {
      const next = new Set(h)
      next.has(c) ? next.delete(c) : next.add(c)
      return next
    })

  const shown = events.filter((e) => !hidden.has(e.channel))

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {channels.map((c) => (
          <button
            key={c}
            onClick={() => toggle(c)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
              hidden.has(c)
                ? 'border-border bg-surface text-ink-muted/50 line-through'
                : 'border-border bg-surface-raised text-ink',
            )}
          >
            {CH[c].label}
          </button>
        ))}
      </div>
      <div className="space-y-0">
        {shown.map((e, i) => {
          const c = CH[e.channel]
          const Icon = c.icon
          return (
            <div key={e.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-raised">
                  <Icon className={cn('h-3.5 w-3.5', c.tone)} />
                </span>
                {i < shown.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-ink">{e.title}</p>
                <p className="text-xs text-ink-muted">{e.detail}</p>
                <p className="tabular mt-0.5 text-[11px] text-ink-muted/70">
                  {formatDistanceToNow(e.at, { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
