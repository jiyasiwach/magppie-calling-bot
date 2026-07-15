'use client'

// A mock recording player: play/pause with a progress bar that advances over
// the (accelerated) call duration. No real audio file — it simulates playback
// so the Conversations panel feels live. Swap the interval for an <audio>
// element's timeupdate when real recordings exist.

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { duration } from '@/lib/utils'

export function AudioScrubber({ durationSec }: { durationSec: number }) {
  const [pos, setPos] = useState(0) // seconds elapsed
  const [playing, setPlaying] = useState(false)
  const raf = useRef<number | null>(null)
  const last = useRef<number>(0)

  useEffect(() => {
    if (!playing) return
    // advance ~6x real-time so a 4-minute call is watchable in ~40s
    last.current = performance.now()
    const step = (t: number) => {
      const dt = (t - last.current) / 1000
      last.current = t
      setPos((p) => {
        const next = p + dt * 6
        if (next >= durationSec) {
          setPlaying(false)
          return durationSec
        }
        return next
      })
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing, durationSec])

  const pct = Math.min(100, (pos / durationSec) * 100)
  const atEnd = pos >= durationSec

  const onBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    setPos(Math.max(0, Math.min(durationSec, ratio * durationSec)))
  }

  return (
    <div className="mb-4 flex items-center gap-3 rounded-sm border border-border bg-surface-raised px-3 py-2">
      <Button
        size="icon"
        variant="primary"
        className="h-8 w-8 rounded-full"
        onClick={() => (atEnd ? (setPos(0), setPlaying(true)) : setPlaying((p) => !p))}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {atEnd ? <RotateCcw className="h-4 w-4" /> : playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div
        onClick={onBarClick}
        className="group h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-ink/10"
      >
        <div
          className="h-full rounded-full bg-accent-secondary transition-[width] duration-75"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular w-20 text-right text-xs text-ink-muted">
        {duration(pos)} / {duration(durationSec)}
      </span>
    </div>
  )
}
