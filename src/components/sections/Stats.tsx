'use client'

import { FadeUp } from '@/components/ui/fade-up'
import Image from 'next/image'

const stats = [
  { value: '3,000+', label: 'Brands', sub: 'Active on platform', img: '/images/stat_brands.jpg' },
  { value: '1M+', label: 'Creators', sub: 'In vetted network', img: '/images/stat_creators.jpg' },
  { value: '5B', label: 'Views', sub: 'Generated for brands', img: '/images/stat_views.jpg' },
  { value: '$100M+', label: 'Paid Out', sub: 'To creators worldwide', img: '/images/stat_paid.jpg' },
]

export default function Stats() {
  return (
    <section className="py-24 px-6 bg-[#F8FCFF]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.08} className="h-full">
              <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 h-full">
                <div className="p-5">
                  <div className="text-[20px] font-bold text-[#202020] leading-none mb-0.5">{stat.value}</div>
                  <div className="text-[14px] font-medium text-gray-500">{stat.label}</div>
                </div>
                <div className="h-[140px] mt-auto relative overflow-hidden bg-gray-50 border-t border-gray-100 flex items-center justify-center">
                  <Image src={stat.img} alt={stat.label} fill className="object-cover opacity-90" />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}