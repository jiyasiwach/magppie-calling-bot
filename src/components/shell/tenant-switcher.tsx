'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, ChevronsUpDown } from 'lucide-react'
import { TENANTS } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

export function TenantSwitcher() {
  const { tenant, setTenant } = useApp()
  const active = TENANTS.find((t) => t.id === tenant)!

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2.5 rounded-sm border border-border bg-surface-raised px-2.5 py-1.5 text-left transition-colors hover:bg-surface focus-visible:outline-none">
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white',
              active.accent === 'pine' ? 'bg-accent-primary' : 'bg-accent-secondary',
            )}
          >
            {active.name.slice(0, 1)}
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-medium text-ink">{active.name}</span>
            <span className="block text-[11px] text-ink-muted">{active.tagline}</span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-ink-muted" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 w-64 rounded-md border border-border bg-surface-raised p-1.5 shadow-panel animate-fade-slide-in"
        >
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">
            Switch brand · one login
          </p>
          {TENANTS.map((t) => (
            <DropdownMenu.Item
              key={t.id}
              onSelect={() => setTenant(t.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-2 text-sm outline-none data-[highlighted]:bg-ink/5"
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white',
                  t.accent === 'pine' ? 'bg-accent-primary' : 'bg-accent-secondary',
                )}
              >
                {t.name.slice(0, 1)}
              </span>
              <span className="flex-1 leading-tight">
                <span className="block font-medium text-ink">{t.name}</span>
                <span className="block text-[11px] text-ink-muted">{t.tagline}</span>
              </span>
              {t.id === tenant && <Check className="h-4 w-4 text-accent-primary" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
