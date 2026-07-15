'use client'

// Mock real-time layer (§7.5). Today these hooks tick a local interval to
// simulate a WebSocket feed. To go live, replace the interval bodies with a
// WebSocket subscription (e.g. socket.on('call.update', …)) — the return
// shapes are already what components consume.

import { useEffect, useRef, useState } from 'react'
import { LIVE_CALLS } from './mock-data'
import type { LiveCall } from './types'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Concurrent-call volume 0..1 driving the waveform amplitude. */
export function useCallVolume() {
  const [vol, setVol] = useState(0.6)
  useEffect(() => {
    if (REDUCED) return
    const id = setInterval(() => {
      setVol((v) => {
        const next = v + (Math.random() - 0.5) * 0.25
        return Math.max(0.25, Math.min(1, next))
      })
    }, 1400)
    return () => clearInterval(id)
  }, [])
  return vol
}

/** Live calls with ticking duration timers. */
export function useLiveCalls(tenant?: string): LiveCall[] {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const base = tenant ? LIVE_CALLS.filter((c) => c.tenant === tenant) : LIVE_CALLS
  return base.map((c) => ({ ...c, durationSec: c.durationSec + tick }))
}

/** A number that smoothly counts toward `target` (§1.4 KPI count-up). */
export function useCountUp(target: number, ms = 600) {
  const [val, setVal] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (REDUCED) {
      setVal(target)
      return
    }
    const start = performance.now()
    const initial = from.current
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(initial + (target - initial) * eased)
      if (p < 1) raf = requestAnimationFrame(step)
      else from.current = target
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return val
}
