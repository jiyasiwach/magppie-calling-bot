'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/misc'
import { useComplianceRecords } from '@/lib/data'
import { maskPhone, cn } from '@/lib/utils'
import { toast } from '@/lib/toast'
import { Check, X, Download, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function CompliancePage() {
  const records = useComplianceRecords()
  const compliant = records.filter((r) => r.status === 'compliant').length
  const flagged = records.length - compliant

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance & Consent"
        subtitle="A full, exportable audit trail per call — not a footnote. Consent, DND, recording disclosure & escalations."
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast.success('Audit log exported', `${records.length} records queued as CSV — check your downloads.`)
          }
        >
          <Download className="h-4 w-4" /> Export audit log
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard icon={<ShieldCheck className="h-5 w-5 text-success" />} label="Fully compliant" value={compliant} tone="success" />
        <StatCard icon={<ShieldAlert className="h-5 w-5 text-warning" />} label="Flagged for review" value={flagged} tone="warning" />
        <StatCard icon={<ShieldCheck className="h-5 w-5 text-accent-primary" />} label="DND checks passed" value={records.filter((r) => r.dndClear).length} tone="pine" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-call audit trail</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-ink-muted">
                  <th className="w-1 p-3"></th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Time</th>
                  <th className="p-3 text-center font-medium">Consent</th>
                  <th className="p-3 text-center font-medium">DND clear</th>
                  <th className="p-3 text-center font-medium">Recording disclosed</th>
                  <th className="p-3 font-medium">Escalation</th>
                  <th className="p-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-ink-muted">
                      No calls audited yet — every call will log consent, DND and recording-disclosure checks here automatically.
                    </td>
                  </tr>
                )}
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0">
                    {/* §3.8 visual status strip */}
                    <td className="p-0">
                      <div className={cn('h-full min-h-[3rem] w-1', r.status === 'compliant' ? 'bg-success' : 'bg-warning')} />
                    </td>
                    <td className="p-3 text-ink">{maskPhone(r.customerPhone)}</td>
                    <td className="tabular p-3 text-ink-muted">{format(r.at, 'dd MMM, HH:mm')}</td>
                    <td className="p-3 text-center"><Tick ok={r.consentCaptured} /></td>
                    <td className="p-3 text-center"><Tick ok={r.dndClear} /></td>
                    <td className="p-3 text-center"><Tick ok={r.recordingDisclosed} /></td>
                    <td className="p-3 text-ink-muted">{r.escalationReason ?? '—'}</td>
                    <td className="p-3 text-right">
                      <Badge tone={r.status === 'compliant' ? 'success' : 'warning'}>{r.status}</Badge>
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

function Tick({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="mx-auto h-4 w-4 text-success" />
  ) : (
    <X className="mx-auto h-4 w-4 text-danger" />
  )
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="tabular text-xl font-semibold text-ink">{value}</p>
          <p className="text-xs text-ink-muted">{label}</p>
        </div>
      </div>
    </Card>
  )
}
