'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader, Meter } from '@/components/ui/misc'
import { ChartTooltip } from '@/components/charts/tooltip'
import { CHART, CATEGORICAL } from '@/components/charts/theme'
import { getHourHeatmap, getToolReliability, getCallVolume } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import { TOOL_ACTION_LABEL, type ToolAction } from '@/lib/types'
import { nfmt, cn } from '@/lib/utils'
import { Wrench } from 'lucide-react'

export default function AnalyticsPage() {
  const { tenant } = useApp()
  const heat = getHourHeatmap()
  const tools = getToolReliability(tenant)
  const langData = [
    { name: 'Hindi', value: 42 },
    { name: 'English', value: 31 },
    { name: 'Tamil', value: 11 },
    { name: 'Telugu', value: 8 },
    { name: 'Marathi', value: 5 },
    { name: 'Kannada', value: 3 },
  ]
  const maxHeat = Math.max(...heat.map((h) => h.value))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & ROI"
        subtitle="Cross-filterable reporting on outcomes, performance, language mix and tool reliability."
      />

      {/* Action Console §5.8 — the Magppie-specific differentiator */}
      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <Wrench className="h-4 w-4 text-accent-secondary" />
          <div>
            <CardTitle>Warranty / Dealer / Order Action Console</CardTitle>
            <p className="text-sm text-ink-muted">
              Success & failure rate for each of the six tool-calling actions.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <div key={t.action} className="rounded-sm border border-border bg-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">
                    {TOOL_ACTION_LABEL[t.action as ToolAction]}
                  </span>
                  <Badge tone={t.success > 0.97 ? 'success' : t.success > 0.9 ? 'warning' : 'danger'}>
                    {(t.success * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Meter
                  value={t.success}
                  tone={t.success > 0.97 ? 'success' : t.success > 0.9 ? 'brass' : 'danger'}
                  className="mt-2"
                />
                <p className="mt-1.5 text-xs text-ink-muted">
                  {nfmt(t.calls)} calls · {nfmt(t.failed)} failed
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Outcomes by time of day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1.5">
              {heat.map((h) => {
                const intensity = h.value / maxHeat
                return (
                  <div
                    key={h.hour}
                    title={`${h.hour} · ${h.value} resolved`}
                    className="flex aspect-square flex-col items-center justify-center rounded-md text-[10px]"
                    style={{
                      backgroundColor: `rgba(63,90,70,${0.12 + intensity * 0.7})`,
                      color: intensity > 0.55 ? '#FBF8F1' : '#2A2620',
                    }}
                  >
                    <span className="tabular font-semibold">{h.value}</span>
                    <span className="opacity-70">{h.hour}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Darker = more resolved calls. Peak throughput mid-afternoon.
            </p>
          </CardContent>
        </Card>

        {/* language breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Language mix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={langData} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: CHART.inkMuted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
                <YAxis tick={{ fill: CHART.inkMuted, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30}>
                  {langData.map((_, i) => (
                    <Cell key={i} fill={CATEGORICAL[i % CATEGORICAL.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* cost-per-resolution trend */}
      <Card>
        <CardHeader>
          <CardTitle>Cost-per-resolution trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getCallVolume(14, tenant)} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: CHART.inkMuted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: CHART.grid }} />
              <YAxis tick={{ fill: CHART.inkMuted, fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="inbound" name="₹/resolution" radius={[4, 4, 0, 0]} fill={CHART.slate} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
