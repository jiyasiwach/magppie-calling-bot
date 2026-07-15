'use client'

import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Send, Sparkles } from 'lucide-react'
import type { LiveCall } from '@/lib/types'
import { CONVERSATIONS } from '@/lib/mock-data'
import { SentimentTag } from '@/components/ui/misc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { maskPhone, duration, cn } from '@/lib/utils'
import { LANGUAGE_LABEL } from '@/lib/types'

// Reuse a canned transcript to animate a "live" scroll.
const SAMPLE = CONVERSATIONS[0].transcript

export function CallPanel({
  call,
  onClose,
}: {
  call: LiveCall | null
  onClose: () => void
}) {
  const [shown, setShown] = useState(1)
  const [whispers, setWhispers] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Simulate live transcript arriving turn-by-turn.
  useEffect(() => {
    if (!call) return
    setShown(1)
    setWhispers([])
    const id = setInterval(() => {
      setShown((s) => (s >= SAMPLE.length ? s : s + 1))
    }, 2200)
    return () => clearInterval(id)
  }, [call])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [shown, whispers])

  const sendWhisper = () => {
    if (!draft.trim()) return
    setWhispers((w) => [...w, draft.trim()])
    setDraft('')
  }

  return (
    <Dialog.Root open={!!call} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface-raised shadow-panel focus:outline-none data-[state=open]:animate-fade-slide-in">
          {call && (
            <>
              <div className="flex items-start justify-between border-b border-border p-5">
                <div>
                  <Dialog.Title className="font-display text-lg text-ink">
                    {maskPhone(call.customerPhone)}
                  </Dialog.Title>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {call.agentName} · {LANGUAGE_LABEL[call.language]}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <SentimentTag sentiment={call.sentiment} />
                    <Badge tone={call.direction === 'inbound' ? 'pine' : 'brass'}>
                      {call.direction}
                    </Badge>
                    <span className="tabular text-xs text-ink-muted">
                      {duration(call.durationSec)}
                    </span>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="rounded-sm p-1.5 text-ink-muted hover:bg-ink/5">
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="border-b border-border bg-surface px-5 py-2.5">
                <p className="text-xs text-ink-muted">
                  Current intent ·{' '}
                  <span className="font-medium text-ink">{call.intent}</span>
                </p>
              </div>

              {/* Live transcript */}
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
                {SAMPLE.slice(0, shown).map((turn, i) => (
                  <TranscriptBubble key={i} role={turn.role} text={turn.text} />
                ))}
                {shown < SAMPLE.length && (
                  <div className="flex items-center gap-1.5 pl-1 text-xs text-ink-muted">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent-primary" />
                    listening…
                  </div>
                )}
                {whispers.map((w, i) => (
                  <div
                    key={`w-${i}`}
                    className="ml-auto max-w-[85%] rounded-card rounded-tr-sm border border-accent-secondary/30 bg-accent-secondary/10 px-3 py-2"
                  >
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-secondary">
                      <Sparkles className="h-3 w-3" /> Whisper to agent
                    </p>
                    <p className="mt-0.5 text-sm text-ink">{w}</p>
                  </div>
                ))}
              </div>

              {/* Whisper Coach input (§3.2 / §5.4) */}
              <div className="border-t border-border p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
                  Whisper Coach — inject a correction into the agent’s next turn
                </p>
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendWhisper()}
                    placeholder="e.g. Offer the festive 10% bundle discount"
                    className="h-10 flex-1 rounded-sm border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
                  />
                  <Button variant="brass" size="icon" onClick={sendWhisper}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function TranscriptBubble({
  role,
  text,
}: {
  role: 'agent' | 'customer' | 'system'
  text: string
}) {
  if (role === 'system') {
    return (
      <p className="mx-auto w-fit rounded-full bg-ink/5 px-2.5 py-1 text-center text-[11px] text-ink-muted">
        {text}
      </p>
    )
  }
  const isAgent = role === 'agent'
  return (
    <div className={cn('flex', isAgent ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[85%] rounded-card px-3 py-2 text-sm',
          isAgent
            ? 'rounded-tl-sm bg-surface text-ink'
            : 'rounded-tr-sm bg-accent-primary/10 text-ink',
        )}
      >
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          {isAgent ? 'Agent' : 'Customer'}
        </p>
        {text}
      </div>
    </div>
  )
}
