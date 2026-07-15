'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PageHeader } from '@/components/ui/misc'
import { LANGUAGE_LABEL, type Language } from '@/lib/types'
import { toast } from '@/lib/toast'
import { Volume2, Languages, Gauge, GitBranch } from 'lucide-react'

export default function SettingsPage() {
  const [reduced, setReduced] = useState(false)
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Voice, language, latency targets and escalation defaults for this brand."
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.success('Settings saved', 'Your voice, language and escalation defaults are updated.')}
        >
          Save changes
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <Volume2 className="h-4 w-4 text-accent-primary" />
            <CardTitle>Voice & TTS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="TTS engine">
              <Select options={['ElevenLabs (default)', 'Cartesia', 'Azure Neural']} />
            </Row>
            <Row label="Default voice">
              <Select options={['Aria — warm female (Hindi/English)', 'Kabir — calm male', 'Meera — brisk female']} />
            </Row>
            <Row label="STT engine">
              <Select options={['Deepgram (default)', 'OpenAI Whisper']} />
            </Row>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <Languages className="h-4 w-4 text-accent-primary" />
            <CardTitle>Language defaults</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs font-medium text-ink-muted">Enabled languages</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(LANGUAGE_LABEL) as Language[]).map((l) => (
                <Badge key={l} tone={['en', 'hi', 'ta'].includes(l) ? 'pine' : 'neutral'}>
                  {LANGUAGE_LABEL[l]}
                </Badge>
              ))}
            </div>
            <p className="mt-4 mb-2 text-xs font-medium text-ink-muted">Fallback language</p>
            <Select options={['English', 'Hindi']} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <Gauge className="h-4 w-4 text-accent-primary" />
            <CardTitle>Latency targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <TargetRow label="Simple turn (barge-in)" value="500–700 ms" tone="success" />
            <TargetRow label="Complex / tool-calling turn" value="1–2 s" tone="brass" />
            <TargetRow label="Escalation decision" value="< 300 ms" tone="success" />
            <p className="text-xs text-ink-muted">
              Targets mirror backend budgets; live latency is shown per-agent on the Command Center.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <GitBranch className="h-4 w-4 text-accent-primary" />
            <CardTitle>Escalation & accessibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Escalate on sentiment">
              <Select options={['Frustrated or Urgent', 'Urgent only', 'Never']} />
            </Row>
            <Row label="Escalate after failed tools">
              <Select options={['2 failures', '3 failures', 'Disabled']} />
            </Row>
            <div className="flex items-center justify-between rounded-sm border border-border bg-surface p-3">
              <div>
                <p className="text-sm font-medium text-ink">Reduce motion</p>
                <p className="text-xs text-ink-muted">Pause the waveform & count-up animations.</p>
              </div>
              <Switch checked={reduced} onCheckedChange={setReduced} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</label>
      {children}
    </div>
  )
}

function Select({ options }: { options: string[] }) {
  return (
    <select className="h-9 w-full rounded-sm border border-border bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

function TargetRow({ label, value, tone }: { label: string; value: string; tone: 'success' | 'brass' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  )
}
