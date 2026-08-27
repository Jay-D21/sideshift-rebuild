'use client'

import { FadeUp } from '@/components/ui/fade-up'

const testimonials = [
  {
    quote:
      "We went from spending 3 weeks finding creators to getting 80 qualified applications in 48 hours. CreatorFlow completely changed how we run UGC campaigns.",
    name: 'Sarah Chen',
    role: 'Head of Marketing',
    company: 'Replit',
    rating: 5,
  },
  {
    quote:
      "The quality of creators on CreatorFlow is unmatched. Every applicant had relevant experience and a real audience. Our ROAS tripled in Q3.",
    name: 'Marcus Rivera',
    role: 'Growth Lead',
    company: 'Kalshi',
    rating: 5,
  },
  {
    quote:
      "Finally, a platform that puts brands in control. The inbound model means we only talk to creators who actually want to work with us. Game changer.",
    name: 'Priya Patel',
    role: 'VP Brand Partnerships',
    company: 'Picsart',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section
      className="py-20 px-4"
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #E0F5FF 30%, #D0EDFF 50%, #E0F5FF 70%, #FFFFFF 100%)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">
            Brands love CreatorFlow
          </h2>
          <p className="mt-3 text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
            Don&apos;t take our word for it.
          </p>
        </FadeUp>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1} className="h-full">
              <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-[#f59e0b] text-base">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="flex-1 text-[15px] leading-[145%] text-[#202020] mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ background: ['#3C83F9', '#10b981', '#8b5cf6'][i] }}
                  >
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#202020]">{t.name}</div>
                    <div className="text-[12px]" style={{ color: 'rgba(32,32,32,0.55)' }}>
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
