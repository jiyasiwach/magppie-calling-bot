import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format an integer with thin thousands separators (Indian-friendly). */
export function nfmt(n: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(n))
}

/** Compact currency in INR (₹1.2L, ₹3.4Cr style via Intl). */
export function inr(n: number, compact = true): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(n)
}

/** Mask a phone number, keeping country code + last 3 digits. */
export function maskPhone(p: string): string {
  const digits = p.replace(/\D/g, '')
  if (digits.length < 5) return p
  const cc = p.startsWith('+') ? '+91 ' : ''
  return `${cc}•••••${digits.slice(-3)}`
}

/** mm:ss from seconds. */
export function duration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
