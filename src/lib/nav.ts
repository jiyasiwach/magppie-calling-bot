import {
  LayoutDashboard,
  RadioTower,
  Bot,
  Megaphone,
  MessagesSquare,
  BookOpen,
  BarChart3,
  ShieldCheck,
  Plug,
  Users,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  group: 'monitor' | 'build' | 'analyze' | 'admin'
}

export const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard, group: 'monitor' },
  { href: '/live', label: 'Live Calls', icon: RadioTower, group: 'monitor' },
  { href: '/agents', label: 'Agent Builder', icon: Bot, group: 'build' },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone, group: 'build' },
  { href: '/conversations', label: 'Conversations', icon: MessagesSquare, group: 'analyze' },
  { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen, group: 'build' },
  { href: '/analytics', label: 'Analytics & ROI', icon: BarChart3, group: 'analyze' },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck, group: 'analyze' },
  { href: '/integrations', label: 'Integrations', icon: Plug, group: 'admin' },
  { href: '/team', label: 'Team & Roles', icon: Users, group: 'admin' },
  { href: '/settings', label: 'Settings', icon: Settings, group: 'admin' },
]

export const GROUP_LABEL: Record<NavItem['group'], string> = {
  monitor: 'Monitor',
  build: 'Build',
  analyze: 'Analyze',
  admin: 'Administer',
}
