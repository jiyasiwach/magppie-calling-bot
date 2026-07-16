'use client'

import { usePathname } from 'next/navigation'

// Living kitchen backdrop — real Magppie kitchen photography (magppie.com CDN)
// crossfading with a slow Ken Burns zoom. Shared by the landing hero and the
// console shell; `veil` controls how strongly the parchment tint covers it.
// When no veil is given, it adapts per route: showcase screens (dashboard,
// live) let the kitchen breathe through; data-dense screens stay near-solid
// so nothing competes with tables and charts.
// Keyframes + reduced-motion handling live in globals.css (.landing-layer).

const SHOWCASE_VEIL = 0.88
const DENSE_VEIL = 0.965
const SHOWCASE_ROUTES = ['/dashboard', '/live']

export const KITCHEN_PHOTOS = [
  'https://magppie.com/cdn/shop/files/TAR9436-1.jpg?v=1765195362',
  'https://magppie.com/cdn/shop/files/3.jpg?v=1765195362',
  'https://magppie.com/cdn/shop/files/20250812_1846_Luxurious_Kitchen_Plants_remix_01k2f6tcdee87rmxbxzprgva5b.png?v=1765195359',
  'https://magppie.com/cdn/shop/files/TAR9430-1.jpg?v=1765195363',
  'https://magppie.com/cdn/shop/files/3_Backsplash.jpg?v=1765195359',
]

export const SECONDS_PER_PHOTO = 8
export const KITCHEN_LOOP_SECONDS = KITCHEN_PHOTOS.length * SECONDS_PER_PHOTO

export function KitchenBackdrop({ veil }: { veil?: number }) {
  const pathname = usePathname()
  const resolved =
    veil ?? (SHOWCASE_ROUTES.some((r) => pathname.startsWith(r)) ? SHOWCASE_VEIL : DENSE_VEIL)
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* static base so a crossfade dip never flashes blank */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${KITCHEN_PHOTOS[0]})` }}
      />
      {KITCHEN_PHOTOS.map((src, i) => (
        <div
          key={src}
          className="landing-layer absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            animation: `landing-kenburns ${KITCHEN_LOOP_SECONDS}s ${(-i * KITCHEN_LOOP_SECONDS) / KITCHEN_PHOTOS.length}s infinite`,
          }}
        />
      ))}
      {/* parchment veil keeps the console quiet and legible */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: `rgb(245 239 227 / ${resolved})` }}
      />
    </div>
  )
}
