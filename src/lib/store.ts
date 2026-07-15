'use client'

import { create } from 'zustand'
import type { TenantId } from './types'

interface AppState {
  tenant: TenantId
  setTenant: (t: TenantId) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  commandOpen: boolean
  setCommandOpen: (v: boolean) => void
  notifOpen: boolean
  setNotifOpen: (v: boolean) => void
}

export const useApp = create<AppState>((set) => ({
  tenant: 'magppie-living',
  setTenant: (tenant) => set({ tenant }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  notifOpen: false,
  setNotifOpen: (notifOpen) => set({ notifOpen }),
}))
