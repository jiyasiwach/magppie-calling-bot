'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader, StatusDot, EmptyState } from '@/components/ui/misc'
import { AGENTS, AGENT_VERSIONS, NOW } from '@/lib/mock-data'
import { useAgents } from '@/lib/data'
import {
  LANGUAGE_LABEL,
  TOOL_ACTION_LABEL,
  type ToolAction,
  type Language,
} from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from '@/lib/toast'
import { Send, History, RotateCcw, GitCompare, Bot, Sparkles } from 'lucide-react'

const ALL_TOOLS: ToolAction[] = [
  'create_lead',
  'create_ticket',
  'create_appointment',
  'warranty_lookup',
  'dealer_lookup',
  'order_status',
]
const ALL_LANGS: Language[] = ['en', 'hi', 'ta', 'te', 'mr', 'bn', 'kn']
const PERSONAS = ['patient', 'impatient', 'confused', 'hostile'] as const

export default function AgentsPage() {
  const agents = useAgents()
  const [activeId, setActiveId] = useState(agents[0]?.id)
  const active = agents.find((a) => a.id === activeId) ?? agents[0]

  if (!active)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Agent Builder & Simulator"
          subtitle="Configure your voice agents and pressure-test them in a sandbox before publishing."
        >
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast.info('New agent', 'Name your agent, pick a persona and languages to begin.')}
          >
            <Sparkles className="h-4 w-4" /> New agent
          </Button>
        </PageHeader>
        <EmptyState
          icon={<Bot className="h-8 w-8" />}
          title="No agents yet"
          hint="Create your first voice agent to configure its persona, languages and tools — then rehearse it in the sandbox before going live."
        />
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Builder & Simulator"
        subtitle="Configure your voice agents and pressure-test them in a sandbox before publishing."
      >
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            toast.success(
              `${active.name} published`,
              `Version ${active.version + 1} is now live and taking calls.`,
            )
          }
        >
          <Sparkles className="h-4 w-4" /> Publish v{active.version + 1}
        </Button>
      </PageHeader>

      {/* Agent selector */}
      <div className="flex flex-wrap gap-2">
        {agents.map((a) => (
          <button
            key={a.id}
            onClick={() => setActiveId(a.id)}
            className={cn(
              'flex items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors',
              a.id === active.id
                ? 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary'
                : 'border-border bg-surface-raised text-ink-muted hover:text-ink',
            )}
          >
            <StatusDot status={a.status} />
            {a.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ConfigPanel active={active} />
        <Sandbox agentName={active.name} />
      </div>

      <VersionHistory agentId={active.id} currentVersion={active.version} />
    </div>
  )
}

function ConfigPanel({ active }: { active: (typeof AGENTS)[number] }) {
  const [tools, setTools] = useState<Set<ToolAction>>(new Set(active.enabledTools))
  const [langs, setLangs] = useState<Set<Language>>(new Set(active.languages))

  const toggle = <T,>(set: Set<T>, v: T, upd: (s: Set<T>) => void) => {
    const next = new Set(set)
    next.has(v) ? next.delete(v) : next.add(v)
    upd(next)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <Bot className="h-4 w-4 text-accent-primary" />
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <Field label="Persona">
          <textarea
            defaultValue={active.persona}
            rows={2}
            className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tone">
            <SelectLike options={['Warm & unhurried', 'Brisk & efficient', 'Formal', 'Playful']} />
          </Field>
          <Field label="Escalation threshold">
            <SelectLike options={['On frustration + human ask', 'On 2 failed tools', 'Never auto-escalate']} />
          </Field>
        </div>

        <Field label="Languages">
          <div className="flex flex-wrap gap-1.5">
            {ALL_LANGS.map((l) => (
              <Chip
                key={l}
                active={langs.has(l)}
                onClick={() => toggle(langs, l, setLangs)}
                label={LANGUAGE_LABEL[l]}
              />
            ))}
          </div>
        </Field>

        <Field label="Tool-calling actions">
          <div className="grid grid-cols-2 gap-1.5">
            {ALL_TOOLS.map((t) => (
              <Chip
                key={t}
                active={tools.has(t)}
                onClick={() => toggle(tools, t, setTools)}
                label={TOOL_ACTION_LABEL[t]}
                full
              />
            ))}
          </div>
        </Field>

        <Field label="Knowledge base sources">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="pine">Catalog 2026</Badge>
            <Badge tone="pine">Warranty policy</Badge>
            <Badge tone="pine">Dealer locations</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Pick a knowledge source', 'Connect Drive, Notion or upload a document.')}
            >
              + Add source
            </Button>
          </div>
        </Field>
      </CardContent>
    </Card>
  )
}

function Sandbox({ agentName }: { agentName: string }) {
  const [persona, setPersona] = useState<(typeof PERSONAS)[number]>('patient')
  const [difficulty, setDifficulty] = useState(40)
  const [msgs, setMsgs] = useState<{ role: 'agent' | 'customer'; text: string }[]>([
    { role: 'agent', text: 'Namaste! Main aapki kitchen ke liye kaise madad kar sakti hoon?' },
  ])
  const [draft, setDraft] = useState('')

  const send = () => {
    if (!draft.trim()) return
    const userText = draft.trim()
    setMsgs((m) => [...m, { role: 'customer', text: userText }])
    setDraft('')
    // canned agent reply keyed off persona/difficulty for a convincing demo
    setTimeout(() => {
      const reply =
        difficulty > 70
          ? 'I understand this is frustrating. Let me pull up your details and escalate if needed.'
          : 'Great — I can help with that. Could you share your city and approximate budget?'
      setMsgs((m) => [...m, { role: 'agent', text: reply }])
    }, 500)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-secondary" />
          <CardTitle>Call Sandbox</CardTitle>
        </div>
        <Badge tone="brass">Unpublished draft</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* persona + difficulty controls */}
        <div className="rounded-sm border border-border bg-surface p-3">
          <p className="mb-2 text-xs font-medium text-ink-muted">Synthetic customer persona</p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {PERSONAS.map((p) => (
              <Chip key={p} active={persona === p} onClick={() => setPersona(p)} label={p} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted">Difficulty</span>
            <input
              type="range"
              min={0}
              max={100}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="flex-1 accent-accent-primary"
            />
            <span className="tabular w-8 text-right text-xs font-medium text-ink">{difficulty}</span>
          </div>
        </div>

        {/* conversation */}
        <div className="h-56 space-y-2 overflow-y-auto rounded-sm border border-border bg-surface-raised p-3">
          {msgs.map((m, i) => (
            <div key={i} className={cn('flex', m.role === 'agent' ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-card px-3 py-1.5 text-sm',
                  m.role === 'agent' ? 'bg-surface text-ink' : 'bg-accent-primary/10 text-ink',
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`Speak as a ${persona} customer…`}
            className="h-10 flex-1 rounded-sm border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
          />
          <Button variant="primary" size="icon" onClick={send}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function VersionHistory({ agentId, currentVersion }: { agentId: string; currentVersion: number }) {
  const versions = AGENT_VERSIONS[agentId] ?? [
    { version: currentVersion, savedAt: NOW - 3600_000, author: '—', note: 'Current published version', persona: '' },
  ]
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-ink-muted" />
          <CardTitle>Version history</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info('Select two versions', 'Pick any two versions to see a line-by-line diff.')}
        >
          <GitCompare className="h-4 w-4" /> Compare selected
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {versions.map((v, i) => (
            <div
              key={v.version}
              className={cn(
                'w-64 shrink-0 rounded-sm border p-3',
                i === 0 ? 'border-accent-primary/30 bg-accent-primary/5' : 'border-border bg-surface-raised',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="tabular text-sm font-semibold text-ink">v{v.version}</span>
                {i === 0 ? (
                  <Badge tone="success">Live</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5"
                    onClick={() => toast.success(`Rolled back to v${v.version}`, v.note)}
                  >
                    <RotateCcw className="h-3 w-3" /> Roll back
                  </Button>
                )}
              </div>
              <p className="mt-1 text-xs text-ink">{v.note}</p>
              <p className="mt-2 text-[11px] text-ink-muted">
                {v.author} · {formatDistanceToNow(v.savedAt, { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// --- small helpers ---
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</label>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  label,
  full,
}: {
  active: boolean
  onClick: () => void
  label: string
  full?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors',
        full && 'w-full text-left',
        active
          ? 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary'
          : 'border-border bg-surface text-ink-muted hover:text-ink',
      )}
    >
      {label}
    </button>
  )
}

function SelectLike({ options }: { options: string[] }) {
  return (
    <select className="h-9 w-full rounded-sm border border-border bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}
