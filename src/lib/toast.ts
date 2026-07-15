'use client'

import { create } from 'zustand'

export type ToastTone = 'success' | 'info' | 'warning' | 'danger'

export interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastState {
  toasts: Toast[]
  push: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

let seq = 1

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = seq++
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    // auto-dismiss after 3.5s
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
    }, 3500)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))

/** Convenience helpers so components can call toast.success(...) etc. */
export const toast = {
  success: (title: string, description?: string) =>
    useToast.getState().push({ title, description, tone: 'success' }),
  info: (title: string, description?: string) =>
    useToast.getState().push({ title, description, tone: 'info' }),
  warning: (title: string, description?: string) =>
    useToast.getState().push({ title, description, tone: 'warning' }),
  danger: (title: string, description?: string) =>
    useToast.getState().push({ title, description, tone: 'danger' }),
}
