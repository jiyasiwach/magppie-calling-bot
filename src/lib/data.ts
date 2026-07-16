'use client'

// Mode-aware data access. Every screen reads through these hooks instead of
// importing fixtures directly:
//   'live' → the real current state. No backend exists yet, so activity is
//            genuinely zero — KPIs at 0, empty lists, flat charts.
//   'demo' → the mock dataset, for presentations.
// When the real API lands, only the 'live' branches change (fetch/WebSocket);
// the components stay untouched.

import { useApp } from './store'
import {
  AGENTS,
  CAMPAIGNS,
  COMPLIANCE,
  CONVERSATIONS,
  ESCALATIONS,
  KB_DOCS,
  KB_GAPS,
  TEAM,
  INTEGRATIONS,
  getCallVolume,
  getHourHeatmap,
  getKpis,
  getSparkline,
  getToolReliability,
} from './mock-data'
import type { Integration } from './types'

const EMPTY: never[] = []

export function useDataMode() {
  return useApp((s) => s.dataMode)
}
export function useIsDemo() {
  return useApp((s) => s.dataMode === 'demo')
}

export function useAgents() {
  const { tenant, dataMode } = useApp()
  return dataMode === 'demo' ? AGENTS.filter((a) => a.tenant === tenant) : EMPTY
}

export function useConversations() {
  const { tenant, dataMode } = useApp()
  return dataMode === 'demo' ? CONVERSATIONS.filter((c) => c.tenant === tenant) : EMPTY
}

export function useCampaigns() {
  const { tenant, dataMode } = useApp()
  return dataMode === 'demo' ? CAMPAIGNS.filter((c) => c.tenant === tenant) : EMPTY
}

export function useEscalations() {
  const { tenant, dataMode } = useApp()
  return dataMode === 'demo' ? ESCALATIONS.filter((e) => e.tenant === tenant) : EMPTY
}

export function useComplianceRecords() {
  const { tenant, dataMode } = useApp()
  return dataMode === 'demo' ? COMPLIANCE.filter((r) => r.tenant === tenant) : EMPTY
}

export function useKbDocs() {
  const { tenant, dataMode } = useApp()
  return dataMode === 'demo' ? KB_DOCS.filter((d) => d.tenant === tenant) : EMPTY
}

export function useKbGaps() {
  const { dataMode } = useApp()
  return dataMode === 'demo' ? KB_GAPS : EMPTY
}

export function useTeam() {
  const { dataMode } = useApp()
  return dataMode === 'demo' ? TEAM : EMPTY
}

export function useIntegrations(): Integration[] {
  const { dataMode } = useApp()
  return dataMode === 'demo'
    ? INTEGRATIONS
    : INTEGRATIONS.map((it) => ({ ...it, connected: false, detail: 'Not connected' }))
}

const ZERO_KPIS = {
  callsToday: 0,
  callsTrend: 0,
  resolutionRate: 0,
  resolutionTrend: 0,
  avgLatencyMs: 0,
  latencyTrend: 0,
  costSaved: 0,
  costTrend: 0,
}

export function useKpis() {
  const { tenant, dataMode } = useApp()
  return dataMode === 'demo' ? getKpis(tenant) : ZERO_KPIS
}

export function useCallVolumeSeries(days: number) {
  const { tenant, dataMode } = useApp()
  if (dataMode === 'demo') return getCallVolume(days, tenant)
  return getCallVolume(days, tenant).map((d) => ({ ...d, inbound: 0, outbound: 0 }))
}

export function useHourHeatmap() {
  const { dataMode } = useApp()
  return dataMode === 'demo' ? getHourHeatmap() : getHourHeatmap().map((h) => ({ ...h, value: 0 }))
}

export function useToolReliability() {
  const { tenant, dataMode } = useApp()
  const rows = getToolReliability(tenant)
  return dataMode === 'demo' ? rows : rows.map((r) => ({ ...r, calls: 0, success: 0, failed: 0 }))
}

export function useLanguageMix() {
  const { dataMode } = useApp()
  const base = [
    { name: 'Hindi', value: 42 },
    { name: 'English', value: 31 },
    { name: 'Tamil', value: 11 },
    { name: 'Telugu', value: 8 },
    { name: 'Marathi', value: 5 },
    { name: 'Kannada', value: 3 },
  ]
  return dataMode === 'demo' ? base : base.map((b) => ({ ...b, value: 0 }))
}

export function useSparkline(seed: number) {
  const { dataMode } = useApp()
  return dataMode === 'demo'
    ? getSparkline(seed)
    : Array.from({ length: 14 }, (_, i) => ({ x: i, y: 0 }))
}
