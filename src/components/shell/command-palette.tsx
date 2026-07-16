'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import { NAV } from '@/lib/nav'
import { useConversations, useCampaigns, useAgents, useKbDocs } from '@/lib/data'
import { useApp } from '@/lib/store'
import { Search } from 'lucide-react'

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useApp()
  const router = useRouter()
  const conversations = useConversations()
  const campaigns = useCampaigns()
  const agents = useAgents()
  const kbDocs = useKbDocs()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen(!commandOpen)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [commandOpen, setCommandOpen])

  const go = (href: string) => {
    router.push(href)
    setCommandOpen(false)
  }

  return (
    <Dialog.Root open={commandOpen} onOpenChange={setCommandOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[18%] z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-card border border-border bg-surface-raised shadow-panel animate-fade-slide-in">
          <Dialog.Title className="sr-only">Global search</Dialog.Title>
          <Command className="[&_[cmdk-input]]:outline-none">
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="h-4 w-4 text-ink-muted" />
              <Command.Input
                autoFocus
                placeholder="Search calls, customers, campaigns, agents, KB…"
                className="h-12 w-full bg-transparent text-sm text-ink placeholder:text-ink-muted"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-ink-muted">
                ESC
              </kbd>
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="px-3 py-6 text-center text-sm text-ink-muted">
                No matches. Try a name, number, or campaign.
              </Command.Empty>

              <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-muted/70">
                {NAV.map((n) => (
                  <Item key={n.href} onSelect={() => go(n.href)}>
                    <n.icon className="h-4 w-4 text-ink-muted" />
                    {n.label}
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading="Conversations" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-muted/70">
                {conversations.map((c) => (
                  <Item key={c.id} onSelect={() => go('/conversations')}>
                    <span className="text-ink">{c.customerName}</span>
                    <span className="ml-auto text-xs text-ink-muted">{c.agentName}</span>
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading="Campaigns & Agents" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-muted/70">
                {campaigns.map((c) => (
                  <Item key={c.id} onSelect={() => go('/campaigns')}>
                    {c.name}
                    <span className="ml-auto text-xs text-ink-muted">Campaign</span>
                  </Item>
                ))}
                {agents.map((a) => (
                  <Item key={a.id} onSelect={() => go('/agents')}>
                    {a.name}
                    <span className="ml-auto text-xs text-ink-muted">Agent</span>
                  </Item>
                ))}
                {kbDocs.map((d) => (
                  <Item key={d.id} onSelect={() => go('/knowledge')}>
                    {d.title}
                    <span className="ml-auto text-xs text-ink-muted">KB</span>
                  </Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Item({
  children,
  onSelect,
}: {
  children: React.ReactNode
  onSelect: () => void
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-ink outline-none data-[selected=true]:bg-accent-primary/10 data-[selected=true]:text-accent-primary"
    >
      {children}
    </Command.Item>
  )
}
