'use client'

// Living kitchen backdrop — real Magppie kitchen photography (magppie.com CDN)
// crossfading with a slow Ken Burns zoom. Shared by the landing hero and the
// console shell; `veil` controls how strongly the parchment tint covers it
// (console uses a heavy veil so content stays calm and readable).
// Keyframes + reduced-motion handling live in globals.css (.landing-layer).

export const KITCHEN_PHOTOS = [
  'https://magppie.com/cdn/shop/files/TAR9436-1.jpg?v=1765195362',
  'https://magppie.com/cdn/shop/files/3.jpg?v=1765195362',
  'https://magppie.com/cdn/shop/files/20250812_1846_Luxurious_Kitchen_Plants_remix_01k2f6tcdee87rmxbxzprgva5b.png?v=1765195359',
  'https://magppie.com/cdn/shop/files/TAR9430-1.jpg?v=1765195363',
  'https://magppie.com/cdn/shop/files/3_Backsplash.jpg?v=1765195359',
]

export const SECONDS_PER_PHOTO = 8
export const KITCHEN_LOOP_SECONDS = KITCHEN_PHOTOS.length * SECONDS_PER_PHOTO

export function KitchenBackdrop({ veil = 0.93 }: { veil?: number }) {
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
        className="absolute inset-0"
        style={{ backgroundColor: `rgb(245 239 227 / ${veil})` }}
      />
    </div>
  )
}
