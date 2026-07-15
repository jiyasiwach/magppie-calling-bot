'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, RadioTower, Megaphone, MessagesSquare, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

// §5.12 — compact bottom nav for one-handed phone monitoring.
const ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/live', label: 'Live', icon: RadioTower },
  { href: '/campaigns', label: 'Camp.', icon: Megaphone },
  { href: '/conversations', label: 'Calls', icon: MessagesSquare },
  { href: '/analytics', label: 'Stats', icon: BarChart3 },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface-raised/95 px-2 py-1.5 backdrop-blur-md md:hidden">
      {ITEMS.map((item) => {
        const active =
          item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 rounded-sm py-1 text-[10px] font-medium',
              active ? 'text-accent-primary' : 'text-ink-muted',
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
