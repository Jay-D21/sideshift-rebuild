'use client'

import { FadeUp } from '@/components/ui/fade-up'
import { Users, TrendingUp, Eye, DollarSign } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '3,000+',
    label: 'Brands',
    subtitle: 'Active advertisers on the platform',
  },
  {
    icon: TrendingUp,
    value: '1M+',
    label: 'Creators',
    subtitle: 'Vetted UGC creators ready to apply',
  },
  {
    icon: Eye,
    value: '5B',
    label: 'Views',
    subtitle: 'Total views generated for brands',
  },
  {
    icon: DollarSign,
    value: '$100M+',
    label: 'Paid Out',
    subtitle: 'Earned by creators on our platform',
  },
]

export default function Stats() {
  return (
    <section className="py-16 px-4" style={{ background: '#F8FEFF' }}>
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">
            The numbers speak for themselves
          </h2>
          <p className="mt-3 text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
            Join the fastest-growing creator marketing platform
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <FadeUp key={stat.label} delay={i * 0.08} className="h-full">
                <div className="group flex h-full flex-col items-center justify-center rounded-lg border-2 border-white bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-0.5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E0F5FF]">
                    <Icon className="h-5 w-5 text-[#3C83F9]" />
                  </div>
                  <div className="text-[32px] font-bold leading-none text-[#202020]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-base font-semibold text-[#202020]">
                    {stat.label}
                  </div>
                  <div className="mt-1.5 text-[13px] leading-tight" style={{ color: 'rgba(32,32,32,0.55)' }}>
                    {stat.subtitle}
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
