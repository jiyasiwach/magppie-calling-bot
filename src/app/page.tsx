'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PhoneCall, ArrowRight, Sparkles, ShieldCheck, Users, MessageSquareText, ChevronDown } from 'lucide-react'
import { TENANTS } from '@/lib/mock-data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

// Real Magppie kitchen photos — crossfaded with a slow Ken Burns zoom.
// All verified to load from the magppie.com CDN; mixed portrait + landscape.
const KITCHENS = [
  'https://magppie.com/cdn/shop/files/TAR9436-1.jpg?v=1765195362',
  'https://magppie.com/cdn/shop/files/3.jpg?v=1765195362',
  'https://magppie.com/cdn/shop/files/20250812_1846_Luxurious_Kitchen_Plants_remix_01k2f6tcdee87rmxbxzprgva5b.png?v=1765195359',
  'https://magppie.com/cdn/shop/files/TAR9430-1.jpg?v=1765195363',
  'https://magppie.com/cdn/shop/files/3_Backsplash.jpg?v=1765195359',
]
const SECONDS_PER_PHOTO = 8
const LOOP_SECONDS = KITCHENS.length * SECONDS_PER_PHOTO // scales with photo count

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Hero />
      <FeatureSection />
      <footer className="border-t border-border px-6 py-6 text-center text-xs text-ink-muted">
        Magppie Voice — AI calling console · Magppie Living & SUNROOOF · demo data
      </footer>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* --- moving kitchen background --- */}
      <div className="absolute inset-0 -z-10">
        {/* static base so any crossfade dip never shows a blank */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${KITCHENS[0]})` }}
        />
        {KITCHENS.map((src, i) => (
          <div
            key={src}
            className="landing-layer absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              animation: `landing-kenburns ${LOOP_SECONDS}s ${(-i * LOOP_SECONDS) / KITCHENS.length}s infinite`,
            }}
          />
        ))}
        {/* warm beige tint keeps text legible while the kitchen still shows through */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-bg/25 to-bg/85" />
        {/* extra veil on the left, behind the headline column, for contrast */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(245_239_227/0.75)_0%,rgb(245_239_227/0.35)_45%,transparent_70%)]" />
      </div>

      <TopBar />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-3 py-1 text-xs font-medium text-accent-secondary">
            <Sparkles className="h-3.5 w-3.5" /> AI voice, dressed for a premium brand
          </span>
          <h1 className="mt-5 font-display text-[40px] leading-[1.05] text-ink sm:text-[52px]">
            Every call, handled with warmth — and watched in real time.
          </h1>
          <p className="mt-4 max-w-md text-base text-ink-muted">
            Magppie’s AI calling console runs your inbound and outbound voice
            operation: live monitoring, agent building, campaigns, and proof of
            compliance — for Magppie Living and SUNROOOF, from one login.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent-primary px-5 text-sm font-medium text-white shadow-card transition-[transform,background-color] duration-150 hover:bg-accent-primary/90 active:translate-y-px"
            >
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#capabilities"
              className="inline-flex h-11 items-center gap-2 rounded-sm border border-border bg-surface-raised/70 px-5 text-sm font-medium text-ink backdrop-blur-sm transition-colors hover:bg-surface-raised"
            >
              See what it can do
            </a>
          </div>
        </div>

        <LiveCard />
      </div>
    </section>
  )
}

function TopBar() {
  const { tenant, setTenant } = useApp()
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-primary text-white">
          <PhoneCall className="h-4.5 w-4.5" />
        </span>
        <span className="font-display text-lg text-ink">Magppie Voice</span>
      </div>

      <div className="flex items-center gap-3">
        {/* brand switch — choice carries into the dashboard */}
        <div className="flex rounded-full border border-border bg-surface-raised/70 p-0.5 backdrop-blur-sm">
          {TENANTS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTenant(t.id)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                tenant === t.id ? 'bg-accent-primary text-white' : 'text-ink-muted hover:text-ink',
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-accent-primary hover:underline">
          Sign in
        </Link>
      </div>
    </header>
  )
}

function LiveCard() {
  const [stats, setStats] = useState({ active: 9, resolution: 83, latency: 640 })
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(rm.matches)
    if (rm.matches) return
    const id = setInterval(() => {
      setStats((s) => ({
        active: Math.max(6, Math.min(14, s.active + (Math.random() > 0.5 ? 1 : -1))),
        resolution: Math.max(79, Math.min(86, Math.round((s.resolution + (Math.random() - 0.5)) * 10) / 10)),
        latency: Math.max(560, Math.min(760, s.latency + Math.round((Math.random() - 0.5) * 30))),
      }))
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full max-w-sm rounded-card border border-border bg-surface-raised/70 p-5 shadow-panel backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          System live
        </span>
        {/* mini bar waveform */}
        <div className="flex h-6 items-end gap-0.5" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="landing-bar w-1 origin-bottom rounded-full bg-accent-secondary"
              style={{
                height: '100%',
                animation: reduced ? 'none' : `landing-bars ${1 + (i % 4) * 0.25}s ${i * 0.08}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Active now" value={stats.active} />
        <Stat label="Resolved today" value={`${stats.resolution}%`} />
        <Stat label="Avg response" value={`${stats.latency}ms`} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="tabular text-xl font-semibold text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-ink-muted">{label}</p>
    </div>
  )
}

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Call Sandbox',
    blurb: 'Practice with an AI agent before it goes live.',
    more: 'Talk to a synthetic customer with an adjustable mood and difficulty — patient to hostile — so you catch weak spots before real callers do.',
    href: '/agents',
    cta: 'Open Agent Builder',
  },
  {
    icon: MessageSquareText,
    title: 'Whisper Coach',
    blurb: 'Steer a live call without interrupting it.',
    more: 'A supervisor can type a correction mid-call that’s fed into the agent’s very next turn — coaching in real time, not just listening in.',
    href: '/live',
    cta: 'Go to Live Calls',
  },
  {
    icon: Users,
    title: 'Customer 360',
    blurb: 'One timeline across voice, WhatsApp and CRM.',
    more: 'Every touchpoint for a customer — calls, messages and tickets — merged into a single chronological view you can collapse by channel.',
    href: '/conversations',
    cta: 'Open Conversations',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Trail',
    blurb: 'Proof every call followed the rules.',
    more: 'A visible, exportable audit log — consent captured, DND checked, recording disclosed — not just a badge that claims compliance.',
    href: '/compliance',
    cta: 'View Compliance',
  },
]

function FeatureSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="capabilities" className="mx-auto w-full max-w-6xl scroll-mt-8 px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary">
        Beyond the competition
      </p>
      <h2 className="mt-2 font-display text-2xl text-ink">
        Things a dark, generic console won’t give you
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => {
          const isOpen = open === i
          const Icon = f.icon
          return (
            <div
              key={f.title}
              className={cn(
                'flex flex-col rounded-card border border-border bg-surface p-5 transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-lift',
                isOpen && 'shadow-lift',
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex flex-col text-left"
                aria-expanded={isOpen}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-3 flex items-center justify-between font-display text-base text-ink">
                  {f.title}
                  <ChevronDown className={cn('h-4 w-4 text-ink-muted transition-transform', isOpen && 'rotate-180')} />
                </span>
                <span className="mt-1 text-sm text-ink-muted">{f.blurb}</span>
              </button>
              <div
                className={cn(
                  'grid transition-all duration-200',
                  isOpen ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden">
                  <p className="text-sm text-ink">{f.more}</p>
                  <Link
                    href={f.href}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary hover:gap-2 hover:underline"
                  >
                    {f.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
