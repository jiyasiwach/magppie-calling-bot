'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { AgentStatus, Sentiment } from '@/lib/types'

/** A small pulsing status dot in success/amber/red. */
export function StatusDot({
  status,
  className,
}: {
  status: AgentStatus | 'live'
  className?: string
}) {
  const color =
    status === 'healthy' || status === 'live'
      ? 'bg-success'
      : status === 'degraded'
        ? 'bg-warning'
        : 'bg-danger'
  return (
    <span className={cn('relative inline-flex h-2.5 w-2.5', className)}>
      <span
        className={cn(
          'absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-dot',
          color,
        )}
      />
      <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', color)} />
    </span>
  )
}

const SENTIMENT_MAP: Record<Sentiment, { label: string; dot: string; text: string }> = {
  calm: { label: 'Calm', dot: 'bg-chart-blue', text: 'text-chart-blue' },
  positive: { label: 'Positive', dot: 'bg-success', text: 'text-success' },
  frustrated: { label: 'Frustrated', dot: 'bg-warning', text: 'text-warning' },
  urgent: { label: 'Urgent', dot: 'bg-danger', text: 'text-danger' },
}

/** Emoji-free sentiment indicator: colored dot + label (§3.2). */
export function SentimentTag({ sentiment }: { sentiment: Sentiment }) {
  const s = SENTIMENT_MAP[sentiment]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={cn('h-2 w-2 rounded-full', s.dot)} />
      <span className={s.text}>{s.label}</span>
    </span>
  )
}

/** Thin progress bar in the brass/pine palette. */
export function Meter({
  value,
  tone = 'pine',
  className,
}: {
  value: number // 0..1
  tone?: 'pine' | 'brass' | 'danger' | 'success'
  className?: string
}) {
  const bar =
    tone === 'brass'
      ? 'bg-accent-secondary'
      : tone === 'danger'
        ? 'bg-danger'
        : tone === 'success'
          ? 'bg-success'
          : 'bg-accent-primary'
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-ink/8', className)}>
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', bar)}
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
      />
    </div>
  )
}

/** Section heading used across pages. */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

/** Empty state with a clear next action (§4.5). */
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: React.ReactNode
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-surface/60 px-6 py-14 text-center">
      {icon && <div className="text-ink-muted/60">{icon}</div>}
      <div>
        <p className="font-display text-base text-ink">{title}</p>
        {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

/** Skeleton block for loading states (§4.5 — skeletons, not spinners). */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-ink/8', className)} />
}
