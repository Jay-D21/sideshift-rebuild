import { FadeUp } from '@/components/ui/fade-up'
import { Users, Eye, DollarSign, Building2 } from 'lucide-react'

const stats = [
  { value: '3,000+', label: 'Brands', sub: 'Active on the platform', icon: Building2 },
  { value: '1M+', label: 'Creators', sub: 'In our vetted network', icon: Users },
  { value: '5B', label: 'Views', sub: 'Generated for brands', icon: Eye },
  { value: '$100M+', label: 'Paid Out', sub: 'To creators worldwide', icon: DollarSign },
]

export default function Stats() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.08}>
              <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:-translate-y-0.5 transition-transform duration-200">
                {/* Giant decorative icon */}
                <stat.icon
                  className="absolute -right-2 -bottom-2 text-[#202020]"
                  style={{ width: 80, height: 80, opacity: 0.07 }}
                  strokeWidth={1.5}
                />
                <div className="relative z-10">
                  <div className="text-[36px] font-bold tracking-tight text-[#202020] leading-none mb-1">{stat.value}</div>
                  <div className="text-base font-bold text-[#202020]">{stat.label}</div>
                  <div className="text-sm mt-1" style={{ color: 'rgba(32,32,32,0.55)' }}>{stat.sub}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}