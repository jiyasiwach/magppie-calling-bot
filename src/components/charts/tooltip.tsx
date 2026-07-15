'use client'

import type { TooltipProps } from 'recharts'

/** Warm-styled Recharts tooltip shared across all charts. */
export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border bg-surface-raised px-3 py-2 shadow-panel">
      {label != null && (
        <p className="mb-1 text-xs font-medium text-ink">{label}</p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="capitalize text-ink-muted">{p.name}</span>
          <span className="tabular ml-auto font-medium text-ink">
            {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}
