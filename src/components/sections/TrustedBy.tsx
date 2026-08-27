'use client'

import { FadeUp } from '@/components/ui/fade-up'

const brands = [
  'Brex', 'Microsoft', 'Cursor', 'Replit', 'Kalshi',
  'Paramount+', 'Yik Yak', 'Grammarly', 'Picsart',
]

export default function TrustedBy() {
  return (
    <section className="bg-white py-12 px-4">
      <FadeUp className="mx-auto max-w-5xl">
        <p className="text-center text-[13px] font-medium tracking-wide mb-6" style={{ color: 'rgba(32,32,32,0.4)' }}>
          TRUSTED BY TEAMS AT
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {brands.map((brand) => (
            <div
              key={brand}
              className="rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm"
            >
              <span className="text-[15px] font-semibold text-[#202020]">{brand}</span>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  )
}
