'use client'

// §4.1 / §5.11 — reusable timeline of a call's path across channels, each hop
// timestamped with the reason for the handoff.

import { Phone, MessageCircle, MessageSquare, UserRound } from 'lucide-react'
import { format } from 'date-fns'
import type { HandoffHop } from '@/lib/types'
import { cn } from '@/lib/utils'

const CHANNEL = {
  'ai-voice': { label: 'AI Voice', icon: Phone, color: 'bg-accent-primary text-white' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'bg-success text-white' },
  sms: { label: 'SMS', icon: MessageSquare, color: 'bg-chart-blue text-white' },
  human: { label: 'Human', icon: UserRound, color: 'bg-accent-secondary text-white' },
} as const

export function HandoffVisualizer({ hops }: { hops: HandoffHop[] }) {
  return (
    <div className="flex flex-col gap-0">
      {hops.map((hop, i) => {
        const c = CHANNEL[hop.channel]
        const Icon = c.icon
        const last = i === hops.length - 1
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', c.color)}>
                <Icon className="h-4 w-4" />
              </span>
              {!last && <span className="my-1 w-px flex-1 bg-border" />}
            </div>
            <div className={cn('pb-4', last && 'pb-0')}>
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                {c.label}
                <span className="tabular text-xs font-normal text-ink-muted">
                  {format(hop.at, 'HH:mm')}
                </span>
              </p>
              <p className="text-xs text-ink-muted">{hop.reason}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
