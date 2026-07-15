'use client'

import { TenantSwitcher } from './tenant-switcher'
import { NotificationCenter } from './notification-center'
import { useApp } from '@/lib/store'
import { Search } from 'lucide-react'

export function Topbar() {
  const { setCommandOpen } = useApp()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-md md:px-6">
      <TenantSwitcher />

      <button
        onClick={() => setCommandOpen(true)}
        className="ml-auto flex h-9 w-full max-w-xs items-center gap-2 rounded-sm border border-border bg-surface-raised px-3 text-sm text-ink-muted transition-colors hover:bg-surface md:ml-4 md:mr-auto"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search everything…</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        <NotificationCenter />
        <div className="ml-1 flex items-center gap-2 rounded-sm py-1 pl-1 pr-2 hover:bg-ink/5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary/15 text-xs font-semibold text-accent-primary">
            PS
          </span>
          <span className="hidden leading-tight lg:block">
            <span className="block text-sm font-medium text-ink">Priya Sharma</span>
            <span className="block text-[11px] text-ink-muted">Owner</span>
          </span>
        </div>
      </div>
    </header>
  )
}
