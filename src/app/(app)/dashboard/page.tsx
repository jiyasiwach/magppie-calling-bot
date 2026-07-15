'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCard } from '@/components/kpi-card'
import { CallVolumeChart } from '@/components/charts/call-volume'
import { StatusDot, PageHeader } from '@/components/ui/misc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AGENTS, ESCALATIONS, getKpis } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import { inr, nfmt, duration as _d } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export default function OverviewPage() {
  const { tenant } = useApp()
  const kpi = getKpis(tenant)
  const agents = AGENTS.filter((a) => a.tenant === tenant)
  const escalations = ESCALATIONS.filter((e) => e.tenant === tenant)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        subtitle="Everything happening across your AI voice operation, at a glance."
      >
        <Button asChild variant="secondary" size="sm">
          <Link href="/live">
            Live calls <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Calls Today" value={kpi.callsToday} format={nfmt} trend={kpi.callsTrend} seed={1} />
        <KpiCard label="Resolution Rate" value={kpi.resolutionRate * 100} format={(n) => `${n.toFixed(0)}%`} trend={kpi.resolutionTrend} seed={3} />
        <KpiCard label="Avg Latency" value={kpi.avgLatencyMs} format={(n) => `${Math.round(n)}ms`} trend={kpi.latencyTrend} seed={5} invertTrend />
        <KpiCard label="Cost Saved" value={kpi.costSaved} format={(n) => inr(n)} trend={kpi.costTrend} seed={7} />
      </div>

      {/* Chart + agent health */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <CallVolumeChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {agents.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-sm px-2 py-2.5 hover:bg-ink/[0.03]"
              >
                <StatusDot status={a.status} className="mt-1.5" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{a.name}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {a.issue ?? `${a.liveCalls} live · ${(a.resolutionRate * 100).toFixed(0)}% resolved`}
                  </p>
                </div>
                <span className="tabular text-xs text-ink-muted">
                  {a.avgLatencyMs ? `${a.avgLatencyMs}ms` : '—'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent escalations */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent escalations to human</CardTitle>
          <Badge tone="warning">{escalations.length} today</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-ink-muted">
                  <th className="pb-2 font-medium">Reason</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Agent</th>
                  <th className="pb-2 font-medium">Time</th>
                  <th className="pb-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {escalations.map((e) => (
                  <tr key={e.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 text-ink">{e.reason}</td>
                    <td className="py-3 pr-4 text-ink-muted">{e.customerName}</td>
                    <td className="py-3 pr-4 text-ink-muted">{e.agentName}</td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {formatDistanceToNow(e.at, { addSuffix: true })}
                    </td>
                    <td className="py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href="/conversations">View transcript</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
