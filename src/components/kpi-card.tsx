'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getSparkline } from '@/lib/mock-data'
import { useCountUp } from '@/lib/use-live'
import { CHART } from '@/components/charts/theme'
import { cn } from '@/lib/utils'

export function KpiCard({
  label,
  value,
  format,
  trend,
  seed,
  invertTrend,
}: {
  label: string
  value: number
  format: (n: number) => string
  trend: number
  seed: number
  /** when true, a negative trend is good (e.g. latency) */
  invertTrend?: boolean
}) {
  const animated = useCountUp(value)
  const spark = getSparkline(seed)
  const good = invertTrend ? trend < 0 : trend > 0
  const TrendIcon = trend >= 0 ? ArrowUpRight : ArrowDownRight

  return (
    <Card hover className="overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-ink-muted">{label}</p>
          <p className="tabular mt-1 text-xl font-semibold text-ink">
            {format(animated)}
          </p>
        </div>
        <span
          className={cn(
            'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
            good ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {Math.abs(trend).toFixed(1)}%
        </span>
      </div>
      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`spark-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={good ? CHART.pine : CHART.clay} stopOpacity={0.3} />
                <stop offset="100%" stopColor={good ? CHART.pine : CHART.clay} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="y"
              stroke={good ? CHART.pine : CHART.clay}
              strokeWidth={1.75}
              fill={`url(#spark-${seed})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
