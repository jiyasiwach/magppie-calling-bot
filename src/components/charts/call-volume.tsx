'use client'

import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getCallVolume } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import { CHART } from './theme'
import { ChartTooltip } from './tooltip'
import { cn } from '@/lib/utils'

export function CallVolumeChart() {
  const { tenant } = useApp()
  const [range, setRange] = useState<7 | 30>(7)
  const data = getCallVolume(range, tenant)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-display text-lg text-ink">Call volume</p>
          <p className="text-sm text-ink-muted">Inbound vs outbound</p>
        </div>
        <div className="flex rounded-sm border border-border bg-surface-raised p-0.5">
          {([7, 30] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-[4px] px-2.5 py-1 text-xs font-medium transition-colors',
                range === r
                  ? 'bg-accent-primary text-white'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.pine} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART.pine} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.brass} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART.brass} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={CHART.grid} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: CHART.inkMuted, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: CHART.grid }}
          />
          <YAxis
            tick={{ fill: CHART.inkMuted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="inbound"
            stackId="1"
            stroke={CHART.pine}
            strokeWidth={2}
            fill="url(#inGrad)"
          />
          <Area
            type="monotone"
            dataKey="outbound"
            stackId="1"
            stroke={CHART.brass}
            strokeWidth={2}
            fill="url(#outGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CHART.pine }} /> Inbound
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CHART.brass }} /> Outbound
        </span>
      </div>
    </div>
  )
}
