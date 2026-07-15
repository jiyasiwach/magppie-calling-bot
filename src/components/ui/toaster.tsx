'use client'

import { useToast, type ToastTone } from '@/lib/toast'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONE: Record<ToastTone, { icon: React.ComponentType<{ className?: string }>; color: string; bar: string }> = {
  success: { icon: CheckCircle2, color: 'text-success', bar: 'bg-success' },
  info: { icon: Info, color: 'text-accent-primary', bar: 'bg-accent-primary' },
  warning: { icon: AlertTriangle, color: 'text-warning', bar: 'bg-warning' },
  danger: { icon: XCircle, color: 'text-danger', bar: 'bg-danger' },
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const cfg = TONE[t.tone]
        const Icon = cfg.icon
        return (
          <div
            key={t.id}
            className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-card border border-border bg-surface-raised p-3.5 pl-4 shadow-panel animate-fade-slide-in"
          >
            <span className={cn('absolute left-0 top-0 h-full w-1', cfg.bar)} />
            <Icon className={cn('mt-0.5 h-4.5 w-4.5 shrink-0', cfg.color)} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-ink-muted">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-sm p-1 text-ink-muted hover:bg-ink/5 hover:text-ink"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
