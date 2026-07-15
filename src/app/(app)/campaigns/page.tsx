'use client'

import { useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader, Meter } from '@/components/ui/misc'
import { Switch } from '@/components/ui/switch'
import { ChartTooltip } from '@/components/charts/tooltip'
import { CATEGORICAL, CHART } from '@/components/charts/theme'
import { CAMPAIGNS } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import { LANGUAGE_LABEL, type Campaign, type CampaignStatus } from '@/lib/types'
import { inr, nfmt, cn } from '@/lib/utils'
import { toast } from '@/lib/toast'
import { Gauge, TrendingUp, Zap } from 'lucide-react'

const STATUS_TONE: Record<CampaignStatus, 'success' | 'warning' | 'neutral' | 'pine'> = {
  running: 'success',
  paused: 'warning',
  scheduled: 'neutral',
  completed: 'pine',
}

export default function CampaignsPage() {
  const { tenant } = useApp()
  const campaigns = CAMPAIGNS.filter((c) => c.tenant === tenant)
  const [activeId, setActiveId] = useState(campaigns[0]?.id)
  const active = campaigns.find((c) => c.id === activeId) ?? campaigns[0]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        subtitle="Create, monitor and self-throttle your outbound calling campaigns."
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.info('New campaign', 'Choose an agent, contact list and language to begin.')}
        >
          + New campaign
        </Button>
      </PageHeader>

      {/* list */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-ink-muted">
                  <th className="p-3 font-medium">Campaign</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Placed / Left</th>
                  <th className="p-3 text-right font-medium">Connect</th>
                  <th className="p-3 text-right font-medium">Conv.</th>
                  <th className="p-3 text-right font-medium">Spend</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      'cursor-pointer border-b border-border/60 last:border-0 hover:bg-ink/[0.02]',
                      c.id === active?.id && 'bg-accent-primary/[0.04]',
                    )}
                  >
                    <td className="p-3">
                      <p className="font-medium text-ink">{c.name}</p>
                      <p className="text-xs text-ink-muted">{LANGUAGE_LABEL[c.language]}</p>
                    </td>
                    <td className="p-3"><Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge></td>
                    <td className="tabular p-3 text-right text-ink-muted">
                      {nfmt(c.placed)} / {nfmt(c.remaining)}
                    </td>
                    <td className="tabular p-3 text-right text-ink">{(c.connectRate * 100).toFixed(0)}%</td>
                    <td className="tabular p-3 text-right text-ink">{(c.conversionRate * 100).toFixed(0)}%</td>
                    <td className="tabular p-3 text-right text-ink">{inr(c.spend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {active && <CampaignDetail campaign={active} />}
    </div>
  )
}

function CampaignDetail({ campaign }: { campaign: Campaign }) {
  const [throttle, setThrottle] = useState(campaign.autoThrottle)
  const roi = campaign.spend > 0 ? campaign.projectedRecovery / campaign.spend : 0
  const funnel = [
    { stage: 'Dialed', value: campaign.funnel.dialed },
    { stage: 'Connected', value: campaign.funnel.connected },
    { stage: 'Completed', value: campaign.funnel.completed },
    { stage: 'Converted', value: campaign.funnel.converted },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* funnel */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{campaign.name} — funnel</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Pacing controls', 'Adjust calls-per-minute and concurrency for this campaign.')}
            >
              Pacing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Retry & backoff', 'Configure retry attempts and wait time for no-answers.')}
            >
              Retry / backoff
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 24 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fill: CHART.inkMuted, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={84}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26}>
                {funnel.map((_, i) => (
                  <Cell key={i} fill={CATEGORICAL[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-4 gap-2 text-center">
            {funnel.map((f, i) => (
              <div key={f.stage}>
                <p className="tabular text-lg font-semibold text-ink">{nfmt(f.value)}</p>
                <p className="text-xs text-ink-muted">{f.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive ROI + auto-throttle §5.7 */}
      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <Gauge className="h-4 w-4 text-accent-secondary" />
          <CardTitle>Predictive ROI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-muted">Forecast recovery today</span>
              <span className="tabular text-lg font-semibold text-ink">{inr(campaign.projectedRecovery)}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-sm text-ink-muted">Spend today</span>
              <span className="tabular text-sm text-ink">{inr(campaign.spend)}</span>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-surface p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-ink">
                <TrendingUp className="h-4 w-4 text-success" /> Live ROI
              </span>
              <span className="tabular text-lg font-semibold text-success">{roi.toFixed(1)}×</span>
            </div>
            <Meter value={Math.min(1, roi / 5)} tone="success" className="mt-2" />
            <p className="mt-1.5 text-xs text-ink-muted">
              Auto-throttle threshold: {campaign.roiThreshold.toFixed(1)}×
            </p>
          </div>

          <div className="flex items-start justify-between gap-3 rounded-sm border border-accent-secondary/30 bg-accent-secondary/[0.06] p-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <Zap className="h-4 w-4 text-accent-secondary" /> Auto-throttle
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                Slow outbound pacing if live ROI drops below threshold.
              </p>
            </div>
            <Switch
              checked={throttle}
              onCheckedChange={(v) => {
                setThrottle(v)
                v
                  ? toast.success('Auto-throttle on', `Pacing will slow if ROI drops below ${campaign.roiThreshold.toFixed(1)}×.`)
                  : toast.warning('Auto-throttle off', 'Outbound pacing will run at full speed.')
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
