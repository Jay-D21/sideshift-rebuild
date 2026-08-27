'use client'

import { FadeUp } from '@/components/ui/fade-up'

const steps = [
  { num: 1, title: 'Post Brief' },
  { num: 2, title: 'Set Budget' },
  { num: 3, title: 'Get Pitches' },
  { num: 4, title: 'Review' },
  { num: 5, title: 'Pay & Publish' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center mb-16">
          <h2 className="text-[40px] md:text-[52px] font-bold tracking-[-0.03em] text-[#202020] leading-[1.1]">
            How CreatorFlow works
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[rgba(32,32,32,0.6)] max-w-2xl mx-auto">
            From brief to published content in days, not months.
          </p>
        </FadeUp>

        <div className="relative max-w-5xl mx-auto py-8">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[100px] -translate-y-1/2 -z-10 pointer-events-none">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 100">
              <path 
                d="M50,50 Q250,10 500,50 T950,50" 
                stroke="#BFDFFF" 
                strokeWidth="2" 
                fill="none" 
                vectorEffect="non-scaling-stroke"
                strokeDasharray="8 8"
              />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1}>
                <div className="w-[140px] rounded-2xl border-2 border-dashed border-[#DAEEFF] bg-white p-4 flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 relative">
                  <div className="absolute -top-3 -right-3 text-[11px] font-bold bg-[#E0F5FF] text-[#3C83F9] rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-sm">
                    {step.num}
                  </div>
                  <div className="h-12 w-12 bg-gray-50 rounded-xl mb-3 flex items-center justify-center self-center" />
                  <h3 className="text-[13px] font-bold text-[#202020] text-center">{step.title}</h3>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}