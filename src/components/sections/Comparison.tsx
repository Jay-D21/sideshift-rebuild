'use client'

import { FadeUp } from '@/components/ui/fade-up'
import { Check, X } from 'lucide-react'

const rows = [
  { feature: 'Creators apply to you (inbound)', creatorflow: true, agencies: false, marketplaces: false },
  { feature: 'No platform fees on creator pay', creatorflow: true, agencies: false, marketplaces: false },
  { feature: 'Built-in content review tools', creatorflow: true, agencies: false, marketplaces: true },
  { feature: 'Automated creator payments', creatorflow: true, agencies: false, marketplaces: false },
  { feature: 'Real-time campaign analytics', creatorflow: true, agencies: false, marketplaces: true },
  { feature: 'Launch in under 5 minutes', creatorflow: true, agencies: false, marketplaces: false },
  { feature: 'Vetted creator pool', creatorflow: true, agencies: true, marketplaces: false },
]

function Cell({ value }: { value: boolean }) {
  return value ? (
    <span className="flex items-center justify-center">
      <Check className="h-5 w-5 text-emerald-500" strokeWidth={2.5} />
    </span>
  ) : (
    <span className="flex items-center justify-center">
      <X className="h-4 w-4" style={{ color: 'rgba(32,32,32,0.25)' }} />
    </span>
  )
}

export default function Comparison() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="mx-auto max-w-3xl">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">
            The new standard for creator marketing
          </h2>
          <p className="mt-3 text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
            See why brands are switching from agencies and old-school marketplaces.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-4 bg-[#F8FEFF] px-5 py-3.5">
              <div className="col-span-1" />
              <div className="text-center text-[13px] font-bold text-[#202020]">
                CreatorFlow
              </div>
              <div className="text-center text-[13px] font-medium" style={{ color: 'rgba(32,32,32,0.55)' }}>
                Agencies
              </div>
              <div className="text-center text-[13px] font-medium" style={{ color: 'rgba(32,32,32,0.55)' }}>
                Marketplaces
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 items-center px-5 py-3.5 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <div className="col-span-1 text-[14px] leading-tight font-medium text-[#202020] pr-4">
                  {row.feature}
                </div>
                <Cell value={row.creatorflow} />
                <Cell value={row.agencies} />
                <Cell value={row.marketplaces} />
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
