'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV, GROUP_LABEL, type NavItem } from '@/lib/nav'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import { PhoneCall, PanelLeftClose, PanelLeft } from 'lucide-react'

const GROUP_ORDER: NavItem['group'][] = ['monitor', 'build', 'analyze', 'admin']

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useApp()

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface/70 backdrop-blur-sm md:flex',
        sidebarCollapsed ? 'w-[68px]' : 'w-60',
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-primary text-white">
          <PhoneCall className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-sm leading-tight text-ink">
              Magppie Voice
            </p>
            <p className="truncate text-[11px] text-ink-muted">Calling Bot Console</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
        {GROUP_ORDER.map((group) => {
          const items = NAV.filter((n) => n.group === group)
          return (
            <div key={group} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">
                  {GROUP_LABEL[group]}
                </p>
              )}
              {items.map((item) => {
                const active =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'text-ink-muted hover:bg-ink/5 hover:text-ink',
                      sidebarCollapsed && 'justify-center',
                    )}
                  >
                    <Icon
                      className={cn('h-4.5 w-4.5 shrink-0', active && 'text-accent-primary')}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="m-3 flex items-center gap-2 rounded-sm px-2.5 py-2 text-xs font-medium text-ink-muted hover:bg-ink/5 hover:text-ink"
      >
        {sidebarCollapsed ? (
          <PanelLeft className="h-4 w-4" />
        ) : (
          <>
            <PanelLeftClose className="h-4 w-4" /> Collapse
          </>
        )}
      </button>
    </aside>
  )
}
