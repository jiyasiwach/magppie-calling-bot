'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/misc'
import { INTEGRATIONS } from '@/lib/mock-data'
import type { Integration, IntegrationKind } from '@/lib/types'
import { toast } from '@/lib/toast'
import { Database, PhoneCall, MessageCircle, Webhook } from 'lucide-react'

const ICON: Record<IntegrationKind, React.ComponentType<{ className?: string }>> = {
  crm: Database,
  telephony: PhoneCall,
  whatsapp: MessageCircle,
  webhook: Webhook,
}

const KIND_LABEL: Record<IntegrationKind, string> = {
  crm: 'CRM',
  telephony: 'Telephony',
  whatsapp: 'Messaging',
  webhook: 'Webhook',
}

export default function IntegrationsPage() {
  // local copy so connect/disconnect actually flips in the UI
  const [items, setItems] = useState<Integration[]>(INTEGRATIONS)

  const toggle = (id: string) => {
    const target = items.find((it) => it.id === id)
    if (!target) return
    const connected = !target.connected
    // side-effect (toast) stays out of the pure state updater
    if (connected) toast.success(`${target.name} connected`, 'Syncing is now active.')
    else toast.warning(`${target.name} disconnected`, 'Data will stop syncing.')
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, connected, detail: connected ? 'Connected · just now' : 'Not connected' }
          : it,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        subtitle="Connect your CRM, telephony, WhatsApp and webhooks — warm cards, not a wall of logos on black."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const Icon = ICON[it.kind]
          return (
            <Card key={it.id} hover className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <Badge tone={it.connected ? 'success' : 'neutral'}>
                  {it.connected ? 'Connected' : 'Not connected'}
                </Badge>
              </div>
              <p className="mt-3 font-display text-base text-ink">{it.name}</p>
              <p className="text-xs uppercase tracking-wide text-ink-muted/70">{KIND_LABEL[it.kind]}</p>
              <p className="mt-1 flex-1 text-sm text-ink-muted">{it.detail}</p>
              <Button
                variant={it.connected ? 'outline' : 'primary'}
                size="sm"
                className="mt-4 w-full"
                onClick={() => toggle(it.id)}
              >
                {it.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
