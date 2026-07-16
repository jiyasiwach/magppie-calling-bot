'use client'

import * as Popover from '@radix-ui/react-popover'
import { Bell, AlertTriangle, TrendingDown, ShieldAlert } from 'lucide-react'
import { useEscalations, useIsDemo } from '@/lib/data'
import { useApp } from '@/lib/store'
import { formatDistanceToNow } from 'date-fns'

const DEMO_ANOMALIES = [
  { icon: TrendingDown, text: 'Diwali campaign connect-rate dropped 8% in last hour', tone: 'text-warning' },
  { icon: ShieldAlert, text: '1 call flagged: recording disclosure missing', tone: 'text-danger' },
]

export function NotificationCenter() {
  const { notifOpen, setNotifOpen } = useApp()
  const demo = useIsDemo()
  const escalations = useEscalations().slice(0, 4)
  const anomalies = demo ? DEMO_ANOMALIES : []
  const count = escalations.length + anomalies.length

  return (
    <Popover.Root open={notifOpen} onOpenChange={setNotifOpen}>
      <Popover.Trigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-card border border-border bg-surface-raised p-0 shadow-panel animate-fade-slide-in"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-display text-sm text-ink">Notifications</p>
            <span className="text-xs text-ink-muted">{count} new</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {count === 0 && (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">
                You’re all caught up — escalations, anomalies and compliance flags will land here.
              </p>
            )}
            {escalations.length > 0 && (
            <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">
              Escalations
            </p>
            )}
            {escalations.map((e) => (
              <div key={e.id} className="flex gap-2.5 px-4 py-2.5 hover:bg-ink/[0.03]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <div className="min-w-0">
                  <p className="text-sm text-ink">{e.reason}</p>
                  <p className="text-xs text-ink-muted">
                    {e.customerName} · {e.agentName} ·{' '}
                    {formatDistanceToNow(e.at, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            {anomalies.length > 0 && (
            <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">
              Anomalies & compliance
            </p>
            )}
            {anomalies.map((a, i) => (
              <div key={i} className="flex gap-2.5 px-4 py-2.5 hover:bg-ink/[0.03]">
                <a.icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.tone}`} />
                <p className="text-sm text-ink">{a.text}</p>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
