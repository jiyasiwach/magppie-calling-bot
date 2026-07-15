'use client'

// §1.3 signature element — a living brass waveform on beige whose amplitude
// tracks live concurrent-call volume. The one ambient animation in the product.

import { useEffect, useRef } from 'react'
import { useCallVolume } from '@/lib/use-live'

export function Waveform({ concurrent }: { concurrent: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const volume = useCallVolume()
  const volRef = useRef(volume)
  volRef.current = volume

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let t = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      const mid = h / 2
      const amp = (h / 2 - 4) * volRef.current

      // three layered sine bands for a richer, engineered feel
      const bands = [
        { color: 'rgba(176,141,87,0.85)', freq: 0.018, speed: 0.05, phase: 0, aMul: 1 },
        { color: 'rgba(176,141,87,0.45)', freq: 0.027, speed: 0.07, phase: 2, aMul: 0.7 },
        { color: 'rgba(63,90,70,0.35)', freq: 0.012, speed: 0.03, phase: 4, aMul: 0.5 },
      ]

      for (const band of bands) {
        ctx.beginPath()
        for (let x = 0; x <= w; x += 2) {
          const env = Math.sin((x / w) * Math.PI) // taper at edges
          const y =
            mid +
            Math.sin(x * band.freq + t * band.speed + band.phase) *
              amp *
              band.aMul *
              env
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = band.color
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      if (!reduced) t += 1
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-gradient-to-b from-surface to-bg">
      <canvas ref={canvasRef} className="h-24 w-full" />
      <div className="pointer-events-none absolute inset-y-0 left-4 flex flex-col justify-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-secondary">
          Live volume
        </span>
        <span className="tabular text-2xl font-semibold leading-none text-ink">
          {concurrent}
        </span>
        <span className="text-[11px] text-ink-muted">concurrent calls</span>
      </div>
    </div>
  )
}
