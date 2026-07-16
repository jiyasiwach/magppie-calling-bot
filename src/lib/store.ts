'use client'

import { create } from 'zustand'
import type { TenantId } from './types'

/** 'live' shows the real current state (zero activity until the backend exists);
 *  'demo' shows the mock dataset for presentations. */
export type DataMode = 'live' | 'demo'

interface AppState {
  tenant: TenantId
  setTenant: (t: TenantId) => void
  dataMode: DataMode
  setDataMode: (m: DataMode) => void
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
  dataMode: 'live',
  setDataMode: (dataMode) => set({ dataMode }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  notifOpen: false,
  setNotifOpen: (notifOpen) => set({ notifOpen }),
}))
